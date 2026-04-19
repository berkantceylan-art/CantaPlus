"use client"

import * as React from "react"
import {
  Calculator,
  Calendar,
  CreditCard,
  Settings,
  Smile,
  User,
  Search,
  Zap,
  Package,
  ShoppingCart,
  Plus
} from "lucide-react"

import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command"
import { useRouter } from "next/navigation"

export function DashboardCommandPalette() {
  const [open, setOpen] = React.useState(false)
  const router = useRouter()

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen((open) => !open)
      }
    }

    document.addEventListener("keydown", down)
    return () => document.removeEventListener("keydown", down)
  }, [])

  const runCommand = (command: () => void) => {
    setOpen(false)
    command()
  }

  return (
    <>
      <button 
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 px-3 py-1.5 text-xs text-zinc-500 bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-colors"
      >
        <Search className="h-3 w-3" />
        <span>Komut ara...</span>
        <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100 uppercase">
          <span className="text-xs">⌘</span>K
        </kbd>
      </button>

      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Bir komut yazın veya arama yapın..." />
        <CommandList>
          <CommandEmpty>Sonuç bulunamadı.</CommandEmpty>
          <CommandGroup heading="Hızlı İşlemler">
            <CommandItem onSelect={() => runCommand(() => router.push("/dashboard/urunler/yeni"))}>
              <Plus className="mr-2 h-4 w-4" />
              <span>Yeni Ürün Ekle</span>
              <CommandShortcut>⌘N</CommandShortcut>
            </CommandItem>
            <CommandItem onSelect={() => runCommand(() => router.push("/dashboard/pazaryeri"))}>
              <Zap className="mr-2 h-4 w-4" />
              <span>Pazaryeri Eşitle</span>
            </CommandItem>
          </CommandGroup>
          <CommandSeparator />
          <CommandGroup heading="Navigasyon">
            <CommandItem onSelect={() => runCommand(() => router.push("/dashboard"))}>
              <User className="mr-2 h-4 w-4" />
              <span>Profilim</span>
            </CommandItem>
            <CommandItem onSelect={() => runCommand(() => router.push("/dashboard/siparisler"))}>
              <ShoppingCart className="mr-2 h-4 w-4" />
              <span>Siparişler</span>
            </CommandItem>
            <CommandItem onSelect={() => runCommand(() => router.push("/dashboard/ayarlar"))}>
              <Settings className="mr-2 h-4 w-4" />
              <span>Ayarlar</span>
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  )
}
