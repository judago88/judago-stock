"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { CheckCircle2, Loader2, AlertCircle, Download } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
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

        const supabase = createClient();

        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (!session) {
          throw new Error("로그인이 필요합니다.");
        }

        const res = await fetch(
          `${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/confirm-ebook-payment`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${session.access_token}`,
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
        setMessage("결제가 완료되었습니다.");
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
      const orderId = params.get("orderId");

      const supabase = createClient();

      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        throw new Error("로그인이 필요합니다.");
      }

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/download-ebook`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session.access_token}`,
          },
          body: JSON.stringify({
            order_id: orderId,
          }),
        }
      );

      const data = await res.json();

      if (!res.ok || !data.ok) {
        throw new Error(data.message ?? "다운로드 실패");
      }

      window.location.href = data.download_url;
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
            <p className="text-sm text-muted-foreground">{message}</p>

            {orderId && (
              <p className="text-xs text-muted-foreground mt-3">
                주문번호: {orderId}
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
