import { NextResponse } from 'next/server';

export function proxy(req) {
  const url = req.nextUrl;
  console.log("middleware running for:", url.pathname);

  let user = false; // just for testing

  // If user is logged in → block auth routes
  if (
    user &&
    (url.pathname.startsWith('/sign-in') ||
     url.pathname.startsWith('/sign-up') ||
     url.pathname.startsWith('/verify'))
  ) {
    return NextResponse.redirect(new URL('/', req.url));
  }

  // If user is NOT logged in → block private routes
  if (
    !user &&
    (url.pathname.startsWith('/dashboard') ||
     url.pathname.startsWith('/u/'))
  ) {
    return NextResponse.redirect(new URL('/sign-in', req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/sign-in",
    "/sign-up",
    "/verify",
    "/dashboard/:path*",
  ],
};
