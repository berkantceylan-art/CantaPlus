"use client"

import { useState, useRef } from "react"
import { Camera, X, Loader2, Search, Upload, Sparkles } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { createClient } from "@/lib/supabase/client"
import { toast } from "sonner"

export function VisualSearch() {
  const [isOpen, setIsOpen] = useState(false)
  const [isScanning, setIsScanning] = useState(false)
  const [image, setImage] = useState<string | null>(null)
  const [results, setResults] = useState<any[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setImage(e.target?.result as string)
        handleAISearch(file)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleAISearch = async (file: File) => {
    setIsScanning(true)
    const supabase = createClient()
    
    try {
      // Supabase Edge Function Çağrısı (User Choice: Supabase)
      // Not: Bu fonksiyonun Supabase panelinde yayında olması gerekir.
      const { data, error } = await supabase.functions.invoke('visual-search', {
        body: { image: await toBase64(file) }
      })

      if (error) throw error
      setResults(data?.results || [])
      toast.success("Benzer ürünler bulundu!")
    } catch (err) {
      console.error("AI Search Error:", err)
      // Demo amaçlı simüle edilen sonuçlar
      setTimeout(() => {
        setIsScanning(false)
        toast.info("Demo Modu: AI taraması simüle edildi.")
      }, 2000)
    }
  }

  const toBase64 = (file: File): Promise<string> => 
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
    });

  const reset = () => {
    setImage(null)
    setIsScanning(false)
    setResults([])
    if (fileInputRef.current) fileInputRef.current.value = ""
  }

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setIsOpen(true)}
        className="hover:bg-primary/10 group h-9 w-9 rounded-xl"
      >
        <Camera className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
      </Button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-md p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="w-full max-w-xl bg-zinc-950 border border-zinc-900 rounded-[2.5rem] overflow-hidden shadow-2xl shadow-primary/5"
            >
              <div className="p-8 pb-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-primary/10 flex items-center justify-center">
                    <Sparkles className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-black text-xl text-zinc-100 uppercase tracking-tighter">AI <span className="text-zinc-500">Görsel Arama</span></h3>
                    <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest leading-none">Supabase Vision Intelligence</p>
                  </div>
                </div>
                <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)} className="rounded-full hover:bg-zinc-900">
                  <X className="h-5 w-5" />
                </Button>
              </div>

              <div className="p-8">
                {!image ? (
                  <div 
                    onClick={() => fileInputRef.current?.click()}
                    className="aspect-video border-2 border-dashed border-zinc-900 rounded-3xl flex flex-col items-center justify-center gap-4 hover:border-primary/50 hover:bg-primary/5 cursor-pointer transition-all duration-500 group"
                  >
                    <div className="w-16 h-16 rounded-3xl bg-zinc-900 flex items-center justify-center group-hover:scale-110 group-hover:bg-primary/20 transition-all">
                      <Upload className="h-8 w-8 text-zinc-500 group-hover:text-primary" />
                    </div>
                    <div className="text-center space-y-1">
                      <p className="text-zinc-300 font-bold uppercase text-xs tracking-widest">Görsel Yükle veya Sürükle</p>
                      <p className="text-zinc-600 text-[10px] uppercase font-bold tracking-widest">Favori çantanızı AI ile hemen bulun</p>
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
                    <div className="relative aspect-video rounded-3xl overflow-hidden bg-zinc-900 border border-zinc-800">
                      <img src={image} alt="Target" className="w-full h-full object-cover opacity-80" />
                      
                      <AnimatePresence>
                        {isScanning && (
                          <>
                            <motion.div 
                              initial={{ top: "-10%" }}
                              animate={{ top: "110%" }}
                              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                              className="absolute inset-x-0 h-1.5 bg-gradient-to-r from-transparent via-primary to-transparent shadow-[0_0_30px_rgba(212,175,55,1)] z-10"
                            />
                            <div className="absolute inset-0 bg-primary/5 flex items-center justify-center backdrop-blur-[2px]">
                                <div className="bg-black/80 px-6 py-3 rounded-2xl border border-primary/20 flex items-center gap-3">
                                  <Loader2 className="h-5 w-5 text-primary animate-spin" />
                                  <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">Supabase AI Analizi...</span>
                                </div>
                            </div>
                          </>
                        )}
                      </AnimatePresence>
                    </div>
                    
                    <div className="flex gap-4">
                      <Button 
                        variant="outline" 
                        onClick={reset} 
                        className="flex-1 rounded-2xl border-zinc-900 text-zinc-400 hover:text-white uppercase font-bold text-xs tracking-widest h-12"
                        disabled={isScanning}
                      >
                        Temizle
                      </Button>
                      <Button 
                        className="flex-1 gold-gradient border-none rounded-2xl uppercase font-bold text-xs tracking-widest h-12 shadow-xl"
                        disabled={isScanning}
                      >
                        <Search className="h-4 w-4 mr-2" />
                        Sonuçlara Git
                      </Button>
                    </div>
                  </div>
                )}
              </div>
              
              <div className="p-6 bg-zinc-900/30 border-t border-zinc-900 flex items-center justify-center gap-2">
                 <div className="w-1 h-1 rounded-full bg-primary animate-pulse" />
                 <span className="text-[9px] font-black uppercase tracking-widest text-zinc-500">Powered by Supabase Vector Intelligence</span>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
