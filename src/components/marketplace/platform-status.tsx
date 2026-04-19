import { cn } from "@/lib/utils"
import { CheckCircle2, XCircle, AlertCircle } from "lucide-react"

interface PlatformStatusProps {
  platform: 'Trendyol' | 'Hepsiburada' | 'N11' | 'Ciceksepeti'
  status: 'active' | 'inactive' | 'error'
  className?: string
}

const config = {
  Trendyol: { color: "bg-[#f27a1a]", label: "TY" },
  Hepsiburada: { color: "bg-[#ff6000]", label: "HB" },
  N11: { color: "bg-[#5bb2ec]", label: "N11" },
  Ciceksepeti: { color: "bg-[#ff4d4d]", label: "ÇS" },
}

export function PlatformStatus({ platform, status, className }: PlatformStatusProps) {
  const settings = config[platform]

  return (
    <div className={cn("inline-flex items-center gap-1.5 px-2 py-1 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 shadow-sm", className)}>
      <div className={cn("w-5 h-5 rounded-md flex items-center justify-center text-[8px] font-black text-white", settings.color)}>
        {settings.label}
      </div>
      
      <span className="text-[10px] font-bold text-zinc-600 dark:text-zinc-400 uppercase tracking-tighter">
        {platform}
      </span>

      <div className="ml-1">
        {status === 'active' && <div className="w-1.5 h-1.5 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]" />}
        {status === 'inactive' && <div className="w-1.5 h-1.5 rounded-full bg-zinc-300" />}
        {status === 'error' && <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />}
      </div>
    </div>
  )
}

export function PlatformList({ statuses }: { statuses: { platform: any, status: any }[] }) {
    return (
        <div className="flex flex-wrap gap-2">
            {statuses.map((s, i) => (
                <PlatformStatus key={i} platform={s.platform} status={s.status} />
            ))}
        </div>
    )
}
