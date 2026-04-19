import { ProductForm } from "@/components/admin/product-form"

export const dynamic = 'force-dynamic'

/**
 * Yeni Ürün Sayfası (V2 - Vercel Optimized)
 */
export default async function NewProductPage() {
  try {
    return <ProductForm />
  } catch (error: any) {
    return (
      <div className="p-20 bg-red-50 text-red-600 rounded-3xl border border-red-100">
        <h1 className="text-xl font-bold uppercase tracking-tighter">Sunucu Hatası (Vercel)</h1>
        <p className="text-sm mt-2 opacity-80 font-medium">{error?.message || "Bilinmeyen bir hata oluştu. Lütfen environment variables ayarlarını kontrol edin."}</p>
      </div>
    )
  }
}
