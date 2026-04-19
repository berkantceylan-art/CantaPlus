"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { BookOpen, Loader2, Lock, Mail, Package } from "lucide-react"
import { login } from "@/lib/actions/auth"
import { useActionState } from "react"
import Link from "next/link"

export default function LoginPage() {
  const [state, action, isPending] = useActionState(
    async (prevState: any, formData: FormData) => {
      return await login(formData)
    },
    null
  )

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 p-4">
      <div className="w-full max-w-[400px] space-y-8">
        <div className="text-center">
          <Link href="/" className="inline-flex items-center gap-2 font-bold text-2xl mb-2">
            <Package className="h-8 w-8 text-primary" />
            <span className="tracking-tighter">ÇantaPlus</span>
          </Link>
          <p className="text-muted-foreground">Merkez Üs'se hoş geldiniz.</p>
        </div>

        <Card className="border-none shadow-2xl luxury-shadow bg-background/80 backdrop-blur-sm">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl text-center">Giriş Yap</CardTitle>
            <CardDescription className="text-center">
              Yönetici panelinize erişmek için bilgilerinizi girin.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {state?.error && (
              <div className="mb-6 p-3 bg-destructive/15 text-destructive rounded-md text-xs font-medium text-center border border-destructive/20 animate-fade-in-up">
                {state.error}
              </div>
            )}

            <form action={action} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">E-posta</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input 
                    id="email" 
                    name="email" 
                    type="email" 
                    placeholder="ad@ornek.com" 
                    className="pl-10 h-11"
                    required 
                  />
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Şifre</Label>
                  <Link href="#" className="text-xs text-primary hover:underline">Şifremi Unuttum</Link>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input 
                    id="password" 
                    name="password" 
                    type="password" 
                    className="pl-10 h-11"
                    required 
                  />
                </div>
              </div>

              <Button type="submit" className="w-full h-11 text-base gold-gradient border-none hover:opacity-90 transition-opacity" disabled={isPending}>
                {isPending ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  "Sisteme Giriş Yap"
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        <p className="text-center text-xs text-muted-foreground">
          &copy; {new Date().getFullYear()} ÇantaPlus. Tüm hakları saklıdır.
        </p>
      </div>
    </div>
  )
}
