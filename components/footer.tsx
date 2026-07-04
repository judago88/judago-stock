"use client";

import { useState } from "react";
import Link from "next/link";

export function Footer() {
  const [contactOpen, setContactOpen] = useState(false);

  return (
    <>
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

                <button
                  type="button"
                  onClick={() => setContactOpen(true)}
                  className="hover:text-foreground transition-colors"
                >
                  고객센터
                </button>

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

      {contactOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
          <div className="w-full max-w-sm rounded-lg border border-border/50 bg-background p-6 shadow-xl">
            <h2 className="text-lg font-semibold text-foreground">고객센터</h2>

            <p className="mt-2 text-sm text-muted-foreground">
              문의 방법을 선택해주세요.
            </p>

            <p className="mt-4 rounded-md bg-secondary/30 px-3 py-2 text-center text-sm text-muted-foreground">
              judago@naver.com
            </p>

            <div className="mt-5 space-y-2">
              <a
                href="mailto:judago@naver.com?subject=주다고 문의"
                className="block w-full rounded-md bg-red-500 px-4 py-2 text-center text-sm font-medium text-white hover:bg-red-600 transition-colors"
              >
                메일 보내기
              </a>

              <button
                type="button"
                onClick={async () => {
                  await navigator.clipboard.writeText("judago@naver.com");
                  alert("이메일 주소가 복사되었습니다.");
                }}
                className="w-full rounded-md border border-border/50 px-4 py-2 text-sm hover:bg-secondary/50 transition-colors"
              >
                이메일 복사
              </button>

              <button
                type="button"
                onClick={() => setContactOpen(false)}
                className="w-full rounded-md border border-border/50 px-4 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-secondary/50 transition-colors"
              >
                닫기
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
