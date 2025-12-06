import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { verifySession } from '@/lib/auth'

export async function middleware(request: NextRequest) {
    const path = request.nextUrl.pathname

    // Protect /admin routes
    if (path.startsWith('/admin')) {
        const token = request.cookies.get('admin-token')?.value
        const session = token ? await verifySession(token) : null

        if (!session) {
            return NextResponse.redirect(new URL('/super-admin-login-92837-secret', request.url))
        }
    }

    // Prevent accessing secret login if already logged in (optional but nice)
    if (path === '/super-admin-login-92837-secret') {
        const token = request.cookies.get('admin-token')?.value
        const session = token ? await verifySession(token) : null

        if (session) {
            return NextResponse.redirect(new URL('/admin/dashboard', request.url))
        }
    }

    return NextResponse.next()
}

export const config = {
    matcher: ['/admin/:path*', '/super-admin-login-92837-secret'],
}
