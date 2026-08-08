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

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', {
      headers: corsHeaders,
    })
  }

  if (req.method !== 'POST') {
    return Response.json(
      {
        ok: false,
        message: 'POST 요청만 허용됩니다.',
      },
      {
        status: 405,
        headers: corsHeaders,
      },
    )
  }

  try {
    const body = await req.json().catch(() => ({}))

    const ebookId =
      typeof body.ebook_id === 'string' ? body.ebook_id.trim() : ''

    const buyerName =
      typeof body.buyer_name === 'string' ? body.buyer_name.trim() : ''

    const buyerEmail =
      typeof body.buyer_email === 'string'
        ? body.buyer_email.trim().toLowerCase()
        : ''

    const buyerPhone =
      typeof body.buyer_phone === 'string' && body.buyer_phone.trim()
        ? body.buyer_phone.trim()
        : null

    const cashReceiptRequested =
      typeof body.cash_receipt_requested === 'boolean'
        ? body.cash_receipt_requested
        : false

    const orderMemo =
      typeof body.order_memo === 'string' && body.order_memo.trim()
        ? body.order_memo.trim()
        : null

    if (orderMemo && orderMemo.length > 500) {
      throw new Error('추가 요청사항은 500자 이하로 입력해주세요.')
    }

    if (!ebookId) {
      throw new Error('ebook_id가 없습니다.')
    }

    if (!buyerName) {
      throw new Error('이름을 입력해주세요.')
    }

    if (!buyerEmail) {
      throw new Error('이메일을 입력해주세요.')
    }

    if (!isValidEmail(buyerEmail)) {
      throw new Error('올바른 이메일 형식을 입력해주세요.')
    }

    if (!buyerPhone) {
      throw new Error('전화번호를 입력해주세요.')
    }

    const { data: ebook, error: ebookError } = await supabaseAdmin
      .from('ebooks')
      .select('id, title, price, file_path, is_active')
      .eq('id', ebookId)
      .eq('is_active', true)
      .single()

    if (ebookError || !ebook) {
      throw new Error('판매 중인 전자책을 찾을 수 없습니다.')
    }

    if (!ebook.file_path) {
      throw new Error('전자책 파일이 등록되어 있지 않습니다.')
    }

    const orderId = createOrderId()

    const { data: order, error: orderError } = await supabaseAdmin
      .from('ebook_orders')
      .insert({
        user_id: null,
        ebook_id: ebook.id,
        order_id: orderId,
        buyer_name: buyerName,
        buyer_email: buyerEmail,
        buyer_phone: buyerPhone,
        cash_receipt_requested: cashReceiptRequested,
        order_memo: orderMemo,
        amount: ebook.price,
        status: 'ready',
      })
      .select(
        `
        id,
        order_id,
        ebook_id,
        amount,
        status,
        buyer_name,
        buyer_email,
        buyer_phone,
        cash_receipt_requested,
        order_memo,
        created_at
      `,
      )
      .single()

    if (orderError || !order) {
      throw new Error(`주문 생성 실패: ${orderError?.message ?? 'unknown'}`)
    }

    await supabaseAdmin.from('payment_logs').insert({
      user_id: null,
      order_id: orderId,
      event_type: 'ebook_order_created',
      status: 'ready',
      amount: ebook.price,
      raw_payload: {
        ebook_id: ebook.id,
        ebook_title: ebook.title,
        buyer_name: buyerName,
        buyer_email: buyerEmail,
        buyer_phone: buyerPhone,
        cash_receipt_requested: cashReceiptRequested,
        order_memo: orderMemo,
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
          amount: order.amount,
          status: order.status,

          buyer_name: order.buyer_name,
          buyer_email: order.buyer_email,
          buyer_phone: order.buyer_phone,

          cash_receipt_requested: order.cash_receipt_requested,
          order_memo: order.order_memo,

          created_at: order.created_at,
        },
      },
      {
        headers: corsHeaders,
      },
    )
  } catch (error) {
    console.error('create-ebook-order error:', error)

    return Response.json(
      {
        ok: false,
        message: error instanceof Error ? error.message : String(error),
      },
      {
        status: 400,
        headers: corsHeaders,
      },
    )
  }
})