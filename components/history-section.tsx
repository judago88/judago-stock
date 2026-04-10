'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import { DayHistory } from '@/lib/stock-data'
import { cn } from '@/lib/utils'
import { Calendar, ChevronRight } from 'lucide-react'

interface HistorySectionProps {
  history: DayHistory[]
  selectedDate: string
  onSelectDate: (date: string) => void
}

export function HistorySection({
  history,
  selectedDate,
  onSelectDate,
}: HistorySectionProps) {
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    const month = date.getMonth() + 1
    const day = date.getDate()
    const weekday = ['일', '월', '화', '수', '목', '금', '토'][date.getDay()]
    return { display: `${month}/${day}`, weekday }
  }

  return (
    <Card className="border-border/50 bg-card/50 backdrop-blur py-4">
      <CardHeader className="pb-3 px-4">
        <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
          <Calendar className="w-4 h-4" />
          최근 30일 조건 충족 히스토리
        </CardTitle>
      </CardHeader>
      <CardContent className="px-2">
        <ScrollArea className="h-[280px]">
          <div className="space-y-1 px-2">
            {history.map((item) => {
              const { display, weekday } = formatDate(item.date)
              const isSelected = item.date === selectedDate
              const hasStocks = item.stockCount > 0

              return (
                <button
                  key={item.date}
                  onClick={() => onSelectDate(item.date)}
                  className={cn(
                    'w-full flex items-center justify-between px-3 py-2 rounded-lg transition-colors text-left',
                    isSelected
                      ? 'bg-accent text-accent-foreground'
                      : 'hover:bg-secondary/50',
                    !hasStocks && 'opacity-50'
                  )}
                >
                  <div className="flex items-center gap-3">
                    <div className="text-sm">
                      <span className="font-medium">{display}</span>
                      <span className="text-muted-foreground ml-1">
                        ({weekday})
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {hasStocks ? (
                      <span className="text-sm text-red-400 font-medium">
                        {item.stockCount}개 종목
                      </span>
                    ) : (
                      <span className="text-xs text-muted-foreground">
                        없음
                      </span>
                    )}
                    <ChevronRight className="w-4 h-4 text-muted-foreground" />
                  </div>
                </button>
              )
            })}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}
