import { SurpriseType } from '../config/themes';

export interface PhotoItem {
  id: string;
  file?: File;
  previewUrl: string;
  storagePath?: string;
  caption: string;
}

export interface SurpriseData {
  id: string;
  type: SurpriseType;
  first_name: string;
  last_name: string;
  sender_name: string;
  dob: string | null;
  turning_age: number | null;
  details: Record<string, any>;
  wishes: string[];
  letter: string;
  photos: Array<{ storage_path: string; caption: string }>;
  created_at: string;
  viewed_at: string | null;
  photos_deleted: boolean;
}

export interface CreatorFormState {
  type: SurpriseType;
  primaryName: string;
  secondaryName: string;
  senderName: string;
  dateValue: string;
  extraNumber: string;
  details: Record<string, any>;
  wishes: string[];
  photos: PhotoItem[];
  skipPhotos: boolean;
  letter: string;
}
