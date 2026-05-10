import { supabaseAdmin } from '../_shared/supabase-admin.ts'

type Direction = 'up' | 'down' | 'neutral'

interface IndicatorConfig {
  code: string
  name: string
  symbol: string
}

const INDICATORS: IndicatorConfig[] = [
  { code: 'NASDAQ_COMPOSITE', name: 'NASDAQ Composite', symbol: '^IXIC' },
  { code: 'NASDAQ100', name: 'NASDAQ100', symbol: '^NDX' },
  { code: 'DOW_JONES', name: 'Dow Jones', symbol: '^DJI' },
  { code: 'DOW_TRANSPORTATION', name: 'Dow Transportation', symbol: '^DJT' },
  { code: 'SP500', name: 'S&P500', symbol: '^GSPC' },
  { code: 'PHILADELPHIA_SEMI', name: 'Philadelphia Semi', symbol: '^SOX' },

  { code: 'DOW_FUTURES', name: 'Dow Futures', symbol: 'YM=F' },
  { code: 'NASDAQ100_FUTURES', name: 'Nasdaq100 Futures', symbol: 'NQ=F' },
  { code: 'SP500_FUTURES', name: 'S&P500 Futures', symbol: 'ES=F' },
  { code: 'RUSSELL2000_FUTURES', name: 'Russell 2000 Futures', symbol: 'RTY=F' },
  { code: 'VIX', name: 'VIX', symbol: '^VIX' },
]

function getKstDateString() {
  const now = new Date()
  const kst = new Date(now.getTime() + 9 * 60 * 60 * 1000)
  return kst.toISOString().slice(0, 10)
}

function getDirection(changeRate: number): Direction {
  if (changeRate > 0) return 'up'
  if (changeRate < 0) return 'down'
  return 'neutral'
}

function getSignalStatus(upCount: number) {
  if (upCount >= 8) {
    return {
      signal_status: 'bullish',
      signal_label: '상승우세',
    }
  }

  if (upCount >= 5) {
    return {
      signal_status: 'neutral',
      signal_label: '보통',
    }
  }

  return {
    signal_status: 'bearish',
    signal_label: '하락우세',
  }
}

async function fetchYahooChart(indicator: IndicatorConfig) {
  const url =
    `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(
      indicator.symbol,
    )}?interval=1d&range=5d`

  const res = await fetch(url, {
    headers: {
      'User-Agent':
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 Chrome/120 Safari/537.36',
      Accept: 'application/json',
    },
  })

  if (!res.ok) {
    throw new Error(`${indicator.name} Yahoo 조회 실패: ${res.status}`)
  }

  const json = await res.json()
  const result = json?.chart?.result?.[0]

  if (!result) {
    throw new Error(`${indicator.name} Yahoo 응답 없음`)
  }

  const meta = result.meta
  const quote = result.indicators?.quote?.[0]
  const closes = quote?.close?.filter((v: number | null) => v !== null) ?? []

  const currentValue = Number(meta.regularMarketPrice ?? closes.at(-1) ?? 0)
  const previousValue = Number(meta.chartPreviousClose ?? closes.at(-2) ?? 0)

  const changeValue = currentValue - previousValue
  const changeRate =
    previousValue > 0 ? (changeValue / previousValue) * 100 : 0

  return {
    indicator_code: indicator.code,
    indicator_name: indicator.name,
    current_value: currentValue,
    previous_value: previousValue,
    change_value: changeValue,
    change_rate: changeRate,
    direction: getDirection(changeRate),
  }
}

Deno.serve(async () => {
  try {
    const snapshotDate = getKstDateString()

    const items = []

    for (const indicator of INDICATORS) {
      try {
        const item = await fetchYahooChart(indicator)
        items.push(item)
      } catch (error) {
        console.error(error)

        items.push({
          indicator_code: indicator.code,
          indicator_name: indicator.name,
          current_value: null,
          previous_value: null,
          change_value: null,
          change_rate: null,
          direction: 'neutral' as Direction,
        })
      }
    }

    const upCount = items.filter((item) => item.direction === 'up').length
    const downCount = items.filter((item) => item.direction === 'down').length
    const neutralCount = items.filter(
      (item) => item.direction === 'neutral',
    ).length

    const { signal_status, signal_label } = getSignalStatus(upCount)

    const { data: snapshot, error: snapshotError } = await supabaseAdmin
      .from('global_market_snapshots')
      .insert({
        snapshot_date: snapshotDate,
        up_count: upCount,
        down_count: downCount,
        neutral_count: neutralCount,
        signal_status,
        signal_label,
      })
      .select()
      .single()

    if (snapshotError) {
      throw new Error(`global_market_snapshots 저장 실패: ${snapshotError.message}`)
    }

    const rows = items.map((item) => ({
      snapshot_id: snapshot.id,
      indicator_code: item.indicator_code,
      indicator_name: item.indicator_name,
      current_value: item.current_value,
      previous_value: item.previous_value,
      change_value: item.change_value,
      change_rate: item.change_rate,
      direction: item.direction,
    }))

    const { error: itemsError } = await supabaseAdmin
      .from('global_market_snapshot_items')
      .insert(rows)

    if (itemsError) {
      throw new Error(
        `global_market_snapshot_items 저장 실패: ${itemsError.message}`,
      )
    }

    return Response.json({
      ok: true,
      snapshot,
      items: rows,
    })
  } catch (error) {
    return Response.json(
      {
        ok: false,
        message: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  }
})