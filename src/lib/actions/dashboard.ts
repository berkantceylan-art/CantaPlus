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

export async function getRevenueChartData() {
  const supabase = await createClient()
  
  // Son 7 günü al
  const sevenDaysAgo = new Date()
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)
  
  const { data: orders } = await supabase
    .from("orders")
    .select("created_at, total_price, platform")
    .gte("created_at", sevenDaysAgo.toISOString())
    .eq("status", "delivered")

  // Gün bazlı gruplama
  const days = ["Paz", "Pzt", "Sal", "Çar", "Per", "Cum", "Cmt"]
  const chartData = days.map(day => ({
    name: day,
    site: 0,
    trendyol: 0,
    hepsiburada: 0,
    n11: 0
  }))

  orders?.forEach(order => {
    const date = new Date(order.created_at)
    const dayName = days[date.getDay()]
    const dataEntry = chartData.find(d => d.name === dayName)
    
    if (dataEntry) {
      const platformKey = order.platform.toLowerCase() === 'çantaplus' ? 'site' : order.platform.toLowerCase()
      if (platformKey in dataEntry) {
        (dataEntry as any)[platformKey] += Number(order.total_price)
      }
    }
  })

  return chartData
}
