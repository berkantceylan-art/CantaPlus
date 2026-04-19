"use client"

import { useState } from "react"
import { Box, Smartphone, View, Info, CheckCircle2 } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"

export function ARPreview() {
  const [active, setActive] = useState(false)

  return (
    <div className="mt-8">
      <div className="relative group overflow-hidden rounded-2xl bg-zinc-900 border border-zinc-800 hover:border-primary/30 transition-all duration-500">
        <div className="flex flex-col md:flex-row items-center gap-6 p-6">
          <div className="relative w-32 h-32 flex-shrink-0">
            <div className="absolute inset-0 bg-primary/10 rounded-full animate-pulse focus-within:animate-none" />
            <div className="absolute inset-0 flex items-center justify-center">
              <Box className="h-12 w-12 text-primary drop-shadow-[0_0_8px_rgba(212,175,55,0.4)]" />
            </div>
            
            <motion.div 
              animate={{ 
                rotateY: [0, 360],
              }}
              transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
              className="absolute inset-0 pointer-events-none"
            >
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1 h-1 bg-primary rounded-full blur-[1px]" />
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 bg-primary rounded-full blur-[1px]" />
            </motion.div>
          </div>

          <div className="flex-1 text-center md:text-left space-y-2">
            <div className="flex items-center justify-center md:justify-start gap-2 text-primary">
              <Smartphone className="h-4 w-4" />
              <span className="text-xs font-bold uppercase tracking-widest">AR Experience</span>
            </div>
            <h3 className="text-xl font-bold text-zinc-100">Evinizde Deneyimleyin</h3>
            <p className="text-zinc-400 text-sm max-w-xs">
              Gelişmiş AR teknolojisi ile çantanın gerçek boyutlarını kendi alanınızda görün.
            </p>
          </div>

          <div className="flex flex-col gap-2 w-full md:w-auto">
            <Button 
              onClick={() => setActive(true)}
              className="gold-gradient border-none hover:scale-105 transition-transform"
            >
              <View className="h-4 w-4 mr-2" />
              3D/AR Modu
            </Button>
            <div className="flex items-center justify-center md:justify-start gap-1 text-[10px] text-zinc-500 uppercase tracking-tighter">
              <Info className="h-3 w-3" />
              Tüm iOS ve Android cihazlarla uyumlu
            </div>
          </div>
        </div>

        {/* Floating Scanline effect */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-20">
          <motion.div 
            animate={{ x: ["-100%", "200%"] }}
            transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
            className="h-full w-1/2 bg-gradient-to-r from-transparent via-white to-transparent skew-x-12"
          />
        </div>
      </div>

      <AnimatePresence>
        {active && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-zinc-950/95 backdrop-blur-2xl flex items-center justify-center p-4"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              className="max-w-md w-full bg-zinc-900 rounded-3xl p-8 border border-zinc-800 text-center space-y-6"
            >
              <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <Box className="h-10 w-10 text-primary" />
              </div>
              <h2 className="text-2xl font-bold text-zinc-100 underline decoration-primary/40 underline-offset-8">3D Görüntüleyici Hazırlanıyor</h2>
              <p className="text-zinc-400 leading-relaxed">
                Yanıltıcı olmaması adına ürünün 3D modellemesi üzerinde çalışıyoruz. Çok yakında bu alanda çantayı her açıdan inceleyebileceksiniz.
              </p>
              
              <div className="grid grid-cols-2 gap-4 py-4">
                <div className="p-4 rounded-2xl bg-zinc-800/50 text-left border border-zinc-700/50">
                  <CheckCircle2 className="h-5 w-5 text-primary mb-2" />
                  <p className="text-xs font-bold text-zinc-200">Gerçek Boyut</p>
                  <p className="text-[10px] text-zinc-500 mt-1">Hata payı %1'den azdır.</p>
                </div>
                <div className="p-4 rounded-2xl bg-zinc-800/50 text-left border border-zinc-700/50">
                  <CheckCircle2 className="h-5 w-5 text-primary mb-2" />
                  <p className="text-xs font-bold text-zinc-200">Özel Doku</p>
                  <p className="text-[10px] text-zinc-500 mt-1">Deri dokusu netliğini korur.</p>
                </div>
              </div>

              <Button 
                onClick={() => setActive(false)}
                className="w-full h-12 bg-zinc-100 text-zinc-950 hover:bg-zinc-200 rounded-full font-bold"
              >
                Anladım
              </Button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
