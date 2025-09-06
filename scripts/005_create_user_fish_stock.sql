-- Create user fish stock management tables
CREATE TABLE IF NOT EXISTS user_fish_stock (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  fish_species_id INTEGER REFERENCES fish_species(id) ON DELETE CASCADE,
  pond_name TEXT NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 0,
  size_category TEXT CHECK (size_category IN ('fry', 'fingerling', 'juvenile', 'adult')) DEFAULT 'fry',
  average_weight DECIMAL(8,2), -- in grams
  stocking_date DATE,
  expected_harvest_date DATE,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE user_fish_stock ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view their own fish stock" ON user_fish_stock
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own fish stock" ON user_fish_stock
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own fish stock" ON user_fish_stock
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own fish stock" ON user_fish_stock
  FOR DELETE USING (auth.uid() = user_id);
