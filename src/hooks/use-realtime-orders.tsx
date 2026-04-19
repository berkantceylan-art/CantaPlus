"use client"

import { useEffect, useRef } from "react"
import { createClient } from "@/lib/supabase/client"
import { toast } from "sonner"
import { ShoppingBag, Zap } from "lucide-react"
import { useOmniNexusStore } from "@/lib/store/nexus-store"

// Luxury Notification Sound (Premium Ping)
const NOTIFICATION_SOUND_URL = "https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3"

export function useRealtimeOrders() {
  const supabase = createClient()
  const { addOrderToFeed, notificationsEnabled } = useOmniNexusStore()
  const audioRef = useRef<HTMLAudioElement | null>(null)

  useEffect(() => {
    // Ses dosyasını önden yükle
    audioRef.current = new Audio(NOTIFICATION_SOUND_URL)
    audioRef.current.volume = 0.4

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
          console.log('[Omni-Nexus Feed]:', payload.new)
          
          // 1. Merkezi Store'a Ekle (Dashboard Feed için)
          addOrderToFeed(payload.new)

          // 2. Sesli Bildirim (Kullanıcı etkileşimi şartı ile)
          if (notificationsEnabled && audioRef.current) {
            audioRef.current.play().catch(() => {
              console.warn("[Nexus Sound]: Ses çalınamadı (Tarayıcı kısıtlaması).")
            })
          }
          
          // 3. Görsel Bildirim (Toast)
          toast.success("Yeni Sipariş!", {
            description: `${payload.new.platform} - ₺${payload.new.total_price}`,
            icon: <Zap className="h-4 w-4 text-primary fill-current" />,
            duration: 10000,
            action: {
              label: "Yönet",
              onClick: () => window.location.href = `/dashboard/siparisler`
            }
          })
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [supabase, addOrderToFeed, notificationsEnabled])
}
