"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AdminLayout } from "@/components/admin/admin-layout";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function AdminEbookNewPage() {
  const router = useRouter();
  const supabase = createClient();

  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [description, setDescription] = useState("");

  const [price, setPrice] = useState<number>(0);
  const [originalPrice, setOriginalPrice] = useState<number>(0);

  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [pdfFile, setPdfFile] = useState<File | null>(null);

  const [isActive, setIsActive] = useState(true);

  const [isSaving, setIsSaving] = useState(false);

  const uploadCover = async () => {
    if (!coverFile) return null;

    const ext = coverFile.name.split(".").pop() ?? "png";

    const fileName = `cover-${Date.now()}.${ext}`;

    const { error } = await supabase.storage
      .from("ebook-covers")
      .upload(fileName, coverFile, {
        upsert: true,
      });

    if (error) {
      throw new Error(error.message);
    }

    return fileName;
  };

  const uploadPdf = async () => {
    if (!pdfFile) {
      throw new Error("PDF 파일을 업로드해주세요.");
    }

    const ext = pdfFile.name.split(".").pop() ?? "pdf";

    const fileName = `ebook-${Date.now()}.${ext}`;

    const { error } = await supabase.storage
      .from("ebooks")
      .upload(fileName, pdfFile, {
        upsert: true,
      });

    if (error) {
      throw new Error(error.message);
    }

    return fileName;
  };

  const handleSave = async () => {
    try {
      if (!title.trim()) {
        alert("제목을 입력해주세요.");
        return;
      }

      if (!price || Number(price) <= 0) {
        alert("판매가를 입력해주세요.");
        return;
      }

      if (!pdfFile) {
        alert("PDF 파일을 업로드해주세요.");
        return;
      }

      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      console.log("current user:", user);
      console.log("user error:", userError);

      setIsSaving(true);

      const coverPath = await uploadCover();
      const pdfPath = await uploadPdf();

      const { error } = await supabase.from("ebooks").insert({
        title,
        subtitle: subtitle || null,
        description: description || null,

        price: Number(price),

        original_price:
          Number(originalPrice) > 0 ? Number(originalPrice) : null,

        cover_image_path: coverPath,

        file_path: pdfPath,

        is_active: isActive,
      });

      if (error) {
        throw error;
      }

      alert("전자책이 등록되었습니다.");

      router.push("/admin/ebook");
    } catch (error) {
      console.error(error);

      alert(
        error instanceof Error ? error.message : "등록 중 오류가 발생했습니다."
      );
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <AdminLayout>
      <div className="max-w-4xl">
        <Card className="border-border/50 bg-card/50">
          <CardContent className="p-6 space-y-5">
            <div>
              <h1 className="text-3xl font-bold">새 전자책 등록</h1>

              <p className="text-muted-foreground mt-2">
                개정판 또는 신규 전자책을 등록합니다.
              </p>
            </div>

            <div>
              <label className="block text-sm mb-2">제목</label>

              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full rounded-md border border-border/50 bg-background px-3 py-2"
              />
            </div>

            <div>
              <label className="block text-sm mb-2">부제목</label>

              <input
                value={subtitle}
                onChange={(e) => setSubtitle(e.target.value)}
                className="w-full rounded-md border border-border/50 bg-background px-3 py-2"
              />
            </div>

            <div>
              <label className="block text-sm mb-2">설명</label>

              <textarea
                rows={8}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full rounded-md border border-border/50 bg-background px-3 py-2"
              />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="block text-sm mb-2">판매가</label>

                <input
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(Number(e.target.value))}
                  className="w-full rounded-md border border-border/50 bg-background px-3 py-2"
                />
              </div>

              <div>
                <label className="block text-sm mb-2">정가</label>

                <input
                  type="number"
                  value={originalPrice}
                  onChange={(e) => setOriginalPrice(Number(e.target.value))}
                  className="w-full rounded-md border border-border/50 bg-background px-3 py-2"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm mb-2">커버 이미지</label>

              <input
                type="file"
                accept="image/*"
                onChange={(e) => setCoverFile(e.target.files?.[0] ?? null)}
              />
            </div>

            <div>
              <label className="block text-sm mb-2">PDF 파일</label>

              <input
                type="file"
                accept="application/pdf"
                onChange={(e) => setPdfFile(e.target.files?.[0] ?? null)}
              />
            </div>

            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={isActive}
                onChange={(e) => setIsActive(e.target.checked)}
              />
              판매 활성화
            </label>

            <div className="flex gap-2">
              <Button
                onClick={handleSave}
                disabled={isSaving}
                className="bg-red-500 hover:bg-red-600 text-white"
              >
                {isSaving ? "등록 중..." : "전자책 등록"}
              </Button>

              <Button
                variant="outline"
                onClick={() => router.push("/admin/ebook")}
              >
                취소
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
