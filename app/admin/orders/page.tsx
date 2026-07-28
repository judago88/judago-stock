"use client";

import { useCallback, useEffect, useState } from "react";
import { AdminLayout } from "@/components/admin/admin-layout";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface Ebook {
  id: string;
  title: string;
}

interface EbookOrder {
  id: string;
  order_id: string;
  ebook_id: string;
  user_id: string | null;
  amount: number;
  status: string;
  payment_key: string | null;
  buyer_name: string | null;
  buyer_email: string | null;
  buyer_phone: string | null;
  order_memo: string | null;
  download_used: boolean;
  downloaded_at: string | null;
  approved_at: string | null;
  failed_reason: string | null;
  created_at: string;
  updated_at: string;
  ebooks: Ebook | null;
}

type StatusFilter = "all" | "ready" | "paid" | "failed" | "canceled";

const PAGE_SIZE = 20;

const statusFilters: { label: string; value: StatusFilter }[] = [
  { label: "전체", value: "all" },
  { label: "결제대기", value: "ready" },
  { label: "결제완료", value: "paid" },
  { label: "결제실패", value: "failed" },
  { label: "결제취소", value: "canceled" },
];

function formatPrice(value: number | null | undefined) {
  if (value == null) return "-";
  return `${Number(value).toLocaleString()}원`;
}

