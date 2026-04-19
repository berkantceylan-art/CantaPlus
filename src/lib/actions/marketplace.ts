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
  
  return { success: true, platform }
}

export async function getIntegrations() {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("integrations")
    .select("*")
  
  if (error) {
    console.error("[Get Integrations Error]:", error)
    return []
  }
  return data
}

export async function updateIntegration(formData: FormData) {
  const supabase = await createClient()
  
  const id = formData.get("id") as string
  const merchant_id = formData.get("merchant_id") as string
  const api_key = formData.get("api_key") as string
  const api_secret = formData.get("api_secret") as string
  
  const { error } = await supabase
    .from("integrations")
    .update({
      merchant_id,
      api_key,
      api_secret,
      updated_at: new Date().toISOString()
    })
    .eq("id", id)

  if (error) {
    console.error("[Update Integration Error]:", error)
    return { success: false, error: "Ayarlar kaydedilemedi." }
  }

  return { success: true }
}

export async function testConnection(platform: string) {
  // Gerçek API bağlantı testi simülasyonu
  await new Promise(resolve => setTimeout(resolve, 1500))
  
  // Burada platforma göre (Trendyol/HB) bir sağlık kontrolü (Health Check) çağrısı yapılabilir
  const isSuccess = Math.random() > 0.1 // %10 hata payı simülasyonu
  
  return { 
    success: isSuccess, 
    message: isSuccess ? "Bağlantı başarılı. Servisler aktif." : "Bağlantı hatası: API anahtarlarını kontrol edin." 
  }
}
