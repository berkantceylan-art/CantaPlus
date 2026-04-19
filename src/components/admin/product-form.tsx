"use client"

import { Button, buttonVariants } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import * as Icons from "lucide-react"
import Link from "next/link"
import { addProduct } from "@/lib/actions/product"
import { useState, useTransition } from "react"
import { ImageDropzone } from "@/components/admin/image-dropzone"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { productSchema, type ProductInput } from "@/lib/validations/product"

export function ProductForm() {
  const { ArrowLeft, Loader2 } = Icons
  const [isPending, startTransition] = useTransition()
  const [serverError, setServerError] = useState<string | null>(null)
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])
  
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<ProductInput>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: "",
      description: "",
      price: 0,
      stock: 0,
       cost_price: 0
    }
  })

  const onSubmit = async (data: ProductInput) => {
    setServerError(null)
    
    const formData = new FormData()
    Object.entries(data).forEach(([key, value]) => {
      formData.append(key, String(value))
    })
    
    selectedFiles.forEach(file => {
      formData.append("images", file)
    })

    startTransition(async () => {
      const result = await addProduct(formData)
      if (result?.error) {
        setServerError(result.error)
      }
    })
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center gap-4">
        <Link href="/dashboard/urunler" className={buttonVariants({ variant: "outline", size: "icon", className: "rounded-xl border-zinc-200 dark:border-zinc-800" })}>
          <ArrowLeft className="h-4 w-4" />
        </Link>
        <div>
          <h1 className="text-3xl font-black tracking-tighter uppercase">Yeni <span className="text-zinc-400">Ürün</span></h1>
          <p className="text-sm font-medium text-muted-foreground uppercase tracking-widest leading-none">Kataloğa yeni bir parça ekleyin</p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 lg:grid-cols-3 gap-6 pb-20">
        <div className="lg:col-span-2 space-y-6">
          <Card className="border-zinc-200 dark:border-zinc-800 rounded-3xl overflow-hidden shadow-sm">
            <CardHeader className="bg-zinc-50/50 dark:bg-zinc-900/50 border-b border-zinc-200 dark:border-zinc-800">
              <CardTitle className="text-lg font-bold">Ürün Bilgileri</CardTitle>
              <CardDescription className="text-xs uppercase tracking-widest font-bold text-zinc-500">Temel tanımlamalar ve içerik</CardDescription>
            </CardHeader>
            <CardContent className="p-8 space-y-6">
              {serverError && (
                <div className="p-4 bg-red-50 text-red-600 rounded-2xl text-xs font-bold uppercase tracking-wider border border-red-100">
                  {serverError}
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="name" className="text-xs font-black uppercase tracking-widest text-zinc-500">Ürün Adı *</Label>
                <Input 
                  id="name" 
                  {...register("name")}
                  placeholder="Örn: Siyah Deri Çapraz Çanta" 
                  className={`rounded-xl h-12 border-zinc-200 dark:border-zinc-800 focus-visible:ring-primary font-medium ${errors.name ? 'border-red-500' : ''}`}
                />
                {errors.name && <p className="text-[10px] text-red-500 font-bold uppercase">{errors.name.message}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="description" className="text-xs font-black uppercase tracking-widest text-zinc-500">Açıklama</Label>
                <Textarea 
                  id="description" 
                  {...register("description")}
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
                <Input id="price" type="number" step="0.01" {...register("price")} placeholder="0.00" className="rounded-xl h-12 border-zinc-200 dark:border-zinc-800" />
                {errors.price && <p className="text-[10px] text-red-500 font-bold uppercase">{errors.price.message}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="cost_price" className="text-xs font-black uppercase tracking-widest text-zinc-500">Maliyet (₺)</Label>
                <Input id="cost_price" type="number" step="0.01" {...register("cost_price")} placeholder="0.00" className="rounded-xl h-12 border-zinc-200 dark:border-zinc-800" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="stock" className="text-xs font-black uppercase tracking-widest text-zinc-500">Başlangıç Stoğu *</Label>
                <Input id="stock" type="number" {...register("stock")} placeholder="Adet" className="rounded-xl h-12 border-zinc-200 dark:border-zinc-800" />
                {errors.stock && <p className="text-[10px] text-red-500 font-bold uppercase">{errors.stock.message}</p>}
              </div>
            </CardContent>
          </Card>

          <Card className="border-zinc-200 dark:border-zinc-800 rounded-3xl overflow-hidden shadow-sm bg-zinc-900 text-white">
            <CardContent className="p-8 space-y-6">
              <div className="space-y-2">
                <h4 className="text-xs font-black uppercase tracking-widest text-white/50">Yayına Hazır mısınız?</h4>
                <p className="text-[10px] text-zinc-400 font-medium tracking-tight">Ürün kaydedildiğinde Trendyol ve Hepsiburada ile senkronizasyon başlar.</p>
              </div>
              
              <Button 
                type="submit" 
                className="w-full h-12 rounded-xl font-bold uppercase tracking-widest text-xs bg-white text-black hover:bg-zinc-200 transition-all shadow-xl" 
                disabled={isPending}
              >
                {isPending ? (
                  <>
                    <Icons.Loader2 className="mr-2 h-4 w-4 animate-spin" />
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
