import { create } from 'zustand'

interface OmniNexusState {
  orderFeed: any[]
  addOrderToFeed: (order: any) => void
  notificationsEnabled: boolean
  toggleNotifications: () => void
}

export const useOmniNexusStore = create<OmniNexusState>((set) => ({
  orderFeed: [],
  notificationsEnabled: true,
  addOrderToFeed: (order) => set((state) => ({ 
    orderFeed: [order, ...state.orderFeed].slice(0, 20) // Son 20 sipariş
  })),
  toggleNotifications: () => set((state) => ({ 
    notificationsEnabled: !state.notificationsEnabled 
  })),
}))
