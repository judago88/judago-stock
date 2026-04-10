'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { usMarketIndices, getMarketSignal } from '@/lib/stock-data'
import { cn } from '@/lib/utils'
import { TrendingUp, TrendingDown, Minus } from 'lucide-react'

export function USMarketSignal() {
  const { signal, label } = getMarketSignal(usMarketIndices)

  return (
    <Card className="border-border/50 bg-card/50 backdrop-blur py-4">
      <CardHeader className="pb-3 px-4">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          글로벌 경제 신호
        </CardTitle>
      </CardHeader>
      <CardContent className="px-4 space-y-4">
        <div className="flex items-center gap-4">
          <div
            className={cn(
              'w-12 h-12 rounded-full flex items-center justify-center shadow-lg',
              signal === 'green' && 'bg-red-500 shadow-red-500/30',
              signal === 'yellow' && 'bg-yellow-500 shadow-yellow-500/30',
              signal === 'red' && 'bg-blue-500 shadow-blue-500/30'
            )}
          >
            <div
              className={cn(
                'w-8 h-8 rounded-full animate-pulse',
                signal === 'green' && 'bg-red-400',
                signal === 'yellow' && 'bg-yellow-400',
                signal === 'red' && 'bg-blue-400'
              )}
            />
          </div>
          <span
            className={cn(
              'text-sm font-semibold',
              signal === 'green' && 'text-red-400',
              signal === 'yellow' && 'text-yellow-400',
              signal === 'red' && 'text-blue-400'
            )}
          >
            {label}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-1.5">
          {[...usMarketIndices.spot, ...usMarketIndices.futures].map((index) => (
            <div
              key={index.name}
              className="flex items-center gap-1 text-xs"
            >
              {index.change === 'up' && (
                <TrendingUp className="w-3 h-3 text-red-400" />
              )}
              {index.change === 'down' && (
                <TrendingDown className="w-3 h-3 text-blue-400" />
              )}
              {index.change === 'neutral' && (
                <Minus className="w-3 h-3 text-muted-foreground" />
              )}
              <span className="text-muted-foreground truncate">
                {index.name}
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
