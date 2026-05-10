import { supabaseAdmin } from '../_shared/supabase-admin.ts'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers':
    'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

const tossSecretKey = Deno.env.get('TOSS_SECRET_KEY')

if (!tossSecretKey) {
  throw new Error('TOSS_SECRET_KEY is not configured.')
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
      throw new Error('사용자 인증 실패')
    }

    const body = await req.json()

    const paymentKey = body.paymentKey
    const orderId = body.orderId
    const amount = body.amount

    if (!paymentKey || !orderId || !amount) {
      throw new Error('필수 값이 누락되었습니다.')
    }

    // 주문 조회
    const { data: order, error: orderError } = await supabaseAdmin
      .from('ebook_orders')
      .select('*')
      .eq('order_id', orderId)
      .eq('user_id', user.id)
      .single()

    if (orderError || !order) {
      throw new Error('주문 정보를 찾을 수 없습니다.')
    }

    if (order.status === 'paid') {
      return Response.json(
        {
          ok: true,
          already_paid: true,
        },
        {
          headers: corsHeaders,
        },
      )
    }

    if (Number(order.amount) !== Number(amount)) {
      throw new Error('결제 금액이 일치하지 않습니다.')
    }

    // Toss 승인 요청
    const tossResponse = await fetch(
      'https://api.tosspayments.com/v1/payments/confirm',
      {
        method: 'POST',
        headers: {
          Authorization:
            'Basic ' + btoa(`${tossSecretKey}:`),
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          paymentKey,
          orderId,
          amount,
        }),
      },
    )

    const tossResult = await tossResponse.json()

    // 로그 저장
    await supabaseAdmin.from('payment_logs').insert({
      user_id: user.id,
      order_id: orderId,
      event_type: 'payment_confirm_attempt',
      status: tossResponse.ok ? 'success' : 'failed',
      amount,
      raw_payload: tossResult,
    })

    if (!tossResponse.ok) {
      throw new Error(
        tossResult.message ?? 'Toss 결제 승인 실패',
      )
    }

    // paid 처리
    const { error: updateError } = await supabaseAdmin
      .from('ebook_orders')
      .update({
        status: 'paid',
        approved_at: new Date().toISOString(),
        payment_key: paymentKey,
      })
      .eq('id', order.id)

    if (updateError) {
      throw new Error('주문 상태 업데이트 실패')
    }

    return Response.json(
      {
        ok: true,
        payment: tossResult,
      },
      {
        headers: corsHeaders,
      },
    )
  } catch (error) {
    console.error(error)

    return Response.json(
      {
        ok: false,
        message:
          error instanceof Error
            ? error.message
            : String(error),
      },
      {
        status: 400,
        headers: corsHeaders,
      },
    )
  }
})