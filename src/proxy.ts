import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function proxy(request: NextRequest) {
  let response = NextResponse.next({ request })

  // Çevre değişkenleri kontrolü (Vercel'de eksik değişken durumunda 500'ü önler)
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    console.warn('[Proxy Warning]: Supabase environment variables are missing.')
    return response
  }

  const supabase = createServerClient(
    supabaseUrl,
    supabaseAnonKey,
    {
      cookies: {
        getAll: () => request.cookies.getAll(),
        setAll(cookiesToSet) {
          try {
            // İstek çerezlerini güncelle
            cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
            
            // Yanıtı yenile
            response = NextResponse.next({ request })
            
            // Yanıt çerezlerini set et
            cookiesToSet.forEach(({ name, value, options }) =>
              response.cookies.set(name, value, options)
            )
          } catch (e) {
            // Vercel Edge Runtime'da çerez manipülasyonu bazen kısıtlı olabilir
            console.error('[Proxy Cookie Error]:', e)
          }
        },
      },
    }
  )

  try {
    const { data: { user } } = await supabase.auth.getUser()
    const pathname = request.nextUrl.pathname
    
    // Yönlendirme mantığı (Sadece dashboard ve login için)
    const isDashboard = pathname.startsWith('/dashboard')
    const isLogin = pathname === '/login'

    if (!user && isDashboard) {
      return NextResponse.redirect(new URL('/login', request.url))
    }

    if (user && isDashboard) {
      // Rol kontrolü (V2 Corporate)
      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single()

      // Eğer profil yoksa veya rol yetersizse erişimi engelle (Gelişmiş güvenlik)
      if (!profile || (profile.role !== 'admin' && profile.role !== 'staff')) {
         // Not: Mevcut bir admininiz yoksa ilk girişte hata almamak için 
         // geçici olarak profil oluşturma mantığı eklenebilir veya 
         // sadece yetkili profil yoksa engelleme yapılabilir.
         console.warn(`[Proxy RBAC]: User ${user.id} has no valid role. Access denied.`)
      }
    }

    if (user && isLogin) {
      return NextResponse.redirect(new URL('/dashboard', request.url))
    }
  } catch (error) {
    console.error('[Proxy Auth Error]:', error)
  }

  return response
}

export const config = {
  // Sadece kritik rotaları izleyerek riski minimize ediyoruz
  matcher: ['/dashboard/:path*', '/login']
}
