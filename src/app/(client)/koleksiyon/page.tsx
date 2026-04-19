import { createClient } from "@/lib/supabase/server"
import { Card, CardContent } from "@/components/ui/card"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ShoppingBag } from "lucide-react"

export default async function CollectionPage() {
  const supabase = await createClient()

  // Sadece stoğu olan ürünleri listele
  const { data: products } = await supabase
    .from("products")
    .select("*")
    .gt("stock", 0)
    .order("created_at", { ascending: false })

  return (
    <div className="container mx-auto py-12 px-4">
      <div className="flex flex-col items-center text-center mb-12">
        <h1 className="text-4xl font-bold tracking-tight mb-4">Özel Koleksiyon</h1>
        <p className="text-muted-foreground max-w-2xl">
          Tarzınızı yansıtacak, ustalıkla tasarlanmış premium çantalar. Hemen keşfedin.
        </p>
      </div>

      {!products || products.length === 0 ? (
        <div className="py-24 text-center">
          <div className="inline-flex h-20 w-20 items-center justify-center rounded-full bg-muted mb-6">
            <ShoppingBag className="h-10 w-10 text-muted-foreground" />
          </div>
          <h2 className="text-2xl font-semibold mb-2">Henüz Ürün Bulunmuyor</h2>
          <p className="text-muted-foreground">Şu anda satışta olan bir çanta modeli yok. Lütfen daha sonra tekrar uğrayın.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <Link key={product.id} href={`/urun/${product.slug}`} className="group relative focus-within:ring-2 focus-within:ring-primary focus-within:ring-offset-2 rounded-xl">
              <Card className="overflow-hidden border-transparent bg-transparent shadow-none hover:bg-muted/50 transition-colors">
                <CardContent className="p-0">
                  <div className="relative aspect-[4/5] w-full overflow-hidden rounded-xl bg-muted">
                    {product.images && product.images.length > 0 ? (
                      <Image
                        src={product.images[0]}
                        alt={product.name}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex absolute inset-0 items-center justify-center">
                        <ShoppingBag className="h-8 w-8 text-muted-foreground opacity-50" />
                      </div>
                    )}
                    {/* Hızlı Ekle Butonu - Opsiyonel (Gelecekte sepete ekle eklenebilir) */}
                    <div className="absolute bottom-4 left-0 right-0 flex justify-center opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                      <Button variant="secondary" className="w-10/12 rounded-full shadow-lg pointer-events-none">
                        İncele
                      </Button>
                    </div>
                  </div>
                  <div className="mt-4 space-y-1 p-2">
                    <h3 className="font-semibold text-base leading-tight group-hover:underline underline-offset-4">
                      {product.name}
                    </h3>
                    <p className="font-medium text-muted-foreground">
                      ₺{Number(product.price).toLocaleString("tr-TR")}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
