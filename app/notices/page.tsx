"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Megaphone, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getNotices, type Notice } from "@/lib/stock-data";

function getTypeLabel(type: string) {
  if (type === "important") return "중요";
  if (type === "maintenance") return "점검";
  if (type === "event") return "이벤트";
  return "공지";
}

export default function NoticesPage() {
  const [notices, setNotices] = useState<Notice[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadNotices = async () => {
      try {
        const data = await getNotices();
        setNotices(data);
      } catch (error) {
        console.error(error);
        setNotices([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadNotices();
  }, []);

  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto max-w-3xl px-4 py-8">
        <Button variant="ghost" className="mb-6" asChild>
          <Link href="/">
            <ArrowLeft className="w-4 h-4 mr-2" />
            기준봉 센터로 돌아가기
          </Link>
        </Button>

        <div className="mb-8">
          <div className="flex items-center gap-2 mb-3">
            <Megaphone className="w-5 h-5 text-yellow-400" />
            <h1 className="text-2xl md:text-3xl font-bold">공지사항</h1>
          </div>
          <p className="text-sm text-muted-foreground">
            주다고 기준봉 센터의 운영 안내와 업데이트 소식을 확인하세요.
          </p>
        </div>

        <Card className="border-border/50 bg-card/50 backdrop-blur">
          <CardContent className="p-0">
            {isLoading && (
              <div className="p-6 text-sm text-muted-foreground">
                공지사항을 불러오는 중입니다.
              </div>
            )}

            {!isLoading && notices.length === 0 && (
              <div className="p-10 text-center">
                <Megaphone className="w-10 h-10 mx-auto mb-4 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">
                  등록된 공지사항이 없습니다.
                </p>
              </div>
            )}

            {!isLoading &&
              notices.map((notice, index) => (
                <Link
                  key={notice.id}
                  href={`/notices/${notice.id}`}
                  className="block"
                >
                  <div
                    className={[
                      "flex items-center justify-between gap-4 p-5 hover:bg-secondary/40 transition-colors",
                      index !== notices.length - 1
                        ? "border-b border-border/50"
                        : "",
                    ].join(" ")}
                  >
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="secondary">
                          {getTypeLabel(notice.type)}
                        </Badge>

                        {notice.is_pinned && (
                          <Badge className="bg-red-500 text-white border-0">
                            고정
                          </Badge>
                        )}
                      </div>

                      <h2 className="font-semibold truncate">{notice.title}</h2>

                      <p className="text-xs text-muted-foreground mt-1">
                        {new Date(notice.created_at).toLocaleDateString(
                          "ko-KR"
                        )}
                      </p>
                    </div>

                    <ChevronRight className="w-4 h-4 text-muted-foreground shrink-0" />
                  </div>
                </Link>
              ))}
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
