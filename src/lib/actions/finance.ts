"use server"

import { createClient } from "@/lib/supabase/server"

export async function getFinanceStats() {
  const supabase = await createClient()

  // Son 30 günlük siparişleri ve kalemlerini getir
  const { data: orders, error } = await supabase
    .from("orders")
    .select(`
      id,
      total_price,
      order_items (
        price,
        quantity,
        commission_rate,
        shipping_cost
      )
    `)
    .neq("status", "cancelled")

  if (error) {
    console.error("[Finance Action Error]:", error)
    return {
      totalRevenue: 0,
      totalCommission: 0,
      totalShipping: 0,
      netProfit: 0,
      orderCount: 0
    }
  }

  let totalRevenue = 0
  let totalCommission = 0
  let totalShipping = 0

  orders?.forEach((order) => {
    totalRevenue += Number(order.total_price)
    
    order.order_items?.forEach((item: any) => {
      const itemPrice = Number(item.price) * (item.quantity || 1)
      const commission = itemPrice * (Number(item.commission_rate || 0) / 100)
      
      totalCommission += commission
      totalShipping += Number(item.shipping_cost || 0)
    })
  })

  const netProfit = totalRevenue - totalCommission - totalShipping

  return {
    totalRevenue,
    totalCommission,
    totalShipping,
    netProfit,
    orderCount: orders?.length || 0
  }
}

export async function getAIFinanceSummary() {
  const { netProfit, totalRevenue } = await getFinanceStats()
  
  // Basit bir AI özet mantığı (İleride gerçek bir LLM API'sine bağlanabilir)
  const margin = totalRevenue > 0 ? (netProfit / totalRevenue) * 100 : 0
  
  let summary = ""
  if (totalRevenue === 0) {
    summary = "Henüz satış verisi bulunmuyor. Pazaryeri entegrasyonlarını tamamlayarak ilk satışlarınızı takip etmeye başlayabilirsiniz."
  } else if (margin > 20) {
    summary = `Kâr marjınız %${margin.toFixed(1)} ile oldukça sağlıklı seviyede. Özellikle kendi sitenizden gelen satışlar kârlılığı artırıyor.`
  } else {
    summary = `Kâr marjınız %${margin.toFixed(1)} seviyesinde. Pazaryeri komisyonları ve kargo maliyetleri kârlılığı baskılıyor. Fiyat optimizasyonu önerilir.`
  }

  return {
    summary,
    margin
  }
}
