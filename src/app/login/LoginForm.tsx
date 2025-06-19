// app/login/LoginForm.tsx
'use client'

import { supabase } from '@/lib/client'
import {  useSearchParams } from 'next/navigation'
import { useState } from 'react'


export default function LoginForm() {
  const searchParams = useSearchParams()



  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const redirectTo = searchParams.get('redirectTo') || '/'

  const handleMagicLink = async (e: React.FormEvent) => {
    e.preventDefault()
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}${redirectTo}`,
      },
    })

    setMessage(error ? 'Failed to send magic link.' : 'Check your email for the magic link!')
  }

  const handleGoogleLogin = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}${redirectTo}`,
      },
    })
  }


  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <form onSubmit={handleMagicLink} className="flex flex-col gap-2">
        <label htmlFor="email">Email (for Magic Link):</label>
        <input
          id="email"
          name="email"
          type="email"
          onChange={(e) => setEmail(e.target.value)}
          value={email}
          required
          className="border px-2 py-1 rounded"
        />
        <button type="submit" className="bg-blue-500 text-white py-2 px-4 rounded">
          Send Magic Link
        </button>
      </form>

      <div className="my-4">OR</div>

      <button
        onClick={handleGoogleLogin}
        className="bg-black text-white px-4 py-2 rounded"
      >
        Continue with Google
      </button>

      {message && <p className="mt-4 text-center text-sm text-gray-700">{message}</p>}
    </div>
  )
}
