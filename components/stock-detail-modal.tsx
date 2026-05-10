// components/stock-detail-modal.tsx

"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { TrendingUp, Building2, Layers } from "lucide-react";
import {
  Stock,
  formatKRW,
  getStockChartData,
  type ChartDataPoint,
} from "@/lib/stock-data";
import { useEffect, useState } from "react";

interface StockDetailModalProps {
  stock: Stock | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function StockDetailModal({
  stock,
  open,
  onOpenChange,
}: StockDetailModalProps) {
  const [chartData, setChartData] = useState<ChartDataPoint[]>([]);
  const [isChartLoading, setIsChartLoading] = useState(false);

  useEffect(() => {
    const loadChart = async () => {
      if (!stock || !open) return;

      try {
        setIsChartLoading(true);
        const data = await getStockChartData(stock.ticker);
        setChartData(data);
      } catch (error) {
        console.error(error);
        setChartData([]);
      } finally {
        setIsChartLoading(false);
      }
    };

    loadChart();
  }, [stock, open]);
  if (!stock) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-start justify-between">
            <div>
              <DialogTitle className="text-xl">{stock.name}</DialogTitle>
              <p className="text-sm text-muted-foreground mt-1">
                {stock.ticker}
              </p>
            </div>
            <Badge
              className={cn(
                "text-xs",
                stock.market === "KOSPI"
                  ? "bg-blue-600/80 text-blue-50"
                  : "bg-emerald-600/80 text-emerald-50"
              )}
            >
              {stock.market}
            </Badge>
          </div>
        </DialogHeader>

        <div className="space-y-5">
          {/* Price Section */}
          <div className="flex items-baseline gap-3">
            <span className="text-2xl font-bold font-mono">
              {formatKRW(stock.closingPrice)}
            </span>
            <span className="text-lg font-semibold text-red-400">
              +{stock.changePercent.toFixed(1)}%
            </span>
          </div>

          {/* Key Metrics */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-secondary/30 rounded-lg p-3">
              <div className="flex items-center gap-2 text-muted-foreground text-xs mb-1">
                <TrendingUp className="w-3 h-3" />
                거래대금
              </div>
              <p className="font-mono font-medium">
                {formatKRW(stock.tradingValue, "billion")}
              </p>
            </div>
            <div className="bg-secondary/30 rounded-lg p-3">
              <div className="flex items-center gap-2 text-muted-foreground text-xs mb-1">
                <Building2 className="w-3 h-3" />
                시가총액
              </div>
              <p className="font-mono font-medium">
                {formatKRW(stock.marketCap, "billion")}
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
              {stock.theme && stock.theme !== "미분류" && (
                <Badge variant="secondary" className="text-xs bg-secondary/50">
                  {stock.theme}
                </Badge>
              )}
              <Badge variant="outline" className="border-border/50">
                {stock.sector}
              </Badge>
            </div>
          </div>

          {/* Mini Chart */}
          <div className="space-y-2">
            <p className="text-xs text-muted-foreground">최근 60일 차트</p>
            <div className="bg-secondary/20 rounded-lg p-3 h-32">
              {isChartLoading ? (
                <div className="flex h-full items-center justify-center text-xs text-muted-foreground">
                  차트 로딩 중...
                </div>
              ) : chartData.length > 0 ? (
                <MiniCandlestickChart data={chartData} />
              ) : (
                <div className="flex h-full items-center justify-center text-xs text-muted-foreground">
                  차트 데이터 없음
                </div>
              )}
            </div>
          </div>

          {/* Recent Trend */}
          {/* <div className="space-y-2">
            <p className="text-xs text-muted-foreground">최근 추세 요약</p>
            <p className="text-sm leading-relaxed bg-secondary/20 rounded-lg p-3">
              {stock.recentTrend}
            </p>
          </div> */}
        </div>
      </DialogContent>
    </Dialog>
  );
}

interface ChartDataPoint {
  date: string;
  open: number;
  high: number;
  low: number;
  close: number;
}

function MiniCandlestickChart({ data }: { data: ChartDataPoint[] }) {
  const validData = data.filter(
    (d) => d.open > 0 && d.high > 0 && d.low > 0 && d.close > 0
  );

  if (validData.length === 0) {
    return (
      <div className="flex h-full items-center justify-center text-xs text-muted-foreground">
        차트 데이터 없음
      </div>
    );
  }

  const maxHigh = Math.max(...validData.map((d) => d.high));
  const minLow = Math.min(...validData.map((d) => d.low));
  const rawRange = maxHigh - minLow || 1;
  const padding = rawRange * 0.08;

  const chartMax = maxHigh + padding;
  const chartMin = Math.max(0, minLow - padding);
  const range = chartMax - chartMin || 1;

  const getY = (price: number) => {
    return 100 - ((price - chartMin) / range) * 100;
  };

  return (
    <svg
      viewBox="0 0 300 100"
      className="w-full h-full"
      preserveAspectRatio="none"
    >
      {validData.map((candle, i) => {
        const x = (i / validData.length) * 300;
        const width = (300 / validData.length) * 0.7;
        const isUp = candle.close >= candle.open;

        const bodyTop = getY(Math.max(candle.open, candle.close));
        const bodyBottom = getY(Math.min(candle.open, candle.close));
        const bodyHeight = Math.max(bodyBottom - bodyTop, 1);

        const wickTop = getY(candle.high);
        const wickBottom = getY(candle.low);

        return (
          <g key={`${candle.date}-${i}`}>
            <line
              x1={x + width / 2}
              y1={wickTop}
              x2={x + width / 2}
              y2={wickBottom}
              stroke={isUp ? "#ef4444" : "#3b82f6"}
              strokeWidth={0.5}
            />
            <rect
              x={x}
              y={bodyTop}
              width={width}
              height={bodyHeight}
              fill={isUp ? "#ef4444" : "#3b82f6"}
              rx={0.5}
            />
          </g>
        );
      })}
    </svg>
  );
}
