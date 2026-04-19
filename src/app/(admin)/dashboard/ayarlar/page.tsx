"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { 
  Zap, 
  Settings2, 
  ShieldCheck, 
  RefreshCw,
  ExternalLink
} from "lucide-react"

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Ayarlar & Entegrasyonlar</h1>
        <p className="text-muted-foreground">Pazaryeri bağlantılarınızı ve genel mağaza ayarlarınızı yönetin.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Entegrasyonlar */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-orange-500" />
                <CardTitle>Trendyol Entegrasyonu</CardTitle>
              </div>
              <CardDescription>Ürünlerinizi otomatik olarak Trendyol'da yayınlayın.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 rounded-lg bg-muted/30 border">
                <div className="space-y-0.5">
                  <Label>Entegrasyon Durumu</Label>
                  <p className="text-xs text-muted-foreground">Aktif olduğunda stoklar anlık senkronize edilir.</p>
                </div>
                <Switch />
              </div>
              <div className="space-y-2">
                <Label htmlFor="trendyol-api">API Key</Label>
                <Input id="trendyol-api" type="password" value="************************" readOnly />
              </div>
              <Button variant="outline" className="w-full">
                <RefreshCw className="mr-2 h-4 w-4" /> Bağlantıyı Test Et
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-red-500" />
                <CardTitle>Hepsiburada Entegrasyonu</CardTitle>
              </div>
              <CardDescription>Hepsiburada Merchant ID ile API bağlantısı kurun.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 rounded-lg bg-muted/30 border">
                <div className="space-y-0.5">
                  <Label>Entegrasyon Durumu</Label>
                  <p className="text-xs text-muted-foreground">Şu an pasif durumda.</p>
                </div>
                <Switch />
              </div>
              <Button variant="secondary" className="w-full text-xs" size="sm">
                API Bilgilerini Gir <ExternalLink className="ml-2 h-3 w-3" />
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Mağaza Ayarları */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Settings2 className="h-5 w-5 text-primary" />
                <CardTitle>Mağaza Bilgileri</CardTitle>
              </div>
              <CardDescription>Fatura ve iletişim detaylarınız.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="shop-name">Mağaza Adı</Label>
                <Input id="shop-name" value="ÇantaPlus Premium" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="shop-email">Destek E-postası</Label>
                <Input id="shop-email" type="email" value="destek@cantaplus.com" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="tax-number">Vergi Numarası</Label>
                <Input id="tax-number" value="1234567890" />
              </div>
              <Button className="w-full">Ayarları Kaydet</Button>
            </CardContent>
          </Card>

          <Card className="bg-primary/5 border-primary/20">
            <CardHeader>
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-5 w-5 text-primary" />
                <CardTitle>Sistem Sağlığı</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Supabase Bağlantısı</span>
                <span className="text-green-500 font-medium">Aktif</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>API Servisleri</span>
                <span className="text-green-500 font-medium">Çalışıyor</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Son Senkronizasyon</span>
                <span className="text-muted-foreground">5 dk önce</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
