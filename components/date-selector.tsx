'use client'

import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { cn } from '@/lib/utils'
import { CalendarIcon } from 'lucide-react'
import { format } from 'date-fns'
import { ko } from 'date-fns/locale'

interface DateSelectorProps {
  date: Date
  onDateChange: (date: Date) => void
}

export function DateSelector({ date, onDateChange }: DateSelectorProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            'justify-start text-left font-normal border-border/50 bg-card/50',
            !date && 'text-muted-foreground'
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date ? format(date, 'yyyy년 M월 d일 (EEE)', { locale: ko }) : '날짜 선택'}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={date}
          onSelect={(newDate) => newDate && onDateChange(newDate)}
          initialFocus
          disabled={(date) => date > new Date() || date < new Date('2024-01-01')}
        />
      </PopoverContent>
    </Popover>
  )
}
