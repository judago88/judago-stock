"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AdminLayout } from "@/components/admin/admin-layout";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface Ebook {
  id: string;
  title: string;
  subtitle: string | null;
  description: string | null;
  price: number;
  original_price: number | null;
  file_path: string | null;
  cover_image_path: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

function formatPrice(value: number | null | undefined) {
  if (value == null) return "-";
  return `${Number(value).toLocaleString()}원`;
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

export default function AdminEbookPage() {
  const supabase = createClient();

  const [ebooks, setEbooks] = useState<Ebook[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadEbooks = async () => {
    try {
      setIsLoading(true);

      const { data, error } = await supabase
        .from("ebooks")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;

      setEbooks((data ?? []) as Ebook[]);
    } catch (error) {
      console.error(error);
      alert("전자책 목록을 불러오지 못했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadEbooks();
  }, []);

  const handleToggleActive = async (ebook: Ebook) => {
    try {
      const { error } = await supabase
        .from("ebooks")
        .update({
          is_active: !ebook.is_active,
          updated_at: new Date().toISOString(),
        })
        .eq("id", ebook.id);

      if (error) throw error;

      await loadEbooks();
    } catch (error) {
      console.error(error);
      alert("상태 변경 중 오류가 발생했습니다.");
    }
  };

  const handleDelete = async (ebook: Ebook) => {
    const ok = confirm(
      "정말 삭제하시겠습니까?\n이미 주문이 연결된 전자책은 삭제하지 않는 것을 권장합니다."
    );

    if (!ok) return;

    try {
      const { error } = await supabase
        .from("ebooks")
        .delete()
        .eq("id", ebook.id);

      if (error) throw error;

      alert("삭제되었습니다.");
      await loadEbooks();
    } catch (error) {
      console.error(error);
      alert(
        "삭제 중 오류가 발생했습니다. 이미 주문이 연결된 전자책이라면 비활성화만 해주세요."
      );
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className="text-3xl font-bold">전자책 관리</h1>
            <p className="text-muted-foreground mt-2">
              전자책 상품을 개정판 단위로 등록하고 관리합니다.
            </p>
          </div>

          <Button className="bg-red-500 hover:bg-red-600 text-white" asChild>
            <Link href="/admin/ebook/new">새 전자책 등록</Link>
          </Button>
        </div>

        <Card className="border-border/50 bg-card/50">
          <CardContent className="p-6">
            {isLoading && (
              <p className="text-sm text-muted-foreground">불러오는 중...</p>
            )}

            {!isLoading && ebooks.length === 0 && (
              <p className="text-sm text-muted-foreground">
                등록된 전자책이 없습니다.
              </p>
            )}

            <div className="space-y-3">
              {ebooks.map((ebook) => {
                const coverImageUrl = ebook.cover_image_path
                  ? `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/ebook-covers/${ebook.cover_image_path}`
                  : null;

                return (
                  <div
                    key={ebook.id}
                    className="rounded-lg border border-border/50 p-4"
                  >
                    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                      <div className="flex gap-4 min-w-0">
                        <div className="w-16 h-22 shrink-0 rounded-md border border-border/50 bg-secondary/20 overflow-hidden flex items-center justify-center">
                          {coverImageUrl ? (
                            <img
                              src={coverImageUrl}
                              alt={ebook.title}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <span className="text-xs text-muted-foreground">
                              No Cover
                            </span>
                          )}
                        </div>

                        <div className="min-w-0">
                          <div className="flex flex-wrap items-center gap-2 mb-2">
                            <span
                              className={`text-xs ${
                                ebook.is_active
                                  ? "text-red-400"
                                  : "text-muted-foreground"
                              }`}
                            >
                              {ebook.is_active ? "판매중" : "비활성"}
                            </span>

                            <span className="text-xs text-muted-foreground">
                              등록일 {formatDate(ebook.created_at)}
                            </span>
                          </div>

                          <h2 className="font-semibold truncate">
                            {ebook.title}
                          </h2>

                          {ebook.subtitle && (
                            <p className="text-sm text-muted-foreground mt-1 truncate">
                              {ebook.subtitle}
                            </p>
                          )}

                          <div className="mt-2 flex flex-wrap items-center gap-3 text-sm">
                            <span>{formatPrice(ebook.price)}</span>

                            {ebook.original_price && (
                              <span className="text-muted-foreground line-through">
                                {formatPrice(ebook.original_price)}
                              </span>
                            )}

                            <span className="text-xs text-muted-foreground">
                              PDF {ebook.file_path ? "등록됨" : "없음"}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-2 shrink-0">
                        <Button size="sm" variant="outline" asChild>
                          <Link href={`/admin/ebook/edit/${ebook.id}`}>
                            수정
                          </Link>
                        </Button>

                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleToggleActive(ebook)}
                        >
                          {ebook.is_active ? "비활성화" : "활성화"}
                        </Button>

                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleDelete(ebook)}
                        >
                          삭제
                        </Button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        <div className="rounded-lg border border-border/50 bg-secondary/20 p-4 text-sm text-muted-foreground leading-6">
          <p className="font-medium text-foreground mb-1">운영 기준</p>
          <p>
            단순 오타, 설명 문구, 커버 오류 수정은 기존 전자책을 수정하세요. PDF
            내용, 가격, 제목, 구성 등이 바뀐 개정판은 새 전자책으로 등록하는
            것을 권장합니다.
          </p>
        </div>
      </div>
    </AdminLayout>
  );
}
