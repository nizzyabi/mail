import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
 
export function middleware(req: NextRequest) {
  const token_key = process.env.JWT_AUTH_KEY as string;
  const token = req.cookies.get(token_key);
  
  if (!token) {
    if (req.nextUrl.pathname === '/') {
      return NextResponse.redirect(new URL('/auth/signin', req.url))
    }
  } else {
    if (req.nextUrl.pathname === '/') {
      return NextResponse.redirect(new URL('/dashboard', req.url))
    }
  }
}
 
export const config = {
  matcher: ['/dashboard', "/"],
}