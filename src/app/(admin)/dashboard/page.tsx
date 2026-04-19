export const dynamic = 'force-dynamic'

import { DashboardContent } from "@/components/dashboard/dashboard-content"

/**
 * Dashboard ana sayfa (Sunucu tarafı)
 * Build hatalarını önlemek için 'force-dynamic' burada, 
 * interaktif mantık ise DashboardContent (Client) içindedir.
 */
export default function DashboardPage() {
  return <DashboardContent />
}
