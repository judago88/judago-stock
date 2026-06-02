// app/page.tsx

"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Empty,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
  EmptyDescription,
} from "@/components/ui/empty";
import { NoticeBanner } from "@/components/notice-banner";
import { Footer } from "@/components/footer";
import { InvestmentDisclaimer } from "@/components/investment-disclaimer";
import { StockUsageGuide } from "@/components/usage-guide";
import { StockPostModal } from "@/components/stock-post-modal";
import { USMarketSignal } from "@/components/us-market-signal";
import {
  StockPost,
  getLatestStockPost,
  getRecentStockPosts,
  formatPostDate,
  formatShortPostDate,
} from "@/lib/stock-posts";
import { Notice, getPinnedNotices } from "@/lib/stock-data";
import {
  AlertCircle,
  CalendarDays,
  ExternalLink,
  FileText,
  Filter,
} from "lucide-react";

type DataState = "loading" | "success" | "empty" | "error";

export default function DashboardPage() {
  const [dataState, setDataState] = useState<DataState>("loading");
  const [notices, setNotices] = useState<Notice[]>([]);
  const [latestPost, setLatestPost] = useState<StockPost | null>(null);
  const [recentPosts, setRecentPosts] = useState<StockPost[]>([]);
  const [selectedPost, setSelectedPost] = useState<StockPost | null>(null);
  const [postModalOpen, setPostModalOpen] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      try {
        setDataState("loading");

        const [latestPostData, recentPostData, noticeData] = await Promise.all([
          getLatestStockPost(),
          getRecentStockPosts(30),
          getPinnedNotices(),
        ]);

        setLatestPost(latestPostData);
        setRecentPosts(recentPostData);
        setNotices(noticeData);

        setDataState(latestPostData ? "success" : "empty");
      } catch (error) {
        console.error(error);
        setLatestPost(null);
        setRecentPosts([]);
        setNotices([]);
        setDataState("error");
      }
    };

    loadData();
  }, []);

  const handlePostClick = (post: StockPost) => {
    setSelectedPost(post);
    setPostModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-md">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between gap-4">
            <Link
              href="/"
              className="flex items-center gap-2 hover:text-red-400 transition-colors"
            >
              <Filter className="w-5 h-5 text-red-400" />
              <span className="hidden sm:block text-lg font-bold">
                주다고 기준봉 센터
              </span>
              <span className="sm:hidden text-lg font-bold">기준봉 센터</span>
            </Link>

            <div className="hidden sm:flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                className="border-border/50"
                asChild
              >
                <a
                  href="https://www.threads.com/@jodago_"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <ExternalLink className="w-4 h-4 mr-1.5" />
                  Threads
                </a>
              </Button>

              <Button
                variant="outline"
                size="sm"
                className="border-border/50"
                asChild
              >
                <a href="mailto:jundd1@gmail.com?subject=주다고 문의">
                  <ExternalLink className="w-4 h-4 mr-1.5" />
                  문의하기
                </a>
              </Button>

              <Button
                size="sm"
                className="bg-red-500 hover:bg-red-600 text-white border-0"
                asChild
              >
                <Link href="/ebook">
                  <ExternalLink className="w-4 h-4 mr-1.5" />
                  전자책 구매
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </header>

      <NoticeBanner notices={notices} />

      <div className="border-b border-border/50 bg-secondary/20">
        <div className="container mx-auto px-4 py-2">
          <p className="text-xs text-muted-foreground text-center">
            본 콘텐츠는 투자 참고용 정보이며, 특정 종목의 매수·매도를 권유하지
            않습니다.
          </p>
        </div>
      </div>

      <main className="container mx-auto px-4 py-6">
        <div className="sm:hidden flex gap-2 mb-4">
          <Button
            variant="outline"
            size="sm"
            className="flex-1 border-border/50"
            asChild
          >
            <a
              href="https://www.threads.com/@jodago_"
              target="_blank"
              rel="noopener noreferrer"
            >
              <ExternalLink className="w-4 h-4 mr-1.5" />
              Threads
            </a>
          </Button>

          <Button
            variant="outline"
            size="sm"
            className="border-border/50"
            asChild
          >
            <a href="mailto:jundd1@gmail.com?subject=주다고 문의">
              <ExternalLink className="w-4 h-4 mr-1.5" />
              문의하기
            </a>
          </Button>

          <Button
            size="sm"
            className="bg-red-500 hover:bg-red-600 text-white border-0"
            asChild
          >
            <Link href="/ebook">
              <ExternalLink className="w-4 h-4 mr-1.5" />
              전자책
            </Link>
          </Button>
        </div>

        {dataState === "loading" && <LoadingState />}
        {dataState === "empty" && <EmptyState />}
        {dataState === "error" && <ErrorState />}

        {dataState === "success" && latestPost && (
          <div className="space-y-6">
            <section>
              <Card className="border-border/50 bg-card/50 backdrop-blur overflow-hidden">
                <CardContent className="p-6 md:p-8">
                  <div className="flex flex-wrap items-center gap-2 mb-4">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-secondary px-3 py-1 text-xs text-muted-foreground">
                      <CalendarDays className="w-3.5 h-3.5" />
                      {formatPostDate(latestPost.post_date)}
                    </span>

                    <span className="rounded-full bg-red-500 px-3 py-1 text-xs text-white">
                      {latestPost.stock_count}개 종목
                    </span>
                  </div>

                  <h1 className="text-2xl md:text-3xl font-bold leading-tight mb-4">
                    {latestPost.title}
                  </h1>

                  {latestPost.summary && (
                    <p className="text-base leading-7 text-muted-foreground bg-secondary/30 rounded-lg p-4 mb-5">
                      {latestPost.summary}
                    </p>
                  )}

                  <div className="whitespace-pre-wrap text-base leading-8 text-muted-foreground">
                    {latestPost.content}
                  </div>

                  <div className="mt-6 rounded-lg border border-border/50 p-4 text-xs leading-6 text-muted-foreground">
                    본 콘텐츠는 투자 참고용 정보이며, 특정 종목의 매수·매도를
                    권유하지 않습니다. 투자의 최종 판단과 책임은 이용자 본인에게
                    있습니다.
                  </div>
                </CardContent>
              </Card>
            </section>

            <div className="grid lg:grid-cols-12 gap-6">
              <section className="order-1 lg:col-span-7">
                <Card className="border-border/50 bg-card/50 backdrop-blur">
                  <CardContent className="p-5">
                    <div className="flex items-center gap-2 mb-4">
                      <FileText className="w-4 h-4 text-red-400" />
                      <h2 className="font-semibold">최근 30일 기준봉 리포트</h2>
                    </div>

                    <div className="space-y-2 max-h-[520px] overflow-y-auto pr-1">
                      {recentPosts.map((post) => (
                        <button
                          key={post.id}
                          type="button"
                          onClick={() => handlePostClick(post)}
                          className="w-full text-left rounded-lg border border-border/40 bg-background/40 px-4 py-3 hover:bg-accent/50 transition-colors"
                        >
                          <div className="flex items-center justify-between gap-3">
                            <div className="min-w-0">
                              <p className="text-xs text-muted-foreground mb-1">
                                {formatShortPostDate(post.post_date)}
                              </p>
                              <p className="font-medium truncate">
                                {post.title}
                              </p>
                            </div>

                            <span className="shrink-0 text-xs text-red-400">
                              {post.stock_count}개
                            </span>
                          </div>
                        </button>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </section>

              <aside className="order-2 lg:col-span-5 space-y-6">
                <USMarketSignal />
                {/* <StockUsageGuide /> */}
              </aside>
            </div>
          </div>
        )}
      </main>

      <StockPostModal
        post={selectedPost}
        open={postModalOpen}
        onOpenChange={setPostModalOpen}
      />

      <InvestmentDisclaimer />
      <Footer />
    </div>
  );
}

function LoadingState() {
  return (
    <Card className="border-border/50 bg-card/50 backdrop-blur">
      <CardContent className="p-8">
        <div className="space-y-4 animate-pulse">
          <div className="h-5 w-40 bg-accent rounded" />
          <div className="h-8 w-2/3 bg-accent rounded" />
          <div className="h-4 w-full bg-accent rounded" />
          <div className="h-4 w-5/6 bg-accent rounded" />
          <div className="h-4 w-4/6 bg-accent rounded" />
        </div>
      </CardContent>
    </Card>
  );
}

function EmptyState() {
  return (
    <Empty className="py-16">
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <FileText className="w-6 h-6" />
        </EmptyMedia>
        <EmptyTitle>등록된 기준봉 리포트가 없습니다</EmptyTitle>
        <EmptyDescription>
          관리자가 게시글을 등록하면 이곳에 표시됩니다.
        </EmptyDescription>
      </EmptyHeader>
    </Empty>
  );
}

function ErrorState() {
  return (
    <Empty className="py-16">
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <AlertCircle className="w-6 h-6 text-destructive" />
        </EmptyMedia>
        <EmptyTitle>데이터 로드 실패</EmptyTitle>
        <EmptyDescription>잠시 후 다시 시도해주세요.</EmptyDescription>
      </EmptyHeader>
    </Empty>
  );
}
