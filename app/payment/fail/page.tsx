"use client";

import Link from "next/link";
import { AlertCircle } from "lucide-react";
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
            <h1 className="text-2xl font-bold mb-2">결제 실패</h1>
            <p className="text-sm text-muted-foreground">{message}</p>

            {code && (
              <p className="text-xs text-muted-foreground mt-3">
                오류 코드: {code}
              </p>
            )}
          </div>

          <Button className="w-full" asChild>
            <Link href="/ebook">다시 구매하기</Link>
          </Button>
        </CardContent>
      </Card>
    </main>
  );
}
