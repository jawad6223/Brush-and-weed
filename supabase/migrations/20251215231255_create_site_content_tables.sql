/*
  # Site Content Management Schema

  ## Overview
  Creates tables to store all editable content for the website including hero section,
  features, steps, and images.

  ## New Tables
  
  ### `site_sections`
  Stores main content sections with text and images
  - `id` (uuid, primary key)
  - `section_key` (text, unique) - identifier like 'hero', 'about', etc.
  - `title` (text)
  - `subtitle` (text)
  - `description` (text)
  - `image_url` (text)
  - `cta_text` (text) - call to action button text
  - `cta_secondary_text` (text) - secondary button text
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)

  ### `site_features`
  Stores feature items displayed on the site
  - `id` (uuid, primary key)
  - `title` (text)
  - `description` (text)
  - `icon_name` (text) - lucide icon name
  - `order_index` (integer) - display order
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)

  ### `site_steps`
  Stores process/how-it-works steps
  - `id` (uuid, primary key)
  - `step_number` (integer)
  - `title` (text)
  - `description` (text)
  - `section` (text) - which section this belongs to
  - `order_index` (integer)
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)

  ### `site_images`
  Stores additional images used throughout the site
  - `id` (uuid, primary key)
  - `key` (text, unique) - identifier for the image
  - `url` (text)
  - `alt_text` (text)
  - `section` (text) - which section uses this image
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)

  ## Security
  - Enable RLS on all tables
  - Public read access for displaying content
  - Only authenticated users can modify content
*/

-- Create site_sections table
CREATE TABLE IF NOT EXISTS site_sections (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  section_key text UNIQUE NOT NULL,
  title text DEFAULT '',
  subtitle text DEFAULT '',
  description text DEFAULT '',
  image_url text DEFAULT '',
  cta_text text DEFAULT '',
  cta_secondary_text text DEFAULT '',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create site_features table
CREATE TABLE IF NOT EXISTS site_features (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text DEFAULT '',
  icon_name text DEFAULT 'circle',
  order_index integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create site_steps table
CREATE TABLE IF NOT EXISTS site_steps (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  step_number integer NOT NULL,
  title text NOT NULL,
  description text DEFAULT '',
  section text DEFAULT 'how-it-works',
  order_index integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create site_images table
CREATE TABLE IF NOT EXISTS site_images (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  key text UNIQUE NOT NULL,
  url text NOT NULL,
  alt_text text DEFAULT '',
  section text DEFAULT '',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE site_sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_features ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_steps ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_images ENABLE ROW LEVEL SECURITY;

-- Policies for site_sections
CREATE POLICY "Anyone can view site sections"
  ON site_sections FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert site sections"
  ON site_sections FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update site sections"
  ON site_sections FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete site sections"
  ON site_sections FOR DELETE
  TO authenticated
  USING (true);

-- Policies for site_features
CREATE POLICY "Anyone can view features"
  ON site_features FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert features"
  ON site_features FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update features"
  ON site_features FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete features"
  ON site_features FOR DELETE
  TO authenticated
  USING (true);

-- Policies for site_steps
CREATE POLICY "Anyone can view steps"
  ON site_steps FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert steps"
  ON site_steps FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update steps"
  ON site_steps FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete steps"
  ON site_steps FOR DELETE
  TO authenticated
  USING (true);

-- Policies for site_images
CREATE POLICY "Anyone can view images"
  ON site_images FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert images"
  ON site_images FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update images"
  ON site_images FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete images"
  ON site_images FOR DELETE
  TO authenticated
  USING (true);

-- Insert default content from current site
INSERT INTO site_sections (section_key, title, subtitle, description, image_url, cta_text, cta_secondary_text) VALUES
  ('hero', 'Your Natural Solution for Land Management', 'Eco-Friendly Goat Clearing Services in Central Oregon', 'Let our herd of friendly goats transform your overgrown property into beautifully maintained land. Chemical-free, sustainable, and surprisingly effective.', 'https://images.pexels.com/photos/2382619/pexels-photo-2382619.jpeg?auto=compress&cs=tinysrgb&w=800', 'Get Free Quote', 'Learn More'),
  ('about', 'Why Choose Goat Clearing?', '', 'Our goats provide an environmentally friendly alternative to traditional brush clearing methods. No chemicals, no heavy machinery, just nature doing what it does best.', '', '', ''),
  ('technology', 'State-of-the-Art GPS Fence Technology', '', 'Cutting-edge technology meets traditional land management', 'https://images.pexels.com/photos/3628100/pexels-photo-3628100.jpeg?auto=compress&cs=tinysrgb&w=800', '', ''),
  ('benefits', 'The Goat Advantage', '', '', 'https://images.pexels.com/photos/1670732/pexels-photo-1670732.jpeg?auto=compress&cs=tinysrgb&w=800', '', '')
ON CONFLICT (section_key) DO NOTHING;

INSERT INTO site_features (title, description, icon_name, order_index) VALUES
  ('100% Organic', 'No harmful chemicals or pesticides. Safe for your family, pets, and the environment.', 'Leaf', 0),
  ('Cost Effective', 'More affordable than traditional clearing methods with longer-lasting results.', 'DollarSign', 1),
  ('Terrain Friendly', 'Our goats can access steep slopes and difficult terrain where machines cannot go.', 'Mountain', 2),
  ('Soil Enrichment', 'Natural fertilization improves soil health while clearing unwanted vegetation.', 'Sprout', 3),
  ('Fire Prevention', 'Reduce wildfire risk by clearing dry brush and creating defensible space.', 'Flame', 4),
  ('Targeted Clearing', 'Goats eat invasive species while leaving desirable plants intact.', 'Target', 5)
ON CONFLICT DO NOTHING;

INSERT INTO site_steps (step_number, title, description, section, order_index) VALUES
  (1, 'Free Property Assessment', 'We visit your property to evaluate the scope of work and provide a detailed quote.', 'how-it-works', 0),
  (2, 'GPS Fence Installation', 'We set up a virtual GPS fence that keeps our goats exactly where they need to be.', 'how-it-works', 1),
  (3, 'Goats Get to Work', 'Our herd arrives and begins clearing your property naturally and efficiently.', 'how-it-works', 2),
  (4, 'Monitoring & Care', 'We check on the goats daily, ensuring optimal clearing and their wellbeing.', 'how-it-works', 3),
  (1, 'GPS Collar Technology', 'Each goat wears a lightweight GPS collar that communicates with our fence system in real-time.', 'technology', 0),
  (2, 'Virtual Boundaries', 'We create precise digital boundaries around your property or specific areas you want cleared.', 'technology', 1),
  (3, 'Training & Behavior', 'Goats learn the boundaries through gentle audio cues, keeping them safely contained.', 'technology', 2),
  (4, 'Remote Monitoring', 'We can monitor herd location and activity from anywhere, ensuring complete coverage.', 'technology', 3)
ON CONFLICT DO NOTHING;