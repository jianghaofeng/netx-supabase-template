"use client";

import { useState } from "react";
import { Button } from "@heroui/react";
import { createClient } from "@/lib/supabase/client";

type StripePaymentButtonProps = {
  amount: number;
  currency?: string;
  productName?: string;
  onSuccess?: (paymentId: string) => void;
  onError?: (error: string) => void;
};

export function StripePaymentButton({
  amount,
  currency = "cny",
  productName = "商品购买",
  onSuccess,
  onError,
}: StripePaymentButtonProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handlePayment = async () => {
    setIsLoading(true);
    try {
      const supabase = createClient();
      
      // 获取当前用户的会话
      const { data: { session } } = await supabase.auth.getSession();
      
      // 调用 Edge Function 创建支付意向，使用根路径而不是子路径
      const response = await fetch(
        `https://ruocdffetovshaizmqat.supabase.co/functions/v1/stripe-payment`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...(session?.access_token 
              ? { Authorization: `Bearer ${session.access_token}` } 
              : {}),
          },
          body: JSON.stringify({
            amount,
            currency,
            productName,
            successUrl: `${window.location.origin}/payment/success`,
            cancelUrl: `${window.location.origin}/payment/cancel`,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        console.error("支付请求失败:", data);
        throw new Error(data.error || "支付请求失败");
      }

      // 重定向到 Stripe Checkout
      if (data.checkoutUrl) {
        window.location.href = data.checkoutUrl;
        return;
      } else {
        throw new Error("没有收到结账URL");
      }
      
      // 注意：我们不再使用客户端集成，而是完全依赖Stripe Checkout
      // 成功回调将在用户从Stripe Checkout重定向回来后处理
    } catch (error) {
      console.error("支付过程中出错:", error);
      if (onError) {
        onError(error instanceof Error ? error.message : "支付过程中出错");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      onClick={handlePayment}
      disabled={isLoading}
      variant="solid"
      color="primary"
    >
      {isLoading ? "处理中..." : `支付 ${amount} ${currency.toUpperCase()}`}
    </Button>
  );
}

// 完整的 Stripe Elements 集成可能需要以下代码：
/*
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";

// 初始化 Stripe
const stripePromise = loadStripe("你的 Stripe 公钥");

function CheckoutForm({ clientSecret, onSuccess, onError }) {
  const stripe = useStripe();
  const elements = useElements();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setIsLoading(true);
    const result = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/payment/success`,
      },
    });

    if (result.error) {
      onError(result.error.message);
    } else {
      onSuccess(result.paymentIntent.id);
    }
    setIsLoading(false);
  };

  return (
    <form onSubmit={handleSubmit}>
      <PaymentElement />
      <button disabled={!stripe || isLoading}>
        {isLoading ? "处理中..." : "确认支付"}
      </button>
    </form>
  );
}

export function StripePaymentForm({ clientSecret, onSuccess, onError }) {
  return (
    <Elements stripe={stripePromise} options={{ clientSecret }}>
      <CheckoutForm 
        clientSecret={clientSecret} 
        onSuccess={onSuccess} 
        onError={onError} 
      />
    </Elements>
  );
}
*/