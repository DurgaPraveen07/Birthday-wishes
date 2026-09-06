export interface PhotoItem {
  id: string;
  file?: File;
  previewUrl: string;
  storagePath?: string;
  caption: string;
}

export interface SurpriseData {
  id: string;
  first_name: string;
  last_name: string;
  sender_name: string;
  dob: string | null;
  turning_age: number | null;
  wishes: string[];
  letter: string;
  photos: Array<{ storage_path: string; caption: string }>;
  created_at: string;
  viewed_at: string | null;
  photos_deleted: boolean;
}

export interface CreatorFormState {
  first_name: string;
  last_name: string;
  sender_name: string;
  dob: string;
  turning_age: string;
  wishes: string[];
  photos: PhotoItem[];
  skipPhotos: boolean;
  letter: string;
}
