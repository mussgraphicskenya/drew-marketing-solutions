import { NextResponse } from 'next/server';

export function middleware(request) {
    const { pathname } = request.nextUrl;

    // Only guard /admin routes
    if (!pathname.startsWith('/admin')) {
        return NextResponse.next();
    }

    // Always allow the login page through
    if (pathname === '/admin/login') {
        return NextResponse.next();
    }

    // Check for session cookie
    const session = request.cookies.get('admin_session');

    if (!session || session.value !== 'authenticated') {
        const loginUrl = new URL('/admin/login', request.url);
        return NextResponse.redirect(loginUrl);
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/admin/:path*'],
};
