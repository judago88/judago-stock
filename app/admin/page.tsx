"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AdminLayout } from "@/components/admin/admin-layout";
import { createClient } from "@/lib/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  FileText,
  Megaphone,
  ShoppingCart,
  BookOpen,
  Plus,
  ArrowRight,
} from "lucide-react";

interface DashboardStats {
  totalPosts: number;
  publishedPosts: number;
  totalOrders: number;
  paidOrders: number;
  totalNotices: number;
  activeNotices: number;
}

interface RecentPost {
  id: string;
  title: string;
  post_date: string;
  stock_count: number;
  is_published: boolean;
}

interface RecentOrder {
  id: string;
  order_id: string;
  buyer_name: string | null;
  buyer_email: string | null;
  amount: number;
  status: string;
  created_at: string;
}

function formatPrice(value: number | null | undefined) {
  if (value == null) return "-";
  return `${Number(value).toLocaleString()}원`;
}

function formatDate(value: string | null | undefined) {
  if (!value) return "-";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "-";

  return date.toLocaleDateString("ko-KR", {
    month: "2-digit",
    day: "2-digit",
  });
}

export default function AdminPage() {
  const supabase = createClient();

  const [stats, setStats] = useState<DashboardStats>({
    totalPosts: 0,
    publishedPosts: 0,
    totalOrders: 0,
    paidOrders: 0,
    totalNotices: 0,
    activeNotices: 0,
  });

  const [recentPosts, setRecentPosts] = useState<RecentPost[]>([]);
  const [recentOrders, setRecentOrders] = useState<RecentOrder[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        setIsLoading(true);

        const [
          postsResult,
          publishedPostsResult,
          ordersResult,
          paidOrdersResult,
          noticesResult,
          activeNoticesResult,
          recentPostsResult,
          recentOrdersResult,
        ] = await Promise.all([
          supabase
            .from("stock_posts")
            .select("id", { count: "exact", head: true }),
          supabase
            .from("stock_posts")
            .select("id", { count: "exact", head: true })
            .eq("is_published", true),
          supabase
            .from("ebook_orders")
            .select("id", { count: "exact", head: true }),
          supabase
            .from("ebook_orders")
            .select("id", { count: "exact", head: true })
            .eq("status", "paid"),
          supabase.from("notices").select("id", { count: "exact", head: true }),
          supabase
            .from("notices")
            .select("id", { count: "exact", head: true })
            .eq("is_active", true),
          supabase
            .from("stock_posts")
            .select("id,title,post_date,stock_count,is_published")
            .order("post_date", { ascending: false })
            .order("created_at", { ascending: false })
            .limit(5),
          supabase
            .from("ebook_orders")
            .select(
              "id,order_id,buyer_name,buyer_email,amount,status,created_at"
            )
            .order("created_at", { ascending: false })
            .limit(5),
        ]);

        setStats({
          totalPosts: postsResult.count ?? 0,
          publishedPosts: publishedPostsResult.count ?? 0,
          totalOrders: ordersResult.count ?? 0,
          paidOrders: paidOrdersResult.count ?? 0,
          totalNotices: noticesResult.count ?? 0,
          activeNotices: activeNoticesResult.count ?? 0,
        });

        setRecentPosts((recentPostsResult.data ?? []) as RecentPost[]);
        setRecentOrders((recentOrdersResult.data ?? []) as RecentOrder[]);
      } catch (error) {
        console.error(error);
        alert("대시보드 정보를 불러오지 못했습니다.");
      } finally {
        setIsLoading(false);
      }
    };

    loadDashboard();
  }, []);

  return (
    <AdminLayout>
      <div className="space-y-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className="text-3xl font-bold">관리자 대시보드</h1>
            <p className="text-muted-foreground mt-2">
              기준봉 센터 운영 현황을 확인하고 주요 작업을 빠르게 실행합니다.
            </p>
          </div>

          <div className="flex gap-2">
            <Button className="bg-red-500 hover:bg-red-600 text-white" asChild>
              <Link href="/admin/stock-posts/new">
                <Plus className="w-4 h-4 mr-1.5" />새 리포트
              </Link>
            </Button>

            <Button variant="outline" asChild>
              <Link href="/admin/notices/new">
                <Plus className="w-4 h-4 mr-1.5" />새 공지
              </Link>
            </Button>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <StatCard
            title="전체 리포트"
            value={stats.totalPosts}
            subText={`공개 ${stats.publishedPosts}개`}
            icon={<FileText className="w-5 h-5 text-red-400" />}
          />

          <StatCard
            title="전체 주문"
            value={stats.totalOrders}
            subText={`결제완료 ${stats.paidOrders}건`}
            icon={<ShoppingCart className="w-5 h-5 text-red-400" />}
          />

          <StatCard
            title="공지사항"
            value={stats.totalNotices}
            subText={`활성 ${stats.activeNotices}개`}
            icon={<Megaphone className="w-5 h-5 text-red-400" />}
          />

          <StatCard
            title="전자책"
            value="관리"
            subText="상품/가격/파일 관리"
            icon={<BookOpen className="w-5 h-5 text-red-400" />}
          />
        </div>

        <div className="grid gap-6 xl:grid-cols-2">
          <Card className="border-border/50 bg-card/50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-xl font-bold">최근 리포트</h2>

                <Link
                  href="/admin/stock-posts"
                  className="text-sm text-muted-foreground hover:text-foreground inline-flex items-center gap-1"
                >
                  전체 보기
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>

              {isLoading && (
                <p className="text-sm text-muted-foreground">불러오는 중...</p>
              )}

              {!isLoading && recentPosts.length === 0 && (
                <p className="text-sm text-muted-foreground">
                  등록된 리포트가 없습니다.
                </p>
              )}

              <div className="space-y-3">
                {recentPosts.map((post) => (
                  <Link
                    key={post.id}
                    href={`/admin/stock-posts/new?id=${post.id}`}
                    className="block rounded-lg border border-border/50 p-4 hover:bg-accent/50 transition-colors"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div className="min-w-0">
                        <p className="text-xs text-muted-foreground mb-1">
                          {post.post_date} · {post.stock_count}개 종목
                        </p>
                        <h3 className="font-medium truncate">{post.title}</h3>
                      </div>

                      <span className="shrink-0 text-xs text-muted-foreground">
                        {post.is_published ? "공개" : "비공개"}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/50 bg-card/50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-xl font-bold">최근 주문</h2>

                <Link
                  href="/admin/orders"
                  className="text-sm text-muted-foreground hover:text-foreground inline-flex items-center gap-1"
                >
                  전체 보기
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>

              {isLoading && (
                <p className="text-sm text-muted-foreground">불러오는 중...</p>
              )}

              {!isLoading && recentOrders.length === 0 && (
                <p className="text-sm text-muted-foreground">
                  등록된 주문이 없습니다.
                </p>
              )}

              <div className="space-y-3">
                {recentOrders.map((order) => (
                  <div
                    key={order.id}
                    className="rounded-lg border border-border/50 p-4"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div className="min-w-0">
                        <p className="text-xs text-muted-foreground mb-1">
                          {formatDate(order.created_at)} · {order.status}
                        </p>
                        <h3 className="font-medium truncate">
                          {order.buyer_name ?? "이름 없음"}
                        </h3>
                        <p className="text-xs text-muted-foreground truncate">
                          {order.buyer_email ?? "-"}
                        </p>
                      </div>

                      <span className="shrink-0 text-sm">
                        {formatPrice(order.amount)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
}

function StatCard({
  title,
  value,
  subText,
  icon,
}: {
  title: string;
  value: string | number;
  subText: string;
  icon: React.ReactNode;
}) {
  return (
    <Card className="border-border/50 bg-card/50">
      <CardContent className="p-5">
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm text-muted-foreground">{title}</p>
          {icon}
        </div>

        <div className="text-3xl font-bold">{value}</div>
        <p className="text-xs text-muted-foreground mt-2">{subText}</p>
      </CardContent>
    </Card>
  );
}
