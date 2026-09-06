import React, { useRef, useState } from 'react';
import { Sparkles, Upload, Trash2, ArrowUp, ArrowDown, Image as ImageIcon, ArrowLeft, CheckCircle2, Loader2 } from 'lucide-react';
import { CreatorFormState, PhotoItem } from '../../types/surprise';
import { ThemeConfig } from '../../config/themes';
import { uploadTempPhoto } from '../../lib/supabase';

interface Props {
  theme: ThemeConfig;
  form: CreatorFormState;
  draftId: string;
  onChange: (fields: Partial<CreatorFormState>) => void;
  onNext: () => void;
  onPrev: () => void;
}

async function compressImageFile(file: File): Promise<File> {
  if (file.size <= 1.5 * 1024 * 1024 && ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'].includes(file.type.toLowerCase())) {
    return file;
  }

  return new Promise((resolve) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      URL.revokeObjectURL(url);
      const maxWidth = 1920;
      const maxHeight = 1920;
      let width = img.width;
      let height = img.height;

      if (width > maxWidth || height > maxHeight) {
        if (width > height) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        } else {
          width = Math.round((width * maxHeight) / height);
          height = maxHeight;
        }
      }

      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(img, 0, 0, width, height);
        canvas.toBlob(
          (blob) => {
            if (blob) {
              const compressedName = file.name.replace(/\.[^/.]+$/, '') + '.jpg';
              const compressedFile = new File([blob], compressedName, { type: 'image/jpeg' });
              resolve(compressedFile);
            } else {
              resolve(file);
            }
          },
          'image/jpeg',
          0.85
        );
      } else {
        resolve(file);
      }
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      resolve(file);
    };
    img.src = url;
  });
}

