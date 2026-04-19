"use server"

import { createClient } from "@/lib/supabase/server"

export interface OrderFilter {
  platform?: string
  status?: string
  search?: string
  page?: number
  pageSize?: number
}

export async function getOrders(filters: OrderFilter = {}) {
  const supabase = await createClient()
  const { 
    platform, 
    status, 
    search, 
    page = 1, 
    pageSize = 10 
  } = filters

  let query = supabase
    .from("orders")
    .select(`
      *,
      order_items (*)
    `, { count: 'exact' })

  // Filtreler
  if (platform && platform !== "all") {
    query = query.eq("platform", platform)
  }
  
  if (status && status !== "all") {
    query = query.eq("status", status)
  }

  if (search) {
    query = query.ilike("id", `%${search}%`)
  }

  // Sayfalama (Pagination)
  const from = (page - 1) * pageSize
  const to = from + pageSize - 1
  
  const { data, count, error } = await query
    .order("created_at", { ascending: false })
    .range(from, to)

  if (error) {
    console.error("[Orders Action Error]:", error)
    return { data: [], count: 0 }
  }

  return { data, count }
}

export async function updateOrderStatus(orderId: string, status: string) {
  const supabase = await createClient()
  
  const { error } = await supabase
    .from("orders")
    .update({ status })
    .eq("id", orderId)

  if (error) {
    console.error("[Update Status Error]:", error)
    return { success: false }
  }

  return { success: true }
}
