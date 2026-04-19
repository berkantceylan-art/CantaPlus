"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button, buttonVariants } from "@/components/ui/button"
import { 
  Search, 
  Filter, 
  ExternalLink, 
  MoreHorizontal, 
  Truck, 
  CheckCircle2, 
  Clock,
  AlertCircle
} from "lucide-react"
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu"
import { useState } from "react"
import { InvoiceModal } from "@/components/admin/invoice-modal"

const orders = [
  {
    id: "ORD-7283",
    customer: "Ahmet Yılmaz",
    date: "19 Nisan 2026",
    total: "₺2,450.00",
    status: "Hazırlanıyor",
    platform: "Trendyol",
    badge: "bg-orange-500/10 text-orange-500 border-orange-500/20"
  },
  {
    id: "ORD-9210",
    customer: "Ayşe Kaya",
    date: "18 Nisan 2026",
    total: "₺4,120.00",
    status: "Kargoya Verildi",
    platform: "ÇantaPlus",
    badge: "bg-blue-500/10 text-blue-500 border-blue-500/20"
  },
  {
    id: "ORD-1209",
    customer: "Mehmet Demir",
    date: "18 Nisan 2026",
    total: "₺890.00",
    status: "Teslim Edildi",
    platform: "Hepsiburada",
    badge: "bg-green-500/10 text-green-500 border-green-500/20"
  },
  {
    id: "ORD-4432",
    customer: "Canan Şahin",
    date: "17 Nisan 2026",
    total: "₺1,750.00",
    status: "İptal Edildi",
    platform: "N11",
    badge: "bg-red-500/10 text-red-500 border-red-500/20"
  }
]

export default function OrdersPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedOrder, setSelectedOrder] = useState<any>(null)
  const [isInvoiceOpen, setIsInvoiceOpen] = useState(false)

  const openInvoice = (order: any) => {
    setSelectedOrder(order)
    setIsInvoiceOpen(true)
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Sipariş Merkezi</h1>
          <p className="text-muted-foreground">Tüm platformlardan gelen siparişleri buradan yönetin.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Filter className="mr-2 h-4 w-4" /> Filtrele
          </Button>
          <Button>Dışa Aktar (Excel)</Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Siparişler</CardTitle>
              <CardDescription>Son 30 gün içindeki tüm siparişlerinizin listesi.</CardDescription>
            </div>
            <div className="relative w-64">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Sipariş veya müşteri ara..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="relative w-full overflow-auto">
            <table className="w-full caption-bottom text-sm">
              <thead className="[&_tr]:border-b bg-muted/50">
                <tr className="border-b transition-colors hover:bg-muted/50">
                  <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Sipariş No</th>
                  <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Müşteri</th>
                  <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Platform</th>
                  <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Tarih</th>
                  <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Durum</th>
                  <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Toplam</th>
                  <th className="h-12 px-4 text-right align-middle font-medium text-muted-foreground"></th>
                </tr>
              </thead>
              <tbody className="[&_tr:last-child]:border-0">
                {orders.map((order) => (
                  <tr key={order.id} className="border-b transition-colors hover:bg-muted/50">
                    <td className="p-4 align-middle font-medium">{order.id}</td>
                    <td className="p-4 align-middle">{order.customer}</td>
                    <td className="p-4 align-middle">
                      <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold ${order.badge}`}>
                        {order.platform}
                      </span>
                    </td>
                    <td className="p-4 align-middle text-muted-foreground">{order.date}</td>
                    <td className="p-4 align-middle">
                      <div className="flex items-center gap-2">
                        {order.status === "Hazırlanıyor" && <Clock className="h-4 w-4 text-orange-500" />}
                        {order.status === "Kargoya Verildi" && <Truck className="h-4 w-4 text-blue-500" />}
                        {order.status === "Teslim Edildi" && <CheckCircle2 className="h-4 w-4 text-green-500" />}
                        {order.status === "İptal Edildi" && <AlertCircle className="h-4 w-4 text-red-500" />}
                        <span>{order.status}</span>
                      </div>
                    </td>
                    <td className="p-4 align-middle font-medium">{order.total}</td>
                    <td className="p-4 align-middle text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger className={buttonVariants({ variant: "ghost", size: "icon" })}>
                          <MoreHorizontal className="h-4 w-4" />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>İşlemler</DropdownMenuLabel>
                          <DropdownMenuItem>Sipariş Detayı</DropdownMenuItem>
                          <DropdownMenuItem onClick={() => openInvoice(order)}>Fatura Görüntüle</DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-blue-500">Kargo Etiketi Yazdır</DropdownMenuItem>
                          <DropdownMenuItem className="text-red-500">Siparişi İptal Et</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <InvoiceModal 
        isOpen={isInvoiceOpen} 
        onClose={() => setIsInvoiceOpen(false)} 
        order={selectedOrder} 
      />
    </div>
  )
}
