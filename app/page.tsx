// app/page.tsx

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
import { StockUsageGuide } from "@/components/usage-guide";
import { StockDetailModal } from "@/components/stock-detail-modal";
import { USMarketSignal } from "@/components/us-market-signal";
import { HistorySection } from "@/components/history-section";
import { DateSelector } from "@/components/date-selector";
import {
  Stock,
  DayHistory,
  getStocksByDate,
  getSignalHistory,
} from "@/lib/stock-data";
import { useIsMobile } from "@/hooks/use-mobile";
import { ExternalLink, Filter, AlertCircle } from "lucide-react";
import Link from "next/link";
import { AuthButtons } from "@/components/auth-buttons";
import { NoticeBanner } from "@/components/notice-banner";
import { Notice, getLatestNotice } from "@/lib/stock-data";
import { Footer } from "@/components/footer";
import { InvestmentDisclaimer } from "@/components/investment-disclaimer";

type DataState = "loading" | "success" | "empty" | "error";

export default function DashboardPage() {
  const [selectedStock, setSelectedStock] = useState<Stock | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [dataState, setDataState] = useState<DataState>("loading");
  const [stocks, setStocks] = useState<Stock[]>([]);
  const [history, setHistory] = useState<DayHistory[]>([]);
  const [mobileModalOpen, setMobileModalOpen] = useState(false);
  const [latestNotice, setLatestNotice] = useState<Notice | null>(null);
  const isMobile = useIsMobile();

  const selectedDateStr = selectedDate.toISOString().split("T")[0];

  const PAGE_SIZE = 20;

  const [stockPage, setStockPage] = useState(0);
  const [hasMoreStocks, setHasMoreStocks] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  // Simulate data loading based on selected date
  useEffect(() => {
    const loadData = async () => {
      try {
        setDataState("loading");
        setSelectedStock(null);

        const [stocksData, historyData, noticeData] = await Promise.all([
          getStocksByDate(selectedDateStr, 0, PAGE_SIZE),
          getSignalHistory(30),
          getLatestNotice(),
        ]);

        setStocks(stocksData);
        setHistory(historyData);
        console.log("noticeData in page:", noticeData);
        setLatestNotice(noticeData);

        setStockPage(0);
        setHasMoreStocks(stocksData.length === PAGE_SIZE);

        if (stocksData.length > 0) {
          setDataState("success");
        } else {
          setDataState("empty");
        }
      } catch (error) {
        console.error(error);
        setStocks([]);
        setDataState("error");
      }
    };

    loadData();
  }, [selectedDateStr]);

  const handleStockSelect = (stock: Stock) => {
    setSelectedStock(stock);

    if (window.innerWidth < 1024) {
      setMobileModalOpen(true);
    }
  };

  const handleDateFromHistory = (dateStr: string) => {
    setSelectedDate(new Date(dateStr));
  };

  const handleLoadMoreStocks = async () => {
    try {
      setIsLoadingMore(true);

      const nextPage = stockPage + 1;
      const moreStocks = await getStocksByDate(
        selectedDateStr,
        nextPage,
        PAGE_SIZE
      );

      setStocks((prev) => [...prev, ...moreStocks]);
      setStockPage(nextPage);
      setHasMoreStocks(moreStocks.length === PAGE_SIZE);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoadingMore(false);
    }
  };

  const LoadMoreButton = () =>
    dataState === "success" && hasMoreStocks ? (
      <div className="mt-4 flex justify-center">
        <Button
          variant="outline"
          onClick={handleLoadMoreStocks}
          disabled={isLoadingMore}
        >
          {isLoadingMore ? "불러오는 중..." : "더보기"}
        </Button>
      </div>
    ) : null;

  return (
    <div className="min-h-screen bg-background">
      <AuthButtons />
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-md">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <Filter className="w-5 h-5 text-red-400" />
                <Link
                  href="/"
                  className="hidden sm:block text-lg font-bold hover:text-red-400 transition-colors"
                >
                  주다고 기준봉 센터
                </Link>
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
                  <a href="mailto:jundd1@gmail.com?subject=주다고 문의">
                    <ExternalLink className="w-4 h-4 mr-1.5" />
                    문의하기
                  </a>
                </Button>
                <Button
                  size="sm"
                  className="bg-red-500 hover:bg-red-600 text-white border-0"
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

      {/* 공지 영역 */}
      <NoticeBanner notice={latestNotice} />

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
            <LoadMoreButton />
            <StockUsageGuide />
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
              history={history}
              selectedDate={selectedDateStr}
              onSelectDate={handleDateFromHistory}
            />
          </div>
        </div>

        {/* Tablet Layout */}
        <div className="hidden md:block lg:hidden space-y-6">
          {/* 종목 리스트 먼저 */}
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

          <LoadMoreButton />

          {/* 글로벌 신호 + 히스토리 */}
          <div className="grid md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
              <USMarketSignal />
            </div>

            <div className="md:col-span-1">
              <HistorySection
                history={history.slice(0, 7)}
                selectedDate={selectedDateStr}
                onSelectDate={handleDateFromHistory}
              />
            </div>
          </div>

          <StockDetailModal
            stock={selectedStock}
            open={mobileModalOpen}
            onOpenChange={setMobileModalOpen}
          />
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
              className="border-border/50"
              asChild
            >
              <a href="mailto:jundd1@gmail.com?subject=주다고 문의">
                <ExternalLink className="w-4 h-4 mr-1.5" />
                문의하기
              </a>
            </Button>
            <Button
              size="sm"
              className="bg-red-500 hover:bg-red-600 text-white border-0"
              asChild
            >
              <Link href="/ebook">
                <ExternalLink className="w-4 h-4 mr-1.5" />
                전자책 구매
              </Link>
            </Button>
          </div>

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
          <LoadMoreButton />

          {/* US Market Signal - Compact */}
          <USMarketSignal />

          {/* History - Horizontal scroll */}
          <HistorySection
            history={history.slice(0, 10)}
            selectedDate={selectedDateStr}
            onSelectDate={handleDateFromHistory}
          />

          {/* Mobile Detail Modal */}
          <StockDetailModal
            stock={selectedStock}
            open={mobileModalOpen}
            onOpenChange={setMobileModalOpen}
          />
        </div>
      </main>
      <InvestmentDisclaimer />
      <Footer />
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
        <EmptyTitle>조건 충족 종목 없음</EmptyTitle>
        <EmptyDescription></EmptyDescription>
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
