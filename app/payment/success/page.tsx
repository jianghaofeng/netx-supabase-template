"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

// 提取使用useSearchParams的组件
function PaymentSuccessContent() {
  const searchParams = useSearchParams();
  const [paymentId, setPaymentId] = useState<string | null>(null);

  useEffect(() => {
    // 从 URL 查询参数中获取支付 ID
    const payment_intent = searchParams.get("payment_intent");
    if (payment_intent) {
      setPaymentId(payment_intent);
    }
  }, [searchParams]);

  return (
    <div className="bg-green-100 text-green-800 p-6 rounded-lg shadow-md max-w-md w-full">
      <h1 className="text-2xl font-bold mb-4">支付成功！</h1>
      
      <div className="mb-6">
        <p className="mb-2">您的支付已成功处理。</p>
        {paymentId && (
          <p className="text-sm text-green-700">
            支付ID: <span className="font-mono">{paymentId}</span>
          </p>
        )}
      </div>
      
      <div className="flex justify-center">
        <Link 
          href="/"
          className="bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-4 rounded transition-colors"
        >
          返回首页
        </Link>
      </div>
    </div>
  );
}

// 加载状态组件
function LoadingState() {
  return (
    <div className="bg-gray-100 p-6 rounded-lg shadow-md max-w-md w-full text-center">
      <p>加载中...</p>
    </div>
  );
}

export default function PaymentSuccessPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <Suspense fallback={<LoadingState />}>
        <PaymentSuccessContent />
      </Suspense>
    </div>
  );
} 