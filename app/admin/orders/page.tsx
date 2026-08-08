"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

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

  buyer_name: string | null;
  buyer_email: string | null;
  buyer_phone: string | null;

  cash_receipt_requested: boolean;
  cash_receipt_issued: boolean;
  cash_receipt_issued_at: string | null;

  order_memo: string | null;

  paid_at: string | null;
  delivered_at: string | null;
  refunded_at: string | null;

  cancelled_at: string | null;
  created_at: string;
  updated_at: string;

  /*
   * 기존 PG / 다운로드 주문 호환용
   * 신규 UI에서는 사용하지 않는다.
   */
  payment_key: string | null;
  approved_at: string | null;
  failed_reason: string | null;
  download_used: boolean;
  downloaded_at: string | null;

  ebooks: Ebook | null;
}

type StatusFilter =
  | "all"
  | "ready"
  | "paid"
  | "delivered"
  | "cancelled"
  | "refunded";

const PAGE_SIZE = 20;

const statusFilters: {
  label: string;
  value: StatusFilter;
}[] = [
  {
    label: "전체",
    value: "all",
  },
  {
    label: "입금대기",
    value: "ready",
  },
  {
    label: "입금확인",
    value: "paid",
  },
  {
    label: "발송완료",
    value: "delivered",
  },
  {
    label: "취소",
    value: "cancelled",
  },
  {
    label: "환불완료",
    value: "refunded",
  },
];

function formatPrice(value: number | null | undefined) {
  if (value == null) return "-";

  return `${Number(value).toLocaleString()}원`;
}

function formatDateTime(value: string | null | undefined) {
  if (!value) return "-";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "-";
  }

  return date.toLocaleString("ko-KR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function getPaymentDeadline(createdAt: string | null | undefined) {
  if (!createdAt) return "-";

  const date = new Date(createdAt);

  if (Number.isNaN(date.getTime())) {
    return "-";
  }

  date.setHours(date.getHours() + 24);

  return formatDateTime(date.toISOString());
}

function getStatusLabel(status: string | null | undefined) {
  switch (status) {
    case "ready":
      return "입금대기";

    case "paid":
      return "입금확인";

    case "delivered":
      return "발송완료";

    case "cancelled":
      return "취소";

    case "refunded":
      return "환불완료";

    /*
     * 기존 PG 주문 호환
     */
    case "canceled":
      return "취소 (기존 주문)";

    case "failed":
      return "결제실패 (기존 주문)";

    default:
      return status ?? "-";
  }
}

function getStatusClass(status: string | null | undefined) {
  switch (status) {
    case "delivered":
      return "text-green-400";

    case "paid":
      return "text-blue-400";

    case "ready":
      return "text-yellow-400";

    case "refunded":
      return "text-purple-400";

    case "cancelled":
    case "canceled":
    case "failed":
      return "text-red-400";

    default:
      return "text-muted-foreground";
  }
}

function escapeSearchKeyword(value: string) {
  return value.replace(/[%_]/g, "");
}

export default function AdminOrdersPage() {
  const supabase = useMemo(() => createClient(), []);

  const [orders, setOrders] = useState<EbookOrder[]>([]);

  const [isLoading, setIsLoading] = useState(true);

  const [selectedOrder, setSelectedOrder] = useState<EbookOrder | null>(null);

  const [detailOpen, setDetailOpen] = useState(false);

  const [search, setSearch] = useState("");

  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");

  const [page, setPage] = useState(1);

  const [totalCount, setTotalCount] = useState(0);

  const [processingOrderId, setProcessingOrderId] = useState<string | null>(
    null
  );

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
        {
          count: "exact",
        }
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
        .order("created_at", {
          ascending: false,
        })
        .range(from, to);

      if (error) {
        throw error;
      }

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

  const updateOrderStateLocally = (
    orderId: string,
    values: Partial<EbookOrder>
  ) => {
    setOrders((currentOrders) =>
      currentOrders.map((order) =>
        order.id === orderId
          ? {
              ...order,
              ...values,
            }
          : order
      )
    );

    setSelectedOrder((currentOrder) => {
      if (!currentOrder || currentOrder.id !== orderId) {
        return currentOrder;
      }

      return {
        ...currentOrder,
        ...values,
      };
    });
  };

  /*
   * 입금 확인
   * ready -> paid
   */
  const handleMarkPaid = async (order: EbookOrder) => {
    if (order.status !== "ready") {
      return;
    }

    const confirmed = window.confirm(
      [
        `${order.buyer_name ?? "구매자"}님의`,
        `${formatPrice(order.amount)} 입금을 확인하셨습니까?`,
        "",
        "입금 확인 후 주문 상태가 '입금확인'으로 변경됩니다.",
      ].join("\n")
    );

    if (!confirmed) {
      return;
    }

    try {
      setProcessingOrderId(order.id);

      const now = new Date().toISOString();

      const { error } = await supabase
        .from("ebook_orders")
        .update({
          status: "paid",
          paid_at: now,
          updated_at: now,
        })
        .eq("id", order.id)
        .eq("status", "ready");

      if (error) {
        throw error;
      }

      updateOrderStateLocally(order.id, {
        status: "paid",
        paid_at: now,
        updated_at: now,
      });

      alert("입금 확인 처리가 완료되었습니다.");
    } catch (error) {
      console.error(error);

      alert("입금 확인 처리 중 오류가 발생했습니다.");
    } finally {
      setProcessingOrderId(null);
    }
  };

  /*
   * 전자책 발송 완료
   * paid -> delivered
   */
  const handleMarkDelivered = async (order: EbookOrder) => {
    if (order.status !== "paid") {
      return;
    }

    const confirmed = window.confirm(
      [
        `${order.buyer_email ?? "구매자 이메일"}로`,
        "전자책 발송을 완료하셨습니까?",
        "",
        "확인 시 주문 상태가 '발송완료'로 변경됩니다.",
      ].join("\n")
    );

    if (!confirmed) {
      return;
    }

    try {
      setProcessingOrderId(order.id);

      const now = new Date().toISOString();

      const { error } = await supabase
        .from("ebook_orders")
        .update({
          status: "delivered",
          delivered_at: now,
          updated_at: now,
        })
        .eq("id", order.id)
        .eq("status", "paid");

      if (error) {
        throw error;
      }

      updateOrderStateLocally(order.id, {
        status: "delivered",
        delivered_at: now,
        updated_at: now,
      });

      alert("발송 완료 처리가 완료되었습니다.");
    } catch (error) {
      console.error(error);

      alert("발송 완료 처리 중 오류가 발생했습니다.");
    } finally {
      setProcessingOrderId(null);
    }
  };

  /*
   * 입금 전 주문 취소
   * ready -> cancelled
   */
  const handleCancelOrder = async (order: EbookOrder) => {
    if (order.status !== "ready") {
      return;
    }

    const confirmed = window.confirm(
      [
        "입금 전 주문을 취소하시겠습니까?",
        "",
        `주문번호: ${order.order_id}`,
        `구매자: ${order.buyer_name ?? "-"}`,
        `금액: ${formatPrice(order.amount)}`,
      ].join("\n")
    );

    if (!confirmed) {
      return;
    }

    try {
      setProcessingOrderId(order.id);

      const now = new Date().toISOString();

      const { error } = await supabase
        .from("ebook_orders")
        .update({
          status: "cancelled",
          cancelled_at: now,
          updated_at: now,
        })
        .eq("id", order.id)
        .eq("status", "ready");

      if (error) {
        throw error;
      }

      updateOrderStateLocally(order.id, {
        status: "cancelled",
        cancelled_at: now,
        updated_at: now,
      });

      alert("주문이 취소되었습니다.");
    } catch (error) {
      console.error(error);

      alert("주문 취소 처리 중 오류가 발생했습니다.");
    } finally {
      setProcessingOrderId(null);
    }
  };

  /*
   * 환불 완료
   * paid -> refunded
   */
  const handleMarkRefunded = async (order: EbookOrder) => {
    if (order.status !== "paid") {
      return;
    }

    const confirmed = window.confirm(
      [
        "실제 환불 송금을 완료하셨습니까?",
        "",
        `구매자: ${order.buyer_name ?? "-"}`,
        `주문금액: ${formatPrice(order.amount)}`,
        "",
        "확인 시 상태가 '환불완료'로 변경됩니다.",
      ].join("\n")
    );

    if (!confirmed) {
      return;
    }

    try {
      setProcessingOrderId(order.id);

      const now = new Date().toISOString();

      const { error } = await supabase
        .from("ebook_orders")
        .update({
          status: "refunded",
          refunded_at: now,
          updated_at: now,
        })
        .eq("id", order.id)
        .eq("status", "paid");

      if (error) {
        throw error;
      }

      updateOrderStateLocally(order.id, {
        status: "refunded",
        refunded_at: now,
        updated_at: now,
      });

      alert("환불 완료 처리가 완료되었습니다.");
    } catch (error) {
      console.error(error);

      alert("환불 완료 처리 중 오류가 발생했습니다.");
    } finally {
      setProcessingOrderId(null);
    }
  };

  /*
   * 현금영수증 발행 완료
   */
  const handleMarkCashReceiptIssued = async (order: EbookOrder) => {
    if (order.cash_receipt_issued) {
      return;
    }

    const receiptType = order.cash_receipt_requested
      ? "소득공제용 현금영수증"
      : "자진발급 현금영수증";

    const confirmed = window.confirm(
      [
        `${receiptType} 발급을 완료하셨습니까?`,
        "",
        `구매자: ${order.buyer_name ?? "-"}`,
        `전화번호: ${order.buyer_phone ?? "-"}`,
        "",
        "확인 시 현금영수증 상태가 '발행완료'로 변경됩니다.",
      ].join("\n")
    );

    if (!confirmed) {
      return;
    }

    try {
      setProcessingOrderId(order.id);

      const now = new Date().toISOString();

      const { error } = await supabase
        .from("ebook_orders")
        .update({
          cash_receipt_issued: true,
          cash_receipt_issued_at: now,
          updated_at: now,
        })
        .eq("id", order.id);

      if (error) {
        throw error;
      }

      updateOrderStateLocally(order.id, {
        cash_receipt_issued: true,
        cash_receipt_issued_at: now,
        updated_at: now,
      });

      alert("현금영수증 발행 완료 처리가 완료되었습니다.");
    } catch (error) {
      console.error(error);

      alert("현금영수증 발행 완료 처리 중 오류가 발생했습니다.");
    } finally {
      setProcessingOrderId(null);
    }
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
            무통장입금 주문의 입금 확인, 현금영수증 처리 및 전자책 발송 상태를
            관리합니다.
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
              {orders.map((order) => {
                const isProcessing = processingOrderId === order.id;

                return (
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
                            className={`text-xs font-medium ${getStatusClass(
                              order.status
                            )}`}
                          >
                            {getStatusLabel(order.status)}
                          </span>

                          <span
                            className={`text-xs ${
                              order.cash_receipt_issued
                                ? "text-green-400"
                                : "text-muted-foreground"
                            }`}
                          >
                            현금영수증:{" "}
                            {order.cash_receipt_issued
                              ? "발행완료"
                              : order.cash_receipt_requested
                              ? "신청 / 미발행"
                              : "자진발급 / 미발행"}
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
                          <p>구매자 / 입금자명: {order.buyer_name ?? "-"}</p>

                          <p>이메일: {order.buyer_email ?? "-"}</p>

                          <p>연락처: {order.buyer_phone ?? "-"}</p>

                          {order.order_memo && (
                            <p className="mt-1 line-clamp-1">
                              요청사항: {order.order_memo}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="flex shrink-0 flex-col gap-2 lg:items-end">
                        <div className="text-lg font-semibold">
                          {formatPrice(order.amount)}
                        </div>

                        <div className="flex flex-wrap gap-2 lg:justify-end">
                          {order.status === "ready" && (
                            <Button
                              size="sm"
                              disabled={isProcessing}
                              onClick={() => handleMarkPaid(order)}
                              className="bg-green-600 hover:bg-green-700 text-white"
                            >
                              입금 확인
                            </Button>
                          )}

                          {order.status === "paid" && (
                            <>
                              <Button
                                size="sm"
                                disabled={isProcessing}
                                onClick={() => handleMarkDelivered(order)}
                                className="bg-blue-600 hover:bg-blue-700 text-white"
                              >
                                발송 완료
                              </Button>

                              <Button
                                size="sm"
                                variant="destructive"
                                disabled={isProcessing}
                                onClick={() => handleMarkRefunded(order)}
                              >
                                환불 완료
                              </Button>
                            </>
                          )}

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
                  </div>
                );
              })}
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
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto border-border/50 bg-card">
            <DialogHeader>
              <DialogTitle>주문 상세</DialogTitle>
            </DialogHeader>

            {selectedOrder && (
              <div className="space-y-5">
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground break-all">
                    주문번호: {selectedOrder.order_id}
                  </p>

                  <p
                    className={`text-sm font-semibold ${getStatusClass(
                      selectedOrder.status
                    )}`}
                  >
                    {getStatusLabel(selectedOrder.status)}
                  </p>
                </div>

                <div className="grid gap-4 text-sm md:grid-cols-2">
                  <div className="rounded-lg border border-border/50 p-4 space-y-2">
                    <h3 className="font-semibold mb-2">구매자 정보</h3>

                    <p>이름 / 입금자명: {selectedOrder.buyer_name ?? "-"}</p>

                    <p className="break-all">
                      이메일: {selectedOrder.buyer_email ?? "-"}
                    </p>

                    <p>전화번호: {selectedOrder.buyer_phone ?? "-"}</p>
                  </div>

                  <div className="rounded-lg border border-border/50 p-4 space-y-2">
                    <h3 className="font-semibold mb-2">주문 정보</h3>

                    <p>상품명: {selectedOrder.ebooks?.title ?? "전자책"}</p>

                    <p>주문금액: {formatPrice(selectedOrder.amount)}</p>

                    <p>
                      상태:{" "}
                      <span className={getStatusClass(selectedOrder.status)}>
                        {getStatusLabel(selectedOrder.status)}
                      </span>
                    </p>

                    <p>주문일시: {formatDateTime(selectedOrder.created_at)}</p>

                    <p>
                      입금기한: {getPaymentDeadline(selectedOrder.created_at)}
                    </p>
                  </div>

                  <div className="rounded-lg border border-border/50 p-4 space-y-2 md:col-span-2">
                    <h3 className="font-semibold mb-2">현금영수증</h3>

                    <div className="grid gap-2 sm:grid-cols-2">
                      <p>
                        신청 여부:{" "}
                        {selectedOrder.cash_receipt_requested
                          ? "신청"
                          : "미신청"}
                      </p>

                      <p>
                        처리 방식:{" "}
                        {selectedOrder.cash_receipt_requested
                          ? "소득공제용"
                          : "자진발급"}
                      </p>

                      <p>
                        발행 상태:{" "}
                        {selectedOrder.cash_receipt_issued
                          ? "발행완료"
                          : "미발행"}
                      </p>

                      <p>
                        발행 완료일시:{" "}
                        {formatDateTime(selectedOrder.cash_receipt_issued_at)}
                      </p>

                      {selectedOrder.cash_receipt_requested && (
                        <p className="sm:col-span-2">
                          발급용 전화번호: {selectedOrder.buyer_phone ?? "-"}
                        </p>
                      )}
                    </div>

                    {!selectedOrder.cash_receipt_issued &&
                      (selectedOrder.status === "paid" ||
                        selectedOrder.status === "delivered") && (
                        <div className="pt-3">
                          <Button
                            size="sm"
                            variant="outline"
                            disabled={processingOrderId === selectedOrder.id}
                            onClick={() =>
                              handleMarkCashReceiptIssued(selectedOrder)
                            }
                          >
                            현금영수증 발행 완료
                          </Button>
                        </div>
                      )}
                  </div>

                  <div className="rounded-lg border border-border/50 p-4 space-y-2 md:col-span-2">
                    <h3 className="font-semibold mb-2">처리 현황</h3>

                    <div className="grid gap-2 sm:grid-cols-2">
                      <p>
                        입금 확인일시: {formatDateTime(selectedOrder.paid_at)}
                      </p>

                      <p>
                        발송 완료일시:{" "}
                        {formatDateTime(selectedOrder.delivered_at)}
                      </p>

                      <p>
                        환불 완료일시:{" "}
                        {formatDateTime(selectedOrder.refunded_at)}
                      </p>

                      <p>
                        취소일시: {formatDateTime(selectedOrder.cancelled_at)}
                      </p>

                      <p>
                        생성일시: {formatDateTime(selectedOrder.created_at)}
                      </p>

                      <p>
                        최종 수정일시:{" "}
                        {formatDateTime(selectedOrder.updated_at)}
                      </p>
                    </div>
                  </div>

                  <div className="rounded-lg border border-border/50 p-4 space-y-2 md:col-span-2">
                    <h3 className="font-semibold mb-2">추가 요청사항</h3>

                    <div className="text-sm whitespace-pre-wrap">
                      {selectedOrder.order_memo ?? "없음"}
                    </div>
                  </div>
                </div>

                <div className="border-t border-border/50 pt-5">
                  <h3 className="font-semibold mb-3">주문 처리</h3>

                  <div className="flex flex-wrap gap-2">
                    {selectedOrder.status === "ready" && (
                      <>
                        <Button
                          disabled={processingOrderId === selectedOrder.id}
                          onClick={() => handleMarkPaid(selectedOrder)}
                          className="bg-green-600 hover:bg-green-700 text-white"
                        >
                          입금 확인
                        </Button>

                        <Button
                          variant="destructive"
                          disabled={processingOrderId === selectedOrder.id}
                          onClick={() => handleCancelOrder(selectedOrder)}
                        >
                          주문 취소
                        </Button>
                      </>
                    )}

                    {selectedOrder.status === "paid" && (
                      <>
                        <Button
                          disabled={processingOrderId === selectedOrder.id}
                          onClick={() => handleMarkDelivered(selectedOrder)}
                          className="bg-blue-600 hover:bg-blue-700 text-white"
                        >
                          발송 완료
                        </Button>

                        <Button
                          variant="destructive"
                          disabled={processingOrderId === selectedOrder.id}
                          onClick={() => handleMarkRefunded(selectedOrder)}
                        >
                          환불 완료
                        </Button>
                      </>
                    )}
                  </div>

                  {selectedOrder.status === "ready" && (
                    <p className="mt-3 text-xs leading-5 text-muted-foreground">
                      실제 계좌 입금내역을 확인한 후 「입금 확인」을 눌러주세요.
                    </p>
                  )}

                  {selectedOrder.status === "paid" && (
                    <p className="mt-3 text-xs leading-5 text-muted-foreground">
                      구매자 이메일로 PDF 전자책을 직접 발송한 경우 「발송
                      완료」를, 실제 환불 송금을 완료한 경우 「환불 완료」를
                      눌러주세요.
                    </p>
                  )}
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
}
