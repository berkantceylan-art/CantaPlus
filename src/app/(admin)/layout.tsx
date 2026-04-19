import Link from "next/link"
import { Package, LayoutDashboard, ShoppingCart, Settings, Users, ArrowLeft, LogOut, Zap } from "lucide-react"
import { logout } from "@/lib/actions/auth"
import { Button } from "@/components/ui/button"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="w-64 border-r bg-muted/30 flex flex-col">
        <div className="flex h-16 items-center border-b px-6">
          <Link href="/dashboard" className="flex items-center gap-2 font-bold text-lg">
            <Package className="h-6 w-6" />
            <span>Merkez Üs</span>
          </Link>
        </div>
        <nav className="flex-1 space-y-1 p-4">
          <Link href="/dashboard" className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium hover:bg-muted bg-muted/60">
            <LayoutDashboard className="h-4 w-4" />
            Dashboard
          </Link>
          <Link href="/dashboard/urunler" className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium hover:bg-muted text-muted-foreground">
            <Package className="h-4 w-4" />
            Ürün Yönetimi
          </Link>
          <Link href="/dashboard/siparisler" className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium hover:bg-muted text-muted-foreground">
            <ShoppingCart className="h-4 w-4" />
            Siparişler
          </Link>
          <Link href="/dashboard/musteriler" className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium hover:bg-muted text-muted-foreground">
            <Users className="h-4 w-4" />
            Müşteriler
          </Link>
          <Link href="/dashboard/pazaryeri" className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium hover:bg-muted text-primary font-bold group">
            <Zap className="h-4 w-4 group-hover:animate-pulse" />
            Pazaryeri Komuta
          </Link>
          <Link href="/dashboard/ayarlar" className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium hover:bg-muted text-muted-foreground">
            <Settings className="h-4 w-4" />
            Ayarlar / Entegrasyon
          </Link>
        </nav>
        <div className="border-t p-4 space-y-2">
          <Link href="/" className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium hover:bg-muted text-muted-foreground">
            <ArrowLeft className="h-4 w-4" />
            Mağazaya Dön
          </Link>
          <form action={logout}>
            <button type="submit" className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-destructive hover:bg-destructive/10 transition-colors">
              <LogOut className="h-4 w-4" />
              Güvenli Çıkış
            </button>
          </form>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto bg-muted/10 p-8">
        {children}
      </main>
    </div>
  )
}
