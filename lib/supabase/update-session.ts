import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'
import { getSupabaseAnonKey, getSupabaseUrl, hasSupabaseEnvVars } from './env'

/**
 * Next.js 16 proxy에서 호출: 세션 쿠키 갱신 및 CDN 캐시 방지 헤더 반영.
 * 앱 전역 로그인 강제는 하지 않습니다(기존 공개 라우트 유지).
 */
export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request })

  if (!hasSupabaseEnvVars()) {
    return supabaseResponse
  }

  const supabase = createServerClient(getSupabaseUrl(), getSupabaseAnonKey(), {
    cookies: {
      getAll() {
        return request.cookies.getAll()
      },
      setAll(cookiesToSet, headers) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
        supabaseResponse = NextResponse.next({ request })
        cookiesToSet.forEach(({ name, value, options }) =>
          supabaseResponse.cookies.set(name, value, options),
        )
        Object.entries(headers).forEach(([key, value]) =>
          supabaseResponse.headers.set(key, value),
        )
      },
    },
  })

  // getSession()이 아닌 검증된 클레임 기준(공식 SSR 가이드)
  await supabase.auth.getClaims()

  return supabaseResponse
}
