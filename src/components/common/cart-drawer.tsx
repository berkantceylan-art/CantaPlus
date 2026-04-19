"use client"

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { useCartStore } from "@/store/cartStore"
import { ShoppingBag, X, Plus, Minus } from "lucide-react"
import { Button, buttonVariants } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import Image from "next/image"
import Link from "next/link"
import { useEffect, useState } from "react"

export function CartDrawer() {
  const { items, isOpen, setIsOpen, removeItem, updateQuantity, totalPrice, totalItems } = useCartStore()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger className={buttonVariants({ variant: "ghost", size: "icon", className: "relative" })}>
        <ShoppingBag className="h-5 w-5" />
        {totalItems > 0 && (
          <span className="absolute right-1.5 top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
            {totalItems}
          </span>
        )}
      </SheetTrigger>
      <SheetContent className="flex w-full flex-col pr-0 sm:max-w-lg">
        <SheetHeader className="px-1">
          <SheetTitle>Sepetim ({totalItems})</SheetTitle>
        </SheetHeader>
        <Separator className="mt-4" />
        
        {items.length > 0 ? (
          <>
            <ScrollArea className="flex-1 pr-6 mt-4">
              <div className="flex flex-col gap-6">
                {items.map((item) => (
                  <div key={item.id} className="flex gap-4">
                    <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-md border bg-muted">
                      {item.image ? (
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center bg-secondary">
                          <ShoppingBag className="h-6 w-6 text-muted-foreground" />
                        </div>
                      )}
                    </div>
                    <div className="flex flex-1 flex-col justify-between">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <h3 className="font-medium leading-none">{item.name}</h3>
                          {item.color && (
                            <p className="mt-1.5 text-xs text-muted-foreground">
                              Renk: {item.color}
                            </p>
                          )}
                        </div>
                        <p className="font-medium text-sm">₺{item.price.toLocaleString("tr-TR")}</p>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center rounded-md border">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 rounded-none"
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            disabled={item.quantity <= 1}
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                          <div className="flex h-8 w-8 items-center justify-center text-sm font-medium">
                            {item.quantity}
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 rounded-none"
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-muted-foreground hover:text-destructive"
                          onClick={() => removeItem(item.id)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
            <div className="pr-6 pt-4 mt-auto">
              <Separator className="mb-4" />
              <div className="flex items-center justify-between font-medium">
                <span className="text-base">Ara Toplam</span>
                <span className="text-lg">₺{totalPrice.toLocaleString("tr-TR")}</span>
              </div>
              <p className="mt-1 text-xs text-muted-foreground">
                Kargo ve vergiler ödeme adımında hesaplanacaktır.
              </p>
              <Link href="/odeme" className={buttonVariants({ className: "mt-6 w-full h-12 text-base" })} onClick={() => setIsOpen(false)}>
                Ödemeye Geç
              </Link>
            </div>
          </>
        ) : (
          <div className="flex flex-1 flex-col items-center justify-center space-y-4">
            <div className="relative mb-4 h-24 w-24 text-muted-foreground">
               <ShoppingBag className="h-full w-full opacity-20" />
            </div>
            <p className="text-lg font-medium text-muted-foreground">Sepetiniz boş</p>
            <Link href="/koleksiyon" className={buttonVariants({ variant: "outline" })} onClick={() => setIsOpen(false)}>
              Alışverişe Başla
            </Link>
          </div>
        )}
      </SheetContent>
    </Sheet>
  )
}
