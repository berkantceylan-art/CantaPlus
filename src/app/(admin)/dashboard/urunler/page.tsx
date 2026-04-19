import { createClient } from "@/lib/supabase/server"
import { Button, buttonVariants } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, Trash } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { deleteProduct } from "@/lib/actions/product"

export default async function AdminProductsPage() {
  const supabase = await createClient()
  
  // Ürünleri veritabanından çek (en yeniler üstte)
  const { data: products } = await supabase
    .from("products")
    .select("*")
    .order("created_at", { ascending: false })

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Ürün Yönetimi</h1>
          <p className="text-muted-foreground">Mağazanızdaki ürünleri görüntüleyin ve düzenleyin.</p>
        </div>
        <Link href="/dashboard/urunler/yeni" className={buttonVariants()}>
          <Plus className="mr-2 h-4 w-4" /> Yeni Ürün Ekle
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Tüm Ürünler ({products?.length || 0})</CardTitle>
          <CardDescription>Sistemde kayıtlı olan tüm çantalar.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="relative w-full overflow-auto">
            <table className="w-full caption-bottom text-sm">
              <thead className="[&_tr]:border-b bg-muted/50">
                <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                  <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Görsel</th>
                  <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Ürün Adı</th>
                  <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Fiyat</th>
                  <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Stok</th>
                  <th className="h-12 px-4 text-right align-middle font-medium text-muted-foreground">İşlemler</th>
                </tr>
              </thead>
              <tbody className="[&_tr:last-child]:border-0">
                {!products || products.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="p-4 text-center text-muted-foreground">Hiç ürün bulunamadı. Hemen yeni bir tane ekleyin!</td>
                  </tr>
                ) : (
                  products.map((product) => (
                    <tr key={product.id} className="border-b transition-colors hover:bg-muted/50">
                      <td className="p-4 align-middle">
                        <div className="relative h-12 w-12 rounded-md overflow-hidden bg-muted">
                          {product.images && product.images[0] && (
                            <Image src={product.images[0]} alt={product.name} fill className="object-cover" />
                          )}
                        </div>
                      </td>
                      <td className="p-4 align-middle font-medium">{product.name}</td>
                      <td className="p-4 align-middle">₺{Number(product.price).toLocaleString("tr-TR")}</td>
                      <td className="p-4 align-middle">
                        {product.stock > 0 ? (
                          <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold bg-green-500/10 text-green-500">
                            {product.stock}
                          </span>
                        ) : (
                          <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold bg-red-500/10 text-red-500">
                            Tükendi
                          </span>
                        )}
                      </td>
                      <td className="p-4 align-middle text-right">
                        <form action={async () => {
                          "use server"
                          await deleteProduct(product.id)
                        }}>
                          <Button size="icon" variant="ghost" className="text-destructive hover:text-destructive hover:bg-destructive/10">
                            <Trash className="h-4 w-4" />
                          </Button>
                        </form>
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
