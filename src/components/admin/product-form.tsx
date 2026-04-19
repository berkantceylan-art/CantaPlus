"use client"

import { Button, buttonVariants } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft, Loader2 } from "lucide-react"
import Link from "next/link"
import { addProduct } from "@/lib/actions/product"
import { useActionState, useState } from "react"
import { ImageDropzone } from "@/components/admin/image-dropzone"

export function ProductForm() {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])
  
  const [state, action, isPending] = useActionState(
    async (prevState: any, formData: FormData) => {
      // Dosyaları FormData'ya ekle
      selectedFiles.forEach(file => {
        formData.append("images", file)
      })
      return await addProduct(formData)
    },
    null
  )

  return (
    <div className="space-y-6 max-w-4xl animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex items-center gap-4">
        <Link href="/dashboard/urunler" className={buttonVariants({ variant: "outline", size: "icon", className: "rounded-xl border-zinc-200 dark:border-zinc-800" })}>
          <ArrowLeft className="h-4 w-4" />
        </Link>
        <div>
          <h1 className="text-3xl font-black tracking-tighter uppercase">Yeni <span className="text-zinc-400">Ürün</span></h1>
          <p className="text-sm font-medium text-muted-foreground uppercase tracking-widest leading-none">Kataloğa yeni bir parça ekleyin</p>
        </div>
      </div>

      <form action={action} className="grid grid-cols-1 lg:grid-cols-3 gap-6 pb-20">
        <div className="lg:col-span-2 space-y-6">
          <Card className="border-zinc-200 dark:border-zinc-800 rounded-3xl overflow-hidden shadow-sm">
            <CardHeader className="bg-zinc-50/50 dark:bg-zinc-900/50 border-b border-zinc-200 dark:border-zinc-800">
              <CardTitle className="text-lg font-bold">Ürün Bilgileri</CardTitle>
              <CardDescription className="text-xs uppercase tracking-widest font-bold text-zinc-500">Temel tanımlamalar ve içerik</CardDescription>
            </CardHeader>
            <CardContent className="p-8 space-y-6">
              {state?.error && (
                <div className="p-4 bg-destructive/10 text-destructive rounded-2xl text-xs font-bold uppercase tracking-wider border border-destructive/20 animate-shake">
                  {state.error}
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="name" className="text-xs font-black uppercase tracking-widest text-zinc-500">Ürün Adı *</Label>
                <Input 
                  id="name" 
                  name="name" 
                  placeholder="Örn: Siyah Deri Çapraz Çanta" 
                  required 
                  className="rounded-xl h-12 border-zinc-200 dark:border-zinc-800 focus-visible:ring-primary font-medium"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description" className="text-xs font-black uppercase tracking-widest text-zinc-500">Açıklama</Label>
                <Textarea 
                  id="description" 
                  name="description" 
                  placeholder="Ürününüzü detaylıca anlatın..." 
                  rows={6} 
                  className="rounded-2xl border-zinc-200 dark:border-zinc-800 focus-visible:ring-primary resize-none"
                />
              </div>
            </CardContent>
          </Card>

          <Card className="border-zinc-200 dark:border-zinc-800 rounded-3xl overflow-hidden shadow-sm">
            <CardHeader className="bg-zinc-50/50 dark:bg-zinc-900/50 border-b border-zinc-200 dark:border-zinc-800">
              <CardTitle className="text-lg font-bold">Medya Galerisi</CardTitle>
              <CardDescription className="text-xs uppercase tracking-widest font-bold text-zinc-500">Ürün görsellerini yönetin</CardDescription>
            </CardHeader>
            <CardContent className="p-8">
              <ImageDropzone onFilesChange={setSelectedFiles} />
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="border-zinc-200 dark:border-zinc-800 rounded-3xl overflow-hidden shadow-sm">
            <CardHeader className="bg-zinc-50/50 dark:bg-zinc-900/50 border-b border-zinc-200 dark:border-zinc-800">
              <CardTitle className="text-lg font-bold">Stok & Fiyat</CardTitle>
            </CardHeader>
            <CardContent className="p-8 space-y-6">
              <div className="space-y-2">
                <Label htmlFor="price" className="text-xs font-black uppercase tracking-widest text-zinc-500">Satış Fiyatı (₺) *</Label>
                <Input id="price" name="price" type="number" step="0.01" min="0" placeholder="0.00" required className="rounded-xl h-12 border-zinc-200 dark:border-zinc-800" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="stock" className="text-xs font-black uppercase tracking-widest text-zinc-500">Başlangıç Stoğu *</Label>
                <Input id="stock" name="stock" type="number" min="0" placeholder="Adet" required className="rounded-xl h-12 border-zinc-200 dark:border-zinc-800" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-zinc-200 dark:border-zinc-800 rounded-3xl overflow-hidden shadow-sm bg-zinc-900 text-white">
            <CardContent className="p-8 space-y-6">
              <div className="space-y-2">
                <h4 className="text-xs font-black uppercase tracking-widest text-primary">Yayına Hazır mısınız?</h4>
                <p className="text-[10px] text-zinc-400 font-medium">Bu ürün kaydedildiğinde otomatik olarak Trendyol ve Hepsiburada kataloglarınıza eklenecektir.</p>
              </div>
              
              <Button type="submit" className="w-full h-12 rounded-xl font-bold uppercase tracking-widest text-xs gold-gradient border-none text-zinc-950 shadow-xl" disabled={isPending}>
                {isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    İşleniyor...
                  </>
                ) : (
                  "Kaydet ve Yayınla"
                )}
              </Button>
            </CardContent>
          </Card>
        </div>
      </form>
    </div>
  )
}
