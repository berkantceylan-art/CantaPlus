"use client"

import { Receipt, Smartphone, Globe, Mail } from "lucide-react"

interface InvoiceProps {
  order: {
    id: string
    customerName: string
    date: string
    items: { name: string; price: number; quantity: number }[]
    total: number
  }
}

export function InvoiceTemplate({ order }: InvoiceProps) {
  return (
    <div className="w-[210mm] min-h-[297mm] bg-white text-zinc-950 p-[20mm] mx-auto shadow-2xl font-sans">
      {/* Header */}
      <div className="flex justify-between items-start border-b-2 border-zinc-900 pb-12">
        <div>
          <h1 className="text-4xl font-black tracking-tighter uppercase mb-4">
            Çanta<span className="text-zinc-500">Plus</span>
          </h1>
          <div className="space-y-1 text-xs text-zinc-500 uppercase tracking-widest font-bold">
            <p>Nişantaşı, İstanbul / TR</p>
            <p>Mersis: 0123-4567-8901-0001</p>
            <p>V.D: Şişli / 1234567890</p>
          </div>
        </div>
        <div className="text-right">
          <h2 className="text-5xl font-light text-zinc-200 tracking-tighter uppercase mb-4">Fatura</h2>
          <div className="space-y-1 text-sm font-medium">
            <p className="text-zinc-400">Fatura No:</p>
            <p className="text-xl tabular-nums font-bold">{order.id}</p>
            <p className="text-zinc-400 mt-4">Tarih:</p>
            <p>{order.date}</p>
          </div>
        </div>
      </div>

      {/* Customer Info */}
      <div className="grid grid-cols-2 gap-12 py-12">
        <div>
          <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-400 mb-4 italic">Sayın</h3>
          <div className="text-xl font-bold leading-tight">
            {order.customerName}
          </div>
          <p className="text-sm text-zinc-500 mt-2">
            Levent, Melikşah Sk. No:12/4<br />
            Beşiktaş / İstanbul
          </p>
        </div>
        <div className="bg-zinc-50 p-6 rounded-2xl border border-zinc-200">
          <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-400 mb-2">Ödeme Bilgisi</h3>
          <p className="text-sm font-bold">Kredi Kartı / Iyzico</p>
          <div className="mt-4 flex items-center justify-between text-zinc-500 text-[10px] font-bold uppercase">
            <span>Para Birimi</span>
            <span className="text-zinc-950">TRY (₺)</span>
          </div>
        </div>
      </div>

      {/* Items Table */}
      <div className="mt-12">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-zinc-200 text-xs font-bold uppercase tracking-widest text-zinc-400">
              <th className="pb-4">Açıklama</th>
              <th className="pb-4 w-24 text-center">Adet</th>
              <th className="pb-4 w-32 text-right">Fiyat</th>
              <th className="pb-4 w-32 text-right">Toplam</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100">
            {order.items.map((item, i) => (
              <tr key={i} className="group">
                <td className="py-6 pr-4">
                  <p className="font-bold text-zinc-900">{item.name}</p>
                  <p className="text-[10px] text-zinc-400 uppercase mt-1 tracking-wider">Premium Deri Koleksiyonu</p>
                </td>
                <td className="py-6 text-center font-medium tabular-nums">{item.quantity}</td>
                <td className="py-6 text-right tabular-nums">₺{item.price.toLocaleString("tr-TR")}</td>
                <td className="py-6 text-right font-bold tabular-nums">₺{(item.price * item.quantity).toLocaleString("tr-TR")}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Summary */}
      <div className="mt-12 flex justify-end">
        <div className="w-64 space-y-3">
          <div className="flex justify-between text-sm text-zinc-500">
            <span>Ara Toplam</span>
            <span className="tabular-nums">₺{(order.total / 1.2).toLocaleString("tr-TR", { minimumFractionDigits: 2 })}</span>
          </div>
          <div className="flex justify-between text-sm text-zinc-500">
            <span>KDV (%20)</span>
            <span className="tabular-nums">₺{(order.total - (order.total / 1.2)).toLocaleString("tr-TR", { minimumFractionDigits: 2 })}</span>
          </div>
          <div className="h-px bg-zinc-900 my-2" />
          <div className="flex justify-between text-2xl font-black tabular-nums">
            <span>TOPLAM</span>
            <span>₺{order.total.toLocaleString("tr-TR", { minimumFractionDigits: 2 })}</span>
          </div>
        </div>
      </div>

      {/* Footer / Notes */}
      <div className="mt-auto pt-24 space-y-12">
        <div className="p-8 bg-zinc-50 rounded-3xl border border-zinc-100 italic text-sm text-zinc-500 leading-relaxed text-center">
          "Bu fatura elektronik ortamda oluşturulmuştur. ÇantaPlus lüks tasarımı ve kalitesiyle hayatınıza şıklık katmaya devam ediyor."
        </div>
        
        <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400">
          <div className="flex gap-6">
            <span className="flex items-center gap-1"><Smartphone className="h-3 w-3" /> 0850 123 45 67</span>
            <span className="flex items-center gap-1"><Globe className="h-3 w-3" /> cantaplus.com</span>
            <span className="flex items-center gap-1"><Mail className="h-3 w-3" /> info@cantaplus.com</span>
          </div>
          <div>Teşekkür Ederiz.</div>
        </div>
      </div>
    </div>
  )
}
