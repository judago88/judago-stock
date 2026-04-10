export interface Stock {
  id: string
  name: string
  ticker: string
  closingPrice: number
  changePercent: number
  tradingValue: number // in billions KRW
  marketCap: number // in billions KRW
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

export interface USMarketIndex {
  name: string
  change: 'up' | 'down' | 'neutral'
}

// Mock data for demonstration
export const mockStocks: Stock[] = [
  {
    id: '1',
    name: '에코프로비엠',
    ticker: '247540',
    closingPrice: 285000,
    changePercent: 29.5,
    tradingValue: 850,
    marketCap: 12500,
    theme: '2차전지',
    sector: '전기전자',
    market: 'KOSDAQ',
    hasHighVolume: true,
    recentTrend: '최근 5거래일 연속 상승세. 기관 순매수 지속. 2차전지 섹터 강세 흐름 편승.',
  },
  {
    id: '2',
    name: 'HLB',
    ticker: '028300',
    closingPrice: 78500,
    changePercent: 27.8,
    tradingValue: 620,
    marketCap: 8900,
    theme: '바이오',
    sector: '의약품',
    market: 'KOSDAQ',
    hasHighVolume: true,
    recentTrend: 'FDA 승인 기대감으로 급등. 외국인 대량 매수세 유입.',
  },
  {
    id: '3',
    name: '포스코퓨처엠',
    ticker: '003670',
    closingPrice: 425000,
    changePercent: 26.3,
    tradingValue: 520,
    marketCap: 15800,
    theme: '2차전지',
    sector: '철강금속',
    market: 'KOSPI',
    hasHighVolume: false,
    recentTrend: '양극재 수주 확대 기대감. 실적 호전 전망 발표.',
  },
  {
    id: '4',
    name: '레인보우로보틱스',
    ticker: '277810',
    closingPrice: 165000,
    changePercent: 25.8,
    tradingValue: 180,
    marketCap: 3200,
    theme: '로봇',
    sector: '기계장비',
    market: 'KOSDAQ',
    hasHighVolume: true,
    recentTrend: '삼성전자 협력 확대 소식에 급등. 로봇 테마 강세.',
  },
  {
    id: '5',
    name: 'LS일렉트릭',
    ticker: '010120',
    closingPrice: 198000,
    changePercent: 25.2,
    tradingValue: 95,
    marketCap: 5900,
    theme: '전력기기',
    sector: '전기전자',
    market: 'KOSPI',
    hasHighVolume: false,
    recentTrend: '미국 전력망 투자 확대 수혜 기대. 기관 매집 진행중.',
  },
]

export const mock30DayHistory: DayHistory[] = [
  { date: '2026-04-03', stockCount: 5 },
  { date: '2026-04-02', stockCount: 3 },
  { date: '2026-04-01', stockCount: 0 },
  { date: '2026-03-31', stockCount: 7 },
  { date: '2026-03-28', stockCount: 2 },
  { date: '2026-03-27', stockCount: 4 },
  { date: '2026-03-26', stockCount: 1 },
  { date: '2026-03-25', stockCount: 0 },
  { date: '2026-03-24', stockCount: 6 },
  { date: '2026-03-21', stockCount: 3 },
  { date: '2026-03-20', stockCount: 2 },
  { date: '2026-03-19', stockCount: 5 },
  { date: '2026-03-18', stockCount: 0 },
  { date: '2026-03-17', stockCount: 4 },
  { date: '2026-03-14', stockCount: 1 },
]

export const usMarketIndices: { spot: USMarketIndex[]; futures: USMarketIndex[] } = {
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

export function getMarketSignal(indices: { spot: USMarketIndex[]; futures: USMarketIndex[] }): {
  signal: 'green' | 'yellow' | 'red'
  label: string
} {
  const allIndices = [...indices.spot, ...indices.futures]
  const upCount = allIndices.filter((i) => i.change === 'up').length
  const downCount = allIndices.filter((i) => i.change === 'down').length
  const total = allIndices.length

  if (upCount >= total * 0.6) {
    return { signal: 'green', label: '상승 우세' }
  } else if (downCount >= total * 0.6) {
    return { signal: 'red', label: '하락 우세' }
  }
  return { signal: 'yellow', label: '혼조' }
}

// Generate chart data for mini candlestick (last 60 days)
export function generateChartData() {
  const data = []
  let basePrice = 200000
  
  for (let i = 60; i >= 0; i--) {
    const date = new Date()
    date.setDate(date.getDate() - i)
    
    const volatility = Math.random() * 0.08 - 0.04
    const open = basePrice * (1 + (Math.random() * 0.02 - 0.01))
    const close = open * (1 + volatility)
    const high = Math.max(open, close) * (1 + Math.random() * 0.02)
    const low = Math.min(open, close) * (1 - Math.random() * 0.02)
    
    data.push({
      date: date.toISOString().split('T')[0],
      open: Math.round(open),
      high: Math.round(high),
      low: Math.round(low),
      close: Math.round(close),
    })
    
    basePrice = close
  }
  
  return data
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
