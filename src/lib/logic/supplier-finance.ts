import { createClient } from "@/lib/supabase/server"
import { logSystemEvent } from "@/lib/utils/sys-logger"

export class SupplierFinance {
  /**
   * Tedarikçiye yapılan ödemeyi kaydet ve bakiyeyi güncelle.
   */
  static async recordPayment(supplierId: string, amount: number, description?: string) {
    const supabase = await createClient()

    try {
      // 1. İşlemi kaydet
      const { error: transError } = await supabase
        .from('supplier_transactions')
        .insert({
          supplier_id: supplierId,
          amount: amount,
          type: 'payment',
          description: description || 'Ödeme yapıldı'
        })

      if (transError) throw transError

      // 2. Tedarikçi bakiyesini güncelle (Bakiyeden düş)
      const { data: supplier } = await supabase
        .from('suppliers')
        .select('balance')
        .eq('id', supplierId)
        .single()

      const newBalance = (supplier?.balance || 0) - amount

      await supabase
        .from('suppliers')
        .update({ balance: newBalance })
        .eq('id', supplierId)

      await logSystemEvent({
        module: 'Finance',
        message: `Tedarikçi ödemesi kaydedildi: ${supplierId} (₺${amount})`,
        context: { supplierId, amount, newBalance }
      })

      return { success: true, newBalance }
    } catch (error: any) {
      await logSystemEvent({
        level: 'error',
        module: 'Finance',
        message: `Tedarikçi ödeme kayıt hatası: ${supplierId}`,
        stack_trace: error.stack
      })
      return { success: false, error: error.message }
    }
  }

  /**
   * Tedarikçiden alınan malı (borçlanmayı) kaydet.
   */
  static async recordPurchase(supplierId: string, amount: number, description?: string) {
    const supabase = await createClient()

    try {
      const { error: transError } = await supabase
        .from('supplier_transactions')
        .insert({
          supplier_id: supplierId,
          amount: amount,
          type: 'purchase',
          description: description || 'Mal alımı yapıldı'
        })

      if (transError) throw transError

      const { data: supplier } = await supabase
        .from('suppliers')
        .select('balance')
        .eq('id', supplierId)
        .single()

      const newBalance = (supplier?.balance || 0) + amount

      await supabase
        .from('suppliers')
        .update({ balance: newBalance })
        .eq('id', supplierId)

      return { success: true, newBalance }
    } catch (error: any) {
      return { success: false, error: error.message }
    }
  }
}
