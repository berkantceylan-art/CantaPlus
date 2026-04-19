"use server"

import { createClient } from "@/lib/supabase/server"

export async function getMarketplaceStats() {
  const supabase = await createClient()

  // Toplam ürün sayısı
  const { count: totalProducts } = await supabase
    .from("products")
    .select("*", { count: 'exact', head: true })

  // Eşleşen benzersiz ürün sayısı
  const { data: mappings } = await supabase
    .from("marketplace_mappings")
    .select("product_id")

  const matchedProductIds = new Set(mappings?.map(m => m.product_id))

  // Platform bazlı detaylar
  const { data: platformData } = await supabase
    .from("marketplace_mappings")
    .select("platform, sync_status")

  const stats = {
    totalProducts: totalProducts || 0,
    matchedProducts: matchedProductIds.size,
    platforms: [
      { id: "trendyol", count: platformData?.filter(p => p.platform === 'Trendyol').length || 0 },
      { id: "hepsiburada", count: platformData?.filter(p => p.platform === 'Hepsiburada').length || 0 },
      { id: "n11", count: platformData?.filter(p => p.platform === 'N11').length || 0 },
    ]
  }

  return stats
}

export async function syncMarketplace(platform: string) {
  // Simüle edilen gecikme
  await new Promise(resolve => setTimeout(resolve, 2000))
  
  // Burada gerçek bir API çağrısı yapılabilir
  // Örn: Trendyol API -> Stok Güncelle
  
  return { success: true, platform }
}
