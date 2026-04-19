"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

/**
 * e-Logo (Logo İşbaşı) faturasını oluşturmak için Edge Function'ı tetikler.
 */
export async function createLogoInvoice(orderId: string) {
  const supabase = await createClient()

  try {
    // 1. Yetki kontrolü (Admin/Staff)
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error("Yetkisiz işlem.")

    // 2. Edge Function çağırma
    const { data, error } = await supabase.functions.invoke('logo-invoice', {
      body: { orderId }
    })

    if (error) throw new Error(`e-Logo Bridge Hatası: ${error.message}`)

    // 3. UI güncelleme
    revalidatePath(`/dashboard/siparisler/${orderId}`)
    revalidatePath('/dashboard')

    return { success: true, data }
  } catch (error: any) {
    console.error('[Invoice Action Error]:', error)
    return { success: false, error: error.message }
  }
}
