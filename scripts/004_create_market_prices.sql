-- Create market price tracking tables
CREATE TABLE IF NOT EXISTS market_prices (
  id SERIAL PRIMARY KEY,
  fish_species_id INTEGER REFERENCES fish_species(id) ON DELETE CASCADE,
  upazila_id INTEGER REFERENCES upazilas(id) ON DELETE CASCADE,
  price_per_kg DECIMAL(10,2) NOT NULL,
  size_category TEXT CHECK (size_category IN ('small', 'medium', 'large')) DEFAULT 'medium',
  market_name TEXT,
  reported_by UUID REFERENCES auth.users(id),
  is_verified BOOLEAN DEFAULT FALSE,
  price_date DATE DEFAULT CURRENT_DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE market_prices ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Anyone can view market prices" ON market_prices
  FOR SELECT TO authenticated, anon USING (true);

CREATE POLICY "Authenticated users can insert market prices" ON market_prices
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = reported_by);

CREATE POLICY "Users can update their own price reports" ON market_prices
  FOR UPDATE TO authenticated USING (auth.uid() = reported_by);

CREATE POLICY "Users can delete their own price reports" ON market_prices
  FOR DELETE TO authenticated USING (auth.uid() = reported_by);
