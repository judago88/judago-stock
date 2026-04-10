'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  ArrowLeft,
  BookOpen,
  CheckCircle2,
  Star,
  TrendingUp,
  ShieldCheck,
  Clock,
  Users,
} from 'lucide-react'
import Link from 'next/link'

const ebookFeatures = [
  '기준봉 매매법의 핵심 원리와 실전 적용',
  '손절 및 익절 기준 설정 방법',
  '거래량과 캔들 패턴 분석 기법',
  '실제 매매 사례 30개 이상 수록',
  '초보자도 따라할 수 있는 단계별 가이드',
  '시장 상황별 대응 전략',
]

const testimonials = [
  {
    name: '김**',
    rating: 5,
    comment: '기준봉 매매법을 이해하고 나서 수익률이 확실히 달라졌습니다.',
  },
  {
    name: '이**',
    rating: 5,
    comment: '실전 사례가 많아서 바로 적용할 수 있었어요. 강력 추천합니다.',
  },
  {
    name: '박**',
    rating: 5,
    comment: '손절 기준이 명확해져서 손실을 줄일 수 있었습니다.',
  },
]

export default function EbookPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-md">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
              <ArrowLeft className="w-4 h-4" />
              <span className="text-sm">기준봉 센터로 돌아가기</span>
            </Link>
            <div className="flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-red-400" />
              <span className="font-bold hidden sm:inline">주다고 전자책</span>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 md:py-12">
        {/* Hero Section */}
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10 md:mb-14">
            <Badge variant="secondary" className="mb-4">
              베스트셀러
            </Badge>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 text-balance">
              기준봉 매매법
              <span className="text-red-400"> 완벽 가이드</span>
            </h1>
            <p className="text-muted-foreground text-lg md:text-xl max-w-2xl mx-auto text-pretty">
              수년간의 실전 경험을 담은 기준봉 매매 전략서. 
              초보자부터 중급자까지 체계적으로 학습할 수 있습니다.
            </p>
          </div>

          {/* Main Product Card */}
          <Card className="border-border/50 bg-card/50 backdrop-blur mb-8">
            <CardContent className="p-6 md:p-8">
              <div className="grid md:grid-cols-2 gap-8">
                {/* Book Preview */}
                <div className="flex items-center justify-center">
                  <div className="relative">
                    <div className="w-48 h-64 md:w-56 md:h-72 bg-gradient-to-br from-red-500/20 to-red-600/10 rounded-lg border border-border/50 flex items-center justify-center shadow-2xl">
                      <div className="text-center p-6">
                        <BookOpen className="w-12 h-12 text-red-400 mx-auto mb-3" />
                        <p className="font-bold text-lg">기준봉 매매법</p>
                        <p className="text-sm text-muted-foreground mt-1">완벽 가이드</p>
                      </div>
                    </div>
                    <div className="absolute -top-2 -right-2">
                      <Badge className="bg-red-500 text-white border-0">
                        PDF
                      </Badge>
                    </div>
                  </div>
                </div>

                {/* Product Info */}
                <div className="flex flex-col justify-center">
                  <div className="flex items-center gap-1 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                    ))}
                    <span className="text-sm text-muted-foreground ml-2">(127개 리뷰)</span>
                  </div>

                  <div className="mb-6">
                    <div className="flex items-baseline gap-2 mb-1">
                      <span className="text-3xl font-bold">39,000원</span>
                      <span className="text-lg text-muted-foreground line-through">59,000원</span>
                    </div>
                    <Badge variant="outline" className="text-red-400 border-red-400/50">
                      34% 할인
                    </Badge>
                  </div>

                  <div className="space-y-3 mb-6">
                    <div className="flex items-center gap-2 text-sm">
                      <Clock className="w-4 h-4 text-muted-foreground" />
                      <span>구매 즉시 다운로드 가능</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <ShieldCheck className="w-4 h-4 text-muted-foreground" />
                      <span>평생 소장 가능</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Users className="w-4 h-4 text-muted-foreground" />
                      <span>1,200+ 구매자</span>
                    </div>
                  </div>

                  <Button size="lg" className="w-full bg-red-500 hover:bg-red-600 text-white">
                    <TrendingUp className="w-5 h-5 mr-2" />
                    지금 구매하기
                  </Button>
                  <p className="text-xs text-muted-foreground text-center mt-3">
                    안전한 결제 시스템으로 진행됩니다
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Features Section */}
          <Card className="border-border/50 bg-card/50 backdrop-blur mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-green-400" />
                이 책에서 배우는 내용
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="grid sm:grid-cols-2 gap-3">
                {ebookFeatures.map((feature, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-400 mt-0.5 shrink-0" />
                    <span className="text-sm">{feature}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {/* Testimonials */}
          <Card className="border-border/50 bg-card/50 backdrop-blur mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Star className="w-5 h-5 text-yellow-400" />
                구매자 리뷰
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-4">
                {testimonials.map((review, index) => (
                  <div
                    key={index}
                    className="p-4 rounded-lg border border-border/50 bg-secondary/20"
                  >
                    <div className="flex items-center gap-1 mb-2">
                      {[...Array(review.rating)].map((_, i) => (
                        <Star key={i} className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">
                      &quot;{review.comment}&quot;
                    </p>
                    <p className="text-xs font-medium">{review.name}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* FAQ Section */}
          <Card className="border-border/50 bg-card/50 backdrop-blur">
            <CardHeader>
              <CardTitle>자주 묻는 질문</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-medium mb-1">결제 후 바로 받을 수 있나요?</h4>
                <p className="text-sm text-muted-foreground">
                  네, 결제 완료 즉시 PDF 파일을 다운로드할 수 있습니다.
                </p>
              </div>
              <div>
                <h4 className="font-medium mb-1">환불이 가능한가요?</h4>
                <p className="text-sm text-muted-foreground">
                  디지털 상품 특성상 다운로드 전까지 환불이 가능합니다.
                </p>
              </div>
              <div>
                <h4 className="font-medium mb-1">초보자도 이해할 수 있나요?</h4>
                <p className="text-sm text-muted-foreground">
                  네, 기초부터 차근차근 설명하여 초보자도 충분히 따라할 수 있습니다.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Bottom CTA */}
          <div className="mt-10 text-center">
            <Button size="lg" className="bg-red-500 hover:bg-red-600 text-white px-8">
              <TrendingUp className="w-5 h-5 mr-2" />
              지금 구매하기
            </Button>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border/50 mt-12 py-6">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>문의사항이 있으시면 Threads DM으로 연락해주세요.</p>
        </div>
      </footer>
    </div>
  )
}
