import Link from 'next/link'

export function Footer() {
  return (
    <footer className="border-t bg-muted/40">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          <div>
            <h3 className="text-lg font-bold">ÇantaPlus</h3>
            <p className="mt-4 text-sm text-muted-foreground">
              Lüks detaylarla tasarlanmış, özenle seçilmiş çanta koleksiyonları. Stil sizinle başlar.
            </p>
          </div>
          <div>
            <h4 className="font-semibold">Kategoriler</h4>
            <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
              <li><Link href="/kadin" className="hover:text-foreground">Kadın Çanta</Link></li>
              <li><Link href="/erkek" className="hover:text-foreground">Erkek Çanta</Link></li>
              <li><Link href="/sirt-cantasi" className="hover:text-foreground">Sırt Çantası</Link></li>
              <li><Link href="/cuzdan" className="hover:text-foreground">Cüzdan</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold">Yardım</h4>
            <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
              <li><Link href="/sss" className="hover:text-foreground">Sıkça Sorulan Sorular</Link></li>
              <li><Link href="/kargo" className="hover:text-foreground">Kargo ve Teslimat</Link></li>
              <li><Link href="/iade" className="hover:text-foreground">İade Koşulları</Link></li>
              <li><Link href="/iletisim" className="hover:text-foreground">İletişim</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold">Bülten</h4>
            <p className="mt-4 text-sm text-muted-foreground">Yeni ürünler ve kampanyalardan haberdar olmak için e-bültene kayıt olun.</p>
            <div className="mt-4 flex">
              <input 
                type="email" 
                placeholder="E-posta adresiniz" 
                className="flex h-9 w-full rounded-l-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              />
              <button className="inline-flex h-9 items-center justify-center rounded-r-md bg-primary px-4 text-sm font-medium text-primary-foreground shadow hover:bg-primary/90">
                Kayıt Ol
              </button>
            </div>
          </div>
        </div>
        <div className="mt-12 border-t pt-8 text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} ÇantaPlus. Tüm hakları saklıdır.</p>
        </div>
      </div>
    </footer>
  )
}
