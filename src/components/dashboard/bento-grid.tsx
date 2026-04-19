import { ReactNode } from "react"
import { cn } from "@/lib/utils"

interface BentoGridProps {
  children: ReactNode
  className?: string
}

export function BentoGrid({ children, className }: BentoGridProps) {
  return (
    <div
      className={cn(
        "grid w-full auto-rows-[22rem] grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-4",
        className
      )}
    >
      {children}
    </div>
  )
}

interface BentoCardProps {
  children: ReactNode
  className?: string
  title?: string
  description?: string
  icon?: ReactNode
}

export function BentoCard({
  children,
  className,
  title,
  description,
  icon,
}: BentoCardProps) {
  return (
    <div
      className={cn(
        "group relative flex flex-col justify-between overflow-hidden rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm transition-all hover:shadow-md dark:border-zinc-800 dark:bg-zinc-950",
        className
      )}
    >
      {/* Background decoration */}
      <div className="absolute -right-4 -top-4 h-24 w-24 bg-zinc-100/50 blur-3xl transition-colors group-hover:bg-primary/5 dark:bg-zinc-900/50" />
      
      <div className="relative z-10">
        <div className="flex items-center gap-3">
          {icon && (
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-zinc-100 text-zinc-600 transition-colors group-hover:bg-primary/10 group-hover:text-primary dark:bg-zinc-900 dark:text-zinc-400">
              {icon}
            </div>
          )}
          <div>
            {title && <h3 className="font-bold tracking-tight text-zinc-900 dark:text-zinc-100">{title}</h3>}
            {description && <p className="text-xs text-zinc-500">{description}</p>}
          </div>
        </div>
      </div>

      <div className="relative z-10 mt-4 flex-1">
        {children}
      </div>
    </div>
  )
}
