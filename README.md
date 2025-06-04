# Next.js + Supabase + HeroUI 模板

<p align="center">
  基于Next.js和Supabase构建的全栈应用模板，集成了认证、主题切换和支付功能
</p>

<p align="center">
  <a href="#功能特性"><strong>功能特性</strong></a> ·
  <a href="#技术栈"><strong>技术栈</strong></a> ·
  <a href="#本地开发"><strong>本地开发</strong></a> ·
  <a href="#项目结构"><strong>项目结构</strong></a> ·
  <a href="#环境变量"><strong>环境变量</strong></a> ·
  <a href="#部署"><strong>部署</strong></a>
</p>

## 功能特性

- **认证系统**：完整的用户认证流程
  - 登录/注册
  - 密码重置
  - 受保护的路由
  - 会话管理
- **主题系统**：基于HeroUI和next-themes
  - 浅色/深色模式切换
  - 响应系统主题设置
  - 主题持久化
- **支付系统**：Stripe集成
  - Supabase Edge Functions处理支付逻辑
  - 支付意向创建
  - Stripe Checkout集成
  - 开发模式支持
  - 支付调试工具
- **响应式设计**：适配各种设备尺寸
- **类型安全**：完整的TypeScript支持

## 技术栈

- **前端**：
  - [Next.js 14](https://nextjs.org/)：React框架
  - [HeroUI](https://heroui.com/)：UI组件库
  - [TailwindCSS](https://tailwindcss.com/)：CSS框架
  - [next-themes](https://github.com/pacocoursey/next-themes)：主题管理
  
- **后端**：
  - [Supabase](https://supabase.com/)：后端即服务平台
  - [Supabase Auth](https://supabase.com/docs/guides/auth)：认证服务
  - [Supabase Edge Functions](https://supabase.com/docs/guides/functions)：无服务器函数
  
- **支付**：
  - [Stripe](https://stripe.com/)：支付处理服务

## 本地开发

1. 克隆仓库

```bash
git clone <repository-url>
cd netx-supabase-template
```

2. 安装依赖

```bash
npm install
# 或
yarn install
# 或
bun install
```

3. 配置环境变量

复制`.env.example`到`.env.local`并设置必要的环境变量：

```
# Supabase配置
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key

# 可选：支付配置
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your-stripe-publishable-key
```

4. 启动开发服务器

```bash
npm run dev
# 或
yarn dev
# 或
bun dev
```

5. 启动Supabase本地服务（可选）

```bash
supabase start
```

现在可以在[http://localhost:3000](http://localhost:3000)访问应用。

## 项目结构

```
.
├── app/                    # Next.js应用目录
│   ├── auth/               # 认证相关页面
│   ├── payment/            # 支付相关页面
│   ├── protected/          # 受保护的页面
│   ├── layout.tsx          # 根布局
│   └── providers.tsx       # 主题和UI提供者
├── components/             # 可复用组件
│   ├── ui/                 # 基础UI组件
│   ├── login-form.tsx      # 登录表单
│   ├── sign-up-form.tsx    # 注册表单
│   └── theme-switcher.tsx  # 主题切换组件
├── lib/                    # 工具库
│   ├── supabase/           # Supabase客户端
│   └── utils.ts            # 工具函数
└── supabase/               # Supabase配置
    └── functions/          # Edge Functions
        └── stripe-payment/ # 支付处理函数
```

## 环境变量

项目使用以下环境变量：

```
# 基础URL配置
NEXT_PUBLIC_SITE_URL=your-site-url
NEXT_PUBLIC_VERCEL_URL=your-vercel-url

# Supabase配置
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key

# Stripe配置(可选)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your-stripe-publishable-key
```

Supabase Edge Function需要以下环境变量：

```
STRIPE_SECRET_KEY=your-stripe-secret-key
STRIPE_WEBHOOK_SECRET=your-stripe-webhook-secret
SUPABASE_URL=your-supabase-url
SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key
```

## 部署

### Vercel部署

1. 使用Vercel CLI部署：

```bash
vercel
```

2. 或通过Vercel仪表板部署：
   - 连接GitHub仓库
   - 配置环境变量
   - 部署项目

### Supabase Edge Functions部署

1. 登录Supabase CLI：

```bash
supabase login
```

2. 链接到你的Supabase项目：

```bash
supabase link --project-ref your-project-id
```

3. 部署Edge Functions：

```bash
supabase functions deploy stripe-payment
```

## 许可证

MIT
