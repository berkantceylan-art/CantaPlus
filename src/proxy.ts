import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function proxy(request: NextRequest) {
  // Sadece /dashboard ile başlayan rotaları izleyelim. 
  // Ana sayfa ve ürün sayfaları bu mantıktan tamamen izole edildi (Hata riskini sıfırlamak için).
  
  let response = NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => request.cookies.getAll(),
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          response = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  try {
    const { data: { user } } = await supabase.auth.getUser()
    
    // Oturum kapalıysa ve Dashboard'a erişilmeye çalışılıyorsa Login'e yönlendir
    if (!user && request.nextUrl.pathname.startsWith('/dashboard')) {
      return NextResponse.redirect(new URL('/login', request.url))
    }
  } catch (error) {
    // Supabase tarafında bir sorun olsa dahi sitenin geri kalanının çökmesini engelle
    console.error('[Auth Proxy Error]:', error)
  }

  return response
}

export const config = {
  // Matcher'ı daraltıyoruz: Sadece /dashboard altındaki sayfalar ve /login sayfası yakalanacak.
  matcher: ['/dashboard/:path*', '/login']
}
