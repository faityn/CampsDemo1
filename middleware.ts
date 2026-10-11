import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { isSupabaseAdmin } from "@/lib/supabase-admin";

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const isLoginPage = pathname === "/admin/login";
  const isApiRoute =
    pathname === "/api/media/files" ||
    pathname === "/api/cloudinary/upload" ||
    pathname === "/api/cloudinary/images";
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  let isAdmin = false;
  let response = NextResponse.next({ request });

  if (url && key) {
    const supabase = createServerClient(url, key, {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options),
          );
        },
      },
    });

    const { data: { user }, error } = await supabase.auth.getUser();
    isAdmin = !error && isSupabaseAdmin(user);
  }

  if (isLoginPage) {
    if (isAdmin) {
      return NextResponse.redirect(new URL("/admin", request.url));
    }
    return response;
  }

  if (!isAdmin) {
    if (isApiRoute) {
      return NextResponse.json(
        { error: "Administrator authentication required." },
        { status: 401 },
      );
    }
    const redirectResponse = NextResponse.redirect(new URL("/admin/login", request.url));
    response.cookies.getAll().forEach((cookie) => redirectResponse.cookies.set(cookie));
    return redirectResponse;
  }

  return response;
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/api/media/files",
    "/api/cloudinary/upload",
    "/api/cloudinary/images",
  ],
};
