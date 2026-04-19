"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { marketplaceSync } from "@/lib/marketplace/sync-service"

export async function addProduct(formData: FormData) {
  const supabase = await createClient()
  
  const name = formData.get("name") as string
  const description = formData.get("description") as string
  const priceStr = formData.get("price") as string
  const stockStr = formData.get("stock") as string
  
  if (!name || !priceStr || !stockStr) {
    return { error: "Lütfen zorunlu alanları (Ad, Fiyat, Stok) doldurun." }
  }

  // Turkish character friendly slug generation
  const turkishMap: { [key: string]: string } = {
    'ç': 'c', 'ğ': 'g', 'ı': 'i', 'ö': 'o', 'ş': 's', 'ü': 'u',
    'Ç': 'c', 'Ğ': 'g', 'İ': 'i', 'Ö': 'o', 'Ş': 's', 'Ü': 'u'
  }
  
  let slug = name.split('').map(char => turkishMap[char] || char).join('')
    .toLowerCase()
    .replace(/ /g, "-")
    .replace(/[^a-z0-9-]/g, "") 
    + "-" + Math.floor(Math.random() * 1000)

  const price = parseFloat(priceStr)
  const stock = parseInt(stockStr, 10)
  
  const imageFiles = formData.getAll("images") as File[]
  const imageUrls: string[] = []

  for (const file of imageFiles) {
    if (file.size > 0) {
      const fileExt = file.name.split('.').pop()
      const fileName = `${slug}-${Math.random()}.${fileExt}`
      const filePath = `public/${fileName}`

      const { error: uploadError } = await supabase.storage
        .from('product-images')
        .upload(filePath, file)

      if (!uploadError) {
        const { data: publicUrlData } = supabase.storage
          .from('product-images')
          .getPublicUrl(filePath)
        imageUrls.push(publicUrlData.publicUrl)
      } else {
        console.error("Görsel yükleme hatası:", uploadError)
      }
    }
  }

  // 1. Ürünü ekle
  const { data: newProduct, error: dbError } = await supabase.from("products").insert({
    name,
    slug,
    description,
    price,
    stock,
    images: imageUrls
  }).select().single()

  if (dbError) {
    console.error("Ürün ekleme hatası detayları:", dbError)
    return { error: `Ürün veritabanına eklenemedi: ${dbError.message}` }
  }

  // 2. Stok Logu Oluştur (V2 Corporate)
  const { error: logError } = await supabase.from("stock_logs").insert({
    product_id: newProduct.id,
    change_amount: stock,
    new_stock: stock,
    reason: "initial_load",
    platform: "ÇantaPlus"
  })

  if (logError) {
    console.error("Stok logu oluşturma hatası:", logError)
    // Ürün eklendiği için devam ediyoruz ama log hatasını bildiriyoruz
  }

  // 3. Pazaryeri senkronizasyonunu tetikle
  try {
    if (newProduct) {
      await marketplaceSync.syncAll(newProduct)
    }
  } catch (err) {
    console.error("Pazaryeri senkronizasyon hatası (Hata göz ardı edildi):", err)
  }

  revalidatePath('/dashboard/urunler')
  revalidatePath('/koleksiyon')
  redirect('/dashboard/urunler')
}

export async function deleteProduct(id: string) {
  const supabase = await createClient()
  const { error } = await supabase.from("products").delete().eq("id", id)
  if (error) {
    return { error: "Silme işlemi başarısız oldu." }
  }
  revalidatePath('/dashboard/urunler')
  revalidatePath('/koleksiyon')
}
