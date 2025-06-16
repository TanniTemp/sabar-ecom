// app/login/page.tsx
import { createClient } from '@/lib/server'
import { redirect } from 'next/navigation'
import LoginForm from './LoginForm'

export default async function LoginPage() {
  const supabase = await createClient()
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (session) {
    redirect('/')
  }

  return <LoginForm />
}
