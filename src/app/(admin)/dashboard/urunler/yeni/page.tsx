"use client"

import { Button, buttonVariants } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft, Loader2, UploadCloud } from "lucide-react"
import Link from "next/link"
import { addProduct } from "@/lib/actions/product"
import { useActionState } from "react"

export default function NewProductPage() {
  const [state, action, isPending] = useActionState(
    async (prevState: any, formData: FormData) => {
      return await addProduct(formData)
    },
    null
  )

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="flex items-center gap-4">
        <Link href="/dashboard/urunler" className={buttonVariants({ variant: "outline", size: "icon" })}>
          <ArrowLeft className="h-4 w-4" />
        </Link>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Yeni Ürün Ekle</h1>
          <p className="text-muted-foreground">Mağazanıza ve pazaryerlerine (Trendyol vb.) yeni bir çanta ekleyin.</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Ürün Detayları</CardTitle>
          <CardDescription>Lütfen ürün bilgilerini eksiksiz doldurun.</CardDescription>
        </CardHeader>
        <CardContent>
          {state?.error && (
            <div className="mb-6 p-4 bg-destructive/15 text-destructive rounded-md text-sm font-medium">
              {state.error}
            </div>
          )}

          <form action={action} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name">Ürün Adı <span className="text-destructive">*</span></Label>
              <Input id="name" name="name" placeholder="Örn: Siyah Deri Çapraz Çanta" required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Açıklama</Label>
              <Textarea 
                id="description" 
                name="description" 
                placeholder="Ürününüzü detaylıca anlatın..." 
                rows={4} 
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="price">Satış Fiyatı (₺) <span className="text-destructive">*</span></Label>
                <Input id="price" name="price" type="number" step="0.01" min="0" placeholder="0.00" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="stock">Stok Miktarı <span className="text-destructive">*</span></Label>
                <Input id="stock" name="stock" type="number" min="0" placeholder="Yüklenen adet" required />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="image">Ürün Görseli</Label>
              <div className="border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center text-center hover:bg-muted/50 transition-colors">
                <UploadCloud className="h-8 w-8 text-muted-foreground mb-4" />
                <p className="text-sm font-medium mb-1">Görsel yüklemek için tıklayın veya sürükleyin</p>
                <p className="text-xs text-muted-foreground mb-4">PNG, JPG, WEBP (Max 2MB)</p>
                <Input 
                  id="image" 
                  name="image" 
                  type="file" 
                  accept="image/png, image/jpeg, image/webp" 
                  className="max-w-xs"
                />
              </div>
            </div>

            <Button type="submit" className="w-full" disabled={isPending}>
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Ürün Yükleniyor...
                </>
              ) : (
                "Kaydet ve Yayınla"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
