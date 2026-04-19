"use client"

import { useState, useEffect } from "react"
import { BentoGrid, BentoCard } from "@/components/dashboard/bento-grid"
import { RevenueAreaChart } from "@/components/dashboard/revenue-area-chart"
import { QuickActions } from "@/components/dashboard/quick-actions"
import { AIFinanceSummary } from "@/components/admin/ai-finance-summary"
import { DashboardCommandPalette } from "@/components/dashboard/command-palette"
import { useRealtimeOrders } from "@/hooks/use-realtime-orders"
import { getDashboardStats } from "@/lib/actions/dashboard"
import { 
  DollarSign, 
  Package, 
  ShoppingCart, 
  Activity, 
  Globe, 
  Zap, 
  ArrowUpRight 
} from "lucide-react"

export function DashboardContent() {
  const [stats, setStats] = useState<any>(null)
  
  // Real-time sipariş takibini başlat
  useRealtimeOrders()

  useEffect(() => {
    async function fetchStats() {
      const data = await getDashboardStats()
      setStats(data)
    }
    fetchStats()
  }, [])

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tighter text-zinc-900 dark:text-zinc-100 uppercase">
            Ticaret <span className="text-zinc-400">Komuta Merkezi</span>
          </h1>
          <p className="text-sm font-medium text-zinc-500">
            Pazaryeri ve depo verileriniz şu an <span className="text-green-500 animate-pulse font-bold">canlı</span> olarak izleniyor.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <DashboardCommandPalette />
        </div>
      </div>

      <AIFinanceSummary />

      <BentoGrid>
        {/* Ana Gelir Grafiği (Büyük Kart) */}
        <BentoCard 
          title="Birleşik Gelir Analizi" 
          description="Tüm platformların performans karşılaştırması"
          className="md:col-span-3 lg:col-span-3 lg:row-span-1"
          icon={<Activity className="h-5 w-5" />}
        >
          <div className="h-[250px] mt-4">
            <RevenueAreaChart />
          </div>
        </BentoCard>

        {/* Hızlı İşlemler */}
        <BentoCard 
          title="Hızlı İşlemler" 
          description="Kritik öncelikli aksiyonlar"
          className="md:col-span-1 lg:col-span-1"
          icon={<Zap className="h-5 w-5" />}
        >
          <div className="mt-4">
            <QuickActions />
          </div>
        </BentoCard>

        {/* İstatistikler */}
        <BentoCard 
          title="Toplam Gelir" 
          className="lg:col-span-1"
          icon={<DollarSign className="h-5 w-5" />}
        >
          <div className="mt-2">
            <div className="text-3xl font-black tabular-nums tracking-tighter">
              ₺{stats?.totalRevenue.toLocaleString("tr-TR") || "..."}
            </div>
            <div className="flex items-center gap-1 text-[10px] text-green-500 font-bold mt-2 uppercase">
              <ArrowUpRight className="h-3 w-3" /> Canlı Veri Akışı Aktif
            </div>
          </div>
        </BentoCard>

        <BentoCard 
          title="Aktif Siparişler" 
          className="lg:col-span-1"
          icon={<ShoppingCart className="h-5 w-5" />}
        >
          <div className="mt-2 text-right">
            <div className="text-4xl font-black tabular-nums tracking-tighter">
              {stats?.activeOrders || "0"}
            </div>
            <div className="flex items-center justify-end gap-1 text-[10px] text-zinc-500 font-bold mt-2 uppercase tracking-widest">
              Hazırlanan / Kargoda
            </div>
          </div>
        </BentoCard>

        <BentoCard 
          title="Stok Durumu" 
          className="lg:col-span-1"
          icon={<Package className="h-5 w-5" />}
        >
          <div className="mt-2">
            <div className="text-3xl font-black tabular-nums tracking-tighter">
              {stats?.totalStock.toLocaleString("tr-TR") || "0"}
            </div>
            <div className="flex items-center gap-1 text-[10px] text-amber-500 font-bold mt-2 uppercase tracking-widest leading-none">
              %{stats?.lowStockPercentage || "0"} KRİTİK SEVİYEDE
            </div>
          </div>
        </BentoCard>

        <BentoCard 
          title="Platform Sağlığı" 
          className="lg:col-span-1"
          icon={<Globe className="h-5 w-5" />}
        >
           <div className="mt-4 flex flex-wrap gap-2">
              <div className="flex items-center gap-2 px-3 py-1 bg-zinc-100 dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-800 text-[10px] font-black uppercase text-zinc-600 dark:text-zinc-400">
                <div className="w-1.5 h-1.5 rounded-full bg-green-500" /> TY
              </div>
              <div className="flex items-center gap-2 px-3 py-1 bg-zinc-100 dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-800 text-[10px] font-black uppercase text-zinc-600 dark:text-zinc-400">
                <div className="w-1.5 h-1.5 rounded-full bg-green-500" /> HB
              </div>
              <div className="flex items-center gap-2 px-3 py-1 bg-zinc-100 dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-800 text-[10px] font-black uppercase text-zinc-600 dark:text-zinc-400 opacity-50">
                <div className="w-1.5 h-1.5 rounded-full bg-zinc-300" /> n11
              </div>
           </div>
        </BentoCard>
      </BentoGrid>
    </div>
  )
}
