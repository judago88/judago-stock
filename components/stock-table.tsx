'use client'

import { useState } from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Stock, formatKRW } from '@/lib/stock-data'
import { cn } from '@/lib/utils'
import { ArrowUpDown, ChevronUp, ChevronDown } from 'lucide-react'

type SortField = 'name' | 'closingPrice' | 'marketCap' | 'tradingValue'
type SortDirection = 'asc' | 'desc'

interface StockTableProps {
  stocks: Stock[]
  selectedStock: Stock | null
  onSelectStock: (stock: Stock) => void
  isLoading?: boolean
}

export function StockTable({
  stocks,
  selectedStock,
  onSelectStock,
  isLoading,
}: StockTableProps) {
  const [sortField, setSortField] = useState<SortField>('marketCap')
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc')

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortDirection('desc')
    }
  }

  const sortedStocks = [...stocks].sort((a, b) => {
    const multiplier = sortDirection === 'asc' ? 1 : -1
    switch (sortField) {
      case 'name':
        return multiplier * a.name.localeCompare(b.name)
      case 'closingPrice':
        return multiplier * (a.closingPrice - b.closingPrice)
      case 'marketCap':
        return multiplier * (a.marketCap - b.marketCap)
      case 'tradingValue':
        return multiplier * (a.tradingValue - b.tradingValue)
      default:
        return 0
    }
  })

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) {
      return <ArrowUpDown className="ml-1 h-3 w-3 text-muted-foreground" />
    }
    return sortDirection === 'asc' ? (
      <ChevronUp className="ml-1 h-3 w-3" />
    ) : (
      <ChevronDown className="ml-1 h-3 w-3" />
    )
  }

  if (isLoading) {
    return <StockTableSkeleton />
  }

  return (
    <Table>
      <TableHeader>
        <TableRow className="hover:bg-transparent border-border/50">
          <TableHead
            className="cursor-pointer select-none"
            onClick={() => handleSort('name')}
          >
            <span className="flex items-center">
              종목명
              <SortIcon field="name" />
            </span>
          </TableHead>
          <TableHead
            className="cursor-pointer select-none text-right"
            onClick={() => handleSort('closingPrice')}
          >
            <span className="flex items-center justify-end">
              종가
              <SortIcon field="closingPrice" />
            </span>
          </TableHead>
          <TableHead
            className="cursor-pointer select-none text-right"
            onClick={() => handleSort('marketCap')}
          >
            <span className="flex items-center justify-end">
              시가총액
              <SortIcon field="marketCap" />
            </span>
          </TableHead>
          <TableHead>테마/업종</TableHead>
          <TableHead>시장구분</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {sortedStocks.map((stock) => (
          <TableRow
            key={stock.id}
            onClick={() => onSelectStock(stock)}
            className={cn(
              'cursor-pointer transition-colors border-border/50',
              selectedStock?.id === stock.id && 'bg-accent',
              stock.hasHighVolume && 'bg-red-950/20'
            )}
          >
            <TableCell className="font-medium">
              <div>
                <p>{stock.name}</p>
                <p className="text-xs text-muted-foreground">{stock.ticker}</p>
              </div>
            </TableCell>
            <TableCell className="text-right font-mono">
              {formatKRW(stock.closingPrice)}
            </TableCell>
            <TableCell className="text-right font-mono text-muted-foreground">
              {formatKRW(stock.marketCap, 'billion')}
            </TableCell>
            <TableCell>
              <div className="flex flex-wrap gap-1">
                <Badge variant="secondary" className="text-xs bg-secondary/50">
                  {stock.theme}
                </Badge>
                <Badge variant="outline" className="text-xs border-border/50">
                  {stock.sector}
                </Badge>
              </div>
            </TableCell>
            <TableCell>
              <Badge
                variant={stock.market === 'KOSPI' ? 'default' : 'secondary'}
                className={cn(
                  'text-xs',
                  stock.market === 'KOSPI'
                    ? 'bg-blue-600/80 text-blue-50'
                    : 'bg-emerald-600/80 text-emerald-50'
                )}
              >
                {stock.market}
              </Badge>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

function StockTableSkeleton() {
  return (
    <Table>
      <TableHeader>
        <TableRow className="hover:bg-transparent border-border/50">
          <TableHead>종목명</TableHead>
          <TableHead className="text-right">종가</TableHead>
          <TableHead className="text-right">시가총액</TableHead>
          <TableHead>테마/업종</TableHead>
          <TableHead>시장구분</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {[...Array(5)].map((_, i) => (
          <TableRow key={i} className="border-border/50">
            <TableCell>
              <div className="space-y-2">
                <div className="h-4 w-24 bg-accent animate-pulse rounded" />
                <div className="h-3 w-16 bg-accent animate-pulse rounded" />
              </div>
            </TableCell>
            <TableCell className="text-right">
              <div className="h-4 w-20 bg-accent animate-pulse rounded ml-auto" />
            </TableCell>
            <TableCell className="text-right">
              <div className="h-4 w-16 bg-accent animate-pulse rounded ml-auto" />
            </TableCell>
            <TableCell>
              <div className="flex gap-1">
                <div className="h-5 w-14 bg-accent animate-pulse rounded" />
                <div className="h-5 w-12 bg-accent animate-pulse rounded" />
              </div>
            </TableCell>
            <TableCell>
              <div className="h-5 w-16 bg-accent animate-pulse rounded" />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
