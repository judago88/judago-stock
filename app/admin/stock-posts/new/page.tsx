"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { AdminLayout } from "@/components/admin/admin-layout";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const emptyForm = {
  title: "",
  summary: "",
  content: "",
  post_date: new Date().toISOString().slice(0, 10),
  stock_count: 0,
  is_published: true,
  is_pinned: false,
};

export default function AdminStockPostFormPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const editId = searchParams.get("id");

  const supabase = createClient();

  const [form, setForm] = useState(emptyForm);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const loadPost = async () => {
      if (!editId) return;

      const { data, error } = await supabase
        .from("stock_posts")
        .select("*")
        .eq("id", editId)
        .single();

      if (error || !data) {
        alert("리포트를 불러오지 못했습니다.");
        router.push("/admin/stock-posts");
        return;
      }

      setForm({
        title: data.title,
        summary: data.summary ?? "",
        content: data.content,
        post_date: data.post_date,
        stock_count: data.stock_count,
        is_published: data.is_published,
        is_pinned: data.is_pinned,
      });
    };

    loadPost();
  }, [editId, router, supabase]);

  const handleSubmit = async () => {
    if (!form.title.trim()) {
      alert("제목을 입력해주세요.");
      return;
    }

    if (!form.content.trim()) {
      alert("내용을 입력해주세요.");
      return;
    }

    try {
      setIsSaving(true);

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        alert("로그인이 필요합니다.");
        return;
      }

      const payload = {
        title: form.title.trim(),
        summary: form.summary.trim() || null,
        content: form.content.trim(),
        post_date: form.post_date,
        stock_count: Number(form.stock_count) || 0,
        is_published: form.is_published,
        is_pinned: form.is_pinned,
        updated_at: new Date().toISOString(),
      };

      if (editId) {
        const { error } = await supabase
          .from("stock_posts")
          .update(payload)
          .eq("id", editId);

        if (error) throw error;

        alert("수정되었습니다.");
      } else {
        const { error } = await supabase.from("stock_posts").insert({
          ...payload,
          created_by: user.id,
        });

        if (error) throw error;

        alert("등록되었습니다.");
      }

      router.push("/admin/stock-posts");
    } catch (error) {
      console.error(error);
      alert("저장 중 오류가 발생했습니다.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <AdminLayout>
      <Card className="max-w-3xl border-border/50 bg-card/50">
        <CardContent className="p-6 space-y-4">
          <div>
            <h1 className="text-2xl font-bold">
              {editId ? "기준봉 리포트 수정" : "기준봉 리포트 등록"}
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              장 마감 후 기준봉 리포트를 직접 작성합니다.
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">기준 날짜</label>
            <input
              type="date"
              value={form.post_date}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, post_date: e.target.value }))
              }
              className="w-full rounded-md border border-border/50 bg-background px-3 py-2 text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">제목</label>
            <input
              value={form.title}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, title: e.target.value }))
              }
              placeholder="예: 2026년 5월 31일 기준봉 리포트"
              className="w-full rounded-md border border-border/50 bg-background px-3 py-2 text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">요약</label>
            <textarea
              value={form.summary}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, summary: e.target.value }))
              }
              rows={3}
              placeholder="리포트 요약을 입력해주세요."
              className="w-full rounded-md border border-border/50 bg-background px-3 py-2 text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">상세 내용</label>
            <textarea
              value={form.content}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, content: e.target.value }))
              }
              rows={14}
              placeholder="상세 내용을 입력해주세요."
              className="w-full rounded-md border border-border/50 bg-background px-3 py-2 text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">종목 수</label>
            <input
              type="number"
              min={0}
              value={form.stock_count}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  stock_count: Number(e.target.value),
                }))
              }
              className="w-full rounded-md border border-border/50 bg-background px-3 py-2 text-sm"
            />
          </div>

          <div className="flex items-center gap-4 text-sm">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={form.is_published}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    is_published: e.target.checked,
                  }))
                }
              />
              공개
            </label>

            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={form.is_pinned}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    is_pinned: e.target.checked,
                  }))
                }
              />
              상단 고정
            </label>
          </div>

          <div className="flex gap-2 pt-2">
            <Button
              type="button"
              className="bg-red-500 hover:bg-red-600 text-white"
              disabled={isSaving}
              onClick={handleSubmit}
            >
              {isSaving ? "저장 중..." : editId ? "수정하기" : "등록하기"}
            </Button>

            <Button
              type="button"
              variant="outline"
              onClick={() => router.push("/admin/stock-posts")}
            >
              취소
            </Button>
          </div>
        </CardContent>
      </Card>
    </AdminLayout>
  );
}
