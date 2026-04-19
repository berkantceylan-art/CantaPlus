import { createClient } from "@/lib/supabase/server"
import { logSystemEvent } from "@/lib/utils/sys-logger"

export class InvoicingService {
  /**
   * Mükellef sorgulama (VKN/TCKN üzerinden e-Fatura mükellefi mi kontrolü)
   */
  static async lookupTaxPayer(taxId: string): Promise<{ isEInvoice: boolean; alias?: string }> {
    try {
      // TODO: e-Logo 'CheckUserData' servisi çağrılacak
      // Mock logic: 11 haneli TCKN ise e-Arşiv, 10 haneli VKN ise e-Fatura kabul edelim (Test için)
      const isEInvoice = taxId.length === 10
      return { 
        isEInvoice, 
        alias: isEInvoice ? 'default_pk' : undefined 
      }
    } catch (error: any) {
      await logSystemEvent({
        level: 'error',
        module: 'e-Logo',
        message: `Mükellef sorgulama hatası: ${taxId}`,
        stack_trace: error.stack
      })
      throw error
    }
  }

  /**
   * Siparişten fatura taslağı oluşturma
   */
  static async createInvoiceDraft(orderId: string) {
    const supabase = await createClient()
    
    try {
      // 1. Sipariş verilerini çek
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .select('*, order_items(*, products(*))')
        .eq('id', orderId)
        .single()

      if (orderError || !order) throw new Error('Sipariş bulunamadı')

      // 2. Mükellef tipi kontrolü
      const { isEInvoice } = await this.lookupTaxPayer(order.tax_id || '')

      // 3. Taslak kaydı oluştur (Veritabanına)
      const { data: invoice, error: invError } = await supabase
        .from('invoices')
        .insert({
          order_id: orderId,
          status: 'draft',
          meta_data: {
            type: isEInvoice ? 'E-FATURA' : 'E-ARSIV',
            customer: order.customer_full_name,
          }
        })
        .select()
        .single()

      if (invError) throw invError

      await logSystemEvent({
        module: 'e-Logo',
        message: `Fatura taslağı oluşturuldu: Order #${orderId}`,
        context: { invoiceId: invoice.id }
      })

      return invoice
    } catch (error: any) {
      await logSystemEvent({
        level: 'error',
        module: 'e-Logo',
        message: `Fatura taslak oluşturma hatası: ${orderId}`,
        stack_trace: error.stack
      })
      return { error: error.message }
    }
  }

  /**
   * GİB'e gönderim (Submission)
   */
  static async submitToGib(invoiceId: string) {
    // Bu metod e-Logo Edge Function'ı tetikleyecek veya doğrudan API çağrısı yapacak
    // Şimdilik ana mantığı burada tutuyoruz.
    try {
      // TODO: Actual API call to e-Logo
      return { success: true, invoiceNo: `GIB2026${Math.floor(Math.random() * 1000000)}` }
    } catch (error: any) {
       await logSystemEvent({
        level: 'error',
        module: 'e-Logo',
        message: `GİB gönderim hatası: ${invoiceId}`,
        stack_trace: error.stack
      })
      return { success: false, error: error.message }
    }
  }
}
