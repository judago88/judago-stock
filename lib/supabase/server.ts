import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { getSupabaseAnonKey, getSupabaseUrl } from './env'

/**
 * 서버 컴포넌트·Server Action·Route Handler용.
 * 요청마다 새 인스턴스를 만듭니다(Fluid compute / 쿠키 동기화).
 */
export async function createClient() {
  const cookieStore = await cookies()

  return createServerClient(getSupabaseUrl(), getSupabaseAnonKey(), {
    cookies: {
      getAll() {
        return cookieStore.getAll()
      },
      setAll(cookiesToSet, _headers) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options),
          )
        } catch {
          // Server Component에서는 쿠키 쓰기가 막힐 수 있음. 루트 proxy에서 갱신합니다.
        }
      },
    },
  })
}
