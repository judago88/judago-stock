"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft, Megaphone } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getNoticeById, type Notice } from "@/lib/stock-data";

function getTypeLabel(type: string) {
  if (type === "important") return "중요";
  if (type === "maintenance") return "점검";
  if (type === "event") return "이벤트";
  return "공지";
}

export default function NoticeDetailPage() {
  const params = useParams();
  const id = params.id as string;

  const [notice, setNotice] = useState<Notice | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadNotice = async () => {
      try {
        const data = await getNoticeById(id);
        setNotice(data);
      } catch (error) {
        console.error(error);
        setNotice(null);
      } finally {
        setIsLoading(false);
      }
    };

    if (id) loadNotice();
  }, [id]);

  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto max-w-3xl px-4 py-8">
        <Button variant="ghost" className="mb-6" asChild>
          <Link href="/">
            <ArrowLeft className="w-4 h-4 mr-2" />
            기준봉 센터로 돌아가기
          </Link>
        </Button>

        <Card className="border-border/50 bg-card/50 backdrop-blur">
          <CardContent className="p-6 md:p-8">
            {isLoading && (
              <p className="text-sm text-muted-foreground">
                공지사항을 불러오는 중입니다.
              </p>
            )}

            {!isLoading && !notice && (
              <div className="text-center py-16">
                <Megaphone className="w-10 h-10 mx-auto mb-4 text-muted-foreground" />
                <h1 className="text-xl font-bold mb-2">
                  공지사항을 찾을 수 없습니다
                </h1>
                <p className="text-sm text-muted-foreground">
                  삭제되었거나 비활성화된 공지입니다.
                </p>
              </div>
            )}

            {!isLoading && notice && (
              <article>
                <div className="flex items-center gap-2 mb-4">
                  <Badge variant="secondary">{getTypeLabel(notice.type)}</Badge>
                  {notice.is_pinned && (
                    <Badge className="bg-red-500 text-white border-0">
                      고정
                    </Badge>
                  )}
                </div>

                <h1 className="text-2xl md:text-3xl font-bold mb-3">
                  {notice.title}
                </h1>

                <p className="text-xs text-muted-foreground mb-8">
                  {new Date(notice.created_at).toLocaleDateString("ko-KR")}
                </p>

                <div className="whitespace-pre-line text-sm md:text-base leading-7 text-muted-foreground">
                  {notice.content ?? ""}
                </div>
              </article>
            )}
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