function formatDateTime(value: string | null | undefined) {
  if (!value) return "-";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-";

  return date.toLocaleString("ko-KR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function getStatusLabel(status: string | null | undefined) {
  switch (status) {
    case "ready":
      return "결제대기";
    case "paid":
      return "결제완료";
    case "failed":
      return "결제실패";
    case "canceled":
      return "결제취소";
    default:
      return status ?? "-";
  }
}

function getStatusClass(status: string | null | undefined) {
  switch (status) {
    case "paid":
      return "text-green-400";
    case "ready":
      return "text-yellow-400";
    case "failed":
    case "canceled":
      return "text-red-400";
    default:
      return "text-muted-foreground";
  }
}

function escapeSearchKeyword(value: string) {
  return value.replace(/[%_]/g, "");
}

export default function AdminOrdersPage() {
  const supabase = createClient();

  const [orders, setOrders] = useState<EbookOrder[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<EbookOrder | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");

  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  const totalPages = Math.max(1, Math.ceil(totalCount / PAGE_SIZE));

  const loadOrders = useCallback(async () => {
    try {
      setIsLoading(true);

      const from = (page - 1) * PAGE_SIZE;
      const to = from + PAGE_SIZE - 1;
      const keyword = escapeSearchKeyword(search.trim());

      let query = supabase.from("ebook_orders").select(
        `
          *,
          ebooks (
            id,
            title
          )
        `,
        { count: "exact" }
      );

      if (statusFilter !== "all") {
        query = query.eq("status", statusFilter);
      }

      if (keyword) {
        query = query.or(
          [
            `order_id.ilike.%${keyword}%`,
            `buyer_name.ilike.%${keyword}%`,
            `buyer_email.ilike.%${keyword}%`,
            `buyer_phone.ilike.%${keyword}%`,
          ].join(",")
        );
      }

      const { data, error, count } = await query
        .order("created_at", { ascending: false })
        .range(from, to);

      if (error) throw error;

      setOrders((data ?? []) as EbookOrder[]);
      setTotalCount(count ?? 0);
    } catch (error) {
      console.error(error);
      alert("주문 목록을 불러오지 못했습니다.");
    } finally {
      setIsLoading(false);
    }
  }, [page, search, statusFilter, supabase]);

  useEffect(() => {
    loadOrders();
  }, [loadOrders]);

  const handleSearchChange = (value: string) => {
    setSearch(value);
    setPage(1);
  };

  const handleStatusFilterChange = (value: StatusFilter) => {
    setStatusFilter(value);
    setPage(1);
  };

  const handleOpenDetail = (order: EbookOrder) => {
    setSelectedOrder(order);
    setDetailOpen(true);
  };

  const pageNumbers = (() => {
    const pages: number[] = [];

    let start = Math.max(1, page - 2);
    let end = Math.min(totalPages, page + 2);

    if (end - start < 4) {
      if (start === 1) {
        end = Math.min(totalPages, start + 4);
      } else if (end === totalPages) {
        start = Math.max(1, end - 4);
      }
    }

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    return pages;
  })();

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">전자책 주문 관리</h1>
          <p className="text-muted-foreground mt-2">
            비회원 전자책 구매 내역과 다운로드 상태를 확인합니다.
          </p>
        </div>

        <Card className="border-border/50 bg-card/50">
          <CardContent className="p-5 space-y-4">
            <input
              type="text"
              placeholder="주문번호, 이름, 이메일, 전화번호 검색"
              value={search}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="w-full rounded-md border border-border/50 bg-background px-3 py-2 text-sm"
            />

            <div className="flex flex-wrap gap-2">
              {statusFilters.map((filter) => (
                <button
                  key={filter.value}
                  type="button"
                  onClick={() => handleStatusFilterChange(filter.value)}
                  className={`rounded-full border px-3 py-1.5 text-xs transition-colors ${
                    statusFilter === filter.value
                      ? "border-red-500 bg-red-500 text-white"
                      : "border-border/50 text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {filter.label}
                </button>
              ))}
            </div>

            <div className="text-sm text-muted-foreground">
              총 {totalCount.toLocaleString()}건
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/50 bg-card/50">
          <CardContent className="p-6">
            {isLoading && (
              <p className="text-sm text-muted-foreground">불러오는 중...</p>
            )}

            {!isLoading && orders.length === 0 && (
              <p className="text-sm text-muted-foreground">
                조회된 주문이 없습니다.
              </p>
            )}

            <div className="space-y-3">
              {orders.map((order) => (
                <div
                  key={order.id}
                  className="rounded-lg border border-border/50 p-4"
                >
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                    <div className="min-w-0">
                      <div className="mb-2 flex flex-wrap items-center gap-2">
                        <span className="text-xs text-muted-foreground">
                          {formatDateTime(order.created_at)}
                        </span>

                        <span
                          className={`text-xs ${getStatusClass(order.status)}`}
                        >
                          {getStatusLabel(order.status)}
                        </span>

                        <span
                          className={`text-xs ${
                            order.download_used
                              ? "text-green-400"
                              : "text-yellow-400"
                          }`}
                        >
                          {order.download_used ? "다운로드 완료" : "미다운로드"}
                        </span>
                      </div>

                      <h3 className="font-semibold truncate">
                        {order.ebooks?.title ?? "전자책"}
                      </h3>

                      <p className="text-sm text-muted-foreground mt-1 break-all">
                        주문번호:{" "}
                        {order.order_id.length > 28
                          ? `${order.order_id.slice(0, 28)}...`
                          : order.order_id}
                      </p>

                      <div className="mt-2 text-sm text-muted-foreground">
                        <p>
                          구매자: {order.buyer_name ?? "-"} /{" "}
                          {order.buyer_email ?? "-"}
                        </p>
                        <p>연락처: {order.buyer_phone ?? "-"}</p>

                        {order.order_memo && (
                          <p className="mt-1 line-clamp-1">
                            요청사항: {order.order_memo}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex shrink-0 flex-col gap-2 sm:flex-row sm:items-center">
                      <div className="text-sm text-right sm:min-w-24">
                        {formatPrice(order.amount)}
                      </div>

                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleOpenDetail(order)}
                      >
                        상세
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {!isLoading && totalCount > 0 && (
              <div className="mt-8 flex items-center justify-center gap-2 flex-wrap">
                <Button
                  size="sm"
                  variant="outline"
                  disabled={page === 1}
                  onClick={() => setPage(1)}
                >
                  {"<<"}
                </Button>

                <Button
                  size="sm"
                  variant="outline"
                  disabled={page === 1}
                  onClick={() => setPage(page - 1)}
                >
                  {"<"}
                </Button>

                {pageNumbers.map((pageNo) => (
                  <Button
                    key={pageNo}
                    size="sm"
                    variant={pageNo === page ? "default" : "outline"}
                    className={
                      pageNo === page
                        ? "bg-red-500 hover:bg-red-600 text-white"
                        : ""
                    }
                    onClick={() => setPage(pageNo)}
                  >
                    {pageNo}
                  </Button>
                ))}

                <Button
                  size="sm"
                  variant="outline"
                  disabled={page === totalPages}
                  onClick={() => setPage(page + 1)}
                >
                  {">"}
                </Button>

                <Button
                  size="sm"
                  variant="outline"
                  disabled={page === totalPages}
                  onClick={() => setPage(totalPages)}
                >
                  {">>"}
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        <Dialog open={detailOpen} onOpenChange={setDetailOpen}>
          <DialogContent className="max-w-3xl border-border/50 bg-card">
            <DialogHeader>
              <DialogTitle>주문 상세</DialogTitle>
            </DialogHeader>

            {selectedOrder && (
              <div className="space-y-5">
                <p className="text-sm text-muted-foreground break-all">
                  주문번호: {selectedOrder.order_id}
                </p>

                <div className="grid gap-4 text-sm md:grid-cols-2">
                  <div className="rounded-lg border border-border/50 p-4 space-y-2">
                    <h3 className="font-semibold mb-2">구매자 정보</h3>
                    <p>이름: {selectedOrder.buyer_name ?? "-"}</p>
                    <p>이메일: {selectedOrder.buyer_email ?? "-"}</p>
                    <p>전화번호: {selectedOrder.buyer_phone ?? "-"}</p>
                  </div>

                  <div className="rounded-lg border border-border/50 p-4 space-y-2">
                    <h3 className="font-semibold mb-2">결제 정보</h3>
                    <p>상품명: {selectedOrder.ebooks?.title ?? "전자책"}</p>
                    <p>금액: {formatPrice(selectedOrder.amount)}</p>
                    <p>
                      상태:{" "}
                      <span className={getStatusClass(selectedOrder.status)}>
                        {getStatusLabel(selectedOrder.status)}
                      </span>
                    </p>
                    <p>승인일시: {formatDateTime(selectedOrder.approved_at)}</p>
                  </div>

                  <div className="rounded-lg border border-border/50 p-4 space-y-2">
                    <h3 className="font-semibold mb-2">다운로드 정보</h3>
                    <p>
                      다운로드 여부:{" "}
                      {selectedOrder.download_used ? "완료" : "미다운로드"}
                    </p>
                    <p>
                      다운로드 일시:{" "}
                      {formatDateTime(selectedOrder.downloaded_at)}
                    </p>
                  </div>

                  <div className="rounded-lg border border-border/50 p-4 space-y-2">
                    <h3 className="font-semibold mb-2">기타</h3>
                    <p className="break-all">
                      payment_key: {selectedOrder.payment_key ?? "-"}
                    </p>
                    <p>실패 사유: {selectedOrder.failed_reason ?? "-"}</p>
                    <p>생성일시: {formatDateTime(selectedOrder.created_at)}</p>
                    <p>수정일시: {formatDateTime(selectedOrder.updated_at)}</p>
                  </div>

                  <div className="rounded-lg border border-border/50 p-4 space-y-2 md:col-span-2">
                    <h3 className="font-semibold mb-2">주문 메모</h3>

                    <div className="text-sm whitespace-pre-wrap">
                      {selectedOrder.order_memo ?? "없음"}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
}
