"use client";

import { useState } from "react";
import { Button, Card, CardBody, CardHeader, CardFooter } from "@heroui/react";

export default function EdgeFunctionDebugPage() {
  const [status, setStatus] = useState<string>("未测试");
  const [response, setResponse] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [url, setUrl] = useState("https://ruocdffetovshaizmqat.supabase.co/functions/v1/stripe-payment");
  const [method, setMethod] = useState<"GET" | "POST" | "OPTIONS">("POST");
  const [requestBody, setRequestBody] = useState('{\n  "name": "Test"\n}');

  const testConnection = async () => {
    setIsLoading(true);
    setStatus("测试中...");
    
    try {
      const requestOptions: RequestInit = {
        method: method,
        headers: {
          "Content-Type": "application/json",
        },
      };
      
      // 只有POST请求添加请求体
      if (method === "POST") {
        try {
          const bodyObj = JSON.parse(requestBody);
          requestOptions.body = JSON.stringify(bodyObj);
        } catch (error) {
          setStatus(`请求体JSON解析错误: ${error instanceof Error ? error.message : String(error)}`);
          setIsLoading(false);
          return;
        }
      }
      
      const response = await fetch(url, requestOptions);
      
      let responseText = "";
      try {
        const data = await response.json();
        responseText = JSON.stringify(data, null, 2);
      } catch {
        // 如果无法解析为JSON，直接显示文本
        responseText = await response.text();
      }
      
      setStatus(response.ok ? "连接成功" : `连接失败: ${response.status}`);
      setResponse(responseText);
    } catch (error) {
      setStatus(`连接错误: ${error instanceof Error ? error.message : String(error)}`);
      setResponse("");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <Card className="w-full max-w-lg">
        <CardHeader>
          <h1 className="text-2xl font-bold">Edge Function 调试</h1>
          <p className="text-gray-500">检查 Supabase Edge Function 连接状态</p>
        </CardHeader>
        
        <CardBody className="space-y-4">
          <div>
            <label className="block mb-2 text-sm font-medium">Edge Function URL</label>
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="w-full p-2 border rounded"
            />
          </div>
          
          <div>
            <label className="block mb-2 text-sm font-medium">请求方法</label>
            <div className="flex gap-2">
              {(["GET", "POST", "OPTIONS"] as const).map((m) => (
                <button
                  key={m}
                  onClick={() => setMethod(m)}
                  className={`px-3 py-1 border rounded ${
                    method === m ? "bg-blue-500 text-white" : "bg-white"
                  }`}
                >
                  {m}
                </button>
              ))}
            </div>
          </div>
          
          {method === "POST" && (
            <div>
              <label className="block mb-2 text-sm font-medium">请求体 (JSON)</label>
              <textarea
                value={requestBody}
                onChange={(e) => setRequestBody(e.target.value)}
                className="w-full p-2 border rounded font-mono text-sm"
                rows={5}
              />
            </div>
          )}
          
          <div className="flex justify-center">
            <Button
              onClick={testConnection}
              disabled={isLoading}
              variant="solid"
              color="primary"
            >
              测试连接
            </Button>
          </div>
          
          <div className="mt-4">
            <div className="font-medium">状态: 
              <span className={
                status === "连接成功" ? "text-green-600" : 
                status === "未测试" ? "text-gray-500" : "text-red-600"
              }> {status}</span>
            </div>
            
            {response && (
              <div className="mt-2">
                <p className="font-medium">响应内容:</p>
                <pre className="p-3 mt-1 bg-gray-100 rounded-md whitespace-pre-wrap overflow-auto max-h-80 font-mono text-sm">
                  {response}
                </pre>
              </div>
            )}
          </div>
        </CardBody>
        
        <CardFooter className="flex flex-col gap-2">
          <p className="text-sm text-gray-500">
            如果无法连接，请检查以下问题:
          </p>
          <ul className="text-sm text-gray-500 list-disc pl-5">
            <li>Supabase Edge Function 是否正确部署</li>
            <li>URL 路径是否正确</li>
            <li>必要的环境变量是否已设置</li>
            <li>是否有 CORS 问题</li>
          </ul>
        </CardFooter>
      </Card>
    </div>
  );
} 