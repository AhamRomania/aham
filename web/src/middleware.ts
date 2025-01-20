import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getAccessToken } from './c/Auth';

export async function middleware(request: NextRequest) {

    const token = await getAccessToken();

    const res = await fetch(
        'http://localhost:8080/v1/me',
        {
            headers: {
                "Authorization": `Bearer ${token}`
            },
            
            cache: 'no-store'
        }
    )

    if (res.status !== 200) {
        return NextResponse.redirect(new URL(
            '/login',
            request.url
        ))
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        '/u/:path*',
        '/anunt'
    ]
}