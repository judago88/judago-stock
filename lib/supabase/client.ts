'use client'

import { createBrowserClient } from '@supabase/ssr'
import { getSupabaseAnonKey, getSupabaseUrl } from './env'

/** 클라이언트 컴포넌트용(싱글톤 패턴은 @supabase/ssr 내부에서 처리). */
export function createClient() {
  return createBrowserClient(getSupabaseUrl(), getSupabaseAnonKey())
}
