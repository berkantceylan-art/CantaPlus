import { createClient } from "@/lib/supabase/server"
import { logSystemEvent } from "@/lib/utils/sys-logger"

export class InventoryAdjustment {
  /**
   * Fiziksel sayım ile sistem stoğu arasındaki farkı dengeler ve loglar.
   */
  static async adjustStock({
    productId,
    physicalCount,
    reason = 'Sayım Farkı'
  }: {
    productId: string,
    physicalCount: number,
    reason?: string
  }) {
    const supabase = await createClient()

    try {
      // 1. Mevcut stoğu al
      const { data: product, error: fetchError } = await supabase
        .from('products')
        .select('stock')
        .eq('id', productId)
        .single()

      if (fetchError) throw fetchError

      const difference = physicalCount - product.stock
      if (difference === 0) return { success: true, message: 'Denge sağlanmış.' }

      // 2. Stoğu güncelle ve logla
      const { error: updateError } = await supabase
        .from('products')
        .update({ stock: physicalCount })
        .eq('id', productId)

      if (updateError) throw updateError

      const { error: logError } = await supabase
        .from('inventory_logs')
        .insert({
          product_id: productId,
          change_amount: difference,
          new_stock: physicalCount,
          type: 'adjustment',
          reason: reason,
          meta_data: {
            previous_stock: product.stock,
            physical_count: physicalCount
          }
        })

      if (logError) throw logError

      await logSystemEvent({
        module: 'Inventory',
        message: `Stok ayarlandı: ${productId} (${difference > 0 ? '+' : ''}${difference})`,
        context: { productId, difference }
      })

      return { success: true, difference }
    } catch (error: any) {
      await logSystemEvent({
        level: 'error',
        module: 'Inventory',
        message: `Stok ayarlama hatası: ${productId}`,
        stack_trace: error.stack
      })
      return { success: false, error: error.message }
    }
  }
}
