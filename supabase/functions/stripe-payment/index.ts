// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.
// Setup type definitions for built-in Supabase Runtime APIs
import "jsr:@supabase/functions-js/edge-runtime.d.ts";
// 引入 Stripe
import Stripe from "https://esm.sh/stripe@13.10.0?target=deno";
// 从环境变量获取 Stripe API 密钥
const stripeSecretKey = Deno.env.get("STRIPE_SECRET_KEY");
// 允许以开发模式运行（没有密钥时返回模拟数据）
const DEV_MODE = !stripeSecretKey;
// 初始化 Stripe 客户端（如果有密钥）
let stripe = null;
if (stripeSecretKey) {
  stripe = new Stripe(stripeSecretKey, {
    apiVersion: "2023-10-16",
    httpClient: Stripe.createFetchHttpClient()
  });
}
// 定义支持的路由
const ROUTES = {
  CREATE_PAYMENT: "/create-payment",
  WEBHOOK: "/webhook"
};
// 处理请求
Deno.serve(async (req)=>{
  // 允许预检请求
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 204,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization"
      }
    });
  }
  // 为所有响应添加CORS头
  const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
    "Content-Type": "application/json"
  };
  // 解析请求 URL 和方法
  const url = new URL(req.url);
  // 提取路径 - 更改路径提取逻辑
  let path = url.pathname;
  // 移除任何前缀，如 "/functions/v1/stripe-payment"
  if (path.includes("/functions/v1/stripe-payment")) {
    path = path.replace("/functions/v1/stripe-payment", "");
  }
  // 确保路径以 "/" 开头
  if (path === "") path = "/";
  const method = req.method;
  console.log(`处理请求: ${method} ${path} (原始路径: ${url.pathname})`);
  // 健康检查路由 - 根路径也视为创建支付请求
  if (path === "/" || path === "") {
    if (method === "GET") {
      // GET 请求为健康检查
      return new Response(JSON.stringify({
        status: "ok",
        message: "Stripe Payment Edge Function is running",
        dev_mode: DEV_MODE,
        timestamp: new Date().toISOString()
      }), {
        headers: corsHeaders
      });
    } else if (method === "POST") {
      // POST 请求视为创建支付
      return await handleCreatePayment(req, corsHeaders);
    }
  }
  try {
    // 根据路径和方法处理不同的请求
    if ((path === ROUTES.CREATE_PAYMENT || path === "/") && method === "POST") {
      return await handleCreatePayment(req, corsHeaders);
    } else if (path === ROUTES.WEBHOOK && method === "POST") {
      return await handleWebhook(req, corsHeaders);
    }
    // 如果路径不匹配，返回 404
    return new Response(JSON.stringify({
      error: "Not Found",
      path,
      originalPath: url.pathname,
      method,
      availableRoutes: [
        "POST /",
        "POST /create-payment",
        "POST /webhook"
      ]
    }), {
      status: 404,
      headers: corsHeaders
    });
  } catch (error) {
    // 处理错误
    console.error("处理请求时出错:", error);
    return new Response(JSON.stringify({
      error: error instanceof Error ? error.message : "An unknown error occurred",
      path,
      originalPath: url.pathname,
      method
    }), {
      status: 500,
      headers: corsHeaders
    });
  }
});
/**
 * 创建支付意向
 */ async function handleCreatePayment(req, headers) {
  // 开发模式返回模拟数据
  if (DEV_MODE) {
    return new Response(JSON.stringify({
      paymentId: "pi_mock_" + Math.random().toString(36).substring(2, 15),
      clientSecret: "mock_secret_" + Math.random().toString(36).substring(2, 15),
      checkoutUrl: "https://checkout.stripe.com/mock-checkout",
      dev_mode: true
    }), {
      headers
    });
  }
  // 获取当前用户信息（如果已认证）
  const authorization = req.headers.get("Authorization");
  let user = null;
  if (authorization) {
    // 解析授权头中的用户信息
    const supabaseClient = createClient(Deno.env.get("SUPABASE_URL") ?? "", Deno.env.get("SUPABASE_ANON_KEY") ?? "", {
      global: {
        headers: {
          Authorization: authorization
        }
      }
    });
    const { data: { user: userData } } = await supabaseClient.auth.getUser();
    user = userData;
  }
  // 从请求体获取支付信息
  const { amount, currency = "cny", productName, successUrl, cancelUrl } = await req.json();
  if (!amount || amount <= 0) {
    return new Response(JSON.stringify({
      error: "金额必须大于0"
    }), {
      status: 400,
      headers
    });
  }
  // 创建支付意向
  const paymentIntent = await stripe.paymentIntents.create({
    amount: Math.round(amount * 100),
    currency: currency.toLowerCase(),
    description: productName || "产品购买",
    metadata: {
      userId: user?.id || "anonymous"
    },
    // 自动确认支付
    automatic_payment_methods: {
      enabled: true
    }
  });
  // 如果提供了成功和取消 URL，则创建结账会话
  if (successUrl && cancelUrl) {
    const session = await stripe.checkout.sessions.create({
      payment_intent_data: {
        payment_intent: paymentIntent.id
      },
      mode: "payment",
      success_url: successUrl,
      cancel_url: cancelUrl,
      line_items: [
        {
          price_data: {
            currency: currency.toLowerCase(),
            product_data: {
              name: productName || "产品购买"
            },
            unit_amount: Math.round(amount * 100)
          },
          quantity: 1
        }
      ]
    });
    return new Response(JSON.stringify({
      paymentId: paymentIntent.id,
      clientSecret: paymentIntent.client_secret,
      checkoutUrl: session.url
    }), {
      headers
    });
  }
  // 否则仅返回 client_secret 用于客户端支付
  return new Response(JSON.stringify({
    paymentId: paymentIntent.id,
    clientSecret: paymentIntent.client_secret
  }), {
    headers
  });
}
/**
 * 处理 Stripe Webhook
 */ async function handleWebhook(req, headers) {
  if (DEV_MODE) {
    return new Response(JSON.stringify({
      received: true,
      dev_mode: true
    }), {
      headers
    });
  }
  // 获取 Stripe 签名
  const signature = req.headers.get("stripe-signature");
  if (!signature) {
    return new Response(JSON.stringify({
      error: "缺少 Stripe 签名"
    }), {
      status: 400,
      headers
    });
  }
  // 获取 webhook 密钥
  const webhookSecret = Deno.env.get("STRIPE_WEBHOOK_SECRET");
  if (!webhookSecret) {
    throw new Error("缺少 STRIPE_WEBHOOK_SECRET 环境变量");
  }
  try {
    // 将请求体解析为文本
    const body = await req.text();
    // 验证 webhook 事件
    const event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    // 处理不同类型的事件
    switch(event.type){
      case "payment_intent.succeeded":
        await handlePaymentSucceeded(event.data.object);
        break;
      case "payment_intent.payment_failed":
        await handlePaymentFailed(event.data.object);
        break;
    }
    return new Response(JSON.stringify({
      received: true
    }), {
      headers
    });
  } catch (error) {
    return new Response(JSON.stringify({
      error: error instanceof Error ? `Webhook 错误: ${error.message}` : "Unknown webhook error"
    }), {
      status: 400,
      headers
    });
  }
}
/**
 * 处理支付成功
 */ async function handlePaymentSucceeded(paymentIntent) {
  if (DEV_MODE) return;
  // 使用 Supabase 客户端记录支付成功
  const supabaseAdmin = createClient(Deno.env.get("SUPABASE_URL") ?? "", Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "");
  // 在数据库中记录交易
  await supabaseAdmin.from("payments").insert({
    payment_id: paymentIntent.id,
    user_id: paymentIntent.metadata.userId,
    amount: paymentIntent.amount / 100,
    currency: paymentIntent.currency,
    status: "succeeded",
    payment_method: paymentIntent.payment_method_types[0],
    payment_details: paymentIntent
  });
  console.log(`支付成功: ${paymentIntent.id}`);
}
/**
 * 处理支付失败
 */ async function handlePaymentFailed(paymentIntent) {
  if (DEV_MODE) return;
  // 使用 Supabase 客户端记录支付失败
  const supabaseAdmin = createClient(Deno.env.get("SUPABASE_URL") ?? "", Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "");
  // 在数据库中记录失败的交易
  await supabaseAdmin.from("payments").insert({
    payment_id: paymentIntent.id,
    user_id: paymentIntent.metadata.userId,
    amount: paymentIntent.amount / 100,
    currency: paymentIntent.currency,
    status: "failed",
    payment_method: paymentIntent.payment_method_types[0],
    payment_details: paymentIntent,
    error_message: paymentIntent.last_payment_error?.message
  });
  console.log(`支付失败: ${paymentIntent.id}`);
}
// 创建 Supabase 客户端
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.8?target=deno";
console.log("Hello from Functions!") /* To invoke locally:

  1. Run `supabase start` (see: https://supabase.com/docs/reference/cli/supabase-start)
  2. Make an HTTP request:

  curl -i --location --request POST 'http://127.0.0.1:54321/functions/v1/stripe-payment' \
    --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0' \
    --header 'Content-Type: application/json' \
    --data '{"name":"Functions"}'

*/ ;
