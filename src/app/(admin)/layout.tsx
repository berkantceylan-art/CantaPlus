import Link from "next/link"
import { Package, LayoutDashboard, ShoppingCart, Settings, Users, ArrowLeft, LogOut, Zap, Bell, Search } from "lucide-react"
import { logout } from "@/lib/actions/auth"
import { Button } from "@/components/ui/button"
import { Toaster } from "@/components/ui/sonner"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Nexus Floating Sidebar */}
      <aside className="w-64 p-4 h-full hidden md:flex flex-col z-50">
        <div className="flex-1 glass-panel rounded-[2rem] luxury-shadow flex flex-col overflow-hidden border-white/5">
          <div className="p-8 flex items-center gap-3">
            <div className="h-10 w-10 gold-gradient rounded-2xl flex items-center justify-center shadow-lg gold-glow">
              <Zap className="h-5 w-5 text-zinc-950 fill-current" />
            </div>
            <div>
              <span className="text-sm font-black tracking-tighter uppercase block leading-none">Nexus</span>
              <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest leading-none">Command Center</span>
            </div>
          </div>

          <nav className="flex-1 px-4 space-y-1.5 overflow-y-auto custom-scrollbar">
             <SidebarItem href="/dashboard" icon={<LayoutDashboard className="h-4 w-4" />} label="Dashboard" active />
             <SidebarItem href="/dashboard/urunler" icon={<Package className="h-4 w-4" />} label="Katalog" />
             <SidebarItem href="/dashboard/siparisler" icon={<ShoppingCart className="h-4 w-4" />} label="Siparişler" />
             <SidebarItem href="/dashboard/musteriler" icon={<Users className="h-4 w-4" />} label="Müşteriler" />
             <div className="h-4" />
             <div className="px-4 py-2">
               <span className="text-[9px] font-black uppercase tracking-widest text-zinc-500/50">Omni-Channel</span>
             </div>
             <SidebarItem href="/dashboard/pazaryeri" icon={<Zap className="h-4 w-4" />} label="Pazaryeri" primary />
             <SidebarItem href="/dashboard/ayarlar" icon={<Settings className="h-4 w-4" />} label="Entegrasyon" />
          </nav>

          <div className="p-4 mt-auto">
            <div className="p-4 bg-muted/20 rounded-2xl border border-white/5 space-y-3">
               <Link href="/" className="flex items-center gap-2 text-[11px] font-bold text-zinc-500 hover:text-foreground transition-colors uppercase tracking-tight">
                 <ArrowLeft className="h-3 w-3" /> Mağazaya Dön
               </Link>
               <form action={logout}>
                <button type="submit" className="flex w-full items-center gap-2 text-[11px] font-bold text-destructive hover:bg-destructive/10 p-2 rounded-xl transition-all uppercase tracking-tight">
                  <LogOut className="h-3 w-3" /> Güvenli Çıkış
                </button>
              </form>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Command Area */}
      <main className="flex-1 relative overflow-y-auto p-4 md:p-8 custom-scrollbar">
        {/* Top Floating Glass Header */}
        <header className="sticky top-0 z-40 mb-8 flex items-center justify-between pointer-events-none">
           <div className="pointer-events-auto h-12 glass-panel rounded-2xl flex items-center px-4 gap-4 luxury-shadow border-white/5">
              <Search className="h-4 w-4 text-zinc-500" />
              <input 
                placeholder="Nexus'ta ara... (CMD+K)" 
                className="bg-transparent border-none outline-none text-xs font-medium w-48 placeholder:text-zinc-500"
              />
           </div>

           <div className="pointer-events-auto flex items-center gap-3">
              <button className="h-10 w-10 glass-panel rounded-xl flex items-center justify-center hover:bg-white/10 transition-colors luxury-shadow">
                <Bell className="h-4 w-4" />
              </button>
              <div className="h-10 px-4 glass-panel rounded-xl flex items-center gap-2 luxury-shadow">
                 <div className="h-6 w-6 rounded-full bg-primary flex items-center justify-center text-[10px] font-black text-primary-foreground">A</div>
                 <span className="text-[10px] font-black uppercase tracking-widest">Admin</span>
              </div>
           </div>
        </header>

        <div className="max-w-(--breakpoint-2xl) mx-auto">
          {children}
        </div>
      </main>

      <Toaster position="top-right" richColors closeButton />
    </div>
  )
}

function SidebarItem({ href, icon, label, active = false, primary = false }: any) {
  return (
    <Link 
      href={href} 
      className={`
        flex items-center gap-3 px-4 py-3 rounded-2xl text-[12px] font-bold transition-all duration-300 group
        ${active 
          ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20" 
          : primary 
            ? "text-primary hover:bg-primary/5 hover:translate-x-1"
            : "text-zinc-500 hover:text-foreground hover:bg-white/5 hover:translate-x-1"}
      `}
    >
      <span className={`transition-transform group-hover:scale-110 ${primary ? "animate-pulse" : ""}`}>
        {icon}
      </span>
      <span className="uppercase tracking-widest">{label}</span>
      {active && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-primary-foreground shadow-glow" />}
    </Link>
  )
}
