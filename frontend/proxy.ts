import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export default function proxy(req: NextRequest) {
    // const token = req.cookies.get("auth_basic")?.value;

    // const pathname = req.nextUrl.pathname;
    // const isAuthPage = pathname.startsWith("/login") || pathname.startsWith("/signup");

    // if (!token && !isAuthPage) {
    //     return NextResponse.redirect(new URL("/login", req.url));
    // }

    // if (token && pathname.startsWith("/login")) {
    //     return NextResponse.redirect(new URL("/", req.url));
    // }

    return NextResponse.next();
}

export const config = {
    matcher: ["/((?!_next|favicon.ico|api).*)"],
};
