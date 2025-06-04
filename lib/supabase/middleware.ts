import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { hasEnvVars } from "../utils";

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  // If the env vars are not set, skip middleware check. You can remove this once you setup the project.
  if (!hasEnvVars) {
    console.log("Env vars not set, skipping middleware check");
    return supabaseResponse;
  }

  try {
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll();
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value }) =>
              request.cookies.set(name, value),
            );
            supabaseResponse = NextResponse.next({
              request,
            });
            cookiesToSet.forEach(({ name, value, options }) =>
              supabaseResponse.cookies.set(name, value, options),
            );
          },
        },
      },
    );

    const {
      data: { user },
    } = await supabase.auth.getUser();

    // 允许访问主页，即使用户未登录
    const isHomePage = request.nextUrl.pathname === "/";
    const isAuthPage = 
      request.nextUrl.pathname.startsWith("/login") || 
      request.nextUrl.pathname.startsWith("/auth");
    const isPublicAsset = 
      request.nextUrl.pathname.startsWith("/_next") || 
      request.nextUrl.pathname.match(/\.(ico|png|jpg|jpeg|svg|css|js)$/);

    // 只有当用户试图访问受保护的页面且未登录时才重定向
    if (!user && !isHomePage && !isAuthPage && !isPublicAsset && request.nextUrl.pathname.startsWith("/protected")) {
      console.log("Redirecting to login page from:", request.nextUrl.pathname);
      const url = request.nextUrl.clone();
      url.pathname = "/auth/login";
      return NextResponse.redirect(url);
    }

    return supabaseResponse;
  } catch (error) {
    console.error("Middleware error:", error);
    return supabaseResponse;
  }
}
