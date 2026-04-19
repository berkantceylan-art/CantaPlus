import { createClient } from "@/lib/supabase/server"
import { Button, buttonVariants } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, Trash, ExternalLink, Package } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { deleteProduct } from "@/lib/actions/product"
import { PlatformStatus } from "@/components/marketplace/platform-status"

export default async function AdminProductsPage() {
  const supabase = await createClient()
  
  const { data: products } = await supabase
    .from("products")
    .select(`
      *,
      marketplace_mappings (
        platform,
        sync_status
      )
    `)
    .order("created_at", { ascending: false })

  return (
    <div className="space-y-6 animate-in fade-in duration-700">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-black tracking-tighter uppercase">Ürün <span className="text-zinc-400">Yönetimi</span></h1>
          <p className="text-sm font-medium text-muted-foreground uppercase tracking-widest">Katalog ve stok kontrol merkezi</p>
        </div>
        <Link href="/dashboard/urunler/yeni" className={buttonVariants({ className: "rounded-xl shadow-lg border-none" })}>
          <Plus className="mr-2 h-4 w-4" /> Yeni Ürün Ekle
        </Link>
      </div>

      <Card className="border-zinc-200 dark:border-zinc-800 rounded-3xl overflow-hidden shadow-sm">
        <CardHeader className="bg-zinc-50/50 dark:bg-zinc-900/50 border-b border-zinc-200 dark:border-zinc-800">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg font-bold">Tüm Ürünler ({products?.length || 0})</CardTitle>
              <CardDescription className="text-xs uppercase tracking-widest font-bold text-zinc-500">Sistemde ve pazaryerlerinde yayında olan envanter</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="relative w-full overflow-auto">
            <table className="w-full text-sm">
              <thead className="bg-zinc-50/30 dark:bg-zinc-900/30 border-b border-zinc-200 dark:border-zinc-800">
                <tr>
                  <th className="h-12 px-6 text-left align-middle font-bold text-zinc-500 uppercase text-[10px] tracking-widest">Ürün</th>
                  <th className="h-12 px-6 text-left align-middle font-bold text-zinc-500 uppercase text-[10px] tracking-widest">Platformlar</th>
                  <th className="h-12 px-6 text-left align-middle font-bold text-zinc-500 uppercase text-[10px] tracking-widest">Fiyat</th>
                  <th className="h-12 px-6 text-left align-middle font-bold text-zinc-500 uppercase text-[10px] tracking-widest">Stok</th>
                  <th className="h-12 px-6 text-right"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
                {!products || products.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="p-12 text-center text-zinc-500 font-medium">
                      <div className="flex flex-col items-center gap-2">
                        <Package className="h-8 w-8 opacity-20" />
                        <span>Henüz ürün bulunamadı.</span>
                      </div>
                    </td>
                  </tr>
                ) : (
                  products.map((product) => (
                    <tr key={product.id} className="hover:bg-zinc-50/50 dark:hover:bg-zinc-900/50 transition-colors group">
                      <td className="px-6 py-4 align-middle">
                        <div className="flex items-center gap-4">
                          <div className="relative h-14 w-14 rounded-2xl overflow-hidden bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
                            {product.images && product.images[0] ? (
                              <Image src={product.images[0]} alt={product.name} fill className="object-cover group-hover:scale-110 transition-transform duration-500" />
                            ) : (
                              <div className="flex items-center justify-center h-full">
                                <Package className="h-6 w-6 text-zinc-300" />
                              </div>
                            )}
                          </div>
                          <div>
                            <p className="font-bold text-zinc-900 dark:text-zinc-100">{product.name}</p>
                            <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-tighter">SKU: {product.id.slice(0, 8)}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 align-middle">
                        <div className="flex flex-wrap gap-1.5">
                          <PlatformStatus platform="Trendyol" status={product.marketplace_mappings?.some((m: any) => m.platform === 'Trendyol') ? 'active' : 'inactive'} />
                          <PlatformStatus platform="Hepsiburada" status={product.marketplace_mappings?.some((m: any) => m.platform === 'Hepsiburada') ? 'active' : 'inactive'} />
                        </div>
                      </td>
                      <td className="px-6 py-4 align-middle font-black tabular-nums tracking-tighter text-zinc-900 dark:text-zinc-100 italic">
                        ₺{Number(product.price).toLocaleString("tr-TR")}
                      </td>
                      <td className="px-6 py-4 align-middle">
                        {product.stock > 10 ? (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-green-500/5 text-green-600 rounded-full text-[10px] font-black border border-green-500/10 uppercase">
                            <div className="w-1 h-1 rounded-full bg-green-500" /> {product.stock} ADET
                          </span>
                        ) : product.stock > 0 ? (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-500/5 text-amber-600 rounded-full text-[10px] font-black border border-amber-500/10 uppercase animate-pulse">
                            <div className="w-1 h-1 rounded-full bg-amber-500" /> KRİTİK ({product.stock})
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-red-500/5 text-red-600 rounded-full text-[10px] font-black border border-red-500/10 uppercase">
                            TÜKENDİ
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 align-middle text-right">
                        <div className="flex items-center justify-end gap-2">
                           <Link href={`/urun/${product.slug}`} target="_blank" className={buttonVariants({ variant: "ghost", size: "icon", className: "rounded-xl" })}>
                            <ExternalLink className="h-4 w-4" />
                          </Link>
                          <form action={async () => {
                            "use server"
                            await deleteProduct(product.id)
                          }}>
                            <Button size="icon" variant="ghost" className="rounded-xl text-zinc-400 hover:text-red-500 hover:bg-red-500/10 transition-colors">
                              <Trash className="h-4 w-4" />
                            </Button>
                          </form>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
