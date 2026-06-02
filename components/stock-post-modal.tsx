"use client";

import { StockPost, formatPostDate } from "@/lib/stock-posts";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";

interface StockPostModalProps {
  post: StockPost | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function StockPostModal({
  post,
  open,
  onOpenChange,
}: StockPostModalProps) {
  if (!post) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto border-border/50 bg-card">
        <DialogHeader>
          <div className="flex items-center gap-2 mb-3">
            <Badge variant="secondary">{formatPostDate(post.post_date)}</Badge>

            <Badge className="bg-red-500 text-white border-0">
              {post.stock_count}개 종목
            </Badge>
          </div>

          <DialogTitle className="text-2xl leading-8">{post.title}</DialogTitle>
        </DialogHeader>

        {post.summary && (
          <p className="text-sm text-muted-foreground leading-7 rounded-lg bg-secondary/30 p-4">
            {post.summary}
          </p>
        )}

        <div className="mt-4 whitespace-pre-wrap text-base leading-8 text-muted-foreground">
          {post.content}
        </div>

        <div className="mt-6 rounded-lg border border-border/50 p-4 text-xs leading-6 text-muted-foreground">
          본 콘텐츠는 투자 참고용 정보이며, 특정 종목의 매수·매도를 권유하지
          않습니다. 투자의 최종 판단과 책임은 이용자 본인에게 있습니다.
        </div>
      </DialogContent>
    </Dialog>
  );
}
