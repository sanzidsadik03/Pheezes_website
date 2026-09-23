'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter, useSearchParams } from 'next/navigation'
import Image from 'next/image'
import { Logo } from '@/components/ui/Logo'
import { Eye, EyeOff, Lock, Mail, AlertCircle } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'

export default function AdminLoginPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get('callbackUrl') ?? '/admin'

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      })

      if (result?.error) {
        setError('Invalid email or password. Please try again.')
        toast.error('Login failed')
      } else {
        toast.success('Welcome back!')
        router.push(callbackUrl)
        router.refresh()
      }
    } catch {
      setError('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-pheezes-black flex items-center justify-center p-4">
      {/* Background glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse 60% 60% at 50% 30%, rgba(255,217,61,0.08) 0%, transparent 70%)',
        }}
      />

      <div className="relative w-full max-w-md">
        {/* Card */}
        <div className="bg-white rounded-3xl shadow-2xl p-8 sm:p-10">
          {/* Logo */}
          <div className="flex justify-center mb-8">
            <Logo />
          </div>

          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-pheezes-black">Admin Login</h1>
            <p className="text-pheezes-gray-400 text-sm mt-1">Sign in to manage your store</p>
          </div>

          {/* Error */}
          {error && (
            <div className="flex items-start gap-3 bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
              <AlertCircle className="h-4 w-4 text-red-500 mt-0.5 flex-shrink-0" />
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div>
              <Label htmlFor="email" required>Email Address</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-pheezes-gray-400" />
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@pheezes.com"
                  className="pl-9"
                  required
                  autoComplete="email"
                  disabled={loading}
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <Label htmlFor="password" required>Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-pheezes-gray-400" />
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="pl-9 pr-10"
                  required
                  autoComplete="current-password"
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-pheezes-gray-400 hover:text-pheezes-black transition-colors"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {/* Submit */}
            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full mt-2"
              loading={loading}
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </Button>
          </form>

          <p className="text-center text-xs text-pheezes-gray-300 mt-8">
            Pheezes Admin Dashboard — authorized personnel only
          </p>
        </div>
      </div>
    </div>
  )
}
