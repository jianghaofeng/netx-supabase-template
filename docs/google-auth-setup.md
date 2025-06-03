# Supabase Google登录设置指南

## 第一步：在Google Cloud Console创建OAuth凭证

1. 访问 [Google Cloud Console](https://console.cloud.google.com/)
2. 创建一个新项目或选择现有项目
3. 在左侧菜单中，导航到 **APIs & Services** > **Credentials**
4. 点击 **CREATE CREDENTIALS** 并选择 **OAuth client ID**
5. 如果这是您第一次创建OAuth客户端ID，您需要先配置同意屏幕
   - 点击 **CONFIGURE CONSENT SCREEN**
   - 选择适当的用户类型（External或Internal）
   - 填写必要的应用信息（应用名称、用户支持电子邮件等）
   - 添加开发者联系信息
   - 点击 **SAVE AND CONTINUE**
   - 添加需要的范围（通常默认即可）
   - 点击 **SAVE AND CONTINUE**
   - 添加测试用户（如需）
   - 点击 **SAVE AND CONTINUE**
6. 返回创建OAuth客户端ID界面
   - 选择应用类型为 **Web application**
   - 输入名称（例如"Supabase Auth"）
   - 在 **Authorized JavaScript origins** 中添加您的Supabase项目URL，例如`https://<YOUR_PROJECT_ID>.supabase.co`
   - 在 **Authorized redirect URIs** 中添加：`https://<YOUR_PROJECT_ID>.supabase.co/auth/v1/callback`
   - 点击 **CREATE**
7. 记下生成的 **Client ID** 和 **Client Secret**

## 第二步：在Supabase中配置Google提供商

1. 登录到 [Supabase控制台](https://app.supabase.com/)
2. 选择您的项目
3. 在左侧菜单中，导航到 **Authentication** > **Providers**
4. 找到 **Google** 并点击开启滑块
5. 在表单中填入：
   - **Client ID**：粘贴您从Google Cloud Console获取的Client ID
   - **Client Secret**：粘贴您从Google Cloud Console获取的Client Secret
   - **Authorized Client Domains**：添加您的前端应用URL（例如：`http://localhost:3000`，或您的生产URL）
6. 点击 **Save** 保存设置

## 第三步：环境变量设置

确保您的应用程序环境变量已正确设置。在项目根目录创建或编辑`.env.local`文件，添加以下变量：

```
NEXT_PUBLIC_SUPABASE_URL=https://<YOUR_PROJECT_ID>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<YOUR_SUPABASE_ANON_KEY>
```

您可以从Supabase项目设置 > API页面获取这些值。

## 第四步：测试Google登录

1. 启动您的Next.js应用：`npm run dev`
2. 访问登录页面
3. 点击"使用Google账号登录"按钮
4. 您应该被重定向到Google登录界面
5. 授权后，您将被重定向回应用程序

## 常见问题排查

如果遇到问题，请检查：

1. **重定向URI不匹配**：确保Google Cloud Console中配置的重定向URI与Supabase生成的完全一致
2. **CORS错误**：确保已在Supabase授权域中添加您的前端应用URL
3. **环境变量不正确**：验证您的`.env.local`文件中的变量是否正确设置
4. **Google API未启用**：在Google Cloud Console中，确保已启用"Google+ API"或"Google People API"

## 生产环境注意事项

当部署到生产环境时，请确保：

1. 更新Google Cloud Console中的重定向URI和JavaScript来源，以包含您的生产URL
2. 更新Supabase中的授权域，以包含您的生产URL
3. 在生产环境的环境变量中设置正确的Supabase URL和匿名密钥 