import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  
  if (code) {
    const supabase = await createClient();
    await supabase.auth.exchangeCodeForSession(code);
  }

  // 获取重定向URL参数，如果没有则默认重定向到受保护页面
  const redirectTo = requestUrl.searchParams.get("redirectTo") || "/protected";
  
  // URL to redirect to after sign in process completes
  return NextResponse.redirect(new URL(redirectTo, request.url));
}