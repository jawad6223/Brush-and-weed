/*
  # Create quote submissions table

  1. New Tables
    - `quote_submissions`
      - `id` (uuid, primary key) - Unique identifier for each submission
      - `name` (text) - Customer's full name
      - `email` (text) - Customer's email address
      - `phone` (text) - Customer's phone number
      - `address` (text) - Property address
      - `acres` (text) - Approximate acreage
      - `message` (text) - Additional project details
      - `created_at` (timestamptz) - Submission timestamp
      - `status` (text) - Status of the quote (new, contacted, quoted, completed)
  
  2. Security
    - Enable RLS on `quote_submissions` table
    - No public access - only admin users can view submissions
    - Anonymous users can insert (submit quotes) but cannot read
*/

CREATE TABLE IF NOT EXISTS quote_submissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  phone text NOT NULL,
  address text NOT NULL,
  acres text DEFAULT '',
  message text DEFAULT '',
  status text DEFAULT 'new',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE quote_submissions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit quotes"
  ON quote_submissions
  FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Authenticated users can view all submissions"
  ON quote_submissions
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can update submissions"
  ON quote_submissions
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);