import { type NextRequest } from 'next/server'
import { updateSession } from '@/lib/middleware'

export async function middleware(request: NextRequest) {
  return await updateSession(request)
}

export const config = {
  matcher: [
    // only protect these paths
    '/dashboard/:path*',
    '/auth/private/:path*',
    '/profile/:path*',
  ],
}
