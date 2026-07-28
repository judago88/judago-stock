"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { CheckCircle2, Loader2, AlertCircle, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

type ConfirmState = "loading" | "success" | "error";

export default function PaymentSuccessPage() {
  const [state, setState] = useState<ConfirmState>("loading");
  const [message, setMessage] = useState("결제를 확인하고 있습니다.");
  const [orderId, setOrderId] = useState<string | null>(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [downloadExpiresAt, setDownloadExpiresAt] = useState<number | null>(
    null
  );

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const orderIdParam = params.get("orderId");

    if (!orderIdParam) {
      setState("error");
      setMessage("주문번호가 없습니다.");
      return;
    }

    setOrderId(orderIdParam);

    setState("success");
    setMessage(
      "결제가 완료되었습니다. 아래 버튼을 눌러 전자책을 다운로드해주세요."
    );
  }, []);

  const downloadFile = async (url: string) => {
    const fileRes = await fetch(url);

    if (!fileRes.ok) {
      throw new Error(
        "다운로드 링크가 만료되었습니다. 재다운로드가 필요한 경우 고객센터로 문의해주세요."
      );
    }

    const blob = await fileRes.blob();

    const objectUrl = window.URL.createObjectURL(blob);
    const a = document.createElement("a");

    a.href = objectUrl;
    a.download = "기준봉매매법 전자책.pdf";
    document.body.appendChild(a);
    a.click();

    a.remove();
    window.URL.revokeObjectURL(objectUrl);
  };

  const handleDownload = async () => {
    try {
      setIsDownloading(true);

      if (downloadUrl && downloadExpiresAt && Date.now() < downloadExpiresAt) {
        await downloadFile(downloadUrl);
        return;
      }

      if (downloadUrl && downloadExpiresAt && Date.now() >= downloadExpiresAt) {
        setDownloadUrl(null);
        setDownloadExpiresAt(null);
        throw new Error(
          "다운로드 링크가 만료되었습니다. 재다운로드가 필요한 경우 고객센터로 문의해주세요."
        );
      }

      const params = new URLSearchParams(window.location.search);
      const orderIdParam = params.get("orderId");

      if (!orderIdParam) {
        throw new Error("주문번호가 없습니다.");
      }

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/download-ebook`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            order_id: orderIdParam,
          }),
        }
      );

      const data = await res.json();

      if (!res.ok || !data.ok) {
        throw new Error(data.message ?? "다운로드 실패");
      }

      setDownloadUrl(data.download_url);
      setDownloadExpiresAt(Date.now() + 10 * 60 * 1000);
      await downloadFile(data.download_url);

      setMessage(
        "다운로드 링크가 발급되었습니다. 이 화면에 머무는 동안에는 일정 시간 내 재다운로드할 수 있습니다."
      );
    } catch (error) {
      console.error(error);
      alert(error instanceof Error ? error.message : "다운로드 실패");
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <main className="min-h-screen bg-background flex items-center justify-center px-4">
      <Card className="w-full max-w-md border-border/50 bg-card/50 backdrop-blur">
        <CardContent className="p-8 text-center space-y-6">
          {state === "loading" && (
            <Loader2 className="w-14 h-14 mx-auto animate-spin text-muted-foreground" />
          )}

          {state === "success" && (
            <CheckCircle2 className="w-14 h-14 mx-auto text-green-400" />
          )}

          {state === "error" && (
            <AlertCircle className="w-14 h-14 mx-auto text-red-400" />
          )}

          <div>
            <h1 className="text-2xl font-bold mb-2">
              {state === "success"
                ? "결제 완료"
                : state === "error"
                ? "결제 확인 실패"
                : "결제 확인 중"}
            </h1>

            <p className="text-sm text-muted-foreground leading-6">{message}</p>

            {orderId && (
              <p className="text-xs text-muted-foreground mt-3 break-all">
                주문번호: {orderId}
              </p>
            )}

            {state === "success" && (
              <p className="text-xs text-muted-foreground mt-3 leading-5">
                다운로드 링크는 10분 동안 유효합니다. 이 화면을 벗어나거나
                새로고침하면 재다운로드가 제한될 수 있습니다.
              </p>
            )}
          </div>

          <div className="space-y-2">
            {state === "success" && (
              <Button
                className="w-full bg-red-500 hover:bg-red-600 text-white"
                onClick={handleDownload}
                disabled={isDownloading}
              >
                <Download className="w-4 h-4 mr-2" />
                {isDownloading ? "다운로드 준비 중..." : "전자책 다운로드"}
              </Button>
            )}

            <Button variant="outline" className="w-full" asChild>
              <Link href="/ebook">전자책 페이지로 돌아가기</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}
