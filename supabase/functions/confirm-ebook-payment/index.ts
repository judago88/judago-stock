import { supabaseAdmin } from '../_shared/supabase-admin.ts'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers':
    'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

const nicepayClientKey = Deno.env.get('NICEPAY_CLIENT_KEY')
const nicepaySecretKey = Deno.env.get('NICEPAY_SECRET_KEY')
const nicepayApiBaseUrl =
  Deno.env.get('NICEPAY_API_BASE_URL') ??
  'https://sandbox-api.nicepay.co.kr'

if (!nicepayClientKey || !nicepaySecretKey) {
  throw new Error('NICEPAY API keys are not configured.')
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

    const tid =
      typeof body.tid === 'string' ? body.tid.trim() : ''

    const orderId =
      typeof body.orderId === 'string' ? body.orderId.trim() : ''

    const amount = Number(body.amount)

    if (!tid || !orderId || !Number.isFinite(amount)) {
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

    const credentials = btoa(
      `${nicepayClientKey}:${nicepaySecretKey}`,
    )

    const nicepayResponse = await fetch(
      `${nicepayApiBaseUrl}/v1/payments/${encodeURIComponent(tid)}`,
      {
        method: 'POST',
        headers: {
          Authorization: `Basic ${credentials}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount,
        }),
      },
    )

    const nicepayResult = await nicepayResponse.json()

    const isApproved =
      nicepayResponse.ok &&
      nicepayResult.resultCode === '0000' &&
      nicepayResult.status === 'paid' &&
      nicepayResult.orderId === orderId &&
      Number(nicepayResult.amount) === amount

    await supabaseAdmin.from('payment_logs').insert({
      user_id: null,
      order_id: orderId,
      event_type: 'payment_confirm_attempt',
      status: isApproved ? 'success' : 'failed',
      amount,
      raw_payload: {
        provider: 'nicepay',
        nicepay: nicepayResult,
        buyer_name: order.buyer_name,
        buyer_email: order.buyer_email,
        buyer_phone: order.buyer_phone,
      },
    })

    if (!isApproved) {
      const failedReason =
        nicepayResult.resultMsg ??
        'NICEPAY 결제 승인에 실패했습니다.'

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

    const paidAt = new Date(nicepayResult.paidAt)
    const approvedAt = Number.isNaN(paidAt.getTime())
      ? new Date().toISOString()
      : paidAt.toISOString()

    const { error: updateError } = await supabaseAdmin
      .from('ebook_orders')
      .update({
        status: 'paid',
        approved_at: approvedAt,
        payment_key: tid,
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
        payment: nicepayResult,
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
        message:
          error instanceof Error ? error.message : String(error),
      },
      {
        status: 400,
        headers: corsHeaders,
      },
    )
  }
})