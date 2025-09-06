-- Create fish species and categories
CREATE TABLE IF NOT EXISTS fish_categories (
  id SERIAL PRIMARY KEY,
  name_bn TEXT NOT NULL,
  name_en TEXT NOT NULL,
  description_bn TEXT,
  description_en TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS fish_species (
  id SERIAL PRIMARY KEY,
  category_id INTEGER REFERENCES fish_categories(id) ON DELETE CASCADE,
  name_bn TEXT NOT NULL,
  name_en TEXT NOT NULL,
  scientific_name TEXT,
  description_bn TEXT,
  description_en TEXT,
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert fish categories
INSERT INTO fish_categories (name_bn, name_en, description_bn, description_en) VALUES
('কার্প জাতীয়', 'Carp Fish', 'কার্প জাতীয় মাছ', 'Carp family fish'),
('শিং-মাগুর জাতীয়', 'Catfish', 'শিং ও মাগুর জাতীয় মাছ', 'Catfish family'),
('চিংড়ি', 'Shrimp', 'চিংড়ি জাতীয়', 'Shrimp and prawns'),
('সামুদ্রিক মাছ', 'Marine Fish', 'সামুদ্রিক মাছ', 'Marine fish'),
('দেশি মাছ', 'Native Fish', 'দেশি জাতের মাছ', 'Native fish species');

-- Insert popular fish species
INSERT INTO fish_species (category_id, name_bn, name_en, scientific_name) VALUES
(1, 'রুই', 'Rohu', 'Labeo rohita'),
(1, 'কাতলা', 'Catla', 'Catla catla'),
(1, 'মৃগেল', 'Mrigal', 'Cirrhinus cirrhosus'),
(1, 'সিলভার কার্প', 'Silver Carp', 'Hypophthalmichthys molitrix'),
(1, 'গ্রাস কার্প', 'Grass Carp', 'Ctenopharyngodon idella'),
(2, 'শিং', 'Stinging Catfish', 'Heteropneustes fossilis'),
(2, 'মাগুর', 'Walking Catfish', 'Clarias batrachus'),
(2, 'কৈ', 'Climbing Perch', 'Anabas testudineus'),
(3, 'গলদা চিংড়ি', 'Giant Freshwater Prawn', 'Macrobrachium rosenbergii'),
(3, 'বাগদা চিংড়ি', 'Black Tiger Shrimp', 'Penaeus monodon'),
(5, 'শোল', 'Snakehead', 'Channa striata'),
(5, 'টেংরা', 'Tengra', 'Mystus vittatus');
