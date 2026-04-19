"use client"

import { useState, useEffect } from "react"
import { Brain, TrendingUp, Wallet, ArrowDownRight, Sparkles, Receipt, Truck } from "lucide-react"
import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export function AIFinanceSummary() {
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1500)
    return () => clearTimeout(timer)
  }, [])

  if (loading) {
    return (
      <div className="h-32 w-full bg-zinc-900 animate-pulse rounded-3xl border border-zinc-800" />
    )
  }

  return (
    <Card className="border-none shadow-3xl bg-zinc-950 overflow-hidden relative group">
      {/* Background Glow */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 blur-[100px] rounded-full -translate-y-1/2 translate-x-1/2 group-hover:bg-primary/10 transition-colors duration-1000" />
      
      <CardContent className="p-0">
        <div className="flex flex-col md:flex-row divide-y md:divide-y-0 md:divide-x divide-zinc-800/50">
          {/* AI Text Summary Area */}
          <div className="flex-[2] p-8 space-y-4">
            <div className="flex items-center gap-2 text-primary">
              <div className="p-2 bg-primary/10 rounded-xl">
                <Brain className="h-5 w-5" />
              </div>
              <span className="text-xs font-bold uppercase tracking-widest">AI Finans Özeti</span>
              <div className="ml-auto flex items-center gap-1 px-2 py-1 bg-zinc-900 rounded-lg border border-zinc-800">
                <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                <span className="text-[10px] text-zinc-400">Canlı Analiz</span>
              </div>
            </div>

            <div className="space-y-3">
              <h3 className="text-xl font-bold text-zinc-100 text-luxury">
                Satışlarınızda bu hafta <span className="text-primary">%14 artış</span> gözlemlendi.
              </h3>
              <p className="text-zinc-400 text-sm leading-relaxed max-w-2xl">
                Pazaryeri komisyonları (₺14.200) ve kargo maliyetlerinizi (₺8.400) düştüğümüzde, net kâr marjınız <span className="text-zinc-200">%22 seviyesine</span> yükseldi. Trendyol üzerindeki indirimli fiyatlarınızın stok devir hızını artırdığı tespit edildi.
              </p>
            </div>

            <div className="flex gap-2 pt-2">
              <Button size="sm" variant="outline" className="h-8 text-[11px] rounded-lg border-zinc-800 hover:bg-zinc-900">
                Detaylı Analiz
              </Button>
              <Button size="sm" variant="ghost" className="h-8 text-[11px] rounded-lg text-zinc-500">
                Ayarları Düzenle
              </Button>
            </div>
          </div>

          {/* Core Stats Area */}
          <div className="flex-1 p-8 bg-zinc-900/30 grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-1.5 text-zinc-500 text-[10px] font-bold uppercase tracking-wider">
                <Wallet className="h-3 w-3" /> Brüt Ciro
              </div>
              <p className="text-2xl font-bold text-zinc-100">₺142.500</p>
              <div className="flex items-center gap-1 text-[10px] text-green-500">
                <TrendingUp className="h-3 w-3" /> +12%
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-1.5 text-zinc-500 text-[10px] font-bold uppercase tracking-wider">
                <Receipt className="h-3 w-3" /> Komisyonlar
              </div>
              <p className="text-2xl font-bold text-zinc-100 italic opacity-80">₺14.250</p>
              <div className="flex items-center gap-1 text-[10px] text-zinc-500">
                Sabit Oran %10
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-1.5 text-zinc-500 text-[10px] font-bold uppercase tracking-wider">
                <Truck className="h-3 w-3" /> Kargo Maliyeti
              </div>
              <p className="text-2xl font-bold text-zinc-100">₺8.400</p>
              <div className="text-[10px] text-zinc-500">
                Ort. ₺45 / gönderi
              </div>
            </div>

            <div className="space-y-1 p-3 bg-primary/5 rounded-2xl border border-primary/10">
              <div className="flex items-center gap-1.5 text-primary text-[10px] font-bold uppercase tracking-wider">
                <Sparkles className="h-3 w-3" /> Net Kâr
              </div>
              <p className="text-2xl font-bold text-primary">₺119.850</p>
              <div className="flex items-center gap-1 text-[10px] text-primary/70">
                <TrendingUp className="h-3 w-3" /> Rekor Seviye
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
