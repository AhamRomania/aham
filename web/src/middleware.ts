import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getLoggedInState } from './c/Auth';

export async function middleware(request: NextRequest) {
    const isLoggedIn = await getLoggedInState();
    if (!isLoggedIn) {
        return NextResponse.redirect(new URL(
            '/login?mrv=' + Math.round(Math.random() * 100),
            request.url
        ))
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        '/u/:path*',
    ]
}