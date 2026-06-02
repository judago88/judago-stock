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

  useEffect(() => {
    const confirmPayment = async () => {
      try {
        const params = new URLSearchParams(window.location.search);

        const paymentKey = params.get("paymentKey");
        const orderIdParam = params.get("orderId");
        const amount = params.get("amount");

        setOrderId(orderIdParam);

        if (!paymentKey || !orderIdParam || !amount) {
          throw new Error("결제 승인에 필요한 정보가 없습니다.");
        }

        const res = await fetch(
          `${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/confirm-ebook-payment`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              paymentKey,
              orderId: orderIdParam,
              amount: Number(amount),
            }),
          }
        );

        const result = await res.json();

        if (!res.ok || !result.ok) {
          throw new Error(result.message ?? "결제 승인에 실패했습니다.");
        }

        setState("success");
        setMessage(
          "결제가 완료되었습니다. 아래 버튼을 눌러 전자책을 다운로드해주세요."
        );
      } catch (error) {
        console.error(error);
        setState("error");
        setMessage(
          error instanceof Error
            ? error.message
            : "결제 승인 중 오류가 발생했습니다."
        );
      }
    };

    confirmPayment();
  }, []);

  const handleDownload = async () => {
    try {
      setIsDownloading(true);

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

      const fileRes = await fetch(data.download_url);
      const blob = await fileRes.blob();

      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");

      a.href = url;
      a.download = "기준봉매매법 전자책.pdf";
      document.body.appendChild(a);
      a.click();

      a.remove();
      window.URL.revokeObjectURL(url);

      setMessage(
        "다운로드 링크가 발급되었습니다. 해당 전자책은 1회에 한하여 다운로드 가능합니다."
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
                다운로드는 1회만 가능합니다. 다운로드 전 네트워크 상태를
                확인해주세요.
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
