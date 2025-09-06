-- Create pond accounting tables for income and expense tracking
CREATE TABLE IF NOT EXISTS expense_categories (
  id SERIAL PRIMARY KEY,
  name_bn TEXT NOT NULL,
  name_en TEXT NOT NULL,
  description_bn TEXT,
  description_en TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS income_categories (
  id SERIAL PRIMARY KEY,
  name_bn TEXT NOT NULL,
  name_en TEXT NOT NULL,
  description_bn TEXT,
  description_en TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert expense categories
INSERT INTO expense_categories (name_bn, name_en, description_bn, description_en) VALUES
('পোনা ক্রয়', 'Fry Purchase', 'মাছের পোনা কেনার খরচ', 'Cost of buying fish fry'),
('খাদ্য', 'Feed', 'মাছের খাবারের খরচ', 'Fish feed expenses'),
('ওষুধ', 'Medicine', 'মাছের চিকিৎসার খরচ', 'Fish medicine and treatment'),
('পুকুর প্রস্তুতি', 'Pond Preparation', 'পুকুর তৈরি ও প্রস্তুতির খরচ', 'Pond preparation costs'),
('শ্রমিক', 'Labor', 'শ্রমিকের মজুরি', 'Labor wages'),
('জ্বালানি', 'Fuel', 'জ্বালানি খরচ', 'Fuel expenses'),
('অন্যান্য', 'Others', 'অন্যান্য খরচ', 'Other miscellaneous expenses');

-- Insert income categories
INSERT INTO income_categories (name_bn, name_en, description_bn, description_en) VALUES
('মাছ বিক্রয়', 'Fish Sale', 'মাছ বিক্রয়ের আয়', 'Income from fish sales'),
('অন্যান্য', 'Others', 'অন্যান্য আয়', 'Other income sources');

-- Create pond expenses table
CREATE TABLE IF NOT EXISTS pond_expenses (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  pond_name TEXT NOT NULL,
  expense_category_id INTEGER REFERENCES expense_categories(id) ON DELETE CASCADE,
  amount DECIMAL(12,2) NOT NULL,
  description TEXT,
  expense_date DATE DEFAULT CURRENT_DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create pond income table
CREATE TABLE IF NOT EXISTS pond_income (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  pond_name TEXT NOT NULL,
  income_category_id INTEGER REFERENCES income_categories(id) ON DELETE CASCADE,
  amount DECIMAL(12,2) NOT NULL,
  quantity_kg DECIMAL(8,2), -- quantity sold in kg
  price_per_kg DECIMAL(10,2), -- price per kg
  description TEXT,
  income_date DATE DEFAULT CURRENT_DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS for expenses
ALTER TABLE pond_expenses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own pond expenses" ON pond_expenses
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own pond expenses" ON pond_expenses
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own pond expenses" ON pond_expenses
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own pond expenses" ON pond_expenses
  FOR DELETE USING (auth.uid() = user_id);

-- Enable RLS for income
ALTER TABLE pond_income ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own pond income" ON pond_income
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own pond income" ON pond_income
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own pond income" ON pond_income
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own pond income" ON pond_income
  FOR DELETE USING (auth.uid() = user_id);
