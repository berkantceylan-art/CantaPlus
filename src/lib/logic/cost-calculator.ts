import { createClient } from "@/lib/supabase/server"
import { logSystemEvent } from "@/lib/utils/sys-logger"

/**
 * FIFO (First-In, First-Out) Maliyet Hesaplama Motoru
 */
export class CostCalculator {
  /**
   * Bir ürünün mevcut stok maliyetini FIFO yöntemine göre hesaplar
   */
  static async calculateCurrentValue(productId: string): Promise<number> {
    const supabase = await createClient()

    try {
      // 1. Ürünün satın alma (purchase) türündeki stok girişlerini çek
      const { data: entries, error } = await supabase
        .from('inventory_logs')
        .select('change_amount, meta_data, created_at')
        .eq('product_id', productId)
        .eq('type', 'purchase')
        .order('created_at', { ascending: true })

      if (error) throw error

      // 2. Mevcut stok miktarını al
      const { data: product } = await supabase
        .from('products')
        .select('stock')
        .eq('id', productId)
        .single()

      let remainingStock = product?.stock || 0
      let totalValue = 0

      // 3. FIFO Mantığı: Sondan geriye doğru (kalan stok kadar) maliyetleri topla
      // Gerçek bir FIFO için satılan miktarı da takip etmek gerekir, bu basitleştirilmiş bir modeldir.
      for (const entry of entries.reverse()) {
        const amount = entry.change_amount
        const unitCost = entry.meta_data?.unit_cost || 0

        if (remainingStock <= 0) break

        const taken = Math.min(amount, remainingStock)
        totalValue += taken * unitCost
        remainingStock -= taken
      }

      return totalValue
    } catch (error: any) {
      await logSystemEvent({
        level: 'error',
        module: 'Finance',
        message: `Maliyet hesaplama hatası: ${productId}`,
        stack_trace: error.stack
      })
      return 0
    }
  }
}
