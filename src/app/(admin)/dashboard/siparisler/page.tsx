"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button, buttonVariants } from "@/components/ui/button"
import { 
  Search, 
  Filter, 
  MoreHorizontal, 
  Truck, 
  CheckCircle2, 
  Clock,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  Globe,
  Zap,
  ShoppingBag
} from "lucide-react"
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu"
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { InvoiceModal } from "@/components/admin/invoice-modal"
import { getOrders } from "@/lib/actions/orders"
import { PlatformStatus } from "@/components/marketplace/platform-status"

export default function OrdersPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [platform, setPlatform] = useState("all")
  const [status, setStatus] = useState("all")
  const [page, setPage] = useState(1)
  const [data, setData] = useState<any[]>([])
  const [count, setCount] = useState(0)
  const [loading, setLoading] = useState(true)
  
  const [selectedOrder, setSelectedOrder] = useState<any>(null)
  const [isInvoiceOpen, setIsInvoiceOpen] = useState(false)

  const fetchData = async () => {
    setLoading(true)
    const result = await getOrders({
      search: searchTerm,
      platform,
      status,
      page,
      pageSize: 10
    })
    setData(result.data || [])
    setCount(result.count || 0)
    setLoading(false)
  }

  useEffect(() => {
    fetchData()
  }, [searchTerm, platform, status, page])

  const openInvoice = (order: any) => {
    setSelectedOrder(order)
    setIsInvoiceOpen(true)
  }

  const totalPages = Math.ceil(count / 10)

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tighter uppercase">Sipariş <span className="text-zinc-400">Merkezi</span></h1>
          <p className="text-sm text-muted-foreground uppercase font-medium tracking-widest">Tüm platformlardan gelen canlı veriler</p>
        </div>
        <div className="flex gap-2 w-full md:w-auto">
          <Button variant="outline" className="rounded-xl border-zinc-200 dark:border-zinc-800">
            <Zap className="mr-2 h-4 w-4 text-primary" /> Toplu Senkronizasyon
          </Button>
          <Button className="rounded-xl shadow-lg border-none">Dışa Aktar (Excel)</Button>
        </div>
      </div>

      <Card className="border-zinc-200 dark:border-zinc-800 shadow-sm overflow-hidden rounded-3xl">
        <CardHeader className="bg-zinc-50/50 dark:bg-zinc-900/50 border-b border-zinc-200 dark:border-zinc-800">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-3">
              <div className="relative w-full md:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Sipariş no ara..."
                  className="pl-9 rounded-xl border-zinc-200 dark:border-zinc-800 focus-visible:ring-primary"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              <Select value={platform} onValueChange={setPlatform}>
                <SelectTrigger className="w-[140px] rounded-xl border-zinc-200 dark:border-zinc-800">
                  <SelectValue placeholder="Platform" />
                </SelectTrigger>
                <SelectContent className="rounded-xl">
                  <SelectItem value="all">Tüm Platformlar</SelectItem>
                  <SelectItem value="Trendyol">Trendyol</SelectItem>
                  <SelectItem value="Hepsiburada">Hepsiburada</SelectItem>
                  <SelectItem value="ÇantaPlus">ÇantaPlus</SelectItem>
                </SelectContent>
              </Select>

              <Select value={status} onValueChange={setStatus}>
                <SelectTrigger className="w-[140px] rounded-xl border-zinc-200 dark:border-zinc-800">
                  <SelectValue placeholder="Durum" />
                </SelectTrigger>
                <SelectContent className="rounded-xl">
                  <SelectItem value="all">Tüm Durumlar</SelectItem>
                  <SelectItem value="pending">Hazırlanıyor</SelectItem>
                  <SelectItem value="shipped">Kargoda</SelectItem>
                  <SelectItem value="delivered">Teslim Edildi</SelectItem>
                  <SelectItem value="cancelled">İptal Edildi</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest whitespace-nowrap">
              Toplam {count} Kayıt Bulundu
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="relative w-full overflow-auto">
            <table className="w-full text-sm">
              <thead className="bg-zinc-50/30 dark:bg-zinc-900/30 border-b border-zinc-200 dark:border-zinc-800">
                <tr>
                  <th className="h-12 px-6 text-left align-middle font-bold text-zinc-500 uppercase text-[10px] tracking-widest">Sipariş No</th>
                  <th className="h-12 px-6 text-left align-middle font-bold text-zinc-500 uppercase text-[10px] tracking-widest">Platform</th>
                  <th className="h-12 px-6 text-left align-middle font-bold text-zinc-500 uppercase text-[10px] tracking-widest">Müşteri</th>
                  <th className="h-12 px-6 text-left align-middle font-bold text-zinc-500 uppercase text-[10px] tracking-widest">Tarih</th>
                  <th className="h-12 px-6 text-left align-middle font-bold text-zinc-500 uppercase text-[10px] tracking-widest">Durum</th>
                  <th className="h-12 px-6 text-left align-middle font-bold text-zinc-500 uppercase text-[10px] tracking-widest text-right">Toplam</th>
                  <th className="h-12 px-6 text-right"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
                {loading ? (
                   Array.from({ length: 5 }).map((_, i) => (
                    <tr key={i} className="animate-pulse">
                      <td colSpan={7} className="h-16 px-6">
                        <div className="h-4 bg-zinc-100 dark:bg-zinc-900 rounded-full w-full opacity-50" />
                      </td>
                    </tr>
                   ))
                ) : data.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="h-32 text-center text-zinc-500">
                      Hiç sipariş bulunamadı.
                    </td>
                  </tr>
                ) : (
                  data.map((order) => (
                    <tr key={order.id} className="hover:bg-zinc-50/50 dark:hover:bg-zinc-900/50 transition-colors">
                      <td className="px-6 py-4 align-middle font-black tabular-nums tracking-tighter">#{order.id.slice(0, 8).toUpperCase()}</td>
                      <td className="px-6 py-4 align-middle">
                        <PlatformStatus 
                          platform={order.platform as any} 
                          status="active" 
                          className="border-none shadow-none bg-transparent p-0"
                        />
                      </td>
                      <td className="px-6 py-4 align-middle font-medium text-zinc-600 dark:text-zinc-400">Kurumsal Müşteri</td>
                      <td className="px-6 py-4 align-middle text-[11px] font-bold text-zinc-500 uppercase">
                        {new Date(order.created_at).toLocaleDateString("tr-TR")}
                      </td>
                      <td className="px-6 py-4 align-middle">
                        <div className="flex items-center gap-2">
                          {order.status === "pending" && (
                            <span className="flex items-center gap-1 text-orange-500 bg-orange-500/5 px-2 py-0.5 rounded-full text-[10px] font-bold border border-orange-500/10 uppercase">
                              <Clock className="h-3 w-3" /> Hazırlanıyor
                            </span>
                          )}
                          {order.status === "shipped" && (
                            <span className="flex items-center gap-1 text-blue-500 bg-blue-500/5 px-2 py-0.5 rounded-full text-[10px] font-bold border border-blue-500/10 uppercase">
                              <Truck className="h-3 w-3" /> Kargoda
                            </span>
                          )}
                          {order.status === "delivered" && (
                            <span className="flex items-center gap-1 text-green-500 bg-green-500/5 px-2 py-0.5 rounded-full text-[10px] font-bold border border-green-500/10 uppercase">
                              <CheckCircle2 className="h-3 w-3" /> Teslim Edildi
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 align-middle text-right font-black tabular-nums tracking-tighter text-zinc-900 dark:text-zinc-100">
                        ₺{Number(order.total_price).toLocaleString("tr-TR")}
                      </td>
                      <td className="px-6 py-4 align-middle text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger className={buttonVariants({ variant: "ghost", size: "icon" })}>
                            <MoreHorizontal className="h-4 w-4" />
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="rounded-xl">
                            <DropdownMenuLabel className="text-[10px] uppercase tracking-widest text-zinc-400">İşlemler</DropdownMenuLabel>
                            <DropdownMenuItem className="text-xs">Sipariş Detayı</DropdownMenuItem>
                            <DropdownMenuItem className="text-xs" onClick={() => openInvoice({
                                ...order,
                                customerName: "Kurumsal Müşteri",
                                date: new Date(order.created_at).toLocaleDateString("tr-TR"),
                                items: [], // Detaylı items eklenebilir
                                total: order.total_price
                            })}>Fatura Görüntüle</DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-xs text-blue-500">Kargo Etiketi</DropdownMenuItem>
                            <DropdownMenuItem className="text-xs text-red-500">İptal Et</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
        <div className="p-4 border-t border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50 flex items-center justify-between">
            <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
                Sayfa {page} / {totalPages || 1}
            </div>
            <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="rounded-lg"
                  disabled={page <= 1}
                  onClick={() => setPage(p => p - 1)}
                >
                    <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="rounded-lg"
                  disabled={page >= totalPages}
                  onClick={() => setPage(p => p + 1)}
                >
                    <ChevronRight className="h-4 w-4" />
                </Button>
            </div>
        </div>
      </Card>

      <InvoiceModal 
        isOpen={isInvoiceOpen} 
        onClose={() => setIsInvoiceOpen(false)} 
        order={selectedOrder} 
      />
    </div>
  )
}
