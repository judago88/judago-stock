"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { AdminLayout } from "@/components/admin/admin-layout";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const noticeTypes = [
  { label: "일반 공지", value: "general" },
  { label: "중요 공지", value: "important" },
  { label: "이벤트", value: "event" },
  { label: "점검 안내", value: "maintenance" },
];

const emptyForm = {
  title: "",
  content: "",
  type: "general",
  author: "",
  starts_at: "",
  ends_at: "",
  is_active: true,
  is_pinned: false,
};

export default function AdminNoticeFormPage() {
  return (
    <Suspense fallback={null}>
      <AdminNoticeFormContent />
    </Suspense>
  );
}

function AdminNoticeFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const editId = searchParams.get("id");

  const supabase = createClient();

  const [form, setForm] = useState(emptyForm);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const loadNotice = async () => {
      if (!editId) return;

      const { data, error } = await supabase
        .from("notices")
        .select("*")
        .eq("id", editId)
        .single();

      if (error || !data) {
        alert("공지사항을 불러오지 못했습니다.");
        router.push("/admin/notices");
        return;
      }

      setForm({
        title: data.title ?? "",
        content: data.content ?? "",
        type: data.type ?? "general",
        author: data.author ?? "",
        starts_at: data.starts_at
          ? new Date(data.starts_at).toISOString().slice(0, 16)
          : "",
        ends_at: data.ends_at
          ? new Date(data.ends_at).toISOString().slice(0, 16)
          : "",
        is_active: data.is_active ?? true,
        is_pinned: data.is_pinned ?? false,
      });
    };

    loadNotice();
  }, [editId, router, supabase]);

  const handleSubmit = async () => {
    if (!form.title.trim()) {
      alert("제목을 입력해주세요.");
      return;
    }

    try {
      setIsSaving(true);

      const payload = {
        title: form.title.trim(),
        content: form.content.trim() || null,
        type: form.type,
        author: form.author.trim() || null,
        starts_at: form.starts_at
          ? new Date(form.starts_at).toISOString()
          : null,
        ends_at: form.ends_at ? new Date(form.ends_at).toISOString() : null,
        is_active: form.is_active,
        is_pinned: form.is_pinned,
        updated_at: new Date().toISOString(),
      };

      if (editId) {
        const { error } = await supabase
          .from("notices")
          .update(payload)
          .eq("id", editId);

        if (error) throw error;

        alert("수정되었습니다.");
      } else {
        const { error } = await supabase.from("notices").insert({
          ...payload,
          view_count: 0,
        });

        if (error) throw error;

        alert("등록되었습니다.");
      }

      router.push("/admin/notices");
    } catch (error) {
      console.error(error);
      alert(
        error instanceof Error ? error.message : "저장 중 오류가 발생했습니다."
      );
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <AdminLayout>
      <Card className="max-w-3xl border-border/50 bg-card/50">
        <CardContent className="p-6 space-y-5">
          <div>
            <h1 className="text-2xl font-bold">
              {editId ? "공지사항 수정" : "공지사항 등록"}
            </h1>

            <p className="text-sm text-muted-foreground mt-1">
              메인 공지 배너와 공지사항 목록에 노출될 내용을 작성합니다.
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">제목</label>
            <Input
              value={form.title}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, title: e.target.value }))
              }
              placeholder="예: 주다고 기준봉 센터 베타 운영 안내"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">공지 유형</label>
            <select
              value={form.type}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, type: e.target.value }))
              }
              className="w-full rounded-md border border-border/50 bg-background px-3 py-2 text-sm"
            >
              {noticeTypes.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">작성자</label>
            <Input
              value={form.author}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, author: e.target.value }))
              }
              placeholder="예: 주다고"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">내용</label>
            <Textarea
              value={form.content}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, content: e.target.value }))
              }
              rows={10}
              placeholder="공지 내용을 입력해주세요."
            />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="block text-sm font-medium mb-1">
                노출 시작일시
              </label>
              <Input
                type="datetime-local"
                value={form.starts_at}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, starts_at: e.target.value }))
                }
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                노출 종료일시
              </label>
              <Input
                type="datetime-local"
                value={form.ends_at}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, ends_at: e.target.value }))
                }
              />
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-5 text-sm">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={form.is_active}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    is_active: e.target.checked,
                  }))
                }
              />
              활성화
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
              onClick={() => router.push("/admin/notices")}
            >
              취소
            </Button>
          </div>
        </CardContent>
      </Card>
    </AdminLayout>
  );
}
