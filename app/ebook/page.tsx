"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  BookOpen,
  CheckCircle2,
  TrendingUp,
  ShieldCheck,
  Clock,
  Download,
} from "lucide-react";
import { loadTossPayments } from "@tosspayments/tosspayments-sdk";

interface Ebook {
  id: string;
  title: string;
  subtitle: string | null;
  description: string | null;
  price: number;
  original_price: number | null;
  file_path: string;
  cover_image_path: string | null;
  is_active: boolean;
}

const ebookFeatures = [
  "기준봉 매매법의 핵심 원리와 실전 적용",
  "손절 및 익절 기준 설정 방법",
  "거래량과 캔들 패턴 분석 기법",
  "실제 매매 사례 중심의 학습 구성",
  "초보자도 따라할 수 있는 단계별 가이드",
  "시장 상황별 대응 전략",
];

function formatPrice(value: number) {
  return `${value.toLocaleString()}원`;
}

function getDiscountRate(price: number, originalPrice: number | null) {
  if (!originalPrice || originalPrice <= price) return null;
  return Math.round((1 - price / originalPrice) * 100);
}

export default function EbookPage() {
  const [ebook, setEbook] = useState<Ebook | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreatingOrder, setIsCreatingOrder] = useState(false);
  const [paidOrderId, setPaidOrderId] = useState<string | null>(null);
  const [isCheckingPurchase, setIsCheckingPurchase] = useState(true);
  const [isDownloading, setIsDownloading] = useState(false);

  useEffect(() => {
    const loadEbook = async () => {
      try {
        const supabase = createClient();

        const { data, error } = await supabase
          .from("ebooks")
          .select("*")
          .eq("is_active", true)
          .order("created_at", { ascending: false })
          .limit(1)
          .single();

        if (error) throw error;

        const ebookData = data as Ebook;
        setEbook(ebookData);

        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (session) {
          const { data: paidOrder } = await supabase
            .from("ebook_orders")
            .select("order_id")
            .eq("ebook_id", ebookData.id)
            .eq("user_id", session.user.id)
            .eq("status", "paid")
            .order("created_at", { ascending: false })
            .limit(1)
            .maybeSingle();

          setPaidOrderId(paidOrder?.order_id ?? null);
        }
      } catch (error) {
        console.error(error);
        setEbook(null);
      } finally {
        setIsLoading(false);
        setIsCheckingPurchase(false);
      }
    };

    loadEbook();
  }, []);

  const discountRate = ebook
    ? getDiscountRate(ebook.price, ebook.original_price)
    : null;

  const handlePurchaseClick = async () => {
    if (!ebook) return;

    try {
      setIsCreatingOrder(true);

      const supabase = createClient();

      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        alert("구매를 진행하려면 로그인이 필요합니다.");
        await supabase.auth.signInWithOAuth({
          provider: "google",
          options: {
            redirectTo: `${window.location.origin}/ebook`,
          },
        });
        return;
      }

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/create-ebook-order`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session.access_token}`,
          },
          body: JSON.stringify({
            ebook_id: ebook.id,
          }),
        }
      );

      const result = await res.json();

      if (!res.ok || !result.ok) {
        throw new Error(result.message ?? "주문 생성에 실패했습니다.");
      }

      console.log("created order:", result.order);

      const tossClientKey = process.env.NEXT_PUBLIC_TOSS_CLIENT_KEY;

      if (!tossClientKey) {
        throw new Error("Toss Client Key가 설정되어 있지 않습니다.");
      }

      const tossPayments = await loadTossPayments(tossClientKey);

      const payment = tossPayments.payment({
        customerKey: session.user.id,
      });

      await payment.requestPayment({
        method: "CARD",
        amount: {
          currency: "KRW",
          value: result.order.amount,
        },
        orderId: result.order.order_id,
        orderName: result.order.ebook_title,
        customerName:
          session.user.user_metadata?.name ?? session.user.email ?? "구매자",
        customerEmail: session.user.email ?? undefined,
        successUrl: `${window.location.origin}/payment/success`,
        failUrl: `${window.location.origin}/payment/fail`,
      });

      // 다음 단계에서 Toss 결제창으로 이동 처리 예정
    } catch (error) {
      console.error(error);
      alert(
        error instanceof Error
          ? error.message
          : "주문 생성 중 오류가 발생했습니다."
      );
    } finally {
      setIsCreatingOrder(false);
    }
  };

  const handleDownloadClick = async () => {
    if (!paidOrderId) return;

    try {
      setIsDownloading(true);

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
            order_id: paidOrderId,
          }),
        }
      );

      const result = await res.json();

      if (!res.ok || !result.ok) {
        throw new Error(result.message ?? "다운로드 실패");
      }

      // window.location.href = result.download_url;
      const fileRes = await fetch(result.download_url);
      const blob = await fileRes.blob();

      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");

      a.href = url;
      a.download = `${ebook?.title ?? "전자책"}.pdf`;
      document.body.appendChild(a);
      a.click();

      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error(error);
      alert(
        error instanceof Error
          ? error.message
          : "다운로드 중 오류가 발생했습니다."
      );
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-md">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <Link
              href="/"
              className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="text-sm">기준봉 센터로 돌아가기</span>
            </Link>

            <div className="flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-red-400" />
              <span className="font-bold hidden sm:inline">주다고 전자책</span>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 md:py-12">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10 md:mb-14">
            <Badge variant="secondary" className="mb-4">
              PDF 전자책
            </Badge>

            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 text-balance">
              {isLoading
                ? "전자책 정보를 불러오는 중..."
                : ebook?.title ?? "판매 중인 전자책이 없습니다"}
            </h1>

            <p className="text-muted-foreground text-lg md:text-xl max-w-2xl mx-auto text-pretty">
              {ebook?.subtitle ??
                ebook?.description ??
                "현재 판매 중인 전자책 정보를 확인할 수 없습니다."}
            </p>
          </div>

          <Card className="border-border/50 bg-card/50 backdrop-blur mb-8">
            <CardContent className="p-6 md:p-8">
              <div className="grid md:grid-cols-2 gap-8">
                <div className="flex items-center justify-center">
                  <div className="relative">
                    <div className="w-48 h-64 md:w-56 md:h-72 bg-gradient-to-br from-red-500/20 to-red-600/10 rounded-lg border border-border/50 flex items-center justify-center shadow-2xl">
                      <div className="text-center p-6">
                        <BookOpen className="w-12 h-12 text-red-400 mx-auto mb-3" />
                        <p className="font-bold text-lg">
                          {ebook?.title ?? "전자책"}
                        </p>
                        <p className="text-sm text-muted-foreground mt-1">
                          PDF Guide
                        </p>
                      </div>
                    </div>

                    <div className="absolute -top-2 -right-2">
                      <Badge className="bg-red-500 text-white border-0">
                        PDF
                      </Badge>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col justify-center">
                  <div className="mb-6">
                    <div className="flex items-baseline gap-2 mb-1">
                      <span className="text-3xl font-bold">
                        {ebook ? formatPrice(ebook.price) : "-"}
                      </span>

                      {ebook?.original_price && (
                        <span className="text-lg text-muted-foreground line-through">
                          {formatPrice(ebook.original_price)}
                        </span>
                      )}
                    </div>

                    {discountRate && (
                      <Badge
                        variant="outline"
                        className="text-red-400 border-red-400/50"
                      >
                        {discountRate}% 할인
                      </Badge>
                    )}
                  </div>

                  <div className="space-y-3 mb-6">
                    <div className="flex items-center gap-2 text-sm">
                      <Clock className="w-4 h-4 text-muted-foreground" />
                      <span>결제 완료 후 PDF 다운로드 가능</span>
                    </div>

                    <div className="flex items-center gap-2 text-sm">
                      <ShieldCheck className="w-4 h-4 text-muted-foreground" />
                      <span>구매 내역 확인 후 안전하게 제공</span>
                    </div>
                  </div>

                  {ebook?.description && (
                    <p className="text-sm text-muted-foreground leading-relaxed mb-6 bg-secondary/20 rounded-lg p-4">
                      {ebook.description}
                    </p>
                  )}

                  <Button
                    size="lg"
                    className="w-full bg-red-500 hover:bg-red-600 text-white"
                    disabled={
                      !ebook ||
                      isLoading ||
                      isCreatingOrder ||
                      isCheckingPurchase ||
                      isDownloading
                    }
                    onClick={
                      paidOrderId ? handleDownloadClick : handlePurchaseClick
                    }
                  >
                    {paidOrderId ? (
                      <Download className="w-5 h-5 mr-2" />
                    ) : (
                      <TrendingUp className="w-5 h-5 mr-2" />
                    )}

                    {isCheckingPurchase
                      ? "구매 내역 확인 중..."
                      : isDownloading
                      ? "다운로드 준비 중..."
                      : paidOrderId
                      ? "전자책 다운로드"
                      : isCreatingOrder
                      ? "주문 생성 중..."
                      : isLoading
                      ? "불러오는 중..."
                      : "지금 구매하기"}
                  </Button>

                  <p className="text-xs text-muted-foreground text-center mt-3">
                    안전한 결제 시스템으로 진행됩니다
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/50 bg-card/50 backdrop-blur mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-green-400" />이 책에서
                배우는 내용
              </CardTitle>
            </CardHeader>

            <CardContent>
              <ul className="grid sm:grid-cols-2 gap-3">
                {ebookFeatures.map((feature, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-400 mt-0.5 shrink-0" />
                    <span className="text-sm">{feature}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Card className="border-border/50 bg-card/50 backdrop-blur">
            <CardHeader>
              <CardTitle>자주 묻는 질문</CardTitle>
            </CardHeader>

            <CardContent className="space-y-4">
              <div>
                <h4 className="font-medium mb-1">
                  결제 후 바로 받을 수 있나요?
                </h4>
                <p className="text-sm text-muted-foreground">
                  네, 결제 완료 후 PDF 파일 다운로드가 가능하도록 제공할
                  예정입니다.
                </p>
              </div>

              <div>
                <h4 className="font-medium mb-1">파일은 어떤 형식인가요?</h4>
                <p className="text-sm text-muted-foreground">
                  PDF 전자책 형식으로 제공됩니다.
                </p>
              </div>

              <div>
                <h4 className="font-medium mb-1">초보자도 이해할 수 있나요?</h4>
                <p className="text-sm text-muted-foreground">
                  네, 기초 개념부터 실전 적용까지 단계적으로 이해할 수 있도록
                  구성되어 있습니다.
                </p>
              </div>
            </CardContent>
          </Card>

          <div className="mt-10 text-center">
            <Button
              size="lg"
              className="w-full bg-red-500 hover:bg-red-600 text-white"
              disabled={
                !ebook ||
                isLoading ||
                isCreatingOrder ||
                isCheckingPurchase ||
                isDownloading
              }
              onClick={paidOrderId ? handleDownloadClick : handlePurchaseClick}
            >
              {paidOrderId ? (
                <Download className="w-5 h-5 mr-2" />
              ) : (
                <TrendingUp className="w-5 h-5 mr-2" />
              )}

              {isCheckingPurchase
                ? "구매 내역 확인 중..."
                : isDownloading
                ? "다운로드 준비 중..."
                : paidOrderId
                ? "전자책 다운로드"
                : isCreatingOrder
                ? "주문 생성 중..."
                : isLoading
                ? "불러오는 중..."
                : "지금 구매하기"}
            </Button>
          </div>
        </div>
      </main>

      <footer className="border-t border-border/50 mt-12 py-6">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>문의사항이 있으시면 Threads DM으로 연락해주세요.</p>
        </div>
      </footer>
    </div>
  );
}
