-- SQL Migration Schema for Multi-Theme Surprise App (Birthday, Wedding, Love)

-- 1. Create `surprises` table with `type` and `details` JSONB
CREATE TABLE IF NOT EXISTS public.surprises (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type TEXT NOT NULL DEFAULT 'birthday',
  first_name TEXT NOT NULL DEFAULT '',
  last_name TEXT NOT NULL DEFAULT '',
  sender_name TEXT NOT NULL DEFAULT '',
  dob DATE DEFAULT NULL,
  turning_age INTEGER DEFAULT NULL,
  details JSONB NOT NULL DEFAULT '{}'::jsonb,
  wishes JSONB NOT NULL DEFAULT '[]'::jsonb,
  letter TEXT NOT NULL DEFAULT '',
  photos JSONB NOT NULL DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  viewed_at TIMESTAMPTZ DEFAULT NULL,
  photos_deleted BOOLEAN NOT NULL DEFAULT FALSE
);

-- Migrations for existing tables if already created
ALTER TABLE public.surprises ADD COLUMN IF NOT EXISTS type TEXT NOT NULL DEFAULT 'birthday';
ALTER TABLE public.surprises ADD COLUMN IF NOT EXISTS details JSONB NOT NULL DEFAULT '{}'::jsonb;

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

-- Allow public update access (for marking viewed_at and photo deletion status)
CREATE POLICY "Allow public update viewed_at"
  ON public.surprises FOR UPDATE
  USING (true)
  WITH CHECK (true);

-- 2. Storage Setup for `temp-photos`
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
