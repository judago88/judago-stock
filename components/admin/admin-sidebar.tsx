"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BarChart3,
  FileText,
  Megaphone,
  ShoppingCart,
  BookOpen,
  ExternalLink,
  LogOut,
} from "lucide-react";

interface AdminSidebarProps {
  onLogout: () => void;
}

const menus = [
  {
    href: "/admin",
    label: "대시보드",
    icon: BarChart3,
  },
  {
    href: "/admin/stock-posts",
    label: "기준봉 리포트",
    icon: FileText,
  },
  {
    href: "/admin/notices",
    label: "공지사항",
    icon: Megaphone,
  },
  {
    href: "/admin/orders",
    label: "주문관리",
    icon: ShoppingCart,
  },
  {
    href: "/admin/ebook",
    label: "전자책관리",
    icon: BookOpen,
  },
];

export function AdminSidebar({ onLogout }: AdminSidebarProps) {
  const pathname = usePathname();

  return (
    <aside className="hidden lg:flex fixed left-0 top-0 z-40 h-screen w-64 flex-col border-r border-border/50 bg-background/95 backdrop-blur">
      <div className="px-6 py-5 border-b border-border/50">
        <Link href="/admin" className="block">
          <h1 className="font-bold text-lg">주다고 관리자</h1>
          <p className="text-xs text-muted-foreground mt-1">
            기준봉 센터 운영 관리
          </p>
        </Link>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1">
        {menus.map((menu) => {
          const Icon = menu.icon;
          const active =
            menu.href === "/admin"
              ? pathname === "/admin"
              : pathname.startsWith(menu.href);

          return (
            <Link
              key={menu.href}
              href={menu.href}
              className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors ${
                active
                  ? "bg-red-500/10 text-red-400"
                  : "text-muted-foreground hover:bg-accent/50 hover:text-foreground"
              }`}
            >
              <Icon className="w-4 h-4" />
              {menu.label}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-border/50 p-3 space-y-1">
        <Link
          href="/"
          className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-muted-foreground hover:bg-accent/50 hover:text-foreground"
        >
          <ExternalLink className="w-4 h-4" />
          사이트 보기
        </Link>

        <button
          type="button"
          onClick={onLogout}
          className="w-full flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-muted-foreground hover:bg-accent/50 hover:text-foreground"
        >
          <LogOut className="w-4 h-4" />
          로그아웃
        </button>
      </div>
    </aside>
  );
}
