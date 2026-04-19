"use client"

import Link from 'next/link'
import { motion } from 'framer-motion'
import { Search, Menu, User, Moon, Sun } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useTheme } from 'next-themes'
import { useState, useEffect } from 'react'
import { CartDrawer } from './cart-drawer'
import { VisualSearch } from '../store/visual-search'

export function Navbar() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-6">
          <Button variant="ghost" size="icon" className="md:hidden">
            <Menu className="h-5 w-5" />
          </Button>
          <Link href="/" className="flex items-center gap-2">
            <motion.span 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-2xl font-bold tracking-tighter"
            >
              Çanta<span className="text-primary">Plus</span>
            </motion.span>
          </Link>
          <nav className="hidden md:flex gap-6">
            <Link href="/yeni" className="text-sm font-medium transition-colors hover:text-primary">
              Yeni Gelenler
            </Link>
            <Link href="/kadin" className="text-sm font-medium transition-colors hover:text-primary">
              Kadın
            </Link>
            <Link href="/erkek" className="text-sm font-medium transition-colors hover:text-primary">
              Erkek
            </Link>
            <Link href="/aksesuar" className="text-sm font-medium transition-colors hover:text-primary">
              Aksesuar
            </Link>
          </nav>
        </div>

        <div className="flex items-center gap-2">
        <div className="flex items-center gap-1">
          <VisualSearch />
          <Button variant="ghost" size="icon">
            <Search className="h-5 w-5" />
          </Button>
        </div>
          <Button variant="ghost" size="icon" className="hidden sm:inline-flex">
            <User className="h-5 w-5" />
          </Button>
          
          <CartDrawer />

          {mounted && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            >
              {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </Button>
          )}
        </div>
      </div>
    </header>
  )
}
