-- SQL Migration Schema for Birthday Surprise App

-- 1. Create `surprises` table
CREATE TABLE IF NOT EXISTS public.surprises (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL DEFAULT '',
  sender_name TEXT NOT NULL,
  dob DATE DEFAULT NULL,
  turning_age INTEGER DEFAULT NULL,
  wishes JSONB NOT NULL DEFAULT '[]'::jsonb,
  letter TEXT NOT NULL DEFAULT '',
  photos JSONB NOT NULL DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  viewed_at TIMESTAMPTZ DEFAULT NULL,
  photos_deleted BOOLEAN NOT NULL DEFAULT FALSE
);

-- Enable RLS
ALTER TABLE public.surprises ENABLE ROW LEVEL SECURITY;

-- Allow public read access to surprises
CREATE POLICY "Allow public read surprises"
  ON public.surprises FOR SELECT
  USING (true);

-- Allow public insert access to surprises
CREATE POLICY "Allow public insert surprises"
  ON public.surprises FOR INSERT
  WITH CHECK (true);

-- Allow public update access (for marking viewed_at)
CREATE POLICY "Allow public update viewed_at"
  ON public.surprises FOR UPDATE
  USING (true)
  WITH CHECK (true);

-- 2. Storage Setup for `temp-photos`
-- Create bucket if not exists
INSERT INTO storage.buckets (id, name, public)
VALUES ('temp-photos', 'temp-photos', true)
ON CONFLICT (id) DO NOTHING;

-- Storage RLS Policies
CREATE POLICY "Public Upload to temp-photos"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'temp-photos');

CREATE POLICY "Public Read from temp-photos"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'temp-photos');

CREATE POLICY "Public Delete from temp-photos"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'temp-photos');
