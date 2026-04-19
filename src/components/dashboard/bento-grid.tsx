"use client"

import { ReactNode } from "react"
import { cn } from "@/lib/utils"
import { motion, useReducedMotion } from "framer-motion"

interface BentoGridProps {
  children: ReactNode
  className?: string
}

export function BentoGrid({ children, className }: BentoGridProps) {
  return (
    <div
      className={cn(
        "grid w-full auto-rows-[22rem] grid-cols-1 gap-6 md:grid-cols-3 lg:grid-cols-4",
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
  index?: number
}

export function BentoCard({
  children,
  className,
  title,
  description,
  icon,
  index = 0
}: BentoCardProps) {
  const shouldReduceMotion = useReducedMotion()
  
  return (
    <motion.div
      initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 20 }}
      animate={shouldReduceMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
      transition={{ 
        duration: 0.6, 
        delay: index * 0.1, 
        ease: [0.16, 1, 0.3, 1] 
      }}
      whileHover={shouldReduceMotion ? {} : { 
        y: -5, 
        scale: 1.01,
        transition: { duration: 0.3 } 
      }}
      className={cn(
        "group relative flex flex-col justify-between overflow-hidden rounded-[2.5rem] border border-white/5 bg-card/40 p-8 luxury-shadow backdrop-blur-xl transition-colors hover:border-primary/20",
        className
      )}
    >
      {/* Dynamic Gold Gradient Background */}
      <div className="absolute -right-8 -top-8 h-32 w-32 bg-primary/5 blur-3xl transition-opacity group-hover:opacity-100 opacity-20" />
      
      <div className="relative z-10">
        <div className="flex items-center gap-4">
          {icon && (
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-zinc-100/5 dark:bg-zinc-900/50 text-zinc-400 transition-colors group-hover:bg-primary group-hover:text-primary-foreground luxury-shadow border border-white/5">
              {icon}
            </div>
          )}
          <div>
            {title && (
               <h3 className="text-sm font-black tracking-widest text-zinc-900 dark:text-zinc-100 uppercase leading-none">
                 {title}
               </h3>
            )}
            {description && (
               <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-tighter mt-1">
                 {description}
               </p>
            )}
          </div>
        </div>
      </div>

      <div className="relative z-10 mt-6 flex-1">
        {children}
      </div>

      {/* Decorative Accent */}
      <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
    </motion.div>
  )
}
