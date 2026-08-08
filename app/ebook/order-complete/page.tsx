"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  BookOpen,
  CheckCircle2,
  Clock,
  Copy,
  Landmark,
  Mail,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface BankTransferOrder {
  id: string;
  order_id: string;
  ebook_id: string;
  ebook_title: string;
  amount: number;
  status: string;

  buyer_name: string;
  buyer_email: string;
  buyer_phone: string | null;

  cash_receipt_requested: boolean;
  order_memo: string | null;
  created_at?: string;
}

const BANK_NAME = "케이뱅크";
const BANK_ACCOUNT = "100-114-514416";
const BANK_HOLDER = "윤보석";

function formatPrice(value: number) {
  return `${value.toLocaleString()}원`;
}

function formatDateTime(value?: string) {
  if (!value) return "-";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "-";
  }

  return new Intl.DateTimeFormat("ko-KR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

export default function EbookOrderCompletePage() {
  const router = useRouter();

  const [order, setOrder] = useState<BankTransferOrder | null>(null);

  const [isLoading, setIsLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    try {
      const storedOrder = sessionStorage.getItem("ebookBankTransferOrder");

      if (!storedOrder) {
        setOrder(null);
        return;
      }

      const parsed = JSON.parse(storedOrder) as BankTransferOrder;

      if (
        !parsed?.order_id ||
        !parsed?.buyer_name ||
        typeof parsed?.amount !== "number"
      ) {
        setOrder(null);
        return;
      }

      setOrder(parsed);
    } catch (error) {
      console.error("주문 정보를 불러오지 못했습니다.", error);

      setOrder(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const expiresAt = useMemo(() => {
    if (!order?.created_at) return null;

    const createdAt = new Date(order.created_at);

    if (Number.isNaN(createdAt.getTime())) {
      return null;
    }

    return new Date(createdAt.getTime() + 24 * 60 * 60 * 1000);
  }, [order]);

  const handleCopyAccount = async () => {
    try {
      await navigator.clipboard.writeText(BANK_ACCOUNT);

      setCopied(true);

      window.setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch (error) {
      console.error("계좌번호 복사 실패:", error);

      alert(`계좌번호를 직접 복사해주세요.\n${BANK_ACCOUNT}`);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <p className="text-muted-foreground">주문 정보를 확인하고 있습니다.</p>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-background">
        <header className="border-b border-border/50">
          <div className="container mx-auto px-4 py-3">
            <Link
              href="/ebook"
              className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="w-4 h-4" />
              전자책 페이지로 돌아가기
            </Link>
          </div>
        </header>

        <main className="container mx-auto px-4 py-16">
          <Card className="max-w-xl mx-auto border-border/50">
            <CardContent className="p-8 text-center">
              <h1 className="text-2xl font-bold mb-3">
                주문 정보를 확인할 수 없습니다.
              </h1>

              <p className="text-muted-foreground leading-7 mb-6">
                주문 완료 화면은 주문 신청 직후에만 확인할 수 있습니다.
                <br />
                주문이 정상적으로 접수되었는지 확인이 필요한 경우 고객센터로
                문의해주세요.
              </p>

              <Button onClick={() => router.push("/ebook")} className="w-full">
                전자책 페이지로 이동
              </Button>
            </CardContent>
          </Card>
        </main>
      </div>
    );
  }

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
              <span className="text-sm">주다고 기준봉 센터로 돌아가기</span>
            </Link>

            <div className="flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-red-400" />

              <span className="font-bold hidden sm:inline">주다고 전자책</span>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-10 md:py-14">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-green-500/10">
                <CheckCircle2 className="w-8 h-8 text-green-500" />
              </div>
            </div>

            <h1 className="text-3xl md:text-4xl font-bold mb-3">
              주문이 접수되었습니다.
            </h1>

            <p className="text-muted-foreground leading-7">
              아래 계좌로 주문 후 24시간 이내에 입금해주세요.
              <br />
              입금 확인 후 전자책을 이메일로 발송해드립니다.
            </p>
          </div>

          <Card className="border-red-400/20 bg-card/50 backdrop-blur mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Landmark className="w-5 h-5 text-red-400" />
                입금 계좌
              </CardTitle>
            </CardHeader>

            <CardContent className="space-y-5">
              <div className="rounded-lg border border-border/50 bg-background/60 p-5">
                <div className="grid gap-4">
                  <div className="flex items-center justify-between gap-4">
                    <span className="text-sm text-muted-foreground">은행</span>

                    <span className="font-semibold">{BANK_NAME}</span>
                  </div>

                  <div className="flex items-center justify-between gap-4">
                    <span className="text-sm text-muted-foreground">
                      계좌번호
                    </span>

                    <span className="font-semibold tracking-wide">
                      {BANK_ACCOUNT}
                    </span>
                  </div>

                  <div className="flex items-center justify-between gap-4">
                    <span className="text-sm text-muted-foreground">
                      예금주
                    </span>

                    <span className="font-semibold">{BANK_HOLDER}</span>
                  </div>
                </div>

                <Button
                  type="button"
                  variant="outline"
                  className="w-full mt-5"
                  onClick={handleCopyAccount}
                >
                  <Copy className="w-4 h-4 mr-2" />

                  {copied ? "계좌번호가 복사되었습니다." : "계좌번호 복사"}
                </Button>
              </div>

              <div className="rounded-lg bg-red-500/5 border border-red-500/20 p-4">
                <p className="text-sm leading-6">
                  <strong>
                    주문 시 입력한 이름과 동일한 이름으로 입금해주세요.
                  </strong>
                  <br />
                  다른 이름으로 입금할 경우 입금 확인이 지연될 수 있습니다.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/50 bg-card/50 backdrop-blur mb-6">
            <CardHeader>
              <CardTitle>주문 정보</CardTitle>
            </CardHeader>

            <CardContent>
              <div className="divide-y divide-border/50">
                <OrderRow label="주문번호" value={order.order_id} />

                <OrderRow label="상품" value={order.ebook_title} />

                <OrderRow
                  label="입금금액"
                  value={formatPrice(order.amount)}
                  emphasized
                />

                <OrderRow label="입금자명" value={order.buyer_name} />

                <OrderRow
                  label="전자책 수령 이메일"
                  value={order.buyer_email}
                />

                <OrderRow label="전화번호" value={order.buyer_phone ?? "-"} />

                <OrderRow
                  label="현금영수증"
                  value={order.cash_receipt_requested ? "신청" : "미신청"}
                />

                <OrderRow
                  label="주문일시"
                  value={formatDateTime(order.created_at)}
                />

                {expiresAt && (
                  <OrderRow
                    label="입금기한"
                    value={formatDateTime(expiresAt.toISOString())}
                    emphasized
                  />
                )}
              </div>

              {order.order_memo && (
                <div className="mt-5 rounded-lg border border-border/50 p-4">
                  <p className="text-sm text-muted-foreground mb-2">
                    추가 요청사항
                  </p>

                  <p className="text-sm whitespace-pre-wrap leading-6">
                    {order.order_memo}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="border-border/50 bg-card/50 backdrop-blur mb-6">
            <CardHeader>
              <CardTitle>주문 후 안내</CardTitle>
            </CardHeader>

            <CardContent className="space-y-4">
              <div className="flex items-start gap-3">
                <Clock className="w-5 h-5 text-muted-foreground mt-0.5 shrink-0" />

                <p className="text-sm leading-6">
                  주문 후 <strong>24시간 이내</strong>에 입금되지 않을 경우 해당
                  주문은 자동 취소됩니다.
                </p>
              </div>

              <div className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-muted-foreground mt-0.5 shrink-0" />

                <p className="text-sm leading-6">
                  입금 확인 후 <strong>1영업일 이내</strong>에 주문 시 입력한
                  이메일 주소로 PDF 전자책을 발송합니다.
                </p>
              </div>

              <div className="flex items-start gap-3">
                <Clock className="w-5 h-5 text-muted-foreground mt-0.5 shrink-0" />

                <p className="text-sm leading-6">
                  주말 및 공휴일은 전자책 발송일에서 제외됩니다.
                </p>
              </div>

              {order.cash_receipt_requested && (
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-muted-foreground mt-0.5 shrink-0" />

                  <p className="text-sm leading-6">
                    현금영수증 신청 주문은 입력하신 전화번호를 기준으로
                    소득공제용 현금영수증이 발급됩니다.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          <div className="grid sm:grid-cols-2 gap-3">
            <Button variant="outline" size="lg" asChild>
              <Link href="/">메인으로 이동</Link>
            </Button>

            <Button
              size="lg"
              className="bg-red-500 hover:bg-red-600 text-white"
              asChild
            >
              <Link href="/ebook">전자책 페이지로 돌아가기</Link>
            </Button>
          </div>

          <p className="mt-6 text-center text-xs leading-5 text-muted-foreground">
            입금자명, 주문금액 또는 이메일 주소를 잘못 입력한 경우 고객센터로
            문의해주세요.
          </p>
        </div>
      </main>
    </div>
  );
}

function OrderRow({
  label,
  value,
  emphasized = false,
}: {
  label: string;
  value: string;
  emphasized?: boolean;
}) {
  return (
    <div className="flex items-start justify-between gap-6 py-3 first:pt-0 last:pb-0">
      <span className="text-sm text-muted-foreground shrink-0">{label}</span>

      <span
        className={`text-sm text-right break-all ${
          emphasized ? "font-bold text-foreground" : "font-medium"
        }`}
      >
        {value}
      </span>
    </div>
  );
}
