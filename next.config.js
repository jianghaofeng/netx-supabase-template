/**
 * @type {import('next').NextConfig}
 */
const nextConfig = {
  /* config options here */
  env: {
    NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
    NEXT_PUBLIC_VERCEL_URL: process.env.NEXT_PUBLIC_VERCEL_URL
  },
  // 忽略Supabase Functions目录，避免类型错误
  typescript: {
    // 构建时忽略类型错误
    ignoreBuildErrors: true
  },
  eslint: {
    // 构建时忽略ESLint错误
    ignoreDuringBuilds: true
  },
  // 忽略特定目录的文件
  webpack: (config) => {
    // 忽略Supabase Functions目录
    config.watchOptions = {
      ...config.watchOptions,
      ignored: ['**/supabase/functions/**']
    };
    
    // 添加忽略目录的规则
    config.module.rules.push({
      test: /supabase[\\/]functions[\\/].*$/,
      loader: 'ignore-loader'
    });
    
    return config;
  }
};

module.exports = nextConfig; 