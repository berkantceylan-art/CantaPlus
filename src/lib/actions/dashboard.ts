"use server"

import { createClient } from "@/lib/supabase/server"

export async function getDashboardStats() {
  const supabase = await createClient()

  // 1. Toplam Gelir (Delivered siparişlerin toplamı)
  const { data: revenueData } = await supabase
    .from("orders")
    .select("total_price")
    .eq("status", "delivered")

  const totalRevenue = revenueData?.reduce((acc, curr) => acc + Number(curr.total_price), 0) || 0

  // 2. Aktif Siparişler (Pending veya Shipped olanlar)
  const { count: activeOrders } = await supabase
    .from("orders")
    .select("*", { count: 'exact', head: true })
    .in("status", ["pending", "shipped"])

  // 3. Kritik Stok (Stoku 10'dan az olan ürünler)
  const { count: lowStockCount } = await supabase
    .from("products")
    .select("*", { count: 'exact', head: true })
    .lt("stock", 10)

  // 4. Toplam Envanter
  const { data: stockData } = await supabase
    .from("products")
    .select("stock")
  
  const totalStock = stockData?.reduce((acc, curr) => acc + Number(curr.stock), 0) || 0

  return {
    totalRevenue,
    activeOrders: activeOrders || 0,
    lowStockCount: lowStockCount || 0,
    totalStock,
    lowStockPercentage: stockData?.length ? Math.round(((lowStockCount || 0) / stockData.length) * 100) : 0
  }
}
