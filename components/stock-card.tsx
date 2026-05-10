// stock-card.tsx

"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Stock, formatKRW } from "@/lib/stock-data";
import { cn } from "@/lib/utils";
import { TrendingUp } from "lucide-react";

interface StockCardProps {
  stock: Stock;
  onClick: () => void;
}

export function StockCard({ stock, onClick }: StockCardProps) {
  return (
    <Card
      onClick={onClick}
      className={cn(
        "cursor-pointer transition-all border-border/50 bg-card/50 backdrop-blur py-3",
        "hover:bg-accent/50 active:scale-[0.98]",
        stock.hasHighVolume && "border-red-500/30 bg-red-950/10"
      )}
    >
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div>
            <h3 className="font-semibold">{stock.name}</h3>
            <p className="text-xs text-muted-foreground">{stock.ticker}</p>
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

        <div className="flex items-baseline justify-between mb-3">
          <span className="text-lg font-bold font-mono">
            {formatKRW(stock.closingPrice)}
          </span>
          <span className="text-red-400 font-semibold">
            +{stock.changePercent.toFixed(1)}%
          </span>
        </div>

        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <TrendingUp className="w-3 h-3" />
            <span>거래대금</span>
          </div>
          <span className="font-mono">
            {formatKRW(stock.tradingValue, "billion")}
          </span>
        </div>

        <div className="flex flex-wrap gap-1.5 mt-3">
          {stock.theme && stock.theme !== "미분류" && (
            <Badge variant="secondary" className="text-xs bg-secondary/50">
              {stock.theme}
            </Badge>
          )}
          <Badge variant="outline" className="text-xs border-border/50">
            {stock.sector}
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
}

export function StockCardSkeleton() {
  return (
    <Card className="border-border/50 bg-card/50 py-3">
      <CardContent className="p-4 space-y-3">
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <div className="h-5 w-24 bg-accent animate-pulse rounded" />
            <div className="h-3 w-16 bg-accent animate-pulse rounded" />
          </div>
          <div className="h-5 w-16 bg-accent animate-pulse rounded" />
        </div>
        <div className="flex items-baseline justify-between">
          <div className="h-6 w-28 bg-accent animate-pulse rounded" />
          <div className="h-5 w-14 bg-accent animate-pulse rounded" />
        </div>
        <div className="flex gap-2">
          <div className="h-5 w-16 bg-accent animate-pulse rounded" />
          <div className="h-5 w-14 bg-accent animate-pulse rounded" />
        </div>
      </CardContent>
    </Card>
  );
}
