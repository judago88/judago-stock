import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();

    const authResultCode = String(formData.get("authResultCode") ?? "");
    const authResultMsg = String(formData.get("authResultMsg") ?? "");
    const tid = String(formData.get("tid") ?? "");
    const orderId = String(formData.get("orderId") ?? "");
    const amount = Number(formData.get("amount"));

    const origin = request.nextUrl.origin;

    if (authResultCode !== "0000") {
      const failUrl = new URL("/payment/fail", origin);

      failUrl.searchParams.set(
        "message",
        authResultMsg || "결제 인증에 실패했습니다."
      );

      if (orderId) {
        failUrl.searchParams.set("orderId", orderId);
      }

      return NextResponse.redirect(failUrl, 303);
    }

    if (!tid || !orderId || !Number.isFinite(amount)) {
      const failUrl = new URL("/payment/fail", origin);
      failUrl.searchParams.set(
        "message",
        "결제 승인에 필요한 정보가 누락되었습니다."
      );

      return NextResponse.redirect(failUrl, 303);
    }

    const confirmResponse = await fetch(
      `${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/confirm-ebook-payment`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          tid,
          orderId,
          amount,
        }),
        cache: "no-store",
      }
    );

    const confirmText = await confirmResponse.text();

    let confirmResult;

    try {
      confirmResult = JSON.parse(confirmText);
    } catch {
      throw new Error(
        `결제 승인 응답이 올바르지 않습니다.\n${confirmText}`
      );
    }

    if (!confirmResponse.ok || !confirmResult.ok) {
      const failUrl = new URL("/payment/fail", origin);

      failUrl.searchParams.set(
        "message",
        confirmResult.message ?? "결제 승인에 실패했습니다."
      );
      failUrl.searchParams.set("orderId", orderId);

      return NextResponse.redirect(failUrl, 303);
    }

    const successUrl = new URL("/payment/success", origin);
    successUrl.searchParams.set("orderId", orderId);

    return NextResponse.redirect(successUrl, 303);
  } catch (error) {
    console.error("NICEPAY return 처리 오류:", error);

    const failUrl = new URL("/payment/fail", request.nextUrl.origin);
    failUrl.searchParams.set(
      "message",
      error instanceof Error
        ? error.message
        : "결제 처리 중 오류가 발생했습니다."
    );

    return NextResponse.redirect(failUrl, 303);
  }
}