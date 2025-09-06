-- Create location hierarchy tables for Bangladesh administrative divisions
CREATE TABLE IF NOT EXISTS divisions (
  id SERIAL PRIMARY KEY,
  name_bn TEXT NOT NULL,
  name_en TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS districts (
  id SERIAL PRIMARY KEY,
  division_id INTEGER REFERENCES divisions(id) ON DELETE CASCADE,
  name_bn TEXT NOT NULL,
  name_en TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS upazilas (
  id SERIAL PRIMARY KEY,
  district_id INTEGER REFERENCES districts(id) ON DELETE CASCADE,
  name_bn TEXT NOT NULL,
  name_en TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert Bangladesh divisions
INSERT INTO divisions (name_bn, name_en) VALUES
('ঢাকা', 'Dhaka'),
('চট্টগ্রাম', 'Chattogram'),
('রাজশাহী', 'Rajshahi'),
('খুলনা', 'Khulna'),
('বরিশাল', 'Barishal'),
('সিলেট', 'Sylhet'),
('রংপুর', 'Rangpur'),
('ময়মনসিংহ', 'Mymensingh');

-- Insert some major districts (sample data)
INSERT INTO districts (division_id, name_bn, name_en) VALUES
(1, 'ঢাকা', 'Dhaka'),
(1, 'গাজীপুর', 'Gazipur'),
(1, 'নারায়ণগঞ্জ', 'Narayanganj'),
(2, 'চট্টগ্রাম', 'Chattogram'),
(2, 'কক্সবাজার', 'Cox''s Bazar'),
(3, 'রাজশাহী', 'Rajshahi'),
(4, 'খুলনা', 'Khulna'),
(5, 'বরিশাল', 'Barishal');

-- Insert some upazilas (sample data)
INSERT INTO upazilas (district_id, name_bn, name_en) VALUES
(1, 'ধানমন্ডি', 'Dhanmondi'),
(1, 'গুলশান', 'Gulshan'),
(1, 'উত্তরা', 'Uttara'),
(2, 'কালিয়াকৈর', 'Kaliakair'),
(3, 'সিদ্ধিরগঞ্জ', 'Siddhirganj'),
(4, 'পতেঙ্গা', 'Patenga'),
(5, 'কক্সবাজার সদর', 'Cox''s Bazar Sadar');
