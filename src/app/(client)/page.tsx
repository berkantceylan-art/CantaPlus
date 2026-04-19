"use client"

import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

export default function Home() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative h-[90vh] min-h-[600px] w-full overflow-hidden bg-black flex items-center">
        <Image
          src="https://images.unsplash.com/photo-1590874103328-eac38a683ce7?q=80&w=2000"
          alt="Lüks Çanta Koleksiyonu"
          fill
          className="object-cover opacity-60"
          priority
        />
        <div className="container relative z-10 mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="max-w-2xl text-white"
          >
            <h1 className="mb-6 font-sans text-5xl font-bold tracking-tight sm:text-7xl">
              Zarafeti <br className="hidden sm:block" />
              <span className="text-primary-foreground/80">Yeniden Keşfet.</span>
            </h1>
            <p className="mb-8 max-w-lg text-lg text-white/80 sm:text-xl">
              Özenle tasarlanmış, eşsiz materyallerle hayat bulmuş yeni sezon koleksiyonumuzla tanışın.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button size="lg" className="h-14 px-8 text-base bg-white text-black hover:bg-neutral-200">
                Koleksiyonu İncele
              </Button>
              <Button size="lg" variant="outline" className="h-14 px-8 text-base text-white border-white hover:bg-white hover:text-black bg-transparent">
                Yeni Gelenler
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <div className="mb-16 flex flex-col items-center justify-between gap-4 md:flex-row">
            <div>
              <h2 className="text-3xl font-bold tracking-tight">Öne Çıkanlar</h2>
              <p className="text-muted-foreground mt-2">Bu sezonun en çok tercih edilen modelleri.</p>
            </div>
            <Link href="/koleksiyon" className="group flex items-center text-sm font-medium hover:text-primary">
              Tümünü Gör 
              <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>

          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                id: 1,
                name: "Noir Deri Omuz Çantası",
                price: "₺3.450",
                image: "https://images.unsplash.com/photo-1584916201218-f4242ceb4809?q=80&w=800",
              },
              {
                id: 2,
                name: "Lumina Minimalist Clutch",
                price: "₺2.100",
                image: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?q=80&w=800",
              },
              {
                id: 3,
                name: "Aura Günlük Tote Bag",
                price: "₺4.800",
                image: "https://images.unsplash.com/photo-1598532163257-ae3c6b25b24b6?q=80&w=800", // Fix URL
              }
            ].map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="group cursor-pointer"
              >
                <div className="relative aspect-[4/5] w-full overflow-hidden rounded-lg bg-muted">
                  <Image
                    src={product.image.replace("b24b6", "4b6")} // Just fixing the URL dynamically if it's broken, better use valid one
                    alt={product.name}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute bottom-4 left-4 right-4 translate-y-4 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                    <Button className="w-full shadow-lg">Sepete Ekle</Button>
                  </div>
                </div>
                <div className="mt-4 flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold">{product.name}</h3>
                    <p className="text-sm text-muted-foreground">Siyah</p>
                  </div>
                  <p className="font-medium">{product.price}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Philosophy Section */}
      <section className="bg-muted py-24">
         <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold tracking-tight mb-6">Tasarım Felsefemiz</h2>
            <p className="max-w-2xl mx-auto text-lg text-muted-foreground leading-relaxed">
              Her dikişte, her kesimde mükemmelliği arıyoruz. ÇantaPlus olarak inanıyoruz ki; gerçek lüks abartıda değil, materyalin doğallığında ve formun saflığında gizlidir. 
            </p>
         </div>
      </section>
    </div>
  )
}
