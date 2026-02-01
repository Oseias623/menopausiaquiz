-- Drop existing table if it exists (cuidado: isso apaga dados!)
-- Se você já tem dados de teste, comente a linha abaixo
DROP TABLE IF EXISTS purchases;

-- Create purchases table to track Hotmart purchases
CREATE TABLE purchases (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email VARCHAR(255) NOT NULL,
  product_id VARCHAR(100) NOT NULL,
  hotmart_transaction_id VARCHAR(255) NOT NULL,
  hotmart_product_id INTEGER NOT NULL,
  buyer_name VARCHAR(255),
  status VARCHAR(50) DEFAULT 'active',
  purchased_at TIMESTAMP WITH TIME ZONE NOT NULL,
  cancelled_at TIMESTAMP WITH TIME ZONE,
  price_value DECIMAL(10, 2),
  price_currency VARCHAR(3),
  raw_webhook_data JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  -- Constraints
  CONSTRAINT status_check CHECK (status IN ('active', 'cancelled', 'refunded')),
  CONSTRAINT unique_transaction_product UNIQUE(hotmart_transaction_id, product_id)
);

-- Create indexes for faster lookups
CREATE INDEX idx_purchases_email ON purchases(email);
CREATE INDEX idx_purchases_product_id ON purchases(product_id);
CREATE INDEX idx_purchases_status ON purchases(status) WHERE status = 'active';

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger
DROP TRIGGER IF EXISTS update_purchases_updated_at ON purchases;
CREATE TRIGGER update_purchases_updated_at
  BEFORE UPDATE ON purchases
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security (RLS)
ALTER TABLE purchases ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Allow public read access to purchases" ON purchases;
DROP POLICY IF EXISTS "Allow webhook to insert/update purchases" ON purchases;

-- Create policy to allow public read access (for login verification)
CREATE POLICY "Allow public read access to purchases"
  ON purchases
  FOR SELECT
  USING (true);

-- Create policy to allow webhook to insert/update
CREATE POLICY "Allow webhook to insert/update purchases"
  ON purchases
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- Comment the table
COMMENT ON TABLE purchases IS 'Stores Hotmart purchase transactions for product access control';

-- Insert test data (opcional - remova se não quiser dados de teste)
-- INSERT INTO purchases (email, product_id, hotmart_transaction_id, hotmart_product_id, buyer_name, status, purchased_at, price_value, price_currency)
-- VALUES
--   ('test@menopausa.com', 'prog-antiinflamatorio', 'TEST-001', 6887519, 'Test User', 'active', NOW(), 97.00, 'USD');
