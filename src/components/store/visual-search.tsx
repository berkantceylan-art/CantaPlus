"use client"

import { useState, useRef } from "react"
import { Camera, X, Loader2, Search, Upload } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"

export function VisualSearch() {
  const [isOpen, setIsOpen] = useState(false)
  const [isScanning, setIsScanning] = useState(false)
  const [image, setImage] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setImage(e.target?.result as string)
        startScan()
      }
      reader.readAsDataURL(file)
    }
  }

  const startScan = () => {
    setIsScanning(true)
    // Simüle edilen tarama süresi
    setTimeout(() => {
      setIsScanning(false)
    }, 3000)
  }

  const reset = () => {
    setImage(null)
    setIsScanning(false)
    if (fileInputRef.current) fileInputRef.current.value = ""
  }

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setIsOpen(true)}
        className="hover:bg-primary/10 group"
      >
        <Camera className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
      </Button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-950/90 backdrop-blur-xl p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="w-full max-w-lg bg-zinc-900 border border-zinc-800 rounded-3xl overflow-hidden shadow-3xl"
            >
              <div className="p-6 flex items-center justify-between border-b border-zinc-800">
                <div className="flex items-center gap-2">
                  <Camera className="h-5 w-5 text-primary" />
                  <h3 className="font-medium text-lg text-zinc-100">Görsel Arama</h3>
                </div>
                <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)} className="rounded-full">
                  <X className="h-5 w-5" />
                </Button>
              </div>

              <div className="p-8">
                {!image ? (
                  <div 
                    onClick={() => fileInputRef.current?.click()}
                    className="aspect-square border-2 border-dashed border-zinc-800 rounded-2xl flex flex-col items-center justify-center gap-4 hover:border-primary/50 hover:bg-primary/5 cursor-pointer transition-all group"
                  >
                    <div className="w-16 h-16 rounded-full bg-zinc-800 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Upload className="h-8 w-8 text-zinc-400 group-hover:text-primary" />
                    </div>
                    <div className="text-center">
                      <p className="text-zinc-200 font-medium">Bileşen Seçin veya Sürükleyin</p>
                      <p className="text-zinc-500 text-sm mt-1">AI görsele göre en benzer ürünleri bulur</p>
                    </div>
                    <input 
                      type="file" 
                      ref={fileInputRef} 
                      className="hidden" 
                      accept="image/*" 
                      onChange={handleFileSelect}
                    />
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div className="relative aspect-square rounded-2xl overflow-hidden bg-zinc-800">
                      <img src={image} alt="Target" className="w-full h-full object-cover" />
                      
                      {isScanning && (
                        <motion.div 
                          initial={{ top: "-10%" }}
                          animate={{ top: "110%" }}
                          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                          className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-primary to-transparent shadow-[0_0_20px_rgba(212,175,55,0.8)] z-10"
                        />
                      )}
                      
                      {isScanning && (
                        <div className="absolute inset-0 bg-primary/10 backdrop-blur-[2px] flex items-center justify-center">
                          <div className="bg-zinc-950/80 px-6 py-3 rounded-full flex items-center gap-3 border border-primary/20 shadow-2xl">
                            <Loader2 className="h-5 w-5 text-primary animate-spin" />
                            <span className="text-sm font-medium text-primary tracking-wide uppercase">AI Taraması Yapılıyor</span>
                          </div>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex gap-3">
                      <Button 
                        variant="outline" 
                        onClick={reset} 
                        className="flex-1 border-zinc-800 text-zinc-300"
                        disabled={isScanning}
                      >
                        Yeni Görsel
                      </Button>
                      <Button 
                        className="flex-1 gold-gradient border-none"
                        disabled={isScanning}
                      >
                        <Search className="h-4 w-4 mr-2" />
                        Sonuçları Gör
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
