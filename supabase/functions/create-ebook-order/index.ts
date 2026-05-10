import { supabaseAdmin } from '../_shared/supabase-admin.ts'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers':
    'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

function createOrderId() {
  return `ebook_${Date.now()}_${crypto.randomUUID()}`
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', {
      headers: corsHeaders,
    })
  }
  
  try {
    const authHeader = req.headers.get('Authorization')

    if (!authHeader) {
      throw new Error('로그인이 필요합니다.')
    }

    const token = authHeader.replace('Bearer ', '')

    const {
      data: { user },
      error: userError,
    } = await supabaseAdmin.auth.getUser(token)

    if (userError || !user) {
      throw new Error('사용자 인증에 실패했습니다.')
    }

    const body = await req.json().catch(() => ({}))
    const ebookId = body.ebook_id

    if (!ebookId) {
      throw new Error('ebook_id가 없습니다.')
    }

    const { data: ebook, error: ebookError } = await supabaseAdmin
      .from('ebooks')
      .select('*')
      .eq('id', ebookId)
      .eq('is_active', true)
      .single()

    if (ebookError || !ebook) {
      throw new Error('판매 중인 전자책을 찾을 수 없습니다.')
    }

    const orderId = createOrderId()

    const { data: order, error: orderError } = await supabaseAdmin
      .from('ebook_orders')
      .insert({
        user_id: user.id,
        ebook_id: ebook.id,
        order_id: orderId,
        amount: ebook.price,
        status: 'ready',
      })
      .select()
      .single()

    if (orderError) {
      throw new Error(`주문 생성 실패: ${orderError.message}`)
    }

    await supabaseAdmin.from('payment_logs').insert({
      user_id: user.id,
      order_id: orderId,
      event_type: 'ebook_order_created',
      status: 'ready',
      amount: ebook.price,
      raw_payload: {
        ebook_id: ebook.id,
        ebook_title: ebook.title,
      },
    })

    return Response.json(
      {
        ok: true,
        order: {
          id: order.id,
          order_id: order.order_id,
          ebook_id: ebook.id,
          ebook_title: ebook.title,
          amount: ebook.price,
          status: order.status,
        },
      },
      {
        headers: corsHeaders,
      },
    )
  } catch (error) {
    return Response.json(
      {
        ok: false,
        message: error instanceof Error ? error.message : String(error),
      },
      { status: 400,
        headers: corsHeaders,
      },
    )
  }
})