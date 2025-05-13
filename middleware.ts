import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  // This is a simplified middleware for demo purposes
  // In a real app, you would check for a valid session/token

  // For protected routes like /dashboard, check if user is logged in
  // Since we can't access Redux store in middleware, we'd typically check for a cookie or token
  // For this demo, we'll just let all requests through

  return NextResponse.next()
}

export const config = {
  matcher: ["/dashboard/:path*", "/seller/:path*"],
}
