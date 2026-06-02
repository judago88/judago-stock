import Link from "next/link";
import { ArrowLeft, Filter } from "lucide-react";
import { Footer } from "@/components/footer";

interface Props {
  title: string;
  children: React.ReactNode;
}

export default function LegalPageLayout({ title, children }: Props) {
  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-md">
        <div className="container mx-auto px-4 py-3">
          <Link
            href="/"
            className="inline-flex items-center gap-2 hover:text-red-400 transition-colors"
          >
            <Filter className="w-5 h-5 text-red-400" />
            <span className="font-bold">주다고 기준봉 센터</span>
          </Link>
        </div>
      </header>

      <main className="container mx-auto px-4 py-10">
        <div className="max-w-4xl mx-auto">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            홈으로 돌아가기
          </Link>

          <div className="text-center mb-10">
            <h1 className="text-3xl md:text-4xl font-bold">{title}</h1>
          </div>

          <div className="rounded-xl border border-border/50 bg-card/50 backdrop-blur p-6 md:p-10 text-muted-foreground">
            {children}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
