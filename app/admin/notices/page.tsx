"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AdminLayout } from "@/components/admin/admin-layout";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface Notice {
  id: string;
  title: string;
  content: string | null;
  type: string;
  is_active: boolean;
  is_pinned: boolean;
  starts_at: string | null;
  ends_at: string | null;
  author: string | null;
  view_count: number;
  created_at: string;
  updated_at: string;
}

function getTypeLabel(type: string) {
  switch (type) {
    case "important":
      return "중요";
    case "event":
      return "이벤트";
    case "maintenance":
      return "점검";
    case "general":
      return "일반";
    default:
      return type;
  }
}

function getTypeVariant(type: string) {
  switch (type) {
    case "important":
      return "destructive";
    default:
      return "secondary";
  }
}

function formatDate(value: string | null | undefined) {
  if (!value) return "-";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "-";

  return date.toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
}

function formatDateTime(value: string | null | undefined) {
  if (!value) return "-";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "-";

  return date.toLocaleString("ko-KR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function AdminNoticesPage() {
  const supabase = createClient();

  const [notices, setNotices] = useState<Notice[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadNotices = async () => {
    try {
      setIsLoading(true);

      const { data, error } = await supabase
        .from("notices")
        .select("*")
        .order("is_pinned", { ascending: false })
        .order("created_at", { ascending: false });

      if (error) throw error;

      setNotices((data ?? []) as Notice[]);
    } catch (error) {
      console.error(error);
      alert("공지사항을 불러오지 못했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadNotices();
  }, []);

  const handleToggleActive = async (notice: Notice) => {
    try {
      const { error } = await supabase
        .from("notices")
        .update({
          is_active: !notice.is_active,
          updated_at: new Date().toISOString(),
        })
        .eq("id", notice.id);

      if (error) throw error;

      await loadNotices();
    } catch (error) {
      console.error(error);
      alert("상태 변경 중 오류가 발생했습니다.");
    }
  };

  const handleTogglePinned = async (notice: Notice) => {
    try {
      const { error } = await supabase
        .from("notices")
        .update({
          is_pinned: !notice.is_pinned,
          updated_at: new Date().toISOString(),
        })
        .eq("id", notice.id);

      if (error) throw error;

      await loadNotices();
    } catch (error) {
      console.error(error);
      alert("상단 고정 변경 중 오류가 발생했습니다.");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("정말 삭제하시겠습니까?")) return;

    try {
      const { error } = await supabase.from("notices").delete().eq("id", id);

      if (error) throw error;

      alert("삭제되었습니다.");
      await loadNotices();
    } catch (error) {
      console.error(error);
      alert("삭제 중 오류가 발생했습니다.");
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className="text-3xl font-bold">공지사항 관리</h1>
            <p className="text-muted-foreground mt-2">
              메인 공지 배너와 공지사항 목록에 노출되는 내용을 관리합니다.
            </p>
          </div>

          <Button className="bg-red-500 hover:bg-red-600 text-white" asChild>
            <Link href="/admin/notices/new">새 공지 등록</Link>
          </Button>
        </div>

        <Card className="border-border/50 bg-card/50">
          <CardContent className="p-6">
            {isLoading && (
              <p className="text-sm text-muted-foreground">불러오는 중...</p>
            )}

            {!isLoading && notices.length === 0 && (
              <p className="text-sm text-muted-foreground">
                등록된 공지사항이 없습니다.
              </p>
            )}

            <div className="space-y-3">
              {notices.map((notice) => (
                <div
                  key={notice.id}
                  className="rounded-lg border border-border/50 p-4"
                >
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                    <div className="min-w-0">
                      <div className="mb-2 flex flex-wrap items-center gap-2">
                        <Badge variant={getTypeVariant(notice.type) as any}>
                          {getTypeLabel(notice.type)}
                        </Badge>

                        {notice.is_pinned && (
                          <Badge variant="outline">상단 고정</Badge>
                        )}

                        <Badge
                          variant={notice.is_active ? "secondary" : "outline"}
                        >
                          {notice.is_active ? "활성" : "비활성"}
                        </Badge>

                        <span className="text-xs text-muted-foreground">
                          작성일 {formatDate(notice.created_at)}
                        </span>

                        <span className="text-xs text-muted-foreground">
                          조회수 {notice.view_count ?? 0}
                        </span>
                      </div>

                      <h3 className="font-semibold">{notice.title}</h3>

                      {notice.content && (
                        <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">
                          {notice.content}
                        </p>
                      )}

                      <div className="mt-3 space-y-1 text-xs text-muted-foreground">
                        <p>작성자: {notice.author ?? "-"}</p>
                        <p>
                          노출 기간: {formatDateTime(notice.starts_at)} ~{" "}
                          {formatDateTime(notice.ends_at)}
                        </p>
                        <p>수정일: {formatDateTime(notice.updated_at)}</p>
                      </div>
                    </div>

                    <div className="flex shrink-0 flex-wrap gap-2">
                      <Button size="sm" variant="outline" asChild>
                        <Link href={`/admin/notices/new?id=${notice.id}`}>
                          수정
                        </Link>
                      </Button>

                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleTogglePinned(notice)}
                      >
                        {notice.is_pinned ? "고정 해제" : "상단 고정"}
                      </Button>

                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleToggleActive(notice)}
                      >
                        {notice.is_active ? "비활성화" : "활성화"}
                      </Button>

                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleDelete(notice.id)}
                      >
                        삭제
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
