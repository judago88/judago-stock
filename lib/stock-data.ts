import { createClient } from '@/lib/supabase/client'

export interface Stock {
  id: string
  name: string
  ticker: string
  closingPrice: number
  changePercent: number
  tradingValue: number // 억 원
  marketCap: number // 억 원
  theme: string
  sector: string
  market: 'KOSPI' | 'KOSDAQ'
  hasHighVolume: boolean
  recentTrend: string
}

export interface DayHistory {
  date: string
  stockCount: number
}

export interface ChartDataPoint {
  date: string
  open: number
  high: number
  low: number
  close: number
}

export interface StockSignalCondition {
  id: string
  name: string
  min_change_rate: number
  min_trade_amount: number
  is_active: boolean
}

export async function getActiveStockSignalCondition() {
  const supabase = createClient()

  const { data, error } = await supabase
    .from('stock_signal_conditions')
    .select('*')
    .eq('is_active', true)
    .order('created_at', { ascending: false })
    .limit(1)
    .single()

  if (error) throw error

  return data as StockSignalCondition
}

export async function getStocksByDate(
  date: string,
  page = 0,
  pageSize = 20,
): Promise<Stock[]> {
  const supabase = createClient()

  const from = page * pageSize
  const to = from + pageSize - 1

  const { data, error } = await supabase
    .from('stock_signals')
    .select('*')
    .eq('signal_date', date)
    .order('trade_amount', { ascending: false })
    .range(from, to)

  if (error) throw error

  return (data ?? []).map((row) => ({
    id: row.id,
    name: row.stock_name,
    ticker: row.stock_code,
    closingPrice: row.close_price ?? 0,
    changePercent: Number(row.change_rate ?? 0),
    tradingValue: Math.round(Number(row.trade_amount ?? 0) / 100000000),
    marketCap: Number(row.market_cap ?? 0),
    theme: row.theme ?? '미분류',
    sector: row.sector ?? '미분류',
    market: row.market === 'KOSPI' ? 'KOSPI' : 'KOSDAQ',
    hasHighVolume: Number(row.trade_amount ?? 0) >= 50_000_000_000,
    recentTrend: '조건 충족 종목입니다. 상세 차트와 거래대금 흐름을 확인하세요.',
  }))
}

export async function getSignalHistory(limit = 30): Promise<DayHistory[]> {
  const supabase = createClient()

  const startDate = new Date()
  startDate.setDate(startDate.getDate() - limit)

  const yyyyMMdd = startDate.toISOString().split('T')[0]

  const { data, error } = await supabase
    .from('stock_signals')
    .select('signal_date')
    .gte('signal_date', yyyyMMdd)

  if (error) throw error

  const countByDate = new Map<string, number>()

  for (const row of data ?? []) {
    const date = row.signal_date
    countByDate.set(date, (countByDate.get(date) ?? 0) + 1)
  }

  const result: DayHistory[] = []

  for (let i = 0; i < limit; i++) {
    const date = new Date()
    date.setDate(date.getDate() - i)

    const dateStr = date.toISOString().split('T')[0]

    result.push({
      date: dateStr,
      stockCount: countByDate.get(dateStr) ?? 0,
    })
  }

  return result
}

export async function getStockChartData(
  stockCode: string,
  limit = 60,
): Promise<ChartDataPoint[]> {
  const supabase = createClient()

  const { data, error } = await supabase
    .from('stock_price_history')
    .select('price_date, open_price, high_price, low_price, close_price')
    .eq('stock_code', stockCode)
    .order('price_date', { ascending: false })
    .limit(limit)

  if (error) throw error

  return (data ?? [])
    .reverse()
    .map((row) => ({
      date: row.price_date,
      open: row.open_price ?? 0,
      high: row.high_price ?? 0,
      low: row.low_price ?? 0,
      close: row.close_price ?? 0,
    }))
}

export function formatKRW(value: number, unit: 'won' | 'billion' = 'won'): string {
  if (unit === 'billion') {
    if (value >= 10000) {
      return `${(value / 10000).toFixed(1)}조`
    }
    return `${value.toLocaleString()}억`
  }

  return `₩${value.toLocaleString()}`
}

export interface USMarketIndex {
  name: string
  change: 'up' | 'down' | 'neutral'
}