export const Step3Photos: React.FC<Props> = ({ theme, form, draftId, onChange, onNext, onPrev }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const photos = form.photos;
  const skipPhotos = form.skipPhotos;

  const photosRef = useRef(photos);
  photosRef.current = photos;

  const updatePhotosState = (newPhotos: PhotoItem[]) => {
    photosRef.current = newPhotos;
    onChange({ photos: newPhotos, skipPhotos: false });
  };

  const updateSinglePhoto = (id: string, patch: Partial<PhotoItem>) => {
    const current = photosRef.current;
    const updated = current.map((p) => (p.id === id ? { ...p, ...patch } : p));
    updatePhotosState(updated);
  };

  const startUpload = async (item: PhotoItem, index: number) => {
    if (!item.file) return;
    try {
      const fileToUpload = await compressImageFile(item.file);
      const storagePath = await uploadTempPhoto(theme.type, draftId, index + 1, fileToUpload);
      updateSinglePhoto(item.id, { storagePath, isUploading: false, uploadError: undefined });
    } catch (err: any) {
      console.error('Immediate photo upload error:', err);
      const errMsg = err?.message || 'Upload failed';
      setErrorMsg(`Photo "${item.file.name}" failed to upload.`);
      updateSinglePhoto(item.id, { isUploading: false, uploadError: errMsg });
    }
  };

  const handleFileSelect = (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setErrorMsg(null);

    const newItems: PhotoItem[] = [];
    const remainingSlots = 5 - photos.length;

    for (let i = 0; i < Math.min(files.length, remainingSlots); i++) {
      const file = files[i];
      const mime = file.type ? file.type.toLowerCase() : '';
      const ext = file.name.split('.').pop()?.toLowerCase() || '';
      const isValidImage =
        mime.startsWith('image/') ||
        ['jpg', 'jpeg', 'png', 'webp', 'heic', 'heif'].includes(ext);

      if (!isValidImage) {
        setErrorMsg('Please upload valid JPG, PNG, WEBP, or photo images.');
        continue;
      }

      const previewUrl = URL.createObjectURL(file);
      const photoId = `photo_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
      const newItem: PhotoItem = {
        id: photoId,
        file,
        previewUrl,
        caption: '',
        isUploading: true,
      };

      newItems.push(newItem);
    }

    if (newItems.length > 0) {
      const updatedPhotos = [...photos, ...newItems];
      updatePhotosState(updatedPhotos);

      // Trigger background upload for each new photo
      newItems.forEach((item, idx) => {
        const actualIndex = photos.length + idx;
        startUpload(item, actualIndex);
      });
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    handleFileSelect(e.dataTransfer.files);
  };

  const handleCaptionChange = (id: string, caption: string) => {
    const updated = photosRef.current.map((p) => (p.id === id ? { ...p, caption: caption.slice(0, 60) } : p));
    updatePhotosState(updated);
  };

  const handleRemovePhoto = (id: string) => {
    const updated = photosRef.current.filter((p) => p.id !== id);
    updatePhotosState(updated);
  };

  const handleMovePhoto = (index: number, direction: 'up' | 'down') => {
    const newPhotos = [...photosRef.current];
    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= newPhotos.length) return;

    const temp = newPhotos[index];
    newPhotos[index] = newPhotos[targetIdx];
    newPhotos[targetIdx] = temp;

    updatePhotosState(newPhotos);
  };

  const isUploadingAny = photos.some((p) => p.isUploading);

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="text-center space-y-2">
        <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider ${theme.badgeBg}`}>
          <Sparkles className="w-3.5 h-3.5" /> Step 3 of 5
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold font-heading text-white">
          {theme.photosTitle}
        </h2>
        <p className="text-sm text-slate-300">{theme.photosSubtitle}</p>
      </div>

      {/* Skip Toggle */}
      <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-900/60 border border-slate-800">
        <div className="flex items-center gap-2.5">
          <ImageIcon className="w-4 h-4 text-pink-400" />
          <span className="text-xs font-medium text-slate-200">
            {photos.length > 0 ? `${photos.length}/5 photos added` : 'No photos added yet'}
          </span>
        </div>
        <button
          type="button"
          onClick={() => onChange({ skipPhotos: !skipPhotos })}
          className={`text-xs font-semibold px-3 py-1.5 rounded-lg border transition-all ${
            skipPhotos
              ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
              : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-white'
          }`}
        >
          {skipPhotos ? '✓ Photo Step Skipped' : 'Skip Photos for Now'}
        </button>
      </div>

      {/* Upload Zone */}
      {!skipPhotos && photos.length < 5 && (
        <div
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className="border-2 border-dashed border-pink-500/40 hover:border-pink-500 bg-pink-500/5 hover:bg-pink-500/10 rounded-2xl p-6 text-center cursor-pointer transition-all space-y-2 group touch-manipulation relative z-10"
        >
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/*"
            onChange={(e) => handleFileSelect(e.target.files)}
            className="hidden"
          />
          <div className="w-12 h-12 rounded-full bg-pink-500/20 flex items-center justify-center mx-auto text-pink-300 group-hover:scale-110 transition-transform">
            <Upload className="w-6 h-6" />
          </div>
          <p className="text-sm font-semibold text-white">
            Tap or Drag & Drop photos here
          </p>
          <p className="text-xs text-slate-400">
            JPG, PNG or WEBP (Max 5MB each • Up to {5 - photos.length} more)
          </p>
        </div>
      )}

      {errorMsg && (
        <div className="p-3 rounded-xl bg-rose-950/60 border border-rose-500/30 text-xs text-rose-300 text-center">
          {errorMsg}
        </div>
      )}

      {/* Uploaded Photos List */}
      {!skipPhotos && photos.length > 0 && (
        <div className="space-y-3">
          {photos.map((photo, index) => (
            <div
              key={photo.id}
              className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center gap-3"
            >
              <div className="relative w-16 h-16 rounded-lg overflow-hidden border border-slate-700 flex-shrink-0">
                <img
                  src={photo.previewUrl}
                  alt="Memory preview"
                  className="w-full h-full object-cover"
                />
                {photo.isUploading && (
                  <div className="absolute inset-0 bg-slate-950/70 flex items-center justify-center text-pink-400">
                    <Loader2 className="w-5 h-5 animate-spin" />
                  </div>
                )}
              </div>
              <div className="flex-1 space-y-1">
                <input
                  type="text"
                  maxLength={60}
                  placeholder="Add a sweet caption (e.g. Memory ✨)"
                  value={photo.caption}
                  onChange={(e) => handleCaptionChange(photo.id, e.target.value)}
                  className="w-full bg-slate-950/80 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-pink-500"
                />
                <span className="text-[10px] text-slate-500 block">
                  Photo #{index + 1} • {photo.caption.length}/60 chars
                  {photo.isUploading && <span className="text-pink-400 font-semibold ml-2">Uploading to cloud... ☁️</span>}
                  {photo.storagePath && <span className="text-emerald-400 font-semibold ml-2">✓ Uploaded to Supabase</span>}
                  {photo.uploadError && <span className="text-rose-400 font-semibold ml-2">⚠️ {photo.uploadError}</span>}
                </span>
              </div>
              <div className="flex flex-col gap-1">
                <button
                  type="button"
                  onClick={() => handleMovePhoto(index, 'up')}
                  disabled={index === 0}
                  className="p-1 text-slate-400 hover:text-white disabled:opacity-30"
                  title="Move Up"
                >
                  <ArrowUp className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => handleMovePhoto(index, 'down')}
                  disabled={index === photos.length - 1}
                  className="p-1 text-slate-400 hover:text-white disabled:opacity-30"
                  title="Move Down"
                >
                  <ArrowDown className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => handleRemovePhoto(photo.id)}
                  className="p-1 text-rose-400 hover:text-rose-300"
                  title="Delete Photo"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Temporary Notice */}
      <div className="p-3 rounded-xl bg-slate-900/40 border border-slate-800/80 flex items-start gap-2.5">
        <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
        <p className="text-[11px] text-slate-400 leading-relaxed">
          <strong className="text-slate-300">Privacy First:</strong> Photos are temporarily stored in Supabase storage for the recipient to view, and automatically deleted after they finish the experience!
        </p>
      </div>

      {/* Navigation Controls */}
      <div className="flex items-center gap-3 pt-2">
        <button
          type="button"
          onClick={onPrev}
          className="px-5 py-3.5 rounded-xl border border-slate-700 text-slate-300 font-semibold hover:bg-slate-800 transition-all flex items-center gap-2 text-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back</span>
        </button>
        <button
          type="button"
          onClick={onNext}
          disabled={isUploadingAny}
          className={`flex-1 py-3.5 rounded-xl bg-gradient-to-r ${theme.buttonGradient} text-white font-semibold shadow-lg shadow-pink-500/25 active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2 text-base`}
        >
          {isUploadingAny ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin text-white" />
              <span>Uploading Photos...</span>
            </>
          ) : (
            <span>Continue to Letter 💌</span>
          )}
        </button>
      </div>
    </div>
  );
};
