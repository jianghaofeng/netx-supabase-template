"use client";

import { useState } from "react";
import { StripePaymentButton } from "@/components/stripe-payment-button";
import { Input, Card, CardBody, CardHeader, CardFooter } from "@heroui/react";

export default function PaymentPage() {
  const [amount, setAmount] = useState<number>(100);
  const [productName, setProductName] = useState<string>("测试商品");
  const [message, setMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);

  const handleSuccess = (paymentId: string) => {
    setMessage({
      text: `支付成功！支付ID: ${paymentId}`,
      type: "success"
    });
  };

  const handleError = (error: string) => {
    setMessage({
      text: `支付出错: ${error}`,
      type: "error"
    });
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50">
      <Card className="w-full max-w-md">
        <CardHeader>
          <h1 className="text-2xl font-bold">支付测试页面</h1>
          <p className="text-gray-500">使用 Stripe 进行支付测试</p>
        </CardHeader>
        
        <CardBody className="space-y-4">
          {message && (
            <div className={`p-3 rounded ${
              message.type === "success" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
            }`}>
              {message.text}
            </div>
          )}
          
          <div>
            <label className="block mb-2 text-sm font-medium">商品名称</label>
            <Input
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
              placeholder="输入商品名称"
              className="w-full"
            />
          </div>
          
          <div>
            <label className="block mb-2 text-sm font-medium">金额 (CNY)</label>
            <Input
              type="number"
              min="1"
              value={amount.toString()}
              onChange={(e) => setAmount(Number(e.target.value))}
              placeholder="输入金额"
              className="w-full"
            />
          </div>
        </CardBody>
        
        <CardFooter>
          <StripePaymentButton
            amount={amount}
            productName={productName}
            onSuccess={handleSuccess}
            onError={handleError}
          />
        </CardFooter>
      </Card>
    </div>
  );
} 