"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { 
  BarChart3, 
  RefreshCcw, 
  CheckCircle2, 
  AlertCircle, 
  ExternalLink, 
  Zap, 
  Globe, 
  Layers,
  ArrowRightLeft
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { getMarketplaceStats, syncMarketplace } from "@/lib/actions/marketplace"
import { useEffect } from "react"

const platforms = [
  { id: "trendyol", name: "Trendyol", color: "#f27a1a", status: "active", products: 124, lastSync: "2 saat önce" },
  { id: "hepsiburada", name: "Hepsiburada", color: "#ff6000", status: "active", products: 89, lastSync: "4 saat önce" },
  { id: "n11", name: "n11", color: "#5bb2ec", status: "warning", products: 45, lastSync: "1 gün önce" },
  { id: "ciceksepeti", name: "Çiçeksepeti", color: "#ff4d4d", status: "error", products: 0, lastSync: "Başarısız" },
]

export default function MarketplaceCommandCenter() {
  const [syncing, setSyncing] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [progress, setProgress] = useState(0)
  const [stats, setStats] = useState<any>(null)

  useEffect(() => {
    async function loadStats() {
      const data = await getMarketplaceStats()
      setStats(data)
    }
    loadStats()
  }, [])

  const handleSync = async (id: string) => {
    setSyncing(id)
    setProgress(0)
    
    // UI Progress animasyonu
    const interval = setInterval(() => {
      setProgress(prev => (prev >= 95 ? 95 : prev + 5))
    }, 100)

    try {
      await syncMarketplace(id)
      setProgress(100)
    } finally {
      clearInterval(interval)
      setTimeout(() => {
        setSyncing(null)
        setSuccess(id)
        setTimeout(() => setSuccess(null), 3000)
      }, 500)
    }
  }

  const syncAll = () => {
    setSyncing("all")
    setProgress(0)
    const interval = setInterval(() => {
      setProgress(prev => (prev >= 100 ? 100 : prev + 2))
    }, 50)
    
    setTimeout(() => {
      setSyncing(null)
      setSuccess("all")
      setTimeout(() => setSuccess(null), 3000)
    }, 3000)
  }

  return (
    <div className="space-y-8 animate-fade-in-up">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-luxury">Pazaryeri Komuta Merkezi</h1>
          <p className="text-muted-foreground mt-1">Tüm satış platformlarınızdaki stok ve fiyatları tek noktadan yönetin.</p>
        </div>
        <Button 
          onClick={syncAll} 
          disabled={syncing !== null}
          className="gold-gradient border-none rounded-2xl h-12 px-8 shadow-xl hover:scale-105 transition-all group"
        >
          {syncing === "all" ? (
            <RefreshCcw className="mr-2 h-5 w-5 animate-spin" />
          ) : (
            <Zap className="mr-2 h-5 w-5 group-hover:animate-pulse" />
          )}
          Tümünü Senkronize Et
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Statistics cards */}
        <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="midnight-card border-none">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-zinc-400 flex items-center gap-2">
                <ArrowRightLeft className="h-4 w-4 text-primary" /> Toplam Eşleşen Ürün
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-zinc-100">{stats?.matchedProducts || 0} / {stats?.totalProducts || 0}</div>
              <Progress value={stats ? (stats.matchedProducts / stats.totalProducts) * 100 : 0} className="h-1 mt-4 bg-zinc-800" />
              <p className="text-[10px] text-zinc-500 mt-2 uppercase tracking-widest font-bold">Ürünlerin %{stats ? ((stats.matchedProducts / stats.totalProducts) * 100).toFixed(0) : 0}'si pazaryerlerinde yayında</p>
            </CardContent>
          </Card>

          <Card className="midnight-card border-none">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-zinc-400 flex items-center gap-2">
                <BarChart3 className="h-4 w-4 text-primary" /> Tahmini Senk. Süresi
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-zinc-100">~2.4 dk</div>
              <div className="flex items-center gap-2 mt-4">
                <div className="flex -space-x-2">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="h-6 w-6 rounded-full border-2 border-zinc-950 bg-zinc-800 flex items-center justify-center">
                      <Globe className="h-3 w-3 text-zinc-400" />
                    </div>
                  ))}
                </div>
                <span className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold">4 Aktif Platform</span>
              </div>
            </CardContent>
          </Card>

          {/* Sync Status table */}
          <Card className="col-span-2 midnight-card border-none overflow-hidden">
            <div className="p-6 border-b border-zinc-800/50 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Layers className="h-5 w-5 text-primary" />
                <h3 className="font-bold text-zinc-100">Platform Durumları</h3>
              </div>
            </div>
            <div className="divide-y divide-zinc-800/50">
              {platforms.map((platform) => (
                <div key={platform.id} className="p-6 flex items-center justify-between group hover:bg-white/[0.02] transition-colors">
                  <div className="flex items-center gap-4">
                    <div 
                      className="w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-white shadow-lg"
                      style={{ backgroundColor: platform.color }}
                    >
                      {platform.name[0]}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-zinc-100">{platform.name}</span>
                        {platform.status === 'active' && <CheckCircle2 className="h-3 w-3 text-green-500" />}
                        {platform.status === 'warning' && <AlertCircle className="h-3 w-3 text-amber-500" />}
                        {platform.status === 'error' && <AlertCircle className="h-3 w-3 text-red-500" />}
                      </div>
                      <p className="text-xs text-zinc-500">Son Güncelleme: {platform.lastSync}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-8">
                    <div className="hidden md:block text-right">
                      <p className="text-xs text-zinc-500 uppercase tracking-widest font-bold">Ürün Sayısı</p>
                      <p className="text-lg font-bold text-zinc-200">{platform.products}</p>
                    </div>

                    <div className="flex items-center gap-2">
                       <AnimatePresence mode="wait">
                        {syncing === platform.id || syncing === "all" ? (
                          <motion.div
                            key="syncing"
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                            className="flex items-center gap-3 bg-zinc-900 px-4 py-2 rounded-xl border border-zinc-800"
                          >
                            <RefreshCcw className="h-4 w-4 animate-spin text-primary" />
                            <div className="w-24 h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                              <motion.div 
                                className="h-full bg-primary" 
                                initial={{ width: "0%" }}
                                animate={{ width: `${progress}%` }}
                              />
                            </div>
                          </motion.div>
                        ) : success === platform.id || success === "all" ? (
                          <motion.div
                            key="success"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="flex items-center gap-2 text-green-500 bg-green-500/10 px-4 py-2 rounded-xl border border-green-500/20"
                          >
                            <CheckCircle2 className="h-4 w-4" />
                            <span className="text-xs font-bold uppercase tracking-widest">Başarılı</span>
                          </motion.div>
                        ) : (
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleSync(platform.id)}
                            className="border-zinc-800 hover:bg-zinc-800 rounded-xl"
                          >
                            <RefreshCcw className="h-3 w-3 mr-2" /> Senkronize Et
                          </Button>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Right sidebar: Logs/Actions */}
        <div className="space-y-4">
          <Card className="midnight-card border-none h-full">
            <CardHeader>
              <CardTitle className="text-lg font-bold flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-amber-500" /> Senkronizasyon Kayıtları
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {[
                { time: "12:45", msg: "Trendyol stokları güncellendi.", type: "success" },
                { time: "11:20", msg: "n11 API bağlantısında gecikme.", type: "warning" },
                { time: "Yevmiye", msg: "Otomatik akşam senk. tamamlandı.", type: "success" },
                { time: "Dün", msg: "Çiçeksepeti API Key geçersiz.", type: "error" },
              ].map((log, i) => (
                <div key={i} className="flex gap-4 group">
                  <div className={`mt-1.5 w-2 h-2 rounded-full shrink-0 ${
                    log.type === 'success' ? 'bg-green-500' : 
                    log.type === 'warning' ? 'bg-amber-500' : 'bg-red-500'
                  }`} />
                  <div>
                    <p className="text-xs font-bold text-zinc-100">{log.msg}</p>
                    <p className="text-[10px] text-zinc-500 font-medium uppercase mt-1">{log.time}</p>
                  </div>
                </div>
              ))}
              
              <Button variant="ghost" className="w-full text-xs text-primary hover:bg-primary/5 rounded-xl border border-dashed border-zinc-800">
                Tüm Kayıtları Gör <ExternalLink className="ml-2 h-3 w-3" />
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
