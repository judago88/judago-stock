"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  getLatestGlobalMarketSignal,
  type GlobalMarketItem,
  type GlobalMarketSnapshot,
} from "@/lib/stock-data";
import { cn } from "@/lib/utils";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

type SignalColor = "green" | "yellow" | "red";

function getSignalByUpCount(upCount: number): {
  signal: SignalColor;
  label: string;
} {
  if (upCount >= 8) {
    return {
      signal: "green",
      label: "상승우세",
    };
  }

  if (upCount >= 5) {
    return {
      signal: "yellow",
      label: "보통",
    };
  }

  return {
    signal: "red",
    label: "하락우세",
  };
}

function formatChangeRate(value: number | null) {
  if (value === null || Number.isNaN(value)) return "";
  const sign = value > 0 ? "+" : "";
  return `${sign}${value.toFixed(2)}%`;
}

export function USMarketSignal() {
  const [snapshot, setSnapshot] = useState<GlobalMarketSnapshot | null>(null);
  const [items, setItems] = useState<GlobalMarketItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const formatSnapshotTime = (value: string | null | undefined) => {
    if (!value) return "-";

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) return "-";

    const parts = new Intl.DateTimeFormat("en-CA", {
      timeZone: "Asia/Seoul",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    }).formatToParts(date);

    const get = (type: string) =>
      parts.find((part) => part.type === type)?.value ?? "00";

    return `${get("year")}-${get("month")}-${get("day")} ${get("hour")}:${get(
      "minute"
    )}`;
  };

  useEffect(() => {
    const loadSignal = async () => {
      try {
        setIsLoading(true);

        const data = await getLatestGlobalMarketSignal();

        setSnapshot(data.snapshot);
        setItems(data.items);
      } catch (error) {
        console.error(error);
        setSnapshot(null);
        setItems([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadSignal();
  }, []);

  const upCount = items.filter((item) => item.direction === "up").length;
  const downCount = items.filter((item) => item.direction === "down").length;
  const neutralCount = items.filter(
    (item) => item.direction === "neutral"
  ).length;

  const { signal, label } = getSignalByUpCount(upCount);

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
              "w-12 h-12 rounded-full flex items-center justify-center shadow-lg",
              signal === "green" && "bg-green-500 shadow-green-500/30",
              signal === "yellow" && "bg-yellow-500 shadow-yellow-500/30",
              signal === "red" && "bg-red-500 shadow-red-500/30"
            )}
          >
            <div
              className={cn(
                "w-8 h-8 rounded-full animate-pulse",
                signal === "green" && "bg-green-400",
                signal === "yellow" && "bg-yellow-400",
                signal === "red" && "bg-red-400"
              )}
            />
          </div>

          <div>
            <span
              className={cn(
                "text-sm font-semibold",
                signal === "green" && "text-green-400",
                signal === "yellow" && "text-yellow-400",
                signal === "red" && "text-red-400"
              )}
            >
              {isLoading ? "불러오는 중..." : label}
            </span>

            {snapshot && (
              <p className="text-[11px] text-muted-foreground mt-1">
                {formatSnapshotTime(snapshot.snapshot_time)} 기준
                {/* · 상승 {upCount} / 하락{" "}
                {downCount} / 보합 {neutralCount} */}
              </p>
            )}
          </div>
        </div>

        {/* 
          TODO: 최종 배포 시 아래 11개 지표 상세 목록은 비노출 처리 예정.
          지금은 데이터 확인용으로만 노출.
        */}
        {/* <div className="grid grid-cols-2 gap-1.5">
          {isLoading && (
            <p className="col-span-2 text-xs text-muted-foreground">
              글로벌 지표를 불러오는 중입니다.
            </p>
          )}

          {!isLoading && items.length === 0 && (
            <p className="col-span-2 text-xs text-muted-foreground">
              글로벌 지표 데이터가 없습니다.
            </p>
          )}

          {!isLoading &&
            items.map((item) => (
              <div
                key={item.indicator_code}
                className="flex items-center gap-1 text-xs"
                title={
                  item.change_rate !== null
                    ? `${item.indicator_name} ${formatChangeRate(
                        item.change_rate
                      )}`
                    : item.indicator_name
                }
              >
                {item.direction === "up" && (
                  <TrendingUp className="w-3 h-3 text-red-400 shrink-0" />
                )}
                {item.direction === "down" && (
                  <TrendingDown className="w-3 h-3 text-blue-400 shrink-0" />
                )}
                {item.direction === "neutral" && (
                  <Minus className="w-3 h-3 text-muted-foreground shrink-0" />
                )}

                <span className="text-muted-foreground truncate">
                  {item.indicator_name}
                </span>

                {item.change_rate !== null && (
                  <span
                    className={cn(
                      "ml-auto font-mono text-[10px]",
                      item.direction === "up" && "text-red-400",
                      item.direction === "down" && "text-blue-400",
                      item.direction === "neutral" && "text-muted-foreground"
                    )}
                  >
                    {formatChangeRate(item.change_rate)}
                  </span>
                )}
              </div>
            ))}
        </div> */}
      </CardContent>
    </Card>
  );
}
