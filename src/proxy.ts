import { NextRequest, NextResponse } from "next/server";
import { jwtDecode } from "jwt-decode";

const publicRoutes = ["/login", "/register", "/forgot-password", "/"];
// const otpRequiredRoutes = ["/otp"];
const verificationRequiredRoutes = ["/verification"];
const resetRequiredRoutes = ["/reset"];

type Role = "super_admin";

interface DecodedToken {
    id?: string;
    role?: Role;
    email?: string;
    fullName?: string;
    exp?: number;
    iat?: number;
}

// Define protected routes for super_admin
const protectedRoutes = [
    /^\/dashboard/,
    /^\/profile/,
    /^\/category/,
    /^\/content/,
    /^\/creators/,
    /^\/settings/,
];

export async function proxy(request: NextRequest) {
    const { pathname, origin, searchParams } = request.nextUrl;

    // ✅ Skip proxy for API routes, static files, and images
    if (
        pathname.startsWith('/api') ||
        pathname.startsWith('/_next/static') ||
        pathname.startsWith('/_next/image') ||
        pathname.startsWith('/favicon.ico')
    ) {
        return NextResponse.next();
    }

    // ✅ Get token from httpOnly cookie
    const token = request.cookies.get("accessToken")?.value;
    let user: DecodedToken | null = null;

    // ✅ Decode and validate token
    if (token) {
        try {
            user = jwtDecode<DecodedToken>(token);

            // Check if token is expired
            if (user.exp && user.exp * 1000 < Date.now()) {
                const response = NextResponse.redirect(
                    new URL(`/login?redirect=${pathname}&error=session-expired`, origin)
                );
                // ✅ Clear expired cookie with all security flags
                response.cookies.set("accessToken", "", {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === "production",
                    sameSite: "strict",
                    maxAge: 0,
                    path: "/",
                });
                return response;
            }
        } catch (error) {
            console.error("JWT decode error:", error);
            const response = NextResponse.redirect(
                new URL(`/login?redirect=${pathname}&error=invalid-token`, origin)
            );
            // ✅ Clear invalid cookie
            response.cookies.set("accessToken", "", {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "strict",
                maxAge: 0,
                path: "/",
            });
            return response;
        }
    }

    // OTP Route - requires email query parameter
    // if (otpRequiredRoutes.includes(pathname)) {
    //     const email = searchParams.get("email");
    //     if (!email) {
    //         return NextResponse.redirect(new URL("/register?error=no-email", origin));
    //     }
    //     return NextResponse.next();
    // }

    // Verification Route - requires email query parameter
    if (verificationRequiredRoutes.includes(pathname)) {
        const email = searchParams.get("email");
        if (!email) {
            return NextResponse.redirect(
                new URL("/forget?error=no-email", origin)
            );
        }
        return NextResponse.next();
    }

    // Reset Password Route - requires token and email
    if (resetRequiredRoutes.includes(pathname)) {
        const resetToken = searchParams.get("token");
        const email = searchParams.get("email");
        if (!resetToken || !email) {
            return NextResponse.redirect(
                new URL("/forget?error=missing-params", origin)
            );
        }
        return NextResponse.next();
    }

    // Public routes - redirect to dashboard if already logged in
    if (publicRoutes.includes(pathname)) {
        if (user) {
            return NextResponse.redirect(new URL("/dashboard", origin));
        }
        return NextResponse.next();
    }

    // Protected routes - check if user is authenticated
    const isProtectedRoute = protectedRoutes.some(route => route.test(pathname));

    if (isProtectedRoute) {
        // Require authentication
        if (!user) {
            return NextResponse.redirect(
                new URL(`/login?redirect=${pathname}`, origin)
            );
        }

        // Verify user has super_admin role
        if (user.role !== "super_admin") {
            return NextResponse.redirect(new URL("/?error=unauthorized", origin));
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        "/dashboard/:path*",
        "/profile/:path*",
        "/category/:path*",
        "/content/:path*",
        "/creators/:path*",
        "/settings/:path*",
        "/verification",
        "/reset",
        "/forget",
        "/login",
        "/",
        // Exclude API routes from proxy
        "/((?!api|_next/static|_next/image|favicon.ico).*)",
    ],
};