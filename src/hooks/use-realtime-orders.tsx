"use client"

import { useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { toast } from "sonner"
import { ShoppingBag } from "lucide-react"

export function useRealtimeOrders() {
  const supabase = createClient()

  useEffect(() => {
    const channel = supabase
      .channel('realtime_orders')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'orders',
        },
        (payload) => {
          console.log('[Realtime Order]:', payload.new)
          
          toast.success("Yeni Sipariş Alındı!", {
            description: `${payload.new.platform} üzerinden ₺${payload.new.total_price} tutarında yeni oda siparişi.`,
            icon: <ShoppingBag className="h-4 w-4" />,
            duration: 8000,
            action: {
              label: "Görüntüle",
              onClick: () => window.location.href = `/dashboard/siparisler`
            }
          })
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [supabase])
}
