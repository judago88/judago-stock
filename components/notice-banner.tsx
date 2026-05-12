"use client";

import Link from "next/link";
import { Notice } from "@/lib/stock-data";
import { Megaphone } from "lucide-react";

interface NoticeBannerProps {
  notice: Notice | null;
}

export function NoticeBanner({ notice }: NoticeBannerProps) {
  if (!notice) return null;

  return (
    <Link
      href={`/notices/${notice.id}`}
      className="block border-b border-border/50 bg-yellow-500/10 hover:bg-yellow-500/15 transition-colors"
    >
      <div className="container mx-auto px-4 py-2">
        <div className="flex items-center gap-2 text-sm">
          <Megaphone className="w-4 h-4 text-yellow-400 shrink-0" />

          <span className="font-medium text-yellow-300">공지사항</span>

          <span className="text-muted-foreground truncate">{notice.title}</span>
        </div>
      </div>
    </Link>
  );
}
