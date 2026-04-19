"use client"

import { Button } from "@/components/ui/button"
import { 
  Zap, 
  RefreshCcw, 
  FileText, 
  TrendingUp, 
  PackageSearch 
} from "lucide-react"

export function QuickActions() {
  return (
    <div className="grid grid-cols-2 gap-3">
      <Button 
        variant="outline" 
        className="h-auto flex-col items-center justify-center p-4 border-zinc-200 hover:bg-primary/5 hover:border-primary/20 dark:border-zinc-800 transition-all rounded-3xl"
      >
        <div className="mb-2 p-2 rounded-xl bg-primary/10 text-primary">
          <TrendingUp className="h-5 w-5" />
        </div>
        <span className="text-[10px] font-bold uppercase tracking-widest">Fiyat Güncelle</span>
      </Button>

      <Button 
        variant="outline" 
        className="h-auto flex-col items-center justify-center p-4 border-zinc-200 hover:bg-orange-500/5 hover:border-orange-500/20 dark:border-zinc-800 transition-all rounded-3xl"
      >
        <div className="mb-2 p-2 rounded-xl bg-orange-500/10 text-orange-500">
          <RefreshCcw className="h-5 w-5" />
        </div>
        <span className="text-[10px] font-bold uppercase tracking-widest">Stok Senk.</span>
      </Button>

      <Button 
        variant="outline" 
        className="h-auto flex-col items-center justify-center p-4 border-zinc-200 hover:bg-blue-500/5 hover:border-blue-500/20 dark:border-zinc-800 transition-all rounded-3xl"
      >
        <div className="mb-2 p-2 rounded-xl bg-blue-500/10 text-blue-500">
          <FileText className="h-5 w-5" />
        </div>
        <span className="text-[10px] font-bold uppercase tracking-widest">Fatura Kes</span>
      </Button>

      <Button 
        variant="outline" 
        className="h-auto flex-col items-center justify-center p-4 border-zinc-200 hover:bg-zinc-100 hover:border-zinc-300 dark:border-zinc-800 dark:hover:bg-zinc-900 transition-all rounded-3xl"
      >
        <div className="mb-2 p-2 rounded-xl bg-zinc-500/10 text-zinc-500">
          <PackageSearch className="h-5 w-5" />
        </div>
        <span className="text-[10px] font-bold uppercase tracking-widest">Ürün Bul</span>
      </Button>
    </div>
  )
}
