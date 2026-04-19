"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { 
  Settings2, 
  Zap, 
  Lock, 
  CheckCircle2, 
  AlertCircle, 
  RefreshCcw, 
  ArrowLeft 
} from "lucide-react"
import Link from "next/link"
import { getIntegrations, updateIntegration, testConnection } from "@/lib/actions/marketplace"
import { toast } from "sonner"

export default function MarketplaceSettingsPage() {
  const [integrations, setIntegrations] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [testing, setTesting] = useState<string | null>(null)

  const loadIntegrations = async () => {
    setLoading(true)
    const data = await getIntegrations()
    setIntegrations(data)
    setLoading(false)
  }

  useEffect(() => {
    loadIntegrations()
  }, [])

  const handleTest = async (platform: string) => {
    setTesting(platform)
    const result = await testConnection(platform)
    if (result.success) {
      toast.success(`${platform} Bağlantısı Başarılı`, { description: result.message })
    } else {
      toast.error(`${platform} Bağlantı Hatası`, { description: result.message })
    }
    setTesting(null)
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const result = await updateIntegration(formData)
    if (result.success) {
      toast.success("Ayarlar Kaydedildi")
      loadIntegrations()
    } else {
      toast.error("Hata", { description: result.error })
    }
  }

  return (
    <div className="space-y-6 max-w-5xl animate-in fade-in duration-700">
      <div className="flex items-center gap-4">
        <Link href="/dashboard/pazaryeri" className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-900 rounded-xl transition-colors">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <h1 className="text-3xl font-black tracking-tighter uppercase">Entegrasyon <span className="text-zinc-400">Ayarları</span></h1>
          <p className="text-sm font-medium text-muted-foreground uppercase tracking-widest leading-none">API ve Platform Yapılandırması</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {loading ? (
          Array.from({ length: 2 }).map((_, i) => (
            <Card key={i} className="h-[400px] animate-pulse border-zinc-200 dark:border-zinc-800 rounded-3xl" />
          ))
        ) : integrations.map((integration) => (
          <Card key={integration.id} className="border-zinc-200 dark:border-zinc-800 rounded-3xl overflow-hidden shadow-sm flex flex-col">
            <CardHeader className="bg-zinc-50/50 dark:bg-zinc-900/50 border-b border-zinc-200 dark:border-zinc-800 flex flex-row items-center justify-between space-y-0">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-white shadow-lg ${
                  integration.platform_name === 'Trendyol' ? 'bg-[#f27a1a]' : 
                  integration.platform_name === 'Hepsiburada' ? 'bg-[#ff6000]' : 'bg-[#5bb2ec]'
                }`}>
                  {integration.platform_name[0]}
                </div>
                <div>
                  <CardTitle className="text-lg font-bold">{integration.platform_name}</CardTitle>
                  <CardDescription className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">
                    {integration.is_active ? "Bağlantı Aktif" : "Yapılandırma Gerekli"}
                  </CardDescription>
                </div>
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                className="rounded-xl border-zinc-200 dark:border-zinc-800 flex items-center gap-2"
                onClick={() => handleTest(integration.platform_name)}
                disabled={testing === integration.platform_name}
              >
                {testing === integration.platform_name ? <RefreshCcw className="h-3 w-3 animate-spin" /> : <Zap className="h-3 w-3 text-primary" />}
                <span className="text-xs uppercase tracking-tighter font-bold">Bağlantı Testi</span>
              </Button>
            </CardHeader>
            <CardContent className="p-8 flex-1">
              <form onSubmit={handleSubmit} className="space-y-6">
                <input type="hidden" name="id" value={integration.id} />
                
                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 flex items-center gap-1.5">
                    <Settings2 className="h-3 w-3" /> Merchant ID / Satıcı ID
                  </Label>
                  <Input 
                    name="merchant_id" 
                    defaultValue={integration.merchant_id} 
                    placeholder="123456"
                    className="rounded-xl border-zinc-200 dark:border-zinc-800 focus-visible:ring-primary h-11 transition-all"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 flex items-center gap-1.5">
                    <Lock className="h-3 w-3" /> API Key
                  </Label>
                  <Input 
                    name="api_key" 
                    type="password"
                    defaultValue={integration.api_key} 
                    placeholder="••••••••••••••••"
                    className="rounded-xl border-zinc-200 dark:border-zinc-800 focus-visible:ring-primary h-11 transition-all"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 flex items-center gap-1.5">
                    <Lock className="h-3 w-3" /> API Secret / Password
                  </Label>
                  <Input 
                    name="api_secret" 
                    type="password"
                    defaultValue={integration.api_secret} 
                    placeholder="••••••••••••••••"
                    className="rounded-xl border-zinc-200 dark:border-zinc-800 focus-visible:ring-primary h-11 transition-all"
                  />
                </div>

                <Button type="submit" className="w-full rounded-2xl h-12 shadow-xl border-none font-bold uppercase tracking-widest text-xs mt-4">
                  Ayarları Kaydet
                </Button>
              </form>
            </CardContent>
            <div className="p-4 bg-zinc-50 dark:bg-zinc-900 border-t border-zinc-200 dark:border-zinc-800 flex items-center justify-center gap-2">
                <div className={`w-2 h-2 rounded-full ${integration.is_active ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]' : 'bg-zinc-300 animate-pulse'}`} />
                <span className="text-[9px] font-black uppercase tracking-widest text-zinc-500">
                    Sistem Durumu: {integration.is_active ? "Hazır" : "Yapılandırılmamış"}
                </span>
            </div>
          </Card>
        ))}
      </div>

      <Card className="border-zinc-200 dark:border-zinc-800 rounded-3xl overflow-hidden bg-primary/5 border-dashed">
        <CardContent className="p-10 flex flex-col items-center text-center space-y-4">
          <div className="p-4 bg-primary/10 rounded-full text-primary">
            <AlertCircle className="h-8 w-8" />
          </div>
          <div className="max-w-md">
            <h3 className="font-bold text-zinc-900 dark:text-zinc-100 uppercase tracking-tighter">API Güvenliği</h3>
            <p className="text-xs text-zinc-500 font-medium leading-relaxed mt-1">
              Pazaryeri anahtarlarınız Supabase vault üzerinde AES-256 şifreleme ile korunmaktadır. 
              Hiçbir zaman doğrudan kodunuzda veya istemci tarafında tutulmaz.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
