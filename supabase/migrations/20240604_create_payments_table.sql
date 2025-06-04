-- 创建支付记录表
CREATE TABLE IF NOT EXISTS public.payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  payment_id TEXT NOT NULL,
  user_id TEXT NOT NULL,
  amount DECIMAL(10, 2) NOT NULL,
  currency TEXT NOT NULL,
  status TEXT NOT NULL,
  payment_method TEXT,
  payment_details JSONB,
  error_message TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 设置 RLS (Row Level Security) 策略
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;

-- 允许已认证用户查看自己的支付记录
CREATE POLICY "用户可以查看自己的支付记录" ON public.payments
  FOR SELECT 
  USING (auth.uid()::text = user_id);

-- 允许已认证用户插入自己的支付记录（通常由服务端处理）
CREATE POLICY "服务角色可以插入支付记录" ON public.payments
  FOR INSERT 
  TO service_role
  WITH CHECK (true);

-- 创建索引以加快查询速度
CREATE INDEX IF NOT EXISTS payments_user_id_idx ON public.payments (user_id);
CREATE INDEX IF NOT EXISTS payments_payment_id_idx ON public.payments (payment_id);

-- 自动更新 updated_at 字段
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_payments_updated_at
BEFORE UPDATE ON public.payments
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column(); 