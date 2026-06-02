import { createClient } from "@/lib/supabase/client";

export interface StockPost {
  id: string;
  title: string;
  content: string;
  post_date: string;
  stock_count: number;
  summary: string | null;
  is_published: boolean;
  is_pinned: boolean;
  created_by: string | null;
  created_at: string;
  updated_at: string;
}

export async function getLatestStockPost(): Promise<StockPost | null> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("stock_posts")
    .select("*")
    .eq("is_published", true)
    .order("is_pinned", { ascending: false })
    .order("post_date", { ascending: false })
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) {
    console.error("getLatestStockPost error:", error);
    throw error;
  }

  return data as StockPost | null;
}

export async function getRecentStockPosts(
  limit = 30
): Promise<StockPost[]> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("stock_posts")
    .select("*")
    .eq("is_published", true)
    .order("post_date", { ascending: false })
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) {
    console.error("getRecentStockPosts error:", error);
    throw error;
  }

  return (data ?? []) as StockPost[];
}

export function formatPostDate(date: string) {
  const value = new Date(date);

  if (Number.isNaN(value.getTime())) {
    return date;
  }

  return value.toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
    weekday: "short",
  });
}

export function formatShortPostDate(date: string) {
  const value = new Date(date);

  if (Number.isNaN(value.getTime())) {
    return date;
  }

  return value.toLocaleDateString("ko-KR", {
    month: "numeric",
    day: "numeric",
    weekday: "short",
  });
}
