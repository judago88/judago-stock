"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AdminLayout } from "@/components/admin/admin-layout";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface StockPost {
  id: string;
  title: string;
  content: string;
  post_date: string;
  stock_count: number;
  summary: string | null;
  is_published: boolean;
  is_pinned: boolean;
  created_at: string;
  updated_at: string;
}

export default function AdminStockPostsPage() {
  const supabase = createClient();

  const [posts, setPosts] = useState<StockPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadPosts = async () => {
    try {
      setIsLoading(true);

      const { data, error } = await supabase
        .from("stock_posts")
        .select("*")
        .order("post_date", { ascending: false })
        .order("created_at", { ascending: false });

      if (error) throw error;

      setPosts((data ?? []) as StockPost[]);
    } catch (error) {
      console.error(error);
      alert("리포트 목록을 불러오지 못했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadPosts();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("정말 삭제하시겠습니까?")) return;

    try {
      const { error } = await supabase
        .from("stock_posts")
        .delete()
        .eq("id", id);

      if (error) throw error;

      alert("삭제되었습니다.");
      loadPosts();
    } catch (error) {
      console.error(error);
      alert("삭제 중 오류가 발생했습니다.");
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">기준봉 리포트 관리</h1>
            <p className="text-muted-foreground mt-2">
              메인 페이지에 노출되는 기준봉 리포트를 관리합니다.
            </p>
          </div>

          <Button className="bg-red-500 hover:bg-red-600 text-white" asChild>
            <Link href="/admin/stock-posts/new">새 리포트 등록</Link>
          </Button>
        </div>

        <Card className="border-border/50 bg-card/50">
          <CardContent className="p-6">
            {isLoading && (
              <p className="text-sm text-muted-foreground">불러오는 중...</p>
            )}

            {!isLoading && posts.length === 0 && (
              <p className="text-sm text-muted-foreground">
                등록된 리포트가 없습니다.
              </p>
            )}

            <div className="space-y-3">
              {posts.map((post) => (
                <div
                  key={post.id}
                  className="rounded-lg border border-border/50 p-4"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="flex flex-wrap items-center gap-2 mb-2">
                        <span className="text-xs text-muted-foreground">
                          {post.post_date}
                        </span>

                        <span className="text-xs text-red-400">
                          {post.stock_count}개
                        </span>

                        <span className="text-xs">
                          {post.is_published ? "공개" : "비공개"}
                        </span>

                        {post.is_pinned && (
                          <span className="text-xs text-yellow-400">
                            상단 고정
                          </span>
                        )}
                      </div>

                      <h3 className="font-semibold">{post.title}</h3>

                      {post.summary && (
                        <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                          {post.summary}
                        </p>
                      )}
                    </div>

                    <div className="flex shrink-0 gap-2">
                      <Button size="sm" variant="outline" asChild>
                        <Link href={`/admin/stock-posts/new?id=${post.id}`}>
                          수정
                        </Link>
                      </Button>

                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleDelete(post.id)}
                      >
                        삭제
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
