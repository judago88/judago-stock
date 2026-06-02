"use client";

import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-border/50 mt-16">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto grid gap-8 md:grid-cols-2">
          <div className="space-y-5 text-center md:text-left">
            <div>
              <h3 className="font-semibold text-base text-foreground">
                주다고 기준봉 센터
              </h3>
            </div>

            <div className="flex flex-wrap items-center justify-center md:justify-start gap-x-5 gap-y-2 text-sm text-muted-foreground">
              <Link
                href="/notices"
                className="hover:text-foreground transition-colors"
              >
                공지사항
              </Link>

              <a
                href="mailto:junddai91@gmail.com?subject=주다고 문의"
                className="hover:text-foreground transition-colors"
              >
                문의하기
              </a>

              <a
                href="https://www.threads.com/@jodago_"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-foreground transition-colors"
              >
                Threads
              </a>

              <Link
                href="/ebook"
                className="hover:text-foreground transition-colors"
              >
                전자책
              </Link>
            </div>

            <div className="flex flex-wrap items-center justify-center md:justify-start gap-x-5 gap-y-2 text-sm">
              <Link
                href="/privacy-policy"
                className="hover:text-red-400 transition-colors"
              >
                개인정보처리방침
              </Link>

              <Link
                href="/terms-of-service"
                className="hover:text-red-400 transition-colors"
              >
                이용약관
              </Link>

              <Link
                href="/refund-policy"
                className="hover:text-red-400 transition-colors"
              >
                환불정책
              </Link>
            </div>
          </div>

          <div className="text-center md:text-right text-xs text-muted-foreground leading-6 space-y-1">
            <p>상호명 : 주다고(Judago) | 대표자 : 윤보석</p>
            <p>사업자등록번호 : 257-07-03387</p>
            <p>통신판매업신고번호 : 2026-인천연수구-1205</p>
            <p>
              주소 : 인천 부평구 대정로 66, 4층 408-117호(부평동,
              다운타운일레븐)
            </p>
            <p>이메일 : judago@naver.com</p>
            <p>연락처 : 010-5007-1723</p>
            <p className="pt-3">
              © 2026 주다고 기준봉 센터. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
