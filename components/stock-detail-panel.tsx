'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Stock, formatKRW, generateChartData } from '@/lib/stock-data'
import { cn } from '@/lib/utils'
import { TrendingUp, Building2, Layers, BarChart3 } from 'lucide-react'
import { useMemo } from 'react'

interface StockDetailPanelProps {
  stock: Stock | null
}

export function StockDetailPanel({ stock }: StockDetailPanelProps) {
  const chartData = useMemo(() => generateChartData(), [])

  if (!stock) {
    return (
      <Card className="h-full border-border/50 bg-card/50 backdrop-blur flex items-center justify-center">
        <CardContent className="text-center text-muted-foreground">
          <BarChart3 className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p>종목을 선택하세요</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="h-full border-border/50 bg-card/50 backdrop-blur overflow-hidden">
      <CardHeader className="border-b border-border/50 pb-4">
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-xl">{stock.name}</CardTitle>
            <p className="text-sm text-muted-foreground mt-1">{stock.ticker}</p>
          </div>
          <Badge
            className={cn(
              'text-xs',
              stock.market === 'KOSPI'
                ? 'bg-blue-600/80 text-blue-50'
                : 'bg-emerald-600/80 text-emerald-50'
            )}
          >
            {stock.market}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-6 p-4 overflow-y-auto">
        {/* Price Section */}
        <div className="space-y-3">
          <div className="flex items-baseline gap-3">
            <span className="text-2xl font-bold font-mono">
              {formatKRW(stock.closingPrice)}
            </span>
            <span className="text-lg font-semibold text-red-400">
              +{stock.changePercent.toFixed(1)}%
            </span>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-secondary/30 rounded-lg p-3">
            <div className="flex items-center gap-2 text-muted-foreground text-xs mb-1">
              <TrendingUp className="w-3 h-3" />
              거래대금
            </div>
            <p className="font-mono font-medium">
              {formatKRW(stock.tradingValue, 'billion')}
            </p>
          </div>
          <div className="bg-secondary/30 rounded-lg p-3">
            <div className="flex items-center gap-2 text-muted-foreground text-xs mb-1">
              <Building2 className="w-3 h-3" />
              시가총액
            </div>
            <p className="font-mono font-medium">
              {formatKRW(stock.marketCap, 'billion')}
            </p>
          </div>
        </div>

        {/* Theme & Sector */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-muted-foreground text-xs">
            <Layers className="w-3 h-3" />
            테마/업종
          </div>
          <div className="flex flex-wrap gap-2">
            <Badge variant="secondary" className="bg-secondary/50">
              {stock.theme}
            </Badge>
            <Badge variant="outline" className="border-border/50">
              {stock.sector}
            </Badge>
          </div>
        </div>

        {/* Mini Chart */}
        <div className="space-y-2">
          <p className="text-xs text-muted-foreground">최근 60일 차트</p>
          <div className="bg-secondary/20 rounded-lg p-3 h-32">
            <MiniCandlestickChart data={chartData} />
          </div>
        </div>

        {/* Recent Trend */}
        <div className="space-y-2">
          <p className="text-xs text-muted-foreground">최근 추세 요약</p>
          <p className="text-sm leading-relaxed bg-secondary/20 rounded-lg p-3">
            {stock.recentTrend}
          </p>
        </div>
      </CardContent>
    </Card>
  )
}

interface ChartDataPoint {
  date: string
  open: number
  high: number
  low: number
  close: number
}

function MiniCandlestickChart({ data }: { data: ChartDataPoint[] }) {
  const maxHigh = Math.max(...data.map((d) => d.high))
  const minLow = Math.min(...data.map((d) => d.low))
  const range = maxHigh - minLow

  const getY = (price: number) => {
    return 100 - ((price - minLow) / range) * 100
  }

  return (
    <svg viewBox="0 0 300 100" className="w-full h-full" preserveAspectRatio="none">
      {data.map((candle, i) => {
        const x = (i / data.length) * 300
        const width = (300 / data.length) * 0.7
        const isUp = candle.close >= candle.open

        const bodyTop = getY(Math.max(candle.open, candle.close))
        const bodyBottom = getY(Math.min(candle.open, candle.close))
        const bodyHeight = Math.max(bodyBottom - bodyTop, 1)

        const wickTop = getY(candle.high)
        const wickBottom = getY(candle.low)

        return (
          <g key={i}>
            {/* Wick */}
            <line
              x1={x + width / 2}
              y1={wickTop}
              x2={x + width / 2}
              y2={wickBottom}
              stroke={isUp ? '#ef4444' : '#3b82f6'}
              strokeWidth={0.5}
            />
            {/* Body */}
            <rect
              x={x}
              y={bodyTop}
              width={width}
              height={bodyHeight}
              fill={isUp ? '#ef4444' : '#3b82f6'}
              rx={0.5}
            />
          </g>
        )
      })}
    </svg>
  )
}
