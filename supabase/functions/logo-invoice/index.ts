import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

const LOGO_API_URL = "https://api.isbasi.com/v1" // Logo İşbaşı API URL (Placeholder)

serve(async (req) => {
  const { orderId } = await req.json()

  // 1. Supabase İstemcisi Başlat (Servis Rolü ile)
  const supabase = createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
  )

  try {
    // 2. Sipariş Verisini Çek
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .select('*, order_items(*, products(*))')
      .eq('id', orderId)
      .single()

    if (orderError || !order) throw new Error(`Sipariş bulunamadı: ${orderError?.message}`)

    // 3. Logo İşbaşı API İçin Veri Hazırla (Mapping)
    const invoicePayload = {
      description: `Omni-Nexus V3 Sipariş: ${order.id}`,
      type: order.tax_id?.length === 10 ? "E-INVOICE" : "E-ARCHIVE",
      customer: {
        name: order.customer_full_name,
        email: order.customer_email,
        phone: order.customer_phone,
        address: order.customer_address,
        taxNumber: order.tax_id,
        taxOffice: order.tax_office
      },
      items: order.order_items.map((item: any) => ({
        name: item.products.name,
        quantity: item.quantity,
        unitPrice: item.price,
        taxRate: 20 // Varsayılan KDV %20
      }))
    }

    // 4. Logo İşbaşı API Çağrısı (Placeholder Auth & Request)
    // Gerçek entegrasyonda burada 'Isbasi-Token' alınmalıdır.
    const response = await fetch(`${LOGO_API_URL}/Invoices`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${Deno.env.get('LOGO_ACCESS_TOKEN')}`
      },
      body: JSON.stringify(invoicePayload)
    })

    const result = await response.json()

    // 5. İşlem Kaydı (invoices tablosu)
    const { data: invoice, error: invoiceError } = await supabase
      .from('invoices')
      .insert({
        order_id: orderId,
        invoice_no: result.invoiceNumber || 'PENDING',
        uuid: result.uuid,
        status: response.ok ? 'signed' : 'error',
        error_message: response.ok ? null : result.message,
        pdf_url: result.pdfUrl
      })
      .select()
      .single()

    return new Response(JSON.stringify(invoice), {
      headers: { "Content-Type": "application/json" },
      status: 200,
    })

  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { "Content-Type": "application/json" },
      status: 400,
    })
  }
})
