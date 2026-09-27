import { NextRequest, NextResponse } from "next/server";


export function proxy(request: NextRequest) {

    const token = request.cookies?.get("session_token")?.value
    const pathname = request.nextUrl.pathname

    if (pathname.startsWith("/dashboard") && !token) {
        return NextResponse.redirect(new URL("/auth/signin", request.url))
    }


    if ((pathname === "/auth/signin" || pathname === "/") && token) {
        return NextResponse.redirect(new URL("/dashboard/home", request.url));
    }

    return NextResponse.next()

}


export const config = {
    matcher: ["/dashboard/:path*", "/auth/signin/:path*", "/"]
}