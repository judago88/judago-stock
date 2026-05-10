import { getKisAccessToken } from '../_shared/kis-api.ts'
import { saveStockHistory } from '../_shared/stock-history.ts'

Deno.serve(async (req) => {
  try {
    const body = await req.json().catch(() => ({}))
    const stockCode = body.stock_code ?? '005930'

    const accessToken = await getKisAccessToken()
    const savedCount = await saveStockHistory(accessToken, stockCode)

    return Response.json({
      ok: true,
      stock_code: stockCode,
      saved_count: savedCount,
    })
  } catch (error) {
    return Response.json(
      {
        ok: false,
        message: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  }
})