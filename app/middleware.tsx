import { NextResponse } from 'next/server';

export function middleware(req: any) {
  const token = req.cookies.token;
  if (!token && req.nextUrl.pathname.startsWith('/dashboard')) {
    return NextResponse.redirect('/login');
  }
}
