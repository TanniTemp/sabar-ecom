import { redirect } from 'next/navigation'

import { createClient } from '@/lib/server'

export default async function PrivatePage() {
  const supabase = await createClient()

  const { data, error } = await supabase.auth.getUser()
  if (error || !data?.user) {
    redirect('/login')
  }

  return <p className='flex pt-[150px]'>Hello {data.user.email}</p>
}