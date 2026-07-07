'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Lock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'
import { Card } from '@/components/ui/card'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })

      if (res.ok) {
        toast.success('Zalogowano pomyślnie')
        router.push('/admin')
      } else {
        const data = await res.json()
        toast.error(data.error || 'Błąd logowania')
      }
    } catch (err) {
      toast.error('Wystąpił błąd podczas połączenia z serwerem')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 p-4">
      <Card className="w-full max-w-sm p-6 shadow-lg border-border">
        <div className="flex flex-col items-center mb-6">
          <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center text-primary-foreground mb-3">
            <Lock className="h-6 w-6" />
          </div>
          <h1 className="text-2xl font-bold">Zaloguj się</h1>
          <p className="text-sm text-muted-foreground mt-1">Panel administracyjny Portfolio CMS</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@example.com"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Hasło</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Logowanie...' : 'Zaloguj się'}
          </Button>
        </form>
      </Card>
    </div>
  )
}
