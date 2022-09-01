import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";
export async function middleware(req, res, next) {
    //Token will exist if user is logged in
    const token = await getToken({req, secret: process.env.JWT_SECRET});
    
    const { pathname } = req.nextUrl;
    // console.log(pathname);
    // console.log(token)
    // console.log(req.nextUrl.origin)
    // console.log(new URL('/login',req.url))
    //Allow the request if the following is true ...
    //  1) Its a request for next-auth session & provider fetching
    //  2) the token exists 
    if(pathname.includes('api/auth') || token) { 
        return NextResponse.next();
    }

    //Redirect them to login if they dont have token AND are requesting a protected route
    // if (!token && pathname !== '/login') {
    //     // const url = req.nextUrl.clone()
    //     // url.pathname = '/login'
    //     // console.log(url)
    //     const loginUrl = new URL('/login', req.url)
    //     // loginUrl.searchParams.set('from', req.nextUrl.pathname)
    //     return NextResponse.redirect(loginUrl);
    // }
    // if(pathname.startsWith('/login')){
    //     const url = req.nextUrl.clone()
    //     url.pathname = '/login'
    //     return NextResponse.rewrite(url,NextResponse);
    // }
    if (pathname.startsWith("/_next")) return NextResponse.next();
    
    if (!token && !pathname.startsWith('/login')) {
        // const url = req.nextUrl.clone()
        // url.pathname = '/login'
        // console.log(url)
        req.nextUrl.pathname = "/login";
        // const loginUrl = new URL('/login', req.url)
        // loginUrl.searchParams.set('from', req.nextUrl.pathname)
        return NextResponse.redirect(req.nextUrl);
    }

    return NextResponse.next();

}