import { auth } from "@/auth"

export default auth((req) => {
    const {nextUrl} = req;
    const isLoggedIn = !!req.auth;
    const isApiAuthRoute = nextUrl.pathname.startsWith("/api/auth");
    const isPublicRoute = nextUrl.pathname === "/";

    if (isApiAuthRoute) return;
    if (isLoggedIn) return;
    if (!isLoggedIn && !isPublicRoute) return Response.redirect(new URL("/", nextUrl));
    return;
})

export const config = {
    matcher: [ '/((?!.*\\..*|_next).*)', '/', '/(api|trpc)(.*)'],
}