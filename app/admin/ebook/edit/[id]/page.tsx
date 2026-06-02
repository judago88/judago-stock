"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
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

export default function AdminEbookEditPage() {
  const router = useRouter();
  const params = useParams();
  const ebookId = params.id as string;

  const supabase = createClient();

  const [ebook, setEbook] = useState<Ebook | null>(null);

  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [description, setDescription] = useState("");

  const [price, setPrice] = useState<number>(0);
  const [originalPrice, setOriginalPrice] = useState<number>(0);

  const [coverImagePath, setCoverImagePath] = useState<string | null>(null);
  const [filePath, setFilePath] = useState<string | null>(null);

  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [pdfFile, setPdfFile] = useState<File | null>(null);

  const [isActive, setIsActive] = useState(true);

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const loadEbook = async () => {
    try {
      setIsLoading(true);

      const { data, error } = await supabase
        .from("ebooks")
        .select("*")
        .eq("id", ebookId)
        .single();

      if (error || !data) {
        throw error ?? new Error("전자책을 찾을 수 없습니다.");
      }

      const ebookData = data as Ebook;

      setEbook(ebookData);
      setTitle(ebookData.title ?? "");
      setSubtitle(ebookData.subtitle ?? "");
      setDescription(ebookData.description ?? "");
      setPrice(ebookData.price ?? 0);
      setOriginalPrice(ebookData.original_price ?? 0);
      setCoverImagePath(ebookData.cover_image_path);
      setFilePath(ebookData.file_path);
      setIsActive(ebookData.is_active);
    } catch (error) {
      console.error(error);
      alert("전자책 정보를 불러오지 못했습니다.");
      router.push("/admin/ebook");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (ebookId) {
      loadEbook();
    }
  }, [ebookId]);

  const uploadCover = async () => {
    if (!coverFile) return coverImagePath;

    const ext = coverFile.name.split(".").pop() ?? "png";
    const fileName = `cover-${Date.now()}.${ext}`;

    const { error } = await supabase.storage
      .from("ebook-covers")
      .upload(fileName, coverFile, {
        upsert: true,
      });

    if (error) {
      throw new Error(`커버 업로드 실패: ${error.message}`);
    }

    return fileName;
  };

  const uploadPdf = async () => {
    if (!pdfFile) return filePath;

    const ext = pdfFile.name.split(".").pop() ?? "pdf";
    const fileName = `ebook-${Date.now()}.${ext}`;

    const { error } = await supabase.storage
      .from("ebooks")
      .upload(fileName, pdfFile, {
        upsert: true,
      });

    if (error) {
      throw new Error(`PDF 업로드 실패: ${error.message}`);
    }

    return fileName;
  };

  const handleSave = async () => {
    if (!title.trim()) {
      alert("제목을 입력해주세요.");
      return;
    }

    if (!price || Number(price) <= 0) {
      alert("판매가를 입력해주세요.");
      return;
    }

    try {
      setIsSaving(true);

      const nextCoverPath = await uploadCover();
      const nextPdfPath = await uploadPdf();

      if (!nextPdfPath) {
        alert("PDF 파일이 없습니다.");
        return;
      }

      const { error } = await supabase
        .from("ebooks")
        .update({
          title: title.trim(),
          subtitle: subtitle.trim() || null,
          description: description.trim() || null,
          price: Number(price),
          original_price:
            Number(originalPrice) > 0 ? Number(originalPrice) : null,
          cover_image_path: nextCoverPath,
          file_path: nextPdfPath,
          is_active: isActive,
          updated_at: new Date().toISOString(),
        })
        .eq("id", ebookId);

      if (error) {
        throw error;
      }

      alert("전자책이 수정되었습니다.");
      router.push("/admin/ebook");
    } catch (error) {
      console.error(error);

      alert(
        error instanceof Error ? error.message : "수정 중 오류가 발생했습니다."
      );
    } finally {
      setIsSaving(false);
    }
  };

  const coverImageUrl = coverImagePath
    ? `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/ebook-covers/${coverImagePath}`
    : null;

  return (
    <AdminLayout>
      <div className="max-w-4xl">
        <Card className="border-border/50 bg-card/50">
          <CardContent className="p-6 space-y-5">
            <div>
              <h1 className="text-3xl font-bold">전자책 수정</h1>

              <p className="text-muted-foreground mt-2">
                단순 오타, 설명, 커버 오류 등 기존 전자책 정보를 수정합니다.
                개정판은 새 전자책으로 등록해주세요.
              </p>
            </div>

            {isLoading ? (
              <p className="text-sm text-muted-foreground">불러오는 중...</p>
            ) : (
              <>
                <div className="rounded-lg border border-border/50 bg-secondary/20 p-4 text-sm text-muted-foreground leading-6">
                  <p className="font-medium text-foreground mb-1">수정 안내</p>
                  <p>
                    이 화면에서 저장하면 기존 전자책 row가 수정됩니다. 이미
                    구매자가 있는 상품의 PDF, 가격, 제목을 크게 바꾸는 경우에는
                    이 화면을 사용하지 말고 새 전자책으로 등록하는 것을
                    권장합니다.
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

                  {coverImageUrl && (
                    <div className="mb-3">
                      <img
                        src={coverImageUrl}
                        alt={title}
                        className="w-32 h-44 object-cover rounded-md border border-border/50"
                      />
                    </div>
                  )}

                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setCoverFile(e.target.files?.[0] ?? null)}
                  />

                  {coverImagePath && (
                    <p className="text-xs text-muted-foreground mt-2">
                      현재 커버: {coverImagePath}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm mb-2">PDF 파일</label>

                  <input
                    type="file"
                    accept="application/pdf"
                    onChange={(e) => setPdfFile(e.target.files?.[0] ?? null)}
                  />

                  {filePath && (
                    <p className="text-xs text-muted-foreground mt-2">
                      현재 PDF: {filePath}
                    </p>
                  )}
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
                    {isSaving ? "수정 중..." : "전자책 수정"}
                  </Button>

                  <Button
                    variant="outline"
                    onClick={() => router.push("/admin/ebook")}
                  >
                    취소
                  </Button>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
