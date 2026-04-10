"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Empty,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
  EmptyDescription,
} from "@/components/ui/empty";
import { StockTable } from "@/components/stock-table";
import { StockDetailPanel } from "@/components/stock-detail-panel";
import { StockCard, StockCardSkeleton } from "@/components/stock-card";
import { StockDetailModal } from "@/components/stock-detail-modal";
import { USMarketSignal } from "@/components/us-market-signal";
import { HistorySection } from "@/components/history-section";
import { DateSelector } from "@/components/date-selector";
import { Stock, mockStocks, mock30DayHistory } from "@/lib/stock-data";
import { useIsMobile } from "@/hooks/use-mobile";
import { ExternalLink, Filter, AlertCircle } from "lucide-react";
import Link from "next/link";

type DataState = "loading" | "success" | "empty" | "error";

export default function DashboardPage() {
  const [selectedStock, setSelectedStock] = useState<Stock | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [dataState, setDataState] = useState<DataState>("loading");
  const [stocks, setStocks] = useState<Stock[]>([]);
  const [mobileModalOpen, setMobileModalOpen] = useState(false);
  const isMobile = useIsMobile();

  const selectedDateStr = selectedDate.toISOString().split("T")[0];

  // Simulate data loading based on selected date
  useEffect(() => {
    setDataState("loading");
    setSelectedStock(null);

    const timer = setTimeout(() => {
      const historyItem = mock30DayHistory.find(
        (h) => h.date === selectedDateStr,
      );

      if (historyItem && historyItem.stockCount > 0) {
        // Show stocks proportional to the count in history
        const stocksToShow = mockStocks.slice(
          0,
          Math.min(historyItem.stockCount, mockStocks.length),
        );
        setStocks(stocksToShow);
        setDataState("success");
      } else if (historyItem && historyItem.stockCount === 0) {
        setStocks([]);
        setDataState("empty");
      } else {
        // Default to showing all mock stocks for current/unknown dates
        setStocks(mockStocks);
        setDataState("success");
      }
    }, 800);

    return () => clearTimeout(timer);
  }, [selectedDateStr]);

  const handleStockSelect = (stock: Stock) => {
    setSelectedStock(stock);
    if (isMobile) {
      setMobileModalOpen(true);
    }
  };

  const handleDateFromHistory = (dateStr: string) => {
    setSelectedDate(new Date(dateStr));
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-md">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <Filter className="w-5 h-5 text-red-400" />
                <h1 className="text-lg font-bold hidden sm:block">
                  주다고 기준봉 센터
                </h1>
                <h1 className="text-lg font-bold sm:hidden">기준봉 센터</h1>
              </div>
            </div>

            <div className="flex items-center gap-2 sm:gap-3">
              <DateSelector
                date={selectedDate}
                onDateChange={setSelectedDate}
              />

              <div className="hidden sm:flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="border-border/50"
                  asChild
                >
                  <a
                    href="https://www.threads.com/@jodago_"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <ExternalLink className="w-4 h-4 mr-1.5" />
                    Threads
                  </a>
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="border-border/50"
                  asChild
                >
                  <Link href="/ebook">
                    <ExternalLink className="w-4 h-4 mr-1.5" />
                    전자책 구매
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Filter Conditions Info */}
      <div className="border-b border-border/50 bg-secondary/20">
        <div className="container mx-auto px-4 py-2">
          <p className="text-xs text-muted-foreground text-center">
            아래 종목 중 매수조건이 충족된 구간에서 매매를 진행하세요.
          </p>
        </div>
      </div>

      <main className="container mx-auto px-4 py-6">
        {/* Desktop Layout */}
        <div className="hidden lg:grid lg:grid-cols-12 gap-6">
          {/* Main Table Area */}
          <div className="lg:col-span-7 space-y-4">
            <Card className="border-border/50 bg-card/50 backdrop-blur overflow-hidden">
              <CardContent className="p-0">
                {dataState === "loading" && (
                  <StockTable
                    stocks={[]}
                    selectedStock={null}
                    onSelectStock={() => {}}
                    isLoading
                  />
                )}
                {dataState === "success" && (
                  <StockTable
                    stocks={stocks}
                    selectedStock={selectedStock}
                    onSelectStock={handleStockSelect}
                  />
                )}
                {dataState === "empty" && <EmptyState />}
                {dataState === "error" && <ErrorState />}
              </CardContent>
            </Card>
          </div>

          {/* Right Sidebar */}
          <div className="lg:col-span-5 space-y-4">
            {/* Stock Detail Panel */}
            <div className="h-[500px]">
              <StockDetailPanel stock={selectedStock} />
            </div>

            {/* US Market Signal */}
            <USMarketSignal />

            {/* History Section */}
            <HistorySection
              history={mock30DayHistory}
              selectedDate={selectedDateStr}
              onSelectDate={handleDateFromHistory}
            />
          </div>
        </div>

        {/* Tablet Layout */}
        <div className="hidden md:block lg:hidden space-y-6">
          <div className="grid md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
              <USMarketSignal />
            </div>
            <div className="md:col-span-1">
              <HistorySection
                history={mock30DayHistory.slice(0, 7)}
                selectedDate={selectedDateStr}
                onSelectDate={handleDateFromHistory}
              />
            </div>
          </div>

          <Card className="border-border/50 bg-card/50 backdrop-blur overflow-hidden">
            <CardContent className="p-0">
              {dataState === "loading" && (
                <StockTable
                  stocks={[]}
                  selectedStock={null}
                  onSelectStock={() => {}}
                  isLoading
                />
              )}
              {dataState === "success" && (
                <StockTable
                  stocks={stocks}
                  selectedStock={selectedStock}
                  onSelectStock={handleStockSelect}
                />
              )}
              {dataState === "empty" && <EmptyState />}
              {dataState === "error" && <ErrorState />}
            </CardContent>
          </Card>

          {selectedStock && (
            <div className="h-[400px]">
              <StockDetailPanel stock={selectedStock} />
            </div>
          )}
        </div>

        {/* Mobile Layout */}
        <div className="md:hidden space-y-4">
          {/* Mobile External Links */}
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              className="flex-1 border-border/50"
              asChild
            >
              <a
                href="https://www.threads.com/@jodago_"
                target="_blank"
                rel="noopener noreferrer"
              >
                <ExternalLink className="w-4 h-4 mr-1.5" />
                Threads
              </a>
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="flex-1 border-border/50"
              asChild
            >
              <Link href="/ebook">
                <ExternalLink className="w-4 h-4 mr-1.5" />
                전자책 구매
              </Link>
            </Button>
          </div>

          {/* US Market Signal - Compact */}
          <USMarketSignal />

          {/* History - Horizontal scroll */}
          <HistorySection
            history={mock30DayHistory.slice(0, 10)}
            selectedDate={selectedDateStr}
            onSelectDate={handleDateFromHistory}
          />

          {/* Stock Cards */}
          <div className="space-y-3">
            {dataState === "loading" && (
              <>
                <StockCardSkeleton />
                <StockCardSkeleton />
                <StockCardSkeleton />
              </>
            )}
            {dataState === "success" &&
              stocks.map((stock) => (
                <StockCard
                  key={stock.id}
                  stock={stock}
                  onClick={() => handleStockSelect(stock)}
                />
              ))}
            {dataState === "empty" && <EmptyState />}
            {dataState === "error" && <ErrorState />}
          </div>

          {/* Mobile Detail Modal */}
          <StockDetailModal
            stock={selectedStock}
            open={mobileModalOpen}
            onOpenChange={setMobileModalOpen}
          />
        </div>
      </main>
    </div>
  );
}

function EmptyState() {
  return (
    <Empty className="py-16">
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <Filter className="w-6 h-6" />
        </EmptyMedia>
        <EmptyTitle>오늘 조건 충족 종목 없음</EmptyTitle>
        <EmptyDescription>
          거래대금 ≥ 500억원, 일간 상승률 ≥ +25% 조건을 충족하는 종목이
          없습니다.
        </EmptyDescription>
      </EmptyHeader>
    </Empty>
  );
}

function ErrorState() {
  return (
    <Empty className="py-16">
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <AlertCircle className="w-6 h-6 text-destructive" />
        </EmptyMedia>
        <EmptyTitle>데이터 로드 실패</EmptyTitle>
        <EmptyDescription>잠시 후 다시 시도해주세요.</EmptyDescription>
      </EmptyHeader>
    </Empty>
  );
}
