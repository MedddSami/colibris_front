import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

/*
const PUBLIC_ROUTES = [
    "/auth/signin",
    "/auth/signup",
    "/forbidden",
];


const ADMIN_ROLE = "admin";

*/
export async function proxy(request: NextRequest) {

    /*const { pathname } = request.nextUrl;


    // Allow public pages
    if (
        PUBLIC_ROUTES.some((route) =>
            pathname.startsWith(route)
        )
    ) {
        return NextResponse.next();
    }


    const token = request.cookies.get("token")?.value;


    const requiresAuth =
        pathname.startsWith("/dashboard") ||
        pathname.startsWith("/admin");


    if (!requiresAuth) {
        return NextResponse.next();
    }


    // No token
    if (!token) {
        return NextResponse.redirect(
            new URL("/auth/signin", request.url)
        );
    }


    try {

        const secret = new TextEncoder().encode(
            process.env.JWT_SECRET
        );


        const { payload } = await jwtVerify(
            token,
            secret
        );


        const user = payload.user as {
            id: string;
            location: string;
            role: string;
        };


        // Admin protection
        if (
            pathname.startsWith("/admin") &&
            user.role !== ADMIN_ROLE
        ) {

            return NextResponse.redirect(
                new URL("/forbidden", request.url)
            );

        }


        return NextResponse.next();


    } catch (error) {

        console.error("Invalid token", error);


        return NextResponse.redirect(
            new URL("/auth/signin", request.url)
        );

    }*/

}
/*

export const config = {
    matcher: [
        "/admin/:path*",
        "/dashboard/:path*",
    ],
};*/