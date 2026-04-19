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
  const imageFile = formData.get("image") as File | null
  
  if (!name || !priceStr || !stockStr) {
    return { error: "Lütfen zorunlu alanları (Ad, Fiyat, Stok) doldurun." }
  }

  // Generate a basic slug
  const slug = name.toLowerCase()
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
      }
    }
  }

  const { data: newProduct, error: dbError } = await supabase.from("products").insert({
    name,
    slug,
    description,
    price,
    stock,
    images: imageUrls
  }).select().single()

  if (dbError) {
    console.error("Veritabanı hatası:", dbError)
    return { error: "Ürün veritabanına eklenemedi." }
  }

  // Stok Logu Oluştur (V2 Corporate)
  await supabase.from("stock_logs").insert({
    product_id: newProduct.id,
    change_amount: stock,
    new_stock: stock,
    reason: "initial_load",
    platform: "ÇantaPlus"
  })

  if (dbError) {
    console.error("Veritabanı hatası:", dbError)
    return { error: "Ürün veritabanına eklenemedi." }
  }

  // Pazaryeri senkronizasyonunu tetikle
  try {
    await marketplaceSync.syncAll(newProduct)
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
