import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const CLOUD_SUPABASE_URL = Deno.env.get(
  'CLOUD_SUPABASE_URL',
)

const CLOUD_SUPABASE_SERVICE_ROLE_KEY = Deno.env.get(
  'CLOUD_SUPABASE_SERVICE_ROLE_KEY',
)

if (!CLOUD_SUPABASE_URL) {
  throw new Error('CLOUD_SUPABASE_URL is not defined')
}

if (!CLOUD_SUPABASE_SERVICE_ROLE_KEY) {
  throw new Error(
    'CLOUD_SUPABASE_SERVICE_ROLE_KEY is not defined',
  )
}

export const supabaseAdmin = createClient(
  CLOUD_SUPABASE_URL,
  CLOUD_SUPABASE_SERVICE_ROLE_KEY,
)