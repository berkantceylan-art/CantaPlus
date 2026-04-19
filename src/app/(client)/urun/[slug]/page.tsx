"use client"

import { useCartStore } from "@/store/cartStore"
import { Button, buttonVariants } from "@/components/ui/button"
import { ShoppingBag, ChevronRight, ShieldCheck, Truck, RefreshCcw } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { useParams } from "next/navigation"

export default function ProductDetailPage() {
  const params = useParams()
  const slug = params.slug as string
  const [product, setProduct] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const addItem = useCartStore((state) => state.addItem)
  const [activeImage, setActiveImage] = useState(0)

  useEffect(() => {
    async function fetchProduct() {
      const supabase = createClient()
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("slug", slug)
        .single()

      if (data) {
        setProduct(data)
      }
      setLoading(false)
    }

    if (slug) {
      fetchProduct()
    }
  }, [slug])

  if (loading) {
    return (
      <div className="container mx-auto py-24 px-4 flex items-center justify-center">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-8 w-48 bg-muted rounded mb-4"></div>
          <div className="h-4 w-32 bg-muted rounded"></div>
        </div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="container mx-auto py-24 px-4 text-center">
        <h1 className="text-3xl font-bold mb-4">Ürün Bulunamadı</h1>
        <p className="text-muted-foreground mb-8">Aradığınız ürün mevcut değil veya kaldırılmış olabilir.</p>
        <Link href="/koleksiyon" className={buttonVariants()}>
          Koleksiyona Dön
        </Link>
      </div>
    )
  }

  const handleAddToCart = () => {
    addItem({
      id: product.id,
      name: product.name,
      price: Number(product.price),
      image: product.images?.[0] || "",
      quantity: 1,
    })
  }

  return (
    <div className="container mx-auto py-12 px-4">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-12">
        <Link href="/" className="hover:text-foreground transition-colors">Ana Sayfa</Link>
        <ChevronRight className="h-4 w-4" />
        <Link href="/koleksiyon" className="hover:text-foreground transition-colors">Koleksiyon</Link>
        <ChevronRight className="h-4 w-4" />
        <span className="text-foreground font-medium truncate">{product.name}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24">
        {/* Gallerly Section */}
        <div className="space-y-4">
          <div className="relative aspect-[4/5] w-full overflow-hidden rounded-2xl bg-muted border border-border/50">
            {product.images && product.images.length > 0 ? (
              <Image
                src={product.images[activeImage]}
                alt={product.name}
                fill
                priority
                className="object-cover"
              />
            ) : (
              <div className="flex absolute inset-0 items-center justify-center bg-muted">
                <ShoppingBag className="h-12 w-12 text-muted-foreground opacity-20" />
              </div>
            )}
          </div>
          
          {product.images && product.images.length > 1 && (
            <div className="grid grid-cols-4 gap-4">
              {product.images.map((img: string, index: number) => (
                <button
                  key={index}
                  onClick={() => setActiveImage(index)}
                  className={`relative aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                    activeImage === index ? "border-primary" : "border-transparent opacity-60 hover:opacity-100"
                  }`}
                >
                  <Image src={img} alt={`${product.name} - ${index + 1}`} fill className="object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Info Section */}
        <div className="flex flex-col">
          <div className="mb-8">
            <h1 className="text-4xl font-bold tracking-tight mb-4">{product.name}</h1>
            <div className="flex items-baseline gap-4 mb-6">
              <span className="text-3xl font-semibold">₺{Number(product.price).toLocaleString("tr-TR")}</span>
              {product.old_price && (
                <span className="text-xl text-muted-foreground line-through">₺{Number(product.old_price).toLocaleString("tr-TR")}</span>
              )}
            </div>
            <div className="prose prose-sm dark:prose-invert text-muted-foreground leading-relaxed">
              {product.description || "Bu ürün için henüz bir açıklama girilmedi."}
            </div>
          </div>

          <div className="space-y-6 pt-6 border-t border-border">
            <div className="flex flex-col gap-3">
              <Button size="lg" className="w-full h-14 text-lg rounded-xl" onClick={handleAddToCart}>
                <ShoppingBag className="mr-2 h-5 w-5" /> Sepete Ekle
              </Button>
              <p className="text-xs text-center text-muted-foreground">
                Şu anda stokta {product.stock} adet ürün bulunuyor.
              </p>
            </div>

            {/* Features/Trust badges */}
            <div className="grid grid-cols-1 gap-4 pt-6">
              <div className="flex items-center gap-3 p-4 rounded-xl bg-muted/30 border border-border/50">
                <Truck className="h-5 w-5 text-primary" />
                <div className="text-sm">
                  <p className="font-semibold">Ücretsiz Kargo</p>
                  <p className="text-muted-foreground">Tüm Türkiye'ye 1-3 iş günü içinde teslim.</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 rounded-xl bg-muted/30 border border-border/50">
                <RefreshCcw className="h-5 w-5 text-primary" />
                <div className="text-sm">
                  <p className="font-semibold">Kolay İade</p>
                  <p className="text-muted-foreground">14 gün içinde koşulsuz şartsız iade garantisi.</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 rounded-xl bg-muted/30 border border-border/50">
                <ShieldCheck className="h-5 w-5 text-primary" />
                <div className="text-sm">
                  <p className="font-semibold">%100 Orijinal Ürün</p>
                  <p className="text-muted-foreground">Tüm ürünlerimiz %100 orijinal ve faturalıdır.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
