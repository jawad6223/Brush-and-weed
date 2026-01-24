import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type SiteSection = {
  id: string;
  section_key: string;
  title: string;
  subtitle: string;
  description: string;
  image_url: string;
  cta_text: string;
  cta_secondary_text: string;
  created_at: string;
  updated_at: string;
};

export type SiteFeature = {
  id: string;
  title: string;
  description: string;
  icon_name: string;
  order_index: number;
  created_at: string;
  updated_at: string;
};

export type SiteStep = {
  id: string;
  step_number: number;
  title: string;
  description: string;
  section: string;
  order_index: number;
  created_at: string;
  updated_at: string;
};

export type SiteImage = {
  id: string;
  key: string;
  url: string;
  alt_text: string;
  section: string;
  created_at: string;
  updated_at: string;
};