export const usMarketIndices: {
  spot: USMarketIndex[]
  futures: USMarketIndex[]
} = {
  spot: [
    { name: 'NASDAQ Composite', change: 'up' },
    { name: 'NASDAQ100', change: 'up' },
    { name: 'Dow Jones', change: 'up' },
    { name: 'Dow Transportation', change: 'down' },
    { name: 'S&P500', change: 'up' },
    { name: 'Philadelphia Semi', change: 'up' },
  ],
  futures: [
    { name: 'Dow Futures', change: 'up' },
    { name: 'Nasdaq100 Futures', change: 'up' },
    { name: 'S&P500 Futures', change: 'neutral' },
    { name: 'Russell 2000 Futures', change: 'down' },
    { name: 'VIX', change: 'down' },
  ],
}

export function getMarketSignal(indices: {
  spot: USMarketIndex[]
  futures: USMarketIndex[]
}): {
  signal: 'green' | 'yellow' | 'red'
  label: string
} {
  const allIndices = [...indices.spot, ...indices.futures]
  const upCount = allIndices.filter((i) => i.change === 'up').length
  const downCount = allIndices.filter((i) => i.change === 'down').length
  const total = allIndices.length

  if (upCount >= total * 0.6) {
    return { signal: 'green', label: '상승 우세' }
  }

  if (downCount >= total * 0.6) {
    return { signal: 'red', label: '하락 우세' }
  }

  return { signal: 'yellow', label: '혼조' }
}

export interface GlobalMarketSnapshot {
  id: string
  snapshot_date: string
  snapshot_time: string
  up_count: number
  down_count: number
  neutral_count: number
  signal_status: 'bullish' | 'neutral' | 'bearish'
  signal_label: string
}

export interface GlobalMarketItem {
  id: string
  snapshot_id: string
  indicator_code: string
  indicator_name: string
  current_value: number | null
  previous_value: number | null
  change_value: number | null
  change_rate: number | null
  direction: 'up' | 'down' | 'neutral'
}

export async function getLatestGlobalMarketSignal() {
  const supabase = createClient()

  const { data: snapshot, error: snapshotError } = await supabase
    .from('global_market_snapshots')
    .select('*')
    .order('snapshot_time', { ascending: false })
    .limit(1)
    .single()

  if (snapshotError) throw snapshotError

  const { data: items, error: itemsError } = await supabase
    .from('global_market_snapshot_items')
    .select('*')
    .eq('snapshot_id', snapshot.id)
    .order('created_at', { ascending: true })

  if (itemsError) throw itemsError

  return {
    snapshot: snapshot as GlobalMarketSnapshot,
    items: (items ?? []) as GlobalMarketItem[],
  }
}

export interface Notice {
  id: string
  title: string
  content: string | null
  type: string
  is_active: boolean
  is_pinned: boolean
  starts_at: string | null
  ends_at: string | null
  author: string | null
  view_count: number
  created_at: string
  updated_at: string
}

export async function getPinnedNotices() {
  const supabase = createClient()

  const now = new Date().toISOString()

  const { data, error } = await supabase
    .from("notices")
    .select("*")
    .eq("is_active", true)
    .eq("is_pinned", true)
    .or(`starts_at.is.null,starts_at.lte.${now}`)
    .or(`ends_at.is.null,ends_at.gte.${now}`)
    .order("created_at", {
      ascending: false,
    })

  if (error) throw error

  return data ?? []
}

export async function getLatestNotice(): Promise<Notice | null> {
  const supabase = createClient()

  const now = new Date().toISOString()

  const { data, error } = await supabase
    .from("notices")
    .select("*")
    .eq("is_active", true)
    .or(`starts_at.is.null,starts_at.lte.${now}`)
    .or(`ends_at.is.null,ends_at.gte.${now}`)
    .order("is_pinned", { ascending: false })
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle()

  if (error) throw error

  return data
}

export async function getNoticeById(id: string): Promise<Notice | null> {
  const supabase = createClient()

  const { data, error } = await supabase
    .from('notices')
    .select('*')
    .eq('id', id)
    .eq('is_active', true)
    .maybeSingle()

  if (error) throw error

  return data
}

export async function getNotices(): Promise<Notice[]> {
  const supabase = createClient()

  const { data, error } = await supabase
    .from('notices')
    .select('*')
    .eq('is_active', true)
    .order('is_pinned', { ascending: false })
    .order('created_at', { ascending: false })

  if (error) throw error

  return data ?? []
}