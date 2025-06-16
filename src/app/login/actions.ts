'use server'

import { createClient } from '@/lib/server'
import { redirect } from 'next/navigation'

export async function loginWithMagicLink(formData: FormData) {
  const supabase = await createClient()
  const email = formData.get('email') as string

  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}`,
    },
  })

  if (error) {
    redirect('/error')
  }

  redirect('/check-your-email')
}
