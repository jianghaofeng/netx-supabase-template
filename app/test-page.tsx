export default function TestPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <h1 className="text-4xl font-bold mb-4">测试页面</h1>
      <p className="text-lg">如果你看到这个页面，说明路由系统工作正常！</p>
      <div className="mt-8">
        <a href="/" className="text-blue-500 hover:underline">返回主页</a>
      </div>
    </div>
  );
} 