"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { getCurrentAdmin } from "@/lib/admin-auth";
import { AdminSidebar } from "@/components/admin/admin-sidebar";
import {
  BarChart3,
  FileText,
  Megaphone,
  ShoppingCart,
  BookOpen,
  ExternalLink,
  LogOut,
} from "lucide-react";

interface AdminLayoutProps {
  children: React.ReactNode;
}

const mobileMenus = [
  {
    href: "/admin",
    label: "대시보드",
    icon: BarChart3,
  },
  {
    href: "/admin/stock-posts",
    label: "리포트",
    icon: FileText,
  },
  {
    href: "/admin/notices",
    label: "공지",
    icon: Megaphone,
  },
  {
    href: "/admin/orders",
    label: "주문",
    icon: ShoppingCart,
  },
  {
    href: "/admin/ebook",
    label: "전자책",
    icon: BookOpen,
  },
];

export function AdminLayout({ children }: AdminLayoutProps) {
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(true);
  const [hasPermission, setHasPermission] = useState(false);

  useEffect(() => {
    const checkAdmin = async () => {
      const admin = await getCurrentAdmin();

      if (!admin) {
        setHasPermission(false);
        setIsChecking(false);
        return;
      }

      setHasPermission(true);
      setIsChecking(false);
    };

    checkAdmin();
  }, []);

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.replace("/admin/login");
  };

  if (isChecking) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <p className="text-sm text-muted-foreground">관리자 확인 중...</p>
      </main>
    );
  }

  if (!hasPermission) {
    return (
      <main className="min-h-screen flex items-center justify-center px-4">
        <div className="w-full max-w-md rounded-xl border border-border/50 bg-card/50 p-6 text-center space-y-4">
          <h1 className="text-2xl font-bold">관리자 권한이 없습니다.</h1>

          <p className="text-sm text-muted-foreground leading-6">
            현재 로그인한 계정은 관리자 계정으로 등록되어 있지 않습니다.
            <br />
            관리자 권한이 필요한 경우 운영자에게 문의해주세요.
          </p>

          <button
            type="button"
            onClick={handleLogout}
            className="w-full h-10 rounded-md bg-red-500 text-white hover:bg-red-600"
          >
            다른 계정으로 로그인
          </button>
        </div>
      </main>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <AdminSidebar onLogout={handleLogout} />

      <header className="lg:hidden sticky top-0 z-50 border-b border-border/50 bg-background/90 backdrop-blur">
        <div className="px-4 py-3 flex items-center justify-between">
          <Link href="/admin" className="font-bold">
            주다고 관리자
          </Link>

          <div className="flex items-center gap-3 text-muted-foreground">
            <Link href="/">
              <ExternalLink className="w-4 h-4" />
            </Link>

            <button type="button" onClick={handleLogout}>
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>

        <nav className="px-4 pb-3 flex gap-2 overflow-x-auto">
          {mobileMenus.map((menu) => {
            const Icon = menu.icon;

            return (
              <Link
                key={menu.href}
                href={menu.href}
                className="shrink-0 inline-flex items-center gap-1.5 rounded-full border border-border/50 px-3 py-1.5 text-xs text-muted-foreground"
              >
                <Icon className="w-3.5 h-3.5" />
                {menu.label}
              </Link>
            );
          })}
        </nav>
      </header>

      <main className="lg:ml-64 px-4 md:px-6 lg:px-8 py-8">{children}</main>
    </div>
  );
}
