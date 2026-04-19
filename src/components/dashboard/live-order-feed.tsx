"use client"

import { useOmniNexusStore } from "@/lib/store/nexus-store"
import { motion, AnimatePresence } from "framer-motion"
import { ShoppingCart, ExternalLink, Clock } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import { tr } from "date-fns/locale"

export function LiveOrderFeed() {
  const { orderFeed } = useOmniNexusStore()

  if (orderFeed.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 opacity-30 select-none">
        <ShoppingCart className="h-10 w-10 mb-3" />
        <p className="text-[10px] font-black uppercase tracking-widest text-center">
          Yeni nexus akışı bekleniyor... <br/>
          <span className="opacity-50">Canlı Bağlantı Aktif</span>
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-3 overflow-y-auto pr-1 custom-scrollbar max-h-[300px]">
      <AnimatePresence initial={false}>
        {orderFeed.map((order, index) => (
          <motion.div
            key={order.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 500, damping: 30 }}
            className="group p-4 luxury-glass rounded-2xl border border-white/5 hover:border-primary/20 transition-all luxury-shadow flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
               <div className={`h-10 w-10 rounded-xl flex items-center justify-center ${getPlatformColor(order.platform)} shadow-lg`}>
                  <ShoppingCart className="h-5 w-5 text-zinc-950" />
               </div>
               <div>
                  <div className="flex items-center gap-2">
                     <span className="text-[11px] font-black uppercase tracking-tighter">{order.customer_full_name || "Bilinmeyen Müşteri"}</span>
                     <span className="px-1.5 py-0.5 rounded-md bg-white/5 text-[8px] font-black text-zinc-500 uppercase">{order.platform}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-[9px] font-bold text-zinc-500 mt-0.5">
                     <Clock className="h-3 w-3 opacity-50" />
                     {formatDistanceToNow(new Date(order.created_at), { addSuffix: true, locale: tr })}
                  </div>
               </div>
            </div>

            <div className="text-right">
               <div className="text-sm font-black tracking-tighter text-luxury">₺{order.total_price}</div>
               <button className="h-6 w-6 rounded-lg bg-zinc-100/5 dark:bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <ExternalLink className="h-3 w-3" />
               </button>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}

function getPlatformColor(platform: string) {
  switch (platform.toLowerCase()) {
    case 'trendyol': return "bg-orange-500"
    case 'hepsiburada': return "bg-amber-600"
    case 'n11': return "bg-red-600"
    default: return "bg-primary"
  }
}
