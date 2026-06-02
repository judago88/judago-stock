"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Notice } from "@/lib/stock-data";
import {
  AlertTriangle,
  CalendarDays,
  Megaphone,
  PartyPopper,
} from "lucide-react";

interface NoticeBannerProps {
  notices: Notice[];
}

function getNoticeMeta(type: string) {
  switch (type) {
    case "important":
      return {
        label: "중요 공지",
        icon: AlertTriangle,
        iconClassName: "text-yellow-400",
      };

    case "event":
      return {
        label: "이벤트",
        icon: PartyPopper,
        iconClassName: "text-yellow-400",
      };

    case "maintenance":
      return {
        label: "점검 안내",
        icon: CalendarDays,
        iconClassName: "text-yellow-400",
      };

    case "general":
    default:
      return {
        label: "공지사항",
        icon: Megaphone,
        iconClassName: "text-yellow-400",
      };
  }
}

export function NoticeBanner({ notices }: NoticeBannerProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (!notices || notices.length <= 1) return;

    const timer = window.setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % notices.length);
    }, 4000);

    return () => {
      window.clearInterval(timer);
    };
  }, [notices]);

  if (!notices || notices.length === 0) {
    return null;
  }

  const notice = notices[currentIndex] ?? notices[0];
  const meta = getNoticeMeta(notice.type);
  const Icon = meta.icon;

  return (
    <Link
      href={`/notices/${notice.id}`}
      className="block border-b border-yellow-500/20 bg-yellow-500/10 hover:bg-yellow-500/15 transition-colors"
    >
      <div className="container mx-auto px-4 py-2.5">
        <div className="flex items-center gap-2 text-sm">
          <Icon className={`h-4 w-4 shrink-0 ${meta.iconClassName}`} />

          <span className="shrink-0 font-semibold text-yellow-300">
            {meta.label}
          </span>

          <span className="truncate text-muted-foreground">{notice.title}</span>

          {notices.length > 1 && (
            <span className="ml-auto shrink-0 text-[11px] text-muted-foreground">
              {currentIndex + 1}/{notices.length}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
