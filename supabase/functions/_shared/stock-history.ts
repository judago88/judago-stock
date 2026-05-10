import { supabaseAdmin } from './supabase-admin.ts'

import {
  getDailyStockHistory,
} from './kis-api.ts'

export async function saveStockHistory(
  accessToken: string,
  stockCode: string,
) {
  const rows = await getDailyStockHistory(
    accessToken,
    stockCode,
  )

  const histories = rows.slice(0, 60).map((row: any) => ({
    stock_code: stockCode,

    price_date:
      `${row.stck_bsop_date.slice(0, 4)}-` +
      `${row.stck_bsop_date.slice(4, 6)}-` +
      `${row.stck_bsop_date.slice(6, 8)}`,

    open_price: Number(row.stck_oprc),
    high_price: Number(row.stck_hgpr),
    low_price: Number(row.stck_lwpr),
    close_price: Number(row.stck_clpr),

    volume: Number(row.acml_vol),

    trade_amount: row.acml_tr_pbmn
      ? Number(row.acml_tr_pbmn)
      : null,
  }))

  const { error } = await supabaseAdmin
    .from('stock_price_history')
    .upsert(histories, {
      onConflict: 'stock_code,price_date',
    })

  if (error) {
    throw new Error(
      `stock_price_history 저장 실패: ${error.message}`,
    )
  }

  return histories.length
}