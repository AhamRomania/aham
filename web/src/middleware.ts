import useIsLoggedIn from '@/hooks/auth'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
 
export async function middleware(request: NextRequest) {

    const isLoggedIn = await useIsLoggedIn();

    if (!isLoggedIn) {
        return NextResponse.redirect(new URL(
            '/login',
            request.url
        ))
    }

    return NextResponse.next();
}
 
export const config = {
  matcher: '/u/:path*',
}