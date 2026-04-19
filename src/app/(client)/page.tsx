"use client"

import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

export default function Home() {
  return (
    <div className="flex flex-col bg-zinc-950">
      {/* Hero Section */}
      <section className="relative h-[92vh] w-full overflow-hidden flex items-center">
        <motion.div 
          initial={{ scale: 1.1, opacity: 0 }}
          animate={{ scale: 1, opacity: 0.4 }}
          transition={{ duration: 2, ease: "easeOut" }}
          className="absolute inset-0 z-0"
        >
          <Image
            src="https://images.unsplash.com/photo-1590874103328-eac38a683ce7?q=80&w=2000"
            alt="Lüks Çanta Koleksiyonu"
            fill
            className="object-cover"
            priority
          />
        </motion.div>

        {/* Gradient Overlay for Depth */}
        <div className="absolute inset-0 bg-gradient-to-b from-zinc-950/20 via-transparent to-zinc-950 z-0" />
        
        <div className="container relative z-10 mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            className="max-w-3xl"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 mb-8">
              <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
              <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-primary">Yeni Sezon 2026</span>
            </div>

            <h1 className="mb-8 font-heading text-6xl font-bold tracking-tighter sm:text-8xl text-white leading-[0.9]">
              Geleceği <br />
              <span className="text-luxury gold-text underline decoration-primary/20 underline-offset-[12px]">Taşıyın.</span>
            </h1>
            
            <p className="mb-12 max-w-lg text-lg text-zinc-400 sm:text-xl font-medium leading-relaxed">
              Yapay zeka destekli tasarım süreçleri ve asırlık el işçiliği, ÇantaPlus V2 koleksiyonunda buluşuyor.
            </p>

            <div className="flex flex-wrap gap-6">
              <Button size="lg" className="h-16 px-10 text-sm font-bold uppercase tracking-widest gold-gradient border-none hover:scale-105 transition-transform">
                Koleksiyonu Keşfet
              </Button>
              <Button size="lg" variant="outline" className="h-16 px-10 text-sm font-bold uppercase tracking-widest border-zinc-800 text-zinc-300 hover:bg-zinc-900 bg-transparent rounded-2xl">
                Vizyonumuz
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-32 bg-zinc-950">
        <div className="container mx-auto px-4">
          <div className="mb-20 flex flex-col items-center justify-between gap-6 md:flex-row">
            <div className="space-y-2">
              <h2 className="text-4xl font-bold tracking-tighter text-white">Öne Çıkan Seçkiler</h2>
              <p className="text-zinc-500 max-w-md">Kurumsal ERP gücünde, butik moda estetiğinde en özel modellerimiz.</p>
            </div>
            <Link href="/koleksiyon" className="group flex items-center text-xs font-bold uppercase tracking-[0.2em] text-primary hover:text-white transition-colors">
              Tüm Üretimi Gör 
              <ArrowRight className="ml-3 h-4 w-4 transition-transform group-hover:translate-x-2" />
            </Link>
          </div>

          <div className="grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                id: 1,
                name: "Noir Deri Omuz Çantası",
                price: "₺3.450",
                tag: "Bestseller",
                image: "https://images.unsplash.com/photo-1584916201218-f4242ceb4809?q=80&w=800",
              },
              {
                id: 2,
                name: "Lumina Minimalist Clutch",
                price: "₺2.100",
                tag: "İkonik",
                image: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?q=80&w=800",
              },
              {
                id: 3,
                name: "Aura Günlük Tote Bag",
                price: "₺4.800",
                tag: "Yeni",
                image: "https://images.unsplash.com/photo-1598532163257-ae3c6b25b24b6?q=80&w=800",
              }
            ].map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: index * 0.15 }}
                className="group relative"
              >
                <div className="relative aspect-[4/5] w-full overflow-hidden rounded-3xl bg-zinc-900 border border-white/5 group-hover:border-primary/20 transition-all duration-700">
                  <Image
                    src={product.image.replace("b24b6", "4b6")}
                    alt={product.name}
                    fill
                    className="object-cover transition-transform duration-1000 group-hover:scale-110 opacity-90 group-hover:opacity-100"
                  />
                  
                  {/* Luxury Tag */}
                  <div className="absolute top-6 right-6">
                    <span className="px-3 py-1 bg-zinc-950/80 backdrop-blur-md text-[9px] font-black uppercase tracking-widest text-primary border border-primary/20 rounded-full">
                      {product.tag}
                    </span>
                  </div>

                  <div className="absolute inset-x-6 bottom-6 translate-y-4 opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
                    <Button className="w-full h-14 gold-gradient border-none rounded-2xl shadow-2xl font-bold uppercase tracking-widest text-[10px]">
                      Hızlı İncele & Sepet
                    </Button>
                  </div>
                </div>
                
                <div className="mt-8 flex items-start justify-between">
                  <div className="space-y-1">
                    <h3 className="font-bold text-xl text-zinc-100 tracking-tight">{product.name}</h3>
                    <p className="text-xs font-bold uppercase tracking-widest text-zinc-500">Premium Deri Koleksiyonu</p>
                  </div>
                  <p className="font-bold text-lg text-primary">{product.price}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Philosophy Section */}
      <section className="bg-zinc-900/50 py-32 border-y border-white/5">
         <div className="container mx-auto px-4 text-center">
            <div className="w-16 h-px bg-primary mx-auto mb-10 opacity-50" />
            <h2 className="text-4xl font-bold tracking-tighter mb-10 text-white">Zanaatkar Vizyonu</h2>
            <p className="max-w-3xl mx-auto text-xl text-zinc-400 font-medium leading-relaxed italic">
              "Lüks, abartıda değil; dikişin saflığında ve formun mükemmelliğinde gizlidir. ÇantaPlus V2, bu estetiği yapay zekanın hassas analitik gücüyle harmanlayarak geleceğin mirasını oluşturuyor."
            </p>
            <div className="w-16 h-px bg-primary mx-auto mt-10 opacity-50" />
         </div>
      </section>
    </div>
  )
}
