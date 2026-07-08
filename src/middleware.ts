import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const PUBLIC_GET_PATHS = [
  '/api/posts',
  '/api/projects',
  '/api/pages',
  '/api/categories',
  '/api/tags',
  '/api/search',
  '/api/media',
  '/api/feed',
  '/api/robots',
  '/api/sitemap',
]

const PUBLIC_POST_PATHS = [
  '/api/auth',
  '/api/contact',
]

const PUBLIC_SEED_PATHS = [
  '/api/seed-all',
  '/api/projects/seed',
]

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Check if route is protected (starts with /api/, /admin or /panel)
  const isApi = pathname.startsWith('/api/')
  const isAdmin = pathname.startsWith('/admin')
  const isPanel = pathname.startsWith('/panel')

  if (!isApi && !isAdmin && !isPanel) {
    return NextResponse.next()
  }

  const method = request.method

  // Allow POST to auth and contact
  if (isApi && method === 'POST' && PUBLIC_POST_PATHS.some(p => pathname === p)) {
    return NextResponse.next()
  }

  // Allow GET to public content endpoints
  if (isApi && method === 'GET' && PUBLIC_GET_PATHS.some(p => pathname === p || pathname.startsWith(p + '/'))) {
    return NextResponse.next()
  }

  // Allow seed endpoints (should be protected but needed for first setup)
  if (isApi && PUBLIC_SEED_PATHS.some(p => pathname === p)) {
    return NextResponse.next()
  }

  // All other API requests require auth
  const session = request.cookies.get('cms_session')?.value
  if (!session) {
    if (isAdmin || isPanel) {
      return NextResponse.redirect(new URL('/login', request.url))
    }
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/api/:path*', '/admin/:path*', '/panel/:path*'],
}
