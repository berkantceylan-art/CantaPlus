"use client"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { InvoiceTemplate } from "./invoice-template"
import { Button } from "@/components/ui/button"
import { Printer, Download, Share2 } from "lucide-react"

interface InvoiceModalProps {
  isOpen: boolean
  onClose: () => void
  order: any
}

export function InvoiceModal({ isOpen, onClose, order }: InvoiceModalProps) {
  if (!order) return null

  // Mock data for the invoice template
  const invoiceData = {
    id: order.id,
    customerName: order.customer,
    date: order.date,
    items: [
      { name: "Premium Leather Tote Bag", price: 1200, quantity: 1 },
      { name: "Classic Wallet - Gold Edition", price: 450, quantity: 1 }
    ],
    total: order.total ? Number(order.total.replace(/[^0-9.-]+/g,"")) : 0
  }

  const handlePrint = () => {
    window.print()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[900px] w-full max-h-[90vh] overflow-y-auto p-0 bg-white border-zinc-200">
        <DialogHeader className="p-6 border-b bg-zinc-50 flex flex-row items-center justify-between sticky top-0 z-10">
          <div className="space-y-1">
            <DialogTitle className="text-zinc-950">E-Fatura Önizleme</DialogTitle>
            <p className="text-xs text-zinc-500 uppercase tracking-widest font-bold">{order.id} / {order.platform}</p>
          </div>
          <div className="flex gap-2">
            <Button variant="ghost" size="icon" className="text-zinc-500 hover:bg-zinc-200" title="Paylaş">
              <Share2 className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" className="text-zinc-500 hover:bg-zinc-200" title="İndir">
              <Download className="h-4 w-4" />
            </Button>
            <Button 
                variant="default" 
                onClick={handlePrint}
                className="bg-zinc-950 text-white hover:bg-zinc-800 gap-2"
            >
              <Printer className="h-4 w-4" />
              Yazdır
            </Button>
          </div>
        </DialogHeader>
        
        <div className="p-8 bg-zinc-100 flex justify-center">
            <div className="shadow-2xl scale-[0.8] origin-top md:scale-100">
                <InvoiceTemplate order={invoiceData} />
            </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
