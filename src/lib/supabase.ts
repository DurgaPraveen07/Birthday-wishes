import { createClient } from '@supabase/supabase-js';
import { SurpriseData } from '../types/surprise';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

// Local fallback store key
const LOCAL_STORAGE_KEY = 'birthday_surprises_demo';

const getLocalStore = (): Record<string, SurpriseData> => {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
};

const setLocalStore = (store: Record<string, SurpriseData>) => {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(store));
  } catch (e) {
    console.error('Failed to save to local storage', e);
  }
};

// 1. Upload photo to `temp-photos` bucket
export async function uploadTempPhoto(
  surpriseId: string,
  index: number,
  file: File
): Promise<string> {
  const path = `${surpriseId}/${index}_${Date.now()}.${file.name.split('.').pop() || 'jpg'}`;

  if (isSupabaseConfigured && supabase) {
    const { data, error } = await supabase.storage
      .from('temp-photos')
      .upload(path, file, { upsert: true });

    if (error) {
      console.warn('Supabase storage upload error, falling back to data URL', error);
      return convertFileToDataUrl(file);
    }
    return data.path;
  } else {
    // Return data URL for offline fallback
    return convertFileToDataUrl(file);
  }
}

function convertFileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

// 2. Save surprise record
export async function saveSurprise(
  surprise: Omit<SurpriseData, 'created_at' | 'viewed_at' | 'photos_deleted'>
): Promise<SurpriseData> {
  const record: SurpriseData = {
    ...surprise,
    created_at: new Date().toISOString(),
    viewed_at: null,
    photos_deleted: false,
  };

  if (isSupabaseConfigured && supabase) {
    const { data, error } = await supabase
      .from('surprises')
      .insert([
        {
          id: record.id,
          first_name: record.first_name,
          last_name: record.last_name,
          sender_name: record.sender_name,
          dob: record.dob,
          turning_age: record.turning_age,
          wishes: record.wishes,
          letter: record.letter,
          photos: record.photos,
        },
      ])
      .select()
      .single();

    if (error) {
      console.warn('Supabase save failed, storing locally', error);
      const store = getLocalStore();
      store[record.id] = record;
      setLocalStore(store);
      return record;
    }
    return data as SurpriseData;
  } else {
    const store = getLocalStore();
    store[record.id] = record;
    setLocalStore(store);
    return record;
  }
}

// 3. Fetch surprise by ID
export async function getSurprise(id: string): Promise<SurpriseData | null> {
  if (isSupabaseConfigured && supabase) {
    const { data, error } = await supabase
      .from('surprises')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !data) {
      const store = getLocalStore();
      return store[id] || null;
    }

    // Mark viewed_at if not set
    if (!data.viewed_at) {
      await supabase
        .from('surprises')
        .update({ viewed_at: new Date().toISOString() })
        .eq('id', id);
    }

    return data as SurpriseData;
  } else {
    const store = getLocalStore();
    const found = store[id] || null;
    if (found && !found.viewed_at) {
      found.viewed_at = new Date().toISOString();
      store[id] = found;
      setLocalStore(store);
    }
    return found;
  }
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
  if (isSupabaseConfigured && supabase) {
    try {
      // Invoke Edge Function
      const { data, error } = await supabase.functions.invoke('delete-photos', {
        body: { surprise_id: surpriseId },
      });

      if (error) {
        console.warn('Edge function invoke error, running fallback client cleanup', error);
        // Client-side fallback delete if storage policies allow
        const { data: files } = await supabase.storage
          .from('temp-photos')
          .list(surpriseId);

        if (files && files.length > 0) {
          const paths = files.map((f) => `${surpriseId}/${f.name}`);
          await supabase.storage.from('temp-photos').remove(paths);
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
  } else {
    // Local store cleanup
    const store = getLocalStore();
    if (store[surpriseId]) {
      store[surpriseId].photos_deleted = true;
      store[surpriseId].photos = [];
      setLocalStore(store);
    }
    return true;
  }
}
