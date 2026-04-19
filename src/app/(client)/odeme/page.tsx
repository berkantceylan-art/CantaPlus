"use client"

import { useCartStore } from "@/store/cartStore"
import { Button, buttonVariants } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import Image from "next/image"

export default function CheckoutPage() {
  const { items, totalPrice } = useCartStore()
  
  if (items.length === 0) {
    return (
      <div className="container mx-auto py-24 text-center">
        <h1 className="text-3xl font-bold mb-4">Sepetiniz Boş</h1>
        <p className="text-muted-foreground mb-8">Ödeme yapabilmek için sepetinize ürün eklemelisiniz.</p>
        <a href="/koleksiyon" className={buttonVariants()}>
          Alışverişe Başla
        </a>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-12 px-4">
      <h1 className="text-3xl font-bold mb-8">Ödeme Sayfası</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div className="space-y-8">
          {/* İletişim Bilgileri */}
          <section>
            <h2 className="text-xl font-semibold mb-4">İletişim Bilgileri</h2>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">Ad</Label>
                  <Input id="firstName" placeholder="Adınız" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Soyad</Label>
                  <Input id="lastName" placeholder="Soyadınız" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">E-posta</Label>
                <Input id="email" type="email" placeholder="ornek@email.com" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Telefon</Label>
                <Input id="phone" type="tel" placeholder="0555 555 55 55" />
              </div>
            </div>
          </section>

          <Separator />

          {/* Adres Bilgileri */}
          <section>
            <h2 className="text-xl font-semibold mb-4">Teslimat Adresi</h2>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="address">Açık Adres</Label>
                <Input id="address" placeholder="Mahalle, sokak, no..." />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="city">İl</Label>
                  <Input id="city" placeholder="İstanbul" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="district">İlçe</Label>
                  <Input id="district" placeholder="Kadıköy" />
                </div>
              </div>
            </div>
          </section>

          <Separator />

          {/* Ödeme Bilgileri (Iyzico / Kredi Kartı Seçimi) */}
          <section>
            <h2 className="text-xl font-semibold mb-4">Ödeme Yöntemi</h2>
            <RadioGroup defaultValue="iyzico" className="mb-6 flex space-x-4">
              <div className="flex items-center space-x-2 border p-4 rounded-lg flex-1 cursor-pointer">
                <RadioGroupItem value="iyzico" id="iyzico" />
                <Label htmlFor="iyzico" className="cursor-pointer font-semibold flex-1">İyzico ile Öde</Label>
              </div>
              <div className="flex items-center space-x-2 border p-4 rounded-lg flex-1 cursor-pointer">
                <RadioGroupItem value="card" id="card" />
                <Label htmlFor="card" className="cursor-pointer font-semibold flex-1">Kredi Kartı</Label>
              </div>
            </RadioGroup>

            <Card>
              <CardHeader>
                <CardTitle>Kart Bilgileri</CardTitle>
                <CardDescription>Güvenli ödeme altyapısı ile kart bilgilerinizi giriniz.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="cardNumber">Kart Numarası</Label>
                  <Input id="cardNumber" placeholder="0000 0000 0000 0000" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="expiry">Son Kullanma Tarihi</Label>
                    <Input id="expiry" placeholder="AA/YY" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cvv">CVV</Label>
                    <Input id="cvv" placeholder="123" type="password" maxLength={3} />
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>

          <Button size="lg" className="w-full text-lg h-14">
            Siparişi Tamamla (₺{totalPrice.toLocaleString("tr-TR")})
          </Button>
        </div>

        {/* Sipariş Özeti */}
        <div>
          <div className="bg-muted/50 p-6 rounded-lg sticky top-24">
            <h2 className="text-xl font-semibold mb-6">Sipariş Özeti</h2>
            <div className="space-y-4 mb-6">
              {items.map((item) => (
                <div key={item.id} className="flex gap-4">
                  <div className="relative w-16 h-16 rounded border bg-background overflow-hidden shrink-0">
                    {item.image && <Image src={item.image} alt={item.name} fill className="object-cover" />}
                  </div>
                  <div className="flex-1 flex justify-between">
                    <div>
                      <p className="font-medium text-sm">{item.name}</p>
                      <p className="text-xs text-muted-foreground mt-1">Adet: {item.quantity}</p>
                    </div>
                    <p className="font-medium text-sm">₺{(item.price * item.quantity).toLocaleString("tr-TR")}</p>
                  </div>
                </div>
              ))}
            </div>
            <Separator className="my-4" />
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Ara Toplam</span>
                <span>₺{totalPrice.toLocaleString("tr-TR")}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Kargo</span>
                <span>Ücretsiz</span>
              </div>
            </div>
            <Separator className="my-4" />
            <div className="flex justify-between items-center font-bold text-lg">
              <span>Toplam</span>
              <span>₺{totalPrice.toLocaleString("tr-TR")}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
