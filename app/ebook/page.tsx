"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
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
  Mail,
  Landmark,
} from "lucide-react";

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
  "진입 · 익절 · 손절 기준 설정 방법",
  "캔들과 이동평균선 패턴 조합 분석",
  "다양한 차트 중심의 학습 구성",
  "초보자도 쉽게 따라할 수 있는 올인원 패키지",
  "시장 상황별 대응 전략",
];

const purchaseHighlights = [
  "기준봉 · 이동평균선 · 눌림목 패턴을 하나의 흐름으로 학습",
  "PDF 전자책으로 제공",
  "입금 확인 후 이메일 발송",
];

const detailImages = [
  "/ebook/1.jpg",
  "/ebook/2.jpg",
  "/ebook/3.jpg",
  "/ebook/4.jpg",
  "/ebook/5.jpg",
  "/ebook/6.jpg",
  "/ebook/7.jpg",
  "/ebook/8.jpg",
  "/ebook/9.jpg",
];

function formatPrice(value: number) {
  return `${value.toLocaleString()}원`;
}

function getDiscountRate(price: number, originalPrice: number | null) {
  if (!originalPrice || originalPrice <= price) return null;
  return Math.round((1 - price / originalPrice) * 100);
}

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export default function EbookPage() {
  const router = useRouter();

  const [ebook, setEbook] = useState<Ebook | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreatingOrder, setIsCreatingOrder] = useState(false);
  const [showAllDetailImages, setShowAllDetailImages] = useState(false);
  const [selectedDetailImage, setSelectedDetailImage] = useState<string | null>(
    null
  );

  const [buyerName, setBuyerName] = useState("");
  const [buyerEmail, setBuyerEmail] = useState("");
  const [buyerPhone, setBuyerPhone] = useState("");
  const [orderMemo, setOrderMemo] = useState("");

  const [cashReceiptOption, setCashReceiptOption] = useState<
    "" | "requested" | "not_requested"
  >("");

  const [agreeTerms, setAgreeTerms] = useState(false);
  const [agreePrivacy, setAgreePrivacy] = useState(false);
  const [agreeRefund, setAgreeRefund] = useState(false);

  const coverImageUrl = ebook?.cover_image_path
    ? `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/ebook-covers/${ebook.cover_image_path}`
    : null;

  const agreeAll = agreeTerms && agreePrivacy && agreeRefund;

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

        setEbook(data as Ebook);
      } catch (error) {
        console.error(error);
        setEbook(null);
      } finally {
        setIsLoading(false);
      }
    };

    loadEbook();
  }, []);

  const discountRate = ebook
    ? getDiscountRate(ebook.price, ebook.original_price)
    : null;

  const handleAgreeAll = (checked: boolean) => {
    setAgreeTerms(checked);
    setAgreePrivacy(checked);
    setAgreeRefund(checked);
  };

  const handlePurchaseClick = async () => {
    if (!ebook) return;

    const trimmedName = buyerName.trim();
    const trimmedEmail = buyerEmail.trim();
    const trimmedPhone = buyerPhone.trim();
    const trimmedMemo = orderMemo.trim();

    if (!trimmedName) {
      alert("이름을 입력해주세요.");
      return;
    }

    if (!trimmedEmail) {
      alert("이메일을 입력해주세요.");
      return;
    }

    if (!isValidEmail(trimmedEmail)) {
      alert("올바른 이메일 형식을 입력해주세요.");
      return;
    }

    if (!trimmedPhone) {
      alert("전화번호를 입력해주세요.");
      return;
    }

    if (!cashReceiptOption) {
      alert("현금영수증 신청 여부를 선택해주세요.");
      return;
    }

    if (trimmedMemo.length > 500) {
      alert("추가 요청사항은 500자 이하로 입력해주세요.");
      return;
    }

    if (!agreeTerms) {
      alert("이용약관에 동의해주세요.");
      return;
    }

    if (!agreePrivacy) {
      alert("개인정보처리방침에 동의해주세요.");
      return;
    }

    if (!agreeRefund) {
      alert("환불정책에 동의해주세요.");
      return;
    }

    try {
      setIsCreatingOrder(true);

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/create-ebook-order`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ebook_id: ebook.id,
            buyer_name: trimmedName,
            buyer_email: trimmedEmail,
            buyer_phone: trimmedPhone,
            cash_receipt_requested: cashReceiptOption === "requested",
            order_memo: trimmedMemo || null,
          }),
        }
      );

      const result = await res.json();

      if (!res.ok || !result.ok) {
        throw new Error(result.message ?? "주문 생성에 실패했습니다.");
      }

      sessionStorage.setItem(
        "ebookBankTransferOrder",
        JSON.stringify({
          ...result.order,
          cash_receipt_requested: cashReceiptOption === "requested",
        })
      );

      router.push("/ebook/order-complete");
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

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-md">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <Link
              href="/"
              className="flex items-center gap-2 text-muted-foreground transition-colors hover:text-foreground"
            >
              <ArrowLeft className="h-4 w-4" />
              <span className="text-sm">주다고 기준봉 센터로 돌아가기</span>
            </Link>

            <div className="flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-red-400" />
              <span className="hidden font-bold sm:inline">주다고 전자책</span>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 md:py-12">
        <div className="mx-auto max-w-5xl">
          <div className="mb-10 text-center md:mb-14">
            <Badge variant="secondary" className="mb-4">
              PDF 전자책
            </Badge>

            <h1 className="mb-4 text-balance text-3xl font-bold md:text-4xl lg:text-5xl">
              {isLoading
                ? "전자책 정보를 불러오는 중..."
                : ebook?.title ?? "판매 중인 전자책이 없습니다"}
            </h1>

            <p className="mx-auto max-w-3xl text-pretty text-lg leading-8 text-muted-foreground md:text-xl">
              {ebook?.subtitle ??
                ebook?.description ??
                "현재 판매 중인 전자책 정보를 확인할 수 없습니다."}
            </p>
          </div>

          <Card
            id="purchase-form"
            className="mb-8 border-border/50 bg-card/50 backdrop-blur"
          >
            <CardContent className="p-6 md:p-10">
              <div className="grid gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:gap-14">
                {/* LEFT */}
                <div className="relative">
                  <div className="flex flex-col items-center lg:sticky lg:top-28">
                    <div className="relative">
                      <div className="h-[360px] w-[270px] overflow-hidden rounded-xl border border-border/50 bg-gradient-to-br from-red-500/20 to-red-600/10 shadow-2xl md:h-[400px] md:w-[300px]">
                        {coverImageUrl ? (
                          <img
                            src={coverImageUrl}
                            alt={ebook?.title ?? "전자책 커버"}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center">
                            <div className="p-8 text-center">
                              <BookOpen className="mx-auto mb-4 h-14 w-14 text-red-400" />
                              <p className="text-xl font-bold">
                                {ebook?.title ?? "전자책"}
                              </p>
                              <p className="mt-2 text-sm text-muted-foreground">
                                PDF Guide
                              </p>
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="absolute -right-2 -top-2">
                        <Badge className="border-0 bg-red-500 text-white">
                          PDF
                        </Badge>
                      </div>
                    </div>

                    <div className="mt-5 w-full max-w-[300px] space-y-2.5">
                      {purchaseHighlights.map((item, index) => (
                        <div
                          key={index}
                          className="flex items-start gap-2.5 text-sm leading-6 text-muted-foreground"
                        >
                          <CheckCircle2 className="mt-1 h-4 w-4 shrink-0 text-green-400" />
                          <span>{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* RIGHT */}
                <div className="flex flex-col">
                  {/* PRICE */}
                  <div className="mb-5">
                    <div className="flex flex-wrap items-center gap-3">
                      <span className="text-3xl font-bold md:text-4xl">
                        {ebook ? formatPrice(ebook.price) : "-"}
                      </span>

                      {ebook?.original_price && (
                        <span className="text-base text-muted-foreground line-through">
                          {formatPrice(ebook.original_price)}
                        </span>
                      )}

                      {discountRate && (
                        <Badge
                          variant="outline"
                          className="border-red-400/50 text-red-400"
                        >
                          {discountRate}% 할인
                        </Badge>
                      )}
                    </div>
                  </div>

                  {/* PAYMENT GUIDE */}
                  <div className="mb-5 rounded-xl border border-border/50 px-4 py-3.5">
                    <div className="space-y-2.5">
                      <div className="flex items-start gap-3">
                        <Landmark className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />

                        <p className="text-sm leading-6">
                          주문 후 안내되는 계좌로{" "}
                          <strong className="font-semibold text-foreground">
                            24시간 이내
                          </strong>
                          에 입금해주세요.
                        </p>
                      </div>

                      <div className="flex items-start gap-3">
                        <Mail className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />

                        <p className="text-sm leading-6">
                          입금 확인 후{" "}
                          <strong className="font-semibold text-foreground">
                            1영업일 이내
                          </strong>
                          에 입력하신 이메일로 전자책을 발송합니다.
                        </p>
                      </div>
                    </div>

                    <p className="mt-2.5 text-xs leading-5 text-muted-foreground">
                      주말 및 공휴일은 발송일에서 제외됩니다.
                    </p>
                  </div>

                  {/* DESCRIPTION */}
                  {ebook?.description && (
                    <p className="mb-5 text-sm leading-6 text-muted-foreground">
                      {ebook.description}
                    </p>
                  )}

                  {/* FORM */}
                  <div className="mb-4 space-y-3.5">
                    <div>
                      <label className="mb-1 block text-sm font-medium">
                        이름 <span className="text-red-400">*</span>
                      </label>

                      <input
                        type="text"
                        value={buyerName}
                        onChange={(e) => setBuyerName(e.target.value)}
                        placeholder="이름을 입력해주세요"
                        className="w-full rounded-md border border-border/50 bg-background px-3 py-2.5 text-sm outline-none transition-colors focus:border-red-400"
                      />

                      <p className="mt-1 flex items-center gap-1.5 text-[11px] leading-5 text-muted-foreground">
                        <ShieldCheck className="h-3.5 w-3.5 shrink-0" />
                        입력하신 이름과 동일한 이름으로 입금해주세요.
                      </p>
                    </div>

                    <div>
                      <label className="mb-1 block text-sm font-medium">
                        이메일 <span className="text-red-400">*</span>
                      </label>

                      <input
                        type="email"
                        value={buyerEmail}
                        onChange={(e) => setBuyerEmail(e.target.value)}
                        placeholder="전자책을 받을 이메일을 입력해주세요"
                        className="w-full rounded-md border border-border/50 bg-background px-3 py-2.5 text-sm outline-none transition-colors focus:border-red-400"
                      />
                    </div>

                    <div>
                      <label className="mb-1 block text-sm font-medium">
                        전화번호 <span className="text-red-400">*</span>
                      </label>

                      <input
                        type="tel"
                        value={buyerPhone}
                        onChange={(e) => setBuyerPhone(e.target.value)}
                        placeholder="01012345678"
                        className="w-full rounded-md border border-border/50 bg-background px-3 py-2.5 text-sm outline-none transition-colors focus:border-red-400"
                      />
                    </div>

                    {/* CASH RECEIPT */}
                    <div>
                      <div className="mb-1.5 flex items-center gap-1">
                        <span className="text-sm font-medium">현금영수증</span>

                        <span className="text-red-400">*</span>
                      </div>

                      <div className="flex flex-wrap items-center gap-5 py-1">
                        <label className="flex cursor-pointer items-center gap-2 text-sm">
                          <input
                            type="radio"
                            name="cashReceipt"
                            value="requested"
                            checked={cashReceiptOption === "requested"}
                            onChange={() => setCashReceiptOption("requested")}
                          />
                          신청
                        </label>

                        <label className="flex cursor-pointer items-center gap-2 text-sm">
                          <input
                            type="radio"
                            name="cashReceipt"
                            value="not_requested"
                            checked={cashReceiptOption === "not_requested"}
                            onChange={() =>
                              setCashReceiptOption("not_requested")
                            }
                          />
                          미신청
                        </label>
                      </div>

                      {cashReceiptOption === "requested" && (
                        <p className="mt-1 text-[11px] leading-5 text-muted-foreground">
                          입력하신 전화번호로 소득공제용 현금영수증이
                          발급됩니다.
                        </p>
                      )}

                      {cashReceiptOption === "not_requested" && (
                        <p className="mt-1 text-[11px] leading-5 text-muted-foreground">
                          미신청 시 관련 기준에 따라 자진발급 처리될 수
                          있습니다.
                        </p>
                      )}
                    </div>

                    {/* MEMO */}
                    <div className="space-y-1.5">
                      <label
                        htmlFor="orderMemo"
                        className="text-sm font-medium"
                      >
                        요청사항 (선택)
                      </label>

                      <textarea
                        id="orderMemo"
                        value={orderMemo}
                        onChange={(e) => setOrderMemo(e.target.value)}
                        maxLength={500}
                        rows={3}
                        placeholder="구매자의 Threads 닉네임 / 추가로 궁금한 점이나 요청사항이 있다면 자유롭게 남겨주세요"
                        className="w-full resize-none rounded-md border border-border bg-background px-3 py-2.5 text-sm"
                      />

                      <div className="text-right text-[11px] text-muted-foreground">
                        {orderMemo.length}/500
                      </div>
                    </div>
                  </div>

                  {/* AGREEMENTS */}
                  <div className="mb-5 rounded-xl border border-border/50 px-5 py-5">
                    <label className="flex cursor-pointer items-center gap-3 border-b border-border/40 pb-4">
                      <input
                        type="checkbox"
                        checked={agreeAll}
                        onChange={(e) => handleAgreeAll(e.target.checked)}
                        className="h-5 w-5 cursor-pointer"
                      />

                      <span className="text-sm font-semibold">전체 동의</span>
                    </label>

                    <div className="mt-4 space-y-4">
                      <label className="flex cursor-pointer items-center gap-3">
                        <input
                          type="checkbox"
                          checked={agreeTerms}
                          onChange={(e) => setAgreeTerms(e.target.checked)}
                          className="h-5 w-5 cursor-pointer"
                        />

                        <span className="text-sm">
                          <Link
                            href="/terms-of-service"
                            target="_blank"
                            onClick={(e) => e.stopPropagation()}
                            className="underline underline-offset-4 hover:text-foreground"
                          >
                            이용약관
                          </Link>{" "}
                          에 동의합니다.
                        </span>
                      </label>

                      <label className="flex cursor-pointer items-center gap-3">
                        <input
                          type="checkbox"
                          checked={agreePrivacy}
                          onChange={(e) => setAgreePrivacy(e.target.checked)}
                          className="h-5 w-5 cursor-pointer"
                        />

                        <span className="text-sm">
                          <Link
                            href="/privacy-policy"
                            target="_blank"
                            onClick={(e) => e.stopPropagation()}
                            className="underline underline-offset-4 hover:text-foreground"
                          >
                            개인정보처리방침
                          </Link>{" "}
                          에 동의합니다.
                        </span>
                      </label>

                      <label className="flex cursor-pointer items-center gap-3">
                        <input
                          type="checkbox"
                          checked={agreeRefund}
                          onChange={(e) => setAgreeRefund(e.target.checked)}
                          className="h-5 w-5 cursor-pointer"
                        />

                        <span className="text-sm">
                          <Link
                            href="/refund-policy"
                            target="_blank"
                            onClick={(e) => e.stopPropagation()}
                            className="underline underline-offset-4 hover:text-foreground"
                          >
                            환불정책
                          </Link>{" "}
                          에 동의합니다.
                        </span>
                      </label>
                    </div>
                  </div>

                  {/* CTA */}
                  <Button
                    size="lg"
                    className="w-full bg-red-500 text-white hover:bg-red-600"
                    disabled={!ebook || isLoading || isCreatingOrder}
                    onClick={handlePurchaseClick}
                  >
                    <TrendingUp className="mr-2 h-5 w-5" />

                    {isCreatingOrder
                      ? "주문 접수 중..."
                      : isLoading
                      ? "불러오는 중..."
                      : "주문 신청하기"}
                  </Button>

                  <p className="mt-2.5 text-center text-[11px] leading-5 text-muted-foreground">
                    다음 화면에서 입금 계좌를 안내합니다 · 24시간 내 미입금 시
                    자동 취소
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* FEATURES */}
          <Card className="mb-8 border-border/50 bg-card/50 backdrop-blur">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-2xl">
                <CheckCircle2 className="h-5 w-5 text-green-400" />이 책에서
                배우는 내용
              </CardTitle>
            </CardHeader>

            <CardContent>
              <ul className="grid gap-3 sm:grid-cols-2">
                {ebookFeatures.map((feature, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-green-400" />
                    <span className="text-base">{feature}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {/* DETAIL IMAGES */}
          <Card className="mb-8 border-border/50 bg-card/50 backdrop-blur">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-2xl">
                <BookOpen className="h-5 w-5 text-red-400" />
                전자책 상세 미리보기
              </CardTitle>
            </CardHeader>

            <CardContent>
              <div className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-4">
                {(showAllDetailImages
                  ? detailImages
                  : detailImages.slice(0, 3)
                ).map((image, index) => (
                  <button
                    key={image}
                    type="button"
                    onClick={() => setSelectedDetailImage(image)}
                    className="group overflow-hidden rounded-xl border border-border/50 bg-muted/20 text-left transition-colors hover:border-border"
                    aria-label={`전자책 상세 이미지 ${index + 1} 크게 보기`}
                  >
                    <div className="aspect-[3/4] overflow-hidden bg-muted/20 p-2 md:p-3">
                      <img
                        src={image}
                        alt={`전자책 상세 이미지 ${index + 1}`}
                        className="h-full w-full object-contain transition-transform duration-300 group-hover:scale-[1.02]"
                      />
                    </div>
                  </button>
                ))}
              </div>

              {!showAllDetailImages && detailImages.length > 3 && (
                <div className="mt-5 flex justify-center">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowAllDetailImages(true)}
                    className="border-border/50"
                  >
                    상세 이미지 더보기 ({detailImages.length - 3}장)
                  </Button>
                </div>
              )}

              {showAllDetailImages && (
                <div className="mt-5 flex justify-center">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowAllDetailImages(false)}
                    className="border-border/50"
                  >
                    접기
                  </Button>
                </div>
              )}

              <p className="mt-4 text-center text-xs leading-5 text-muted-foreground">
                이미지를 클릭하면 크게 확인할 수 있습니다.
              </p>
            </CardContent>
          </Card>

          {/* AUTHOR */}
          <Card className="mb-8 border-border/50 bg-card/50 backdrop-blur">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-2xl">
                <BookOpen className="h-5 w-5 text-red-400" />
                기준봉 센터장 주다고
              </CardTitle>
            </CardHeader>

            <CardContent>
              <div className="space-y-5 text-base leading-8 text-muted-foreground">
                <p>
                  안녕하세요, 기준봉 센터장 주식다마고치입니다.
                  <br />
                  그동안 투자를 하면서 수많은 실패와 시련을 겪으면서도 주식을
                  놓지 못한 이유는 제대로 된 매매기법만 가지고 있다면 퇴직
                  후에도 안정적으로 수익을 취할 수 있다는 기대감이 있었기
                  때문입니다.
                </p>

                <p>
                  주식에는 보조지표를 이용한 수많은 차트매매기법이 존재합니다.
                  <br />
                  그러나, 보조지표는 말 그대로 &apos;보조&apos; 지표일 뿐 매매의
                  근거가 될 수 없습니다.
                </p>

                <p>
                  제가 실제로 10여 년간 여러가지 기법을 적용하여 매매를
                  진행해오면서 기준봉매매는 높은 정확도가 입증된 매매법이며
                  글솜씨가 없음에도 불구하고 충분히 공유가치가 있다고 판단되어
                  기준봉 매매법 입문서를 전자책으로 제작하게 되었습니다.
                </p>

                <p>
                  정말 좋은 매매법은 초보자도 쉽게 따라 할 수 있어야 합니다.
                  <br />
                  결국, 내가 수익을 냈을 때 그것이 정답입니다.
                </p>

                <p>
                  더이상 리딩방에 의존하지 마세요.
                  <br />
                  명확한 근거를 기반으로 본인 스스로 매매할 수 있는 능력을
                  만들어 드리겠습니다.
                </p>

                <p>
                  아직도 제대로 된 투자 방향을 잡지 못한 투자자분들에게 해당
                  기준봉매매법이 유용하게 쓰였으면 좋겠습니다.
                </p>
                <p> 당신의 주식개념을 180도 바꿔드리겠습니다.</p>
              </div>
            </CardContent>
          </Card>

          {/* FAQ */}
          <Card className="border-border/50 bg-card/50 backdrop-blur">
            <CardHeader>
              <CardTitle className="text-2xl">자주 묻는 질문</CardTitle>
            </CardHeader>

            <CardContent className="space-y-5">
              <div>
                <h4 className="mb-1 text-lg font-medium">
                  주문 후 전자책은 언제 받을 수 있나요?
                </h4>

                <p className="text-base text-muted-foreground">
                  입금 확인 후 1영업일 이내에 주문 시 입력하신 이메일 주소로 PDF
                  전자책을 발송합니다. 주말 및 공휴일은 발송일에서 제외됩니다.
                </p>
              </div>

              <div>
                <h4 className="mb-1 text-lg font-medium">어떻게 결제하나요?</h4>

                <p className="text-base text-muted-foreground">
                  주문 신청 후 안내되는 계좌로 24시간 이내에 주문자 이름과
                  동일한 이름으로 입금해주세요. 24시간 이내 미입금 시 주문은
                  자동 취소됩니다.
                </p>
              </div>

              <div>
                <h4 className="mb-1 text-lg font-medium">
                  파일은 어떤 형식인가요?
                </h4>

                <p className="text-base text-muted-foreground">
                  PDF 전자책 형식으로 제공됩니다.
                </p>
              </div>

              <div>
                <h4 className="mb-1 text-lg font-medium">
                  입문서에는 어떤 내용이 담겨 있나요?
                </h4>

                <p className="text-base text-muted-foreground">
                  서점에서 판매하는 일반적인 주식 개념이 아닌, 곧바로 실전
                  매매에 뛰어들 수 있도록 제작된 실전용 매매기법입니다.
                </p>
              </div>

              <div>
                <h4 className="mb-1 text-lg font-medium">
                  초보자도 이해할 수 있나요?
                </h4>

                <p className="text-base text-muted-foreground">
                  네, 주식을 처음 접한 초보자도 쉽게 따라할 수 있도록 기초
                  개념부터 실전 적용까지 단계별로 구성되어 있습니다.
                </p>
              </div>

              <div>
                <h4 className="mb-1 text-lg font-medium">환불은 가능한가요?</h4>

                <p className="text-base text-muted-foreground">
                  전자책이 발송되기 전에는 입금내역 확인 후 주문 취소 및 환불을
                  요청할 수 있습니다. 다만, 디지털 콘텐츠의 특성상 전자책이 이미
                  제공된 이후에는 관련 법령에 따라 청약철회가 제한될 수
                  있습니다. 자세한 내용은 환불정책을 확인해주시기 바랍니다.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* INVESTMENT DISCLAIMER */}
          <Card className="mt-8 border-yellow-500/20 bg-yellow-500/5 backdrop-blur">
            <CardContent className="p-6">
              <h3 className="mb-3 text-lg font-semibold">투자 관련 안내</h3>

              <div className="space-y-3 text-sm leading-7 text-muted-foreground">
                <p>
                  본 전자책은 주식 차트 분석 및 매매 기준 학습을 위한 교육용
                  콘텐츠입니다.
                </p>

                <p>
                  특정 종목의 매수·매도 추천, 투자자문, 투자일임, 수익 보장을
                  목적으로 하지 않습니다.
                </p>

                <p>
                  전자책에 포함된 예시는 학습을 위한 과거 사례이며, 모든 투자
                  판단과 책임은 본인에게 있습니다.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* BOTTOM CTA */}
          <div className="mt-10 text-center">
            <Button
              size="lg"
              className="w-full bg-red-500 text-white hover:bg-red-600"
              asChild
            >
              <a href="#purchase-form">
                <TrendingUp className="mr-2 h-5 w-5" />
                주문 신청하기
              </a>
            </Button>
          </div>
        </div>
      </main>

      {selectedDetailImage && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 p-4 md:p-8"
          onClick={() => setSelectedDetailImage(null)}
        >
          <button
            type="button"
            onClick={() => setSelectedDetailImage(null)}
            className="absolute right-4 top-4 rounded-full bg-background/90 px-4 py-2 text-sm font-medium text-foreground shadow-lg"
          >
            닫기
          </button>

          <div
            className="max-h-[92vh] max-w-4xl overflow-auto rounded-xl bg-background p-2 shadow-2xl md:p-3"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={selectedDetailImage}
              alt="전자책 상세 이미지 확대"
              className="h-auto w-full object-contain"
            />
          </div>
        </div>
      )}

      <footer className="mt-12 border-t border-border/50 py-6">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>
            기타 사항은 고객센터를 통해 문의주시면 빠른 시일 내에
            답변드리겠습니다.
          </p>
        </div>
      </footer>
    </div>
  );
}
