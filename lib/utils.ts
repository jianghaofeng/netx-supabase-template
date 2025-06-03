import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// This check can be removed, it is just for tutorial purposes
export const hasEnvVars =
  process.env.NEXT_PUBLIC_SUPABASE_URL &&
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

/**
 * 获取应用程序的基本URL，处理不同环境（本地开发、Vercel等）
 * @param path 可选的路径后缀
 * @returns 完整的URL
 */
export function getURL(path: string = "") {
  // 获取基本URL
  let url =
    process?.env?.NEXT_PUBLIC_SITE_URL ?? // 手动设置的网站URL（生产环境）
    (process?.env?.VERCEL_URL ? `https://${process?.env?.VERCEL_URL}` : // Vercel自动设置
    "http://localhost:3000");
  
  // 确保非localhost环境使用https
  url = url.includes("localhost") ? url : (url.startsWith("http") ? url : `https://${url}`);
  
  // 确保URL末尾有斜杠（如果需要）
  url = url.endsWith("/") || path.startsWith("/") ? url : `${url}/`;
  
  // 添加路径（如果有）
  if (path) {
    const cleanPath = path.startsWith("/") ? path.slice(1) : path;
    url = `${url}${cleanPath}`;
  }
  
  return url;
}
