export const KIS_APP_KEY = Deno.env.get('KIS_APP_KEY')
export const KIS_APP_SECRET = Deno.env.get('KIS_APP_SECRET')

export const KIS_BASE_URL =
  Deno.env.get('KIS_BASE_URL') ??
  'https://openapi.koreainvestment.com:9443'

export async function parseResponse(res: Response) {
  const text = await res.text()

  if (!text) return null

  try {
    return JSON.parse(text)
  } catch {
    return {
      parse_error: true,
      raw_text: text,
    }
  }
}

export async function getKisAccessToken() {
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

export async function getStockPrice(
  accessToken: string,
  stockCode: string,
) {
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

  return data?.output
}

export async function getTopChangeRateStocks(
  accessToken: string,
) {
  const params = new URLSearchParams({
    FID_COND_MRKT_DIV_CODE: 'J',
    FID_COND_SCR_DIV_CODE: '20170',
    FID_INPUT_ISCD: '0000',
    FID_RANK_SORT_CLS_CODE: '0',
    FID_INPUT_CNT_1: '100',
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

  return data?.output ?? []
}

export function formatDate(date: Date) {
  return date.toISOString().slice(0, 10).replaceAll('-', '')
}

export async function getDailyStockHistory(
  accessToken: string,
  stockCode: string,
) {
  const today = new Date()

  const from = new Date()
  from.setDate(today.getDate() - 100)

  const params = new URLSearchParams({
    FID_COND_MRKT_DIV_CODE: 'J',
    FID_INPUT_ISCD: stockCode,
    FID_INPUT_DATE_1: formatDate(from),
    FID_INPUT_DATE_2: formatDate(today),
    FID_PERIOD_DIV_CODE: 'D',
    FID_ORG_ADJ_PRC: '1',
  })

  const res = await fetch(
    `${KIS_BASE_URL}/uapi/domestic-stock/v1/quotations/inquire-daily-itemchartprice?${params.toString()}`,
    {
      method: 'GET',
      headers: {
        authorization: `Bearer ${accessToken}`,
        appkey: KIS_APP_KEY!,
        appsecret: KIS_APP_SECRET!,
        tr_id: 'FHKST03010100',
        custtype: 'P',
      },
    },
  )

  const data = await parseResponse(res)

  return data?.output2 ?? []
}