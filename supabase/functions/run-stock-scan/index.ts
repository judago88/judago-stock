import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const KIS_APP_KEY = Deno.env.get('KIS_APP_KEY')
const KIS_APP_SECRET = Deno.env.get('KIS_APP_SECRET')
const KIS_BASE_URL =
  Deno.env.get('KIS_BASE_URL') ?? 'https://openapi.koreainvestment.com:9443'

const CLOUD_SUPABASE_URL = Deno.env.get('CLOUD_SUPABASE_URL')
const CLOUD_SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('CLOUD_SUPABASE_SERVICE_ROLE_KEY')

const supabase = createClient(
  CLOUD_SUPABASE_URL!,
  CLOUD_SUPABASE_SERVICE_ROLE_KEY!,
)

async function parseResponse(res: Response) {
  const text = await res.text()
  if (!text) return null

  try {
    return JSON.parse(text)
  } catch {
    return { parse_error: true, raw_text: text }
  }
}

async function getAccessToken() {
  const res = await fetch(`${KIS_BASE_URL}/oauth2/tokenP`, {
    method: 'POST',
    headers: {
      'content-type': 'application/json; charset=utf-8',
    },
    body: JSON.stringify({
      grant_type: 'client_credentials',
      appkey: KIS_APP_KEY,
      appsecret: KIS_APP_SECRET,
    }),
  })

  const data = await parseResponse(res)

  if (!res.ok || !data?.access_token) {
    throw new Error(`토큰 발급 실패: ${JSON.stringify(data)}`)
  }

  return data.access_token
}

async function getActiveCondition() {
  const { data, error } = await supabase
    .from('stock_signal_conditions')
    .select('*')
    .eq('is_active', true)
    .order('created_at', { ascending: false })
    .limit(1)
    .single()

  if (error || !data) {
    throw new Error(`활성 조건 조회 실패: ${error?.message}`)
  }

  return data
}

async function createRun(condition: any) {
  const today = new Date().toISOString().slice(0, 10)

  const { data, error } = await supabase
    .from('stock_signal_runs')
    .insert({
      run_date: today,
      condition_id: condition.id,
      condition_name: condition.name,
      min_change_rate: condition.min_change_rate,
      min_trade_amount: condition.min_trade_amount,
      status: 'running',
      total_count: 0,
    })
    .select()
    .single()

  if (error) {
    throw new Error(`실행 기록 생성 실패: ${error.message}`)
  }

  return data
}

async function updateRunSuccess(runId: string, totalCount: number) {
  await supabase
    .from('stock_signal_runs')
    .update({
      status: 'success',
      total_count: totalCount,
      finished_at: new Date().toISOString(),
    })
    .eq('id', runId)
}

async function updateRunFailed(runId: string, message: string) {
  await supabase
    .from('stock_signal_runs')
    .update({
      status: 'failed',
      error_message: message,
      finished_at: new Date().toISOString(),
    })
    .eq('id', runId)
}

async function getTopChangeRateStocks(accessToken: string) {
  const params = new URLSearchParams({
    FID_COND_MRKT_DIV_CODE: 'J',
    FID_COND_SCR_DIV_CODE: '20170',
    FID_INPUT_ISCD: '0000',
    FID_RANK_SORT_CLS_CODE: '0',
    FID_INPUT_CNT_1: '30',
    FID_PRC_CLS_CODE: '0',
    FID_INPUT_PRICE_1: '',
    FID_INPUT_PRICE_2: '',
    FID_VOL_CNT: '',
    FID_TRGT_CLS_CODE: '0',
    FID_TRGT_EXLS_CLS_CODE: '0',
    FID_DIV_CLS_CODE: '0',
    FID_RSFL_RATE1: '',
    FID_RSFL_RATE2: '',
  })

  const res = await fetch(
    `${KIS_BASE_URL}/uapi/domestic-stock/v1/ranking/fluctuation?${params.toString()}`,
    {
      method: 'GET',
      headers: {
        authorization: `Bearer ${accessToken}`,
        appkey: KIS_APP_KEY!,
        appsecret: KIS_APP_SECRET!,
        tr_id: 'FHPST01700000',
        custtype: 'P',
      },
    },
  )

  const data = await parseResponse(res)

  if (!res.ok) {
    throw new Error(`등락률 순위 조회 실패: ${JSON.stringify(data)}`)
  }

  return data?.output ?? []
}

async function getStockPrice(accessToken: string, stockCode: string) {
  const params = new URLSearchParams({
    FID_COND_MRKT_DIV_CODE: 'J',
    FID_INPUT_ISCD: stockCode,
  })

  const res = await fetch(
    `${KIS_BASE_URL}/uapi/domestic-stock/v1/quotations/inquire-price?${params.toString()}`,
    {
      method: 'GET',
      headers: {
        authorization: `Bearer ${accessToken}`,
        appkey: KIS_APP_KEY!,
        appsecret: KIS_APP_SECRET!,
        tr_id: 'FHKST01010100',
        custtype: 'P',
      },
    },
  )

  const data = await parseResponse(res)

  if (!res.ok) {
    return null
  }

  return data?.output
}

Deno.serve(async () => {
  let runId: string | null = null

  try {
    if (!KIS_APP_KEY || !KIS_APP_SECRET) {
      throw new Error('KIS 환경변수가 없습니다.')
    }

    if (!CLOUD_SUPABASE_URL || !CLOUD_SUPABASE_SERVICE_ROLE_KEY) {
      throw new Error('Supabase 서버 환경변수가 없습니다.')
    }

    const condition = await getActiveCondition()
    const run = await createRun(condition)
    runId = run.id

    const accessToken = await getAccessToken()
    const stocks = await getTopChangeRateStocks(accessToken)

    const minChangeRate = Number(condition.min_change_rate)
    const minTradeAmount = Number(condition.min_trade_amount)

    const filteredByRate = stocks.filter((stock: any) => {
      return Number(stock.prdy_ctrt) >= minChangeRate
    })

    const signalDate = new Date().toISOString().slice(0, 10)
    const results = []

    for (const stock of filteredByRate) {
      const detail = await getStockPrice(accessToken, stock.stck_shrn_iscd)
      if (!detail) continue

      const changeRate = Number(detail.prdy_ctrt)
      const tradeAmount = Number(detail.acml_tr_pbmn)

      const haltedExcluded =
        condition.exclude_halted === true && detail.temp_stop_yn === 'Y'

      const warningExcluded =
        condition.exclude_warning === true &&
        detail.mrkt_warn_cls_code &&
        detail.mrkt_warn_cls_code !== '00'

      if (haltedExcluded || warningExcluded) continue

      if (changeRate >= minChangeRate && tradeAmount >= minTradeAmount) {
        results.push({
          run_id: run.id,
          signal_date: signalDate,
          stock_code: detail.stck_shrn_iscd,
          stock_name: stock.hts_kor_isnm,
          market: detail.rprs_mrkt_kor_name,
          change_rate: changeRate,
          trade_amount: tradeAmount,
          market_cap: detail.hts_avls ? Number(detail.hts_avls) : null,
          close_price: detail.stck_prpr ? Number(detail.stck_prpr) : null,
          sector: detail.bstp_kor_isnm,
          theme: null,
        })
      }
    }

    if (results.length > 0) {
      const { error } = await supabase
        .from('stock_signals')
        .insert(results)

      if (error) {
        throw new Error(`조건 충족 종목 저장 실패: ${error.message}`)
      }
    }

    await updateRunSuccess(run.id, results.length)

    return Response.json({
      ok: true,
      condition: {
        name: condition.name,
        min_change_rate: minChangeRate,
        min_trade_amount: minTradeAmount,
      },
      count: results.length,
      results,
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)

    if (runId) {
      await updateRunFailed(runId, message)
    }

    return Response.json(
      {
        ok: false,
        message,
      },
      { status: 500 },
    )
  }
})