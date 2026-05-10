import { supabaseAdmin } from '../_shared/supabase-admin.ts'
import {
  getKisAccessToken,
  getStockPrice,
  getTopChangeRateStocks,
} from '../_shared/kis-api.ts'
import { saveStockHistory } from '../_shared/stock-history.ts'

async function getActiveCondition() {
  const { data, error } = await supabaseAdmin
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

  const { data, error } = await supabaseAdmin
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
  const { error } = await supabaseAdmin
    .from('stock_signal_runs')
    .update({
      status: 'success',
      total_count: totalCount,
      finished_at: new Date().toISOString(),
    })
    .eq('id', runId)

  if (error) {
    throw new Error(`실행 성공 상태 업데이트 실패: ${error.message}`)
  }
}

async function updateRunFailed(runId: string, message: string) {
  await supabaseAdmin
    .from('stock_signal_runs')
    .update({
      status: 'failed',
      error_message: message,
      finished_at: new Date().toISOString(),
    })
    .eq('id', runId)
}

Deno.serve(async () => {
  let runId: string | null = null

  try {
    const condition = await getActiveCondition()
    const run = await createRun(condition)
    runId = run.id

    const accessToken = await getKisAccessToken()
    const topStocks = await getTopChangeRateStocks(accessToken)

    const minChangeRate = Number(condition.min_change_rate)
    const minTradeAmount = Number(condition.min_trade_amount)

    const rateFilteredStocks = topStocks.filter((stock: any) => {
      return Number(stock.prdy_ctrt) >= minChangeRate
    })

    const signalDate = new Date().toISOString().slice(0, 10)
    const results = []
    const historyResults = []

    for (const stock of rateFilteredStocks) {
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
      const { error } = await supabaseAdmin
        .from('stock_signals')
        .insert(results)

      if (error) {
        throw new Error(`조건 충족 종목 저장 실패: ${error.message}`)
      }

      for (const result of results) {
        const savedCount = await saveStockHistory(
          accessToken,
          result.stock_code,
        )

        historyResults.push({
          stock_code: result.stock_code,
          stock_name: result.stock_name,
          saved_count: savedCount,
        })
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
      history_results: historyResults,
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