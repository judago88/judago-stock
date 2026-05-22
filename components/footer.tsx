"use client";

import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-border/50 mt-16">
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-4">
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

          <div className="text-xs text-muted-foreground">
            © 2026 주다고 기준봉 센터
          </div>
        </div>
      </div>
    </footer>
  );
}
