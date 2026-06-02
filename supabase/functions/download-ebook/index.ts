import { supabaseAdmin } from '../_shared/supabase-admin.ts'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers':
    'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', {
      headers: corsHeaders,
    })
  }

  try {
    const body = await req.json()
    const orderId = body.order_id

    if (!orderId) {
      throw new Error('order_id가 없습니다.')
    }

    const { data: paidOrder, error: orderError } = await supabaseAdmin
      .from('ebook_orders')
      .select(
        `
        *,
        ebooks (
          id,
          title,
          file_path
        )
      `,
      )
      .eq('order_id', orderId)
      .eq('status', 'paid')
      .single()

    if (orderError || !paidOrder) {
      throw new Error('결제 완료된 주문이 없습니다.')
    }

    if (paidOrder.download_used === true) {
      throw new Error(
        '이미 다운로드가 완료된 주문입니다. 개정판 또는 재다운로드 문의는 문의하기를 이용해주세요.',
      )
    }

    const ebook = paidOrder.ebooks

    if (!ebook) {
      throw new Error('전자책 정보를 찾을 수 없습니다.')
    }

    if (!ebook.file_path) {
      throw new Error('전자책 파일이 등록되어 있지 않습니다.')
    }

    const { data: signedData, error: signedError } =
      await supabaseAdmin.storage
        .from('ebooks')
        .createSignedUrl(ebook.file_path, 60 * 5, {
          download: `${ebook.title}.pdf`,
        })

    if (signedError || !signedData) {
      throw new Error('다운로드 링크 생성 실패')
    }

    const downloadedAt = new Date().toISOString()

    const { error: updateError } = await supabaseAdmin
      .from('ebook_orders')
      .update({
        download_used: true,
        downloaded_at: downloadedAt,
      })
      .eq('id', paidOrder.id)

    if (updateError) {
      throw new Error('다운로드 상태 업데이트 실패')
    }

    await supabaseAdmin.from('ebook_download_logs').insert({
      user_id: null,
      ebook_id: ebook.id,
      order_id: paidOrder.order_id,
    })

    return Response.json(
      {
        ok: true,
        download_url: signedData.signedUrl,
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