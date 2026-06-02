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

    const paymentKey =
      typeof body.paymentKey === 'string' ? body.paymentKey.trim() : ''

    const orderId =
      typeof body.orderId === 'string' ? body.orderId.trim() : ''

    const amount = Number(body.amount)

    if (!paymentKey || !orderId || Number.isNaN(amount)) {
      throw new Error('필수 값이 누락되었습니다.')
    }

    const { data: order, error: orderError } = await supabaseAdmin
      .from('ebook_orders')
      .select('*')
      .eq('order_id', orderId)
      .single()

    if (orderError || !order) {
      throw new Error('주문 정보를 찾을 수 없습니다.')
    }

    if (order.status === 'paid') {
      return Response.json(
        {
          ok: true,
          already_paid: true,
          order: {
            order_id: order.order_id,
            status: order.status,
            amount: order.amount,
            buyer_name: order.buyer_name,
            buyer_email: order.buyer_email,
            buyer_phone: order.buyer_phone,
          },
        },
        {
          headers: corsHeaders,
        },
      )
    }

    if (order.status !== 'ready') {
      throw new Error('결제 대기 상태의 주문이 아닙니다.')
    }

    if (Number(order.amount) !== amount) {
      throw new Error('결제 금액이 일치하지 않습니다.')
    }

    const tossResponse = await fetch(
      'https://api.tosspayments.com/v1/payments/confirm',
      {
        method: 'POST',
        headers: {
          Authorization: 'Basic ' + btoa(`${tossSecretKey}:`),
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

    await supabaseAdmin.from('payment_logs').insert({
      user_id: null,
      order_id: orderId,
      event_type: 'payment_confirm_attempt',
      status: tossResponse.ok ? 'success' : 'failed',
      amount,
      raw_payload: {
        toss: tossResult,
        buyer_name: order.buyer_name,
        buyer_email: order.buyer_email,
        buyer_phone: order.buyer_phone,
      },
    })

    if (!tossResponse.ok) {
      const failedReason = tossResult.message ?? 'Toss 결제 승인 실패'

      await supabaseAdmin
        .from('ebook_orders')
        .update({
          status: 'failed',
          failed_reason: failedReason,
          updated_at: new Date().toISOString(),
        })
        .eq('id', order.id)

      throw new Error(failedReason)
    }

    const approvedAt = new Date().toISOString()

    const { error: updateError } = await supabaseAdmin
      .from('ebook_orders')
      .update({
        status: 'paid',
        approved_at: approvedAt,
        payment_key: paymentKey,
        failed_reason: null,
        updated_at: approvedAt,
      })
      .eq('id', order.id)

    if (updateError) {
      throw new Error('주문 상태 업데이트 실패')
    }

    return Response.json(
      {
        ok: true,
        payment: tossResult,
        order: {
          order_id: order.order_id,
          amount: order.amount,
          buyer_name: order.buyer_name,
          buyer_email: order.buyer_email,
          buyer_phone: order.buyer_phone,
          status: 'paid',
          approved_at: approvedAt,
        },
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
        message: error instanceof Error ? error.message : String(error),
      },
      {
        status: 400,
        headers: corsHeaders,
      },
    )
  }
})