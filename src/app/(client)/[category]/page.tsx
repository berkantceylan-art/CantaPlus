import { Button } from "@/components/ui/button"
import Link from "next/link"

export default async function CategoryPlaceholder({
  params,
}: {
  params: Promise<{ category: string }>
}) {
  const { category } = await params

  // Basit stilize edilmiş sayfa başlığı
  const title = category.charAt(0).toUpperCase() + category.slice(1)

  return (
    <div className="container mx-auto px-4 py-24 text-center flex flex-col items-center justify-center min-h-[60vh]">
      <h1 className="text-4xl font-bold mb-4">{title} Koleksiyonu</h1>
      <p className="text-muted-foreground mb-8 text-lg max-w-lg">
        Bu sayfa şu anda yapım aşamasındadır. ({category}) kategorisindeki ürünler çok yakında burada listelenecektir.
      </p>
      <Button asChild size="lg">
        <Link href="/">Ana Sayfaya Dön</Link>
      </Button>
    </div>
  )
}
