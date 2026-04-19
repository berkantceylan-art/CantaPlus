"use client"

import { useState, useEffect } from "react"
import { BentoGrid, BentoCard } from "@/components/dashboard/bento-grid"
import { RevenueAreaChart } from "@/components/dashboard/revenue-area-chart"
import { QuickActions } from "@/components/dashboard/quick-actions"
import { AIFinanceSummary } from "@/components/admin/ai-finance-summary"
import { useRealtimeOrders } from "@/hooks/use-realtime-orders"
import { getDashboardStats } from "@/lib/actions/dashboard"
import { 
  DollarSign, 
  Package, 
  ShoppingCart, 
  Activity, 
  Globe, 
  Zap, 
  TrendingUp,
  Cpu,
  ShieldCheck,
  ZapOff
} from "lucide-react"

import { LiveOrderFeed } from "@/components/dashboard/live-order-feed"
import { NexusChat } from "@/components/dashboard/nexus-chat"

export function DashboardContent() {
  const [stats, setStats] = useState<any>(null)
  
  useRealtimeOrders()

  useEffect(() => {
    async function fetchStats() {
      const data = await getDashboardStats()
      setStats(data)
    }
    fetchStats()
  }, [])

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-1000">
      {/* Nexus AI Insight Bar */}
      <AIFinanceSummary />

      <BentoGrid>
        {/* 1. Main Operation Intelligence (Gelir & Tahmin) */}
        <BentoCard 
          index={0}
          title="Nexus Operasyonel Zeka" 
          description="Tüm platformların gerçek zamanlı performans analizi"
          className="md:col-span-3 lg:col-span-3 lg:row-span-1"
          icon={<Activity className="h-5 w-5" />}
        >
          <div className="h-[250px] mt-6 relative group/chart">
            <div className="absolute inset-0 bg-primary/5 blur-3xl opacity-0 group-hover/chart:opacity-100 transition-opacity duration-1000" />
            <RevenueAreaChart />
          </div>
        </BentoCard>

        {/* 2. Global Inventory Status */}
        <BentoCard 
          index={1}
          title="Merkezi Envanter" 
          description="Single Source of Truth"
          className="lg:col-span-1"
          icon={<Package className="h-5 w-5" />}
        >
          <div className="mt-4">
            <div className="text-4xl font-black tabular-nums tracking-tighter text-luxury">
              {stats?.totalStock?.toLocaleString("tr-TR") || "0"}
            </div>
            <div className="mt-4 space-y-2">
               <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-widest text-zinc-500">
                  <span>Kritik Seviye</span>
                  <span className="text-amber-500">%{stats?.lowStockPercentage || "0"}</span>
               </div>
               <div className="h-1.5 w-full bg-zinc-100 dark:bg-zinc-900 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-amber-500 rounded-full transition-all duration-1000" 
                    style={{ width: `${stats?.lowStockPercentage || 0}%` }}
                  />
               </div>
            </div>
          </div>
        </BentoCard>

        {/* 3. Live Order Stream (V3 FEED) */}
        <BentoCard 
          index={2}
          title="Canlı Sipariş Akışı" 
          description="Omni-Nexus Realtime Feed"
          className="lg:col-span-2"
          icon={<Cpu className="h-5 w-5" />}
        >
          <div className="mt-4">
             <LiveOrderFeed />
          </div>
        </BentoCard>

        {/* 4. Platform Health Check */}
        <BentoCard 
          index={3}
          title="Platform Sağlığı" 
          description="Entegrasyon Durumları"
          className="lg:col-span-1"
          icon={<ShieldCheck className="h-5 w-5" />}
        >
          <div className="mt-4 grid grid-cols-2 gap-2">
             <PlatformStatus label="Trendyol" status="active" />
             <PlatformStatus label="H.Burada" status="active" />
             <PlatformStatus label="N11" status="idle" />
             <PlatformStatus label="e-Logo" status="active" />
          </div>
        </BentoCard>

        {/* 5. Quick Commands */}
        <BentoCard 
          index={4}
          title="Hızlı Komutlar" 
          description="Sistem Aksiyonları"
          className="lg:col-span-1"
          icon={<Zap className="h-5 w-5" />}
        >
          <div className="mt-2">
            <QuickActions />
          </div>
        </BentoCard>
      </BentoGrid>

      {/* Luxury Support Module */}
      <NexusChat />
    </div>
  )
}

function PlatformStatus({ label, status }: { label: string, status: 'active' | 'idle' | 'error' }) {
  const colors = {
    active: "bg-green-500 shadow-green-500/20",
    idle: "bg-zinc-500 shadow-zinc-500/10",
    error: "bg-red-500 shadow-red-500/20"
  }
  
  return (
    <div className="flex items-center justify-between p-3 rounded-xl bg-zinc-100/5 dark:bg-zinc-900 shadow-sm border border-white/5">
       <span className="text-[10px] font-black uppercase tracking-tighter">{label}</span>
       <div className={`h-1.5 w-1.5 rounded-full ${colors[status]} shadow-lg`} />
    </div>
  )
}
