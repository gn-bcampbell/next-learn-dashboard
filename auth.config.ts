import type { NextAuthConfig } from 'next-auth';

// https://nextjs.org/docs/app/building-your-application/routing/middleware
// https://nextjs.org/learn/dashboard-app/adding-authentication
/*
    authorized callback - verify if request is authorized to access a page via Next.js Middleware (called before a
    request is completed)

    auth property contains users' session
    request property contains incoming request
    providers option array to list different login options
 */
export const authConfig = {
    pages: {
        signIn: '/login',
    },
    callbacks: {
        authorized({ auth, request: { nextUrl } }) {
            const isLoggedIn = !!auth?.user;
            const isOnDashboard = nextUrl.pathname.startsWith('/dashboard');
            if (isOnDashboard) {
                if (isLoggedIn) return true;
                return false; // Redirect unauthenticated users to login page
            } else if (isLoggedIn) {
                return Response.redirect(new URL('/dashboard', nextUrl));
            }
            return true;
        },
    },
    providers: [], // Add providers with an empty array for now
} satisfies NextAuthConfig;