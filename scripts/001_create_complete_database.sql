-- Create complete database schema for fish farming management system

-- Enable Row Level Security
ALTER DATABASE postgres SET "app.jwt_secret" TO 'your-jwt-secret';

-- Create divisions table
CREATE TABLE IF NOT EXISTS public.divisions (
    id SERIAL PRIMARY KEY,
    name_bn VARCHAR(100) NOT NULL,
    name_en VARCHAR(100) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create districts table
CREATE TABLE IF NOT EXISTS public.districts (
    id SERIAL PRIMARY KEY,
    division_id INTEGER REFERENCES public.divisions(id) ON DELETE CASCADE,
    name_bn VARCHAR(100) NOT NULL,
    name_en VARCHAR(100) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create upazilas table
CREATE TABLE IF NOT EXISTS public.upazilas (
    id SERIAL PRIMARY KEY,
    district_id INTEGER REFERENCES public.districts(id) ON DELETE CASCADE,
    name_bn VARCHAR(100) NOT NULL,
    name_en VARCHAR(100) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create fish categories table
CREATE TABLE IF NOT EXISTS public.fish_categories (
    id SERIAL PRIMARY KEY,
    name_bn VARCHAR(100) NOT NULL,
    name_en VARCHAR(100) NOT NULL,
    description_bn TEXT,
    description_en TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create fish species table
CREATE TABLE IF NOT EXISTS public.fish_species (
    id SERIAL PRIMARY KEY,
    category_id INTEGER REFERENCES public.fish_categories(id) ON DELETE CASCADE,
    name_bn VARCHAR(100) NOT NULL,
    name_en VARCHAR(100) NOT NULL,
    scientific_name VARCHAR(100),
    description_bn TEXT,
    description_en TEXT,
    farming_guide_bn TEXT,
    farming_guide_en TEXT,
    image_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create market prices table
CREATE TABLE IF NOT EXISTS public.market_prices (
    id SERIAL PRIMARY KEY,
    fish_species_id INTEGER REFERENCES public.fish_species(id) ON DELETE CASCADE,
    upazila_id INTEGER REFERENCES public.upazilas(id) ON DELETE CASCADE,
    price_per_kg DECIMAL(10,2) NOT NULL,
    market_name VARCHAR(200),
    reported_by UUID REFERENCES auth.users(id),
    reported_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    is_verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert sample divisions
INSERT INTO public.divisions (name_bn, name_en) VALUES
('ঢাকা', 'Dhaka'),
('চট্টগ্রাম', 'Chattogram'),
('রাজশাহী', 'Rajshahi'),
('খুলনা', 'Khulna'),
('বরিশাল', 'Barishal'),
('সিলেট', 'Sylhet'),
('রংপুর', 'Rangpur'),
('ময়মনসিংহ', 'Mymensingh')
ON CONFLICT DO NOTHING;

-- Insert sample districts for Dhaka division
INSERT INTO public.districts (division_id, name_bn, name_en) VALUES
(1, 'ঢাকা', 'Dhaka'),
(1, 'গাজীপুর', 'Gazipur'),
(1, 'নারায়ণগঞ্জ', 'Narayanganj'),
(1, 'মানিকগঞ্জ', 'Manikganj')
ON CONFLICT DO NOTHING;

-- Insert sample upazilas for Dhaka district
INSERT INTO public.upazilas (district_id, name_bn, name_en) VALUES
(1, 'ধানমন্ডি', 'Dhanmondi'),
(1, 'গুলশান', 'Gulshan'),
(1, 'উত্তরা', 'Uttara'),
(1, 'মিরপুর', 'Mirpur')
ON CONFLICT DO NOTHING;

-- Insert fish categories
INSERT INTO public.fish_categories (name_bn, name_en, description_bn, description_en) VALUES
('দেশি মাছ', 'Native Fish', 'বাংলাদেশের স্থানীয় মাছের প্রজাতি', 'Native fish species of Bangladesh'),
('বিদেশি মাছ', 'Exotic Fish', 'বিদেশ থেকে আনা মাছের প্রজাতি', 'Exotic fish species imported from abroad'),
('চিংড়ি', 'Shrimp', 'বিভিন্ন ধরনের চিংড়ি', 'Various types of shrimp'),
('সামুদ্রিক মাছ', 'Marine Fish', 'সমুদ্রের মাছ', 'Marine fish species')
ON CONFLICT DO NOTHING;

-- Insert sample fish species
INSERT INTO public.fish_species (category_id, name_bn, name_en, scientific_name, description_bn, description_en) VALUES
(1, 'রুই', 'Rohu', 'Labeo rohita', 'জনপ্রিয় দেশি মাছ', 'Popular native fish'),
(1, 'কাতলা', 'Catla', 'Catla catla', 'বড় আকারের দেশি মাছ', 'Large native fish'),
(1, 'মৃগেল', 'Mrigal', 'Cirrhinus cirrhosus', 'মধ্যম আকারের দেশি মাছ', 'Medium-sized native fish'),
(2, 'তেলাপিয়া', 'Tilapia', 'Oreochromis niloticus', 'দ্রুত বর্ধনশীল বিদেশি মাছ', 'Fast-growing exotic fish'),
(2, 'পাঙ্গাস', 'Pangasius', 'Pangasianodon hypophthalmus', 'জনপ্রিয় বিদেশি মাছ', 'Popular exotic fish')
ON CONFLICT DO NOTHING;

-- Enable RLS on all tables
ALTER TABLE public.divisions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.districts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.upazilas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fish_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fish_species ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.market_prices ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access to location and fish data
CREATE POLICY "Allow public read access to divisions" ON public.divisions FOR SELECT USING (true);
CREATE POLICY "Allow public read access to districts" ON public.districts FOR SELECT USING (true);
CREATE POLICY "Allow public read access to upazilas" ON public.upazilas FOR SELECT USING (true);
CREATE POLICY "Allow public read access to fish categories" ON public.fish_categories FOR SELECT USING (true);
CREATE POLICY "Allow public read access to fish species" ON public.fish_species FOR SELECT USING (true);
CREATE POLICY "Allow public read access to market prices" ON public.market_prices FOR SELECT USING (true);

-- Create policies for authenticated users to insert market prices
CREATE POLICY "Allow authenticated users to insert market prices" ON public.market_prices FOR INSERT WITH CHECK (auth.uid() = reported_by);
