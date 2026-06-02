"use client";

import Link from "next/link";
import { AlertCircle, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function PaymentFailPage() {
  const params =
    typeof window !== "undefined"
      ? new URLSearchParams(window.location.search)
      : null;

  const message = params?.get("message") ?? "결제가 취소되었거나 실패했습니다.";

  const code = params?.get("code");

  return (
    <main className="min-h-screen bg-background flex items-center justify-center px-4">
      <Card className="w-full max-w-md border-border/50 bg-card/50 backdrop-blur">
        <CardContent className="p-8 text-center space-y-6">
          <AlertCircle className="w-14 h-14 mx-auto text-red-400" />

          <div>
            <h1 className="text-2xl font-bold mb-2">
              결제가 완료되지 않았습니다
            </h1>

            <p className="text-sm text-muted-foreground leading-6">{message}</p>

            {code && (
              <p className="text-xs text-muted-foreground mt-3">
                오류 코드 : {code}
              </p>
            )}

            <div className="mt-5 rounded-lg border border-border/50 p-4 text-left">
              <p className="text-sm font-medium mb-2">
                아래 내용을 확인해주세요.
              </p>

              <ul className="text-xs text-muted-foreground space-y-1 leading-5">
                <li>• 카드 한도 초과 여부</li>
                <li>• 카드사 결제 차단 여부</li>
                <li>• 결제 수단 정보 입력 오류</li>
                <li>• 네트워크 연결 상태</li>
              </ul>
            </div>
          </div>

          <div className="space-y-2">
            <Button
              className="w-full bg-red-500 hover:bg-red-600 text-white"
              asChild
            >
              <Link href="/ebook">다시 구매하기</Link>
            </Button>

            <Button variant="outline" className="w-full" asChild>
              <Link href="/">
                <ArrowLeft className="w-4 h-4 mr-2" />
                홈으로 이동
              </Link>
            </Button>
          </div>

          <p className="text-xs text-muted-foreground leading-5">
            문제가 계속 발생하는 경우
            <br />
            상단 문의하기 또는 Threads DM으로 문의해주세요.
          </p>
        </CardContent>
      </Card>
    </main>
  );
}
