"use client";

import Link from "next/link";

export default function PaymentCancelPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <div className="bg-yellow-50 text-yellow-800 p-6 rounded-lg shadow-md max-w-md w-full">
        <h1 className="text-2xl font-bold mb-4">支付已取消</h1>
        
        <div className="mb-6">
          <p className="mb-2">您的支付流程已被取消。</p>
          <p className="text-sm">如果您在支付过程中遇到任何问题，请联系我们的客户支持团队。</p>
        </div>
        
        <div className="flex justify-between">
          <Link 
            href="/"
            className="bg-yellow-500 hover:bg-yellow-600 text-white font-medium py-2 px-4 rounded transition-colors"
          >
            返回首页
          </Link>
          
          <button 
            onClick={() => window.history.back()}
            className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-4 rounded transition-colors"
          >
            返回购买
          </button>
        </div>
      </div>
    </div>
  );
} 