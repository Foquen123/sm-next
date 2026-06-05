import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verify } from '@/lib/auth';

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  if (pathname.startsWith('/schedule')) {
    const token = request.cookies.get('admin_session')?.value;
    const payload = token ? await verify(token) : null;
    if (!payload) {
      const homeUrl = new URL('/login', request.url);
      return NextResponse.redirect(homeUrl);
    }
  }
  if (pathname.startsWith('/login')) {
    const token = request.cookies.get('admin_session')?.value;
    const payload = token ? await verify(token) : null;
    if (payload) {
      const homeUrl = new URL('/schedule', request.url);
      return NextResponse.redirect(homeUrl);
    }
  }

  return NextResponse.next();
}

// Указываем, для каких путей вызывать Middleware
export const config = {
  matcher: ['/schedule/:path*', '/login'],
};
