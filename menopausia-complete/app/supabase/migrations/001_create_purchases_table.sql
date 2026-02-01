-- Create purchases table to track Hotmart purchases
CREATE TABLE IF NOT EXISTS purchases (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email VARCHAR(255) NOT NULL,
  product_id VARCHAR(100) NOT NULL,
  hotmart_transaction_id VARCHAR(255) NOT NULL,
  hotmart_product_id INTEGER NOT NULL,
  buyer_name VARCHAR(255),
  status VARCHAR(50) DEFAULT 'active' CHECK (status IN ('active', 'cancelled', 'refunded')),
  purchased_at TIMESTAMP WITH TIME ZONE NOT NULL,
  cancelled_at TIMESTAMP WITH TIME ZONE,
  price_value DECIMAL(10, 2),
  price_currency VARCHAR(3),
  raw_webhook_data JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  -- Unique constraint to prevent duplicate purchases
  UNIQUE(hotmart_transaction_id, product_id)
);

-- Create index on email for faster lookups
CREATE INDEX IF NOT EXISTS idx_purchases_email ON purchases(email);

-- Create index on product_id for faster lookups
CREATE INDEX IF NOT EXISTS idx_purchases_product_id ON purchases(product_id);

-- Create index on status for filtering active purchases
CREATE INDEX IF NOT EXISTS idx_purchases_status ON purchases(status) WHERE status = 'active';

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_purchases_updated_at
  BEFORE UPDATE ON purchases
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security (RLS)
ALTER TABLE purchases ENABLE ROW LEVEL SECURITY;

-- Create policy to allow public read access (for login verification)
CREATE POLICY "Allow public read access to purchases"
  ON purchases
  FOR SELECT
  USING (true);

-- Create policy to allow webhook to insert/update
-- Note: In production, you should use a service role key for the webhook
CREATE POLICY "Allow webhook to insert/update purchases"
  ON purchases
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- Comment the table
COMMENT ON TABLE purchases IS 'Stores Hotmart purchase transactions for product access control';
