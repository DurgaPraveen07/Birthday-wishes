import { createClient } from '@supabase/supabase-js';
import { SurpriseData } from '../types/surprise';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

// 1. Upload photo to `temp-photos` bucket
export async function uploadTempPhoto(
  type: string,
  draftId: string,
  index: number,
  file: File
): Promise<string> {
  const safeFileName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
  const path = `${type}/${draftId}/${index}-${Date.now()}-${safeFileName}`;

  if (!isSupabaseConfigured || !supabase) {
    throw new Error('Supabase client is not configured.');
  }

  const contentType = file.type || 'image/jpeg';
  const { data, error } = await supabase.storage
    .from('temp-photos')
    .upload(path, file, { upsert: true, contentType });

  if (error) {
    console.error('Supabase storage upload error:', error);
    throw new Error(`Photo upload failed: ${error.message}`);
  }

  return data.path;
}

// 2. Save surprise record
export async function saveSurprise(
  surprise: Omit<SurpriseData, 'created_at' | 'viewed_at' | 'photos_deleted'>
): Promise<SurpriseData> {
  if (!isSupabaseConfigured || !supabase) {
    throw new Error('Supabase client is not configured. Unable to save surprise.');
  }

  const { data, error } = await supabase
    .from('surprises')
    .insert([
      {
        id: surprise.id,
        type: surprise.type,
        first_name: surprise.first_name || '',
        last_name: surprise.last_name || '',
        sender_name: surprise.sender_name || '',
        dob: surprise.dob || null,
        turning_age: surprise.turning_age || null,
        details: surprise.details || {},
        wishes: surprise.wishes,
        letter: surprise.letter,
        photos: surprise.photos,
      },
    ])
    .select()
    .single();

  if (error) {
    console.error('Supabase insert error:', error);
    throw new Error(`Failed to save surprise to database: ${error.message}`);
  }

  return data as SurpriseData;
}

// 3. Fetch surprise by ID
export async function getSurprise(id: string): Promise<SurpriseData | null> {
  if (!isSupabaseConfigured || !supabase) {
    console.error('Supabase client is not configured.');
    return null;
  }

  const { data, error } = await supabase
    .from('surprises')
    .select('*')
    .eq('id', id)
    .single();

  if (error || !data) {
    console.warn(`Surprise not found or query error for ID "${id}":`, error);
    return null;
  }

  // Mark viewed_at if not set
  if (!data.viewed_at) {
    await supabase
      .from('surprises')
      .update({ viewed_at: new Date().toISOString() })
      .eq('id', id);
  }

  // Check 2-hour expiration and trigger photo cleanup if expired & photos not deleted
  const createdAtTime = new Date(data.created_at).getTime();
  const twoHoursMs = 2 * 60 * 60 * 1000;
  if (!data.photos_deleted && Date.now() - createdAtTime > twoHoursMs) {
    deleteSurprisePhotos(id).catch((err) =>
      console.error('Expired surprise photo cleanup background error:', err)
    );
  }

  return data as SurpriseData;
}

// 4. Resolve photo display URLs (Signed URLs if Supabase, or direct data URL)
export async function getPhotoDisplayUrls(
  photos: Array<{ storage_path: string; caption: string }>
): Promise<Array<{ url: string; caption: string }>> {
  if (!photos || photos.length === 0) return [];

  const results: Array<{ url: string; caption: string }> = [];

  for (const p of photos) {
    if (p.storage_path.startsWith('data:')) {
      results.push({ url: p.storage_path, caption: p.caption });
    } else if (isSupabaseConfigured && supabase) {
      const { data } = await supabase.storage
        .from('temp-photos')
        .createSignedUrl(p.storage_path, 3600);

      results.push({
        url: data?.signedUrl || p.storage_path,
        caption: p.caption,
      });
    } else {
      results.push({ url: p.storage_path, caption: p.caption });
    }
  }

  return results;
}

// 5. Cleanup photos after finale/acceptance
export async function deleteSurprisePhotos(surpriseId: string): Promise<boolean> {
  if (!isSupabaseConfigured || !supabase) return false;

  try {
    // Invoke Edge Function
    const { error } = await supabase.functions.invoke('delete-photos', {
      body: { surprise_id: surpriseId },
    });

    if (error) {
      console.warn('Edge function invoke error, running client fallback cleanup', error);
      // Client-side fallback delete using stored photos array or folder listing
      const { data: surprise } = await supabase
        .from('surprises')
        .select('photos, type')
        .eq('id', surpriseId)
        .single();

      if (surprise && surprise.photos && surprise.photos.length > 0) {
        const pathsToDelete = surprise.photos
          .map((p: any) => p.storage_path)
          .filter(Boolean);
        if (pathsToDelete.length > 0) {
          await supabase.storage.from('temp-photos').remove(pathsToDelete);
        }
      }
      await supabase
        .from('surprises')
        .update({ photos_deleted: true })
        .eq('id', surpriseId);
    }
    return true;
  } catch (e) {
    console.error('Photo cleanup exception', e);
    return false;
  }
}

