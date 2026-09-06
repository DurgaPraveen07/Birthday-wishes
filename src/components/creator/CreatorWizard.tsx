import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Step1BasicDetails } from './Step1BasicDetails';
import { Step2Wishes } from './Step2Wishes';
import { Step3Photos } from './Step3Photos';
import { Step4Letter } from './Step4Letter';
import { Step5Review } from './Step5Review';
import { CreatorFormState } from '../../types/surprise';
import { saveSurprise, uploadTempPhoto } from '../../lib/supabase';
import { THEMES, SurpriseType } from '../../config/themes';
import { Sparkles, ArrowLeft } from 'lucide-react';

interface Props {
  type?: SurpriseType;
  onGoHome?: () => void;
}

export const CreatorWizard: React.FC<Props> = ({ type = 'birthday', onGoHome }) => {
  const theme = THEMES[type] || THEMES.birthday;
  const [step, setStep] = useState(1);

  const [form, setForm] = useState<CreatorFormState>({
    type,
    primaryName: '',
    secondaryName: '',
    senderName: '',
    dateValue: '',
    extraNumber: '',
    details: {},
    wishes: theme.wishesPresets.slice(0, 3),
    photos: [],
    skipPhotos: false,
    letter: '',
  });

  const generateUUID = (): string => {
    if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
      return crypto.randomUUID();
    }
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
      const r = (Math.random() * 16) | 0;
      const v = c === 'x' ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
  };

  const [draftId, setDraftId] = useState<string>(() => generateUUID());

  useEffect(() => {
    setDraftId(generateUUID());
    setForm({
      type,
      primaryName: '',
      secondaryName: '',
      senderName: '',
      dateValue: '',
      extraNumber: '',
      details: {},
      wishes: theme.wishesPresets.slice(0, 3),
      photos: [],
      skipPhotos: false,
      letter: '',
    });
    setStep(1);
  }, [type]);

  const handleUpdate = (fields: Partial<CreatorFormState>) => {
    setForm((prev) => ({ ...prev, ...fields }));
  };

  const handleNext = () => {
    if (step < 5) setStep(step + 1);
  };

  const handlePrev = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleBakeSurprise = async (): Promise<string> => {
    const surpriseId = draftId;

    const uploadedPhotos: Array<{ storage_path: string; caption: string }> = [];

    if (!form.skipPhotos && form.photos.length > 0) {
      for (let i = 0; i < form.photos.length; i++) {
        const p = form.photos[i];
        if (p.storagePath && !p.storagePath.startsWith('blob:')) {
          uploadedPhotos.push({ storage_path: p.storagePath, caption: p.caption });
        } else if (p.file) {
          try {
            const path = await uploadTempPhoto(type, surpriseId, i + 1, p.file);
            uploadedPhotos.push({ storage_path: path, caption: p.caption });
          } catch (uploadErr) {
            console.error(`Failed to upload photo #${i + 1} during baking:`, uploadErr);
          }
        }
      }
    }

    await saveSurprise({
      id: surpriseId,
      type,
      first_name: form.primaryName,
      last_name: form.secondaryName,
      sender_name: form.senderName,
      dob: form.dateValue || null,
      turning_age: form.extraNumber ? parseInt(form.extraNumber, 10) : null,
      details: {
        primaryName: form.primaryName,
        secondaryName: form.secondaryName,
        senderName: form.senderName,
        dateValue: form.dateValue,
        extraNumber: form.extraNumber,
      },
      wishes: form.wishes.filter((w) => w.trim().length > 0),
      letter: form.letter,
      photos: uploadedPhotos,
    });

    return surpriseId;
  };

  const handleReset = () => {
    setStep(1);
    setForm({
      type,
      primaryName: '',
      secondaryName: '',
      senderName: '',
      dateValue: '',
      extraNumber: '',
      details: {},
      wishes: theme.wishesPresets.slice(0, 3),
      photos: [],
      skipPhotos: false,
      letter: '',
    });
  };

  const stepTitles = [
    'Basic Details',
    theme.wishesTitle,
    'Photo Memories',
    'The Letter',
    'Review & Bake',
  ];

  return (
    <div className={`min-h-screen bg-gradient-to-b ${theme.bgGradient} px-4 py-8 sm:py-12 flex flex-col justify-center items-center relative overflow-hidden`}>
      {/* Background ambient sparkles */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-pink-500/15 rounded-full blur-3xl animate-pulse-glow" />
        <div className="absolute top-1/2 -right-32 w-96 h-96 bg-purple-500/15 rounded-full blur-3xl animate-pulse-glow" />
      </div>

      <div className="w-full max-w-xl relative z-10 space-y-6">
        {/* Top Navigation */}
        <div className="flex items-center justify-between">
          {onGoHome && (
            <button
              type="button"
              onClick={onGoHome}
              className="text-xs text-slate-300 hover:text-white flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900/60 border border-slate-800 transition-all"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> All Surprises
            </button>
          )}

          <div className="flex items-center gap-2 text-pink-300 font-extrabold text-base sm:text-lg font-heading ml-auto">
            <span>{theme.emoji}</span>
            <span>{theme.name} Builder</span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="space-y-2 text-center">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-300 px-1">
            <span>Step {step} of 5</span>
            <span className="text-pink-300">{stepTitles[step - 1]}</span>
          </div>
          <div className="w-full bg-slate-900/90 h-2.5 rounded-full overflow-hidden border border-slate-800">
            <div
              className="bg-gradient-to-r from-pink-500 to-rose-400 h-full transition-all duration-500 ease-out"
              style={{ width: `${(step / 5) * 100}%` }}
            />
          </div>
        </div>

        {/* Wizard Container Card */}
        <div className="glass-card rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.25, ease: 'easeInOut' }}
            >
              {step === 1 && (
                <Step1BasicDetails theme={theme} form={form} onChange={handleUpdate} onNext={handleNext} />
              )}
              {step === 2 && (
                <Step2Wishes
                  theme={theme}
                  form={form}
                  onChange={handleUpdate}
                  onNext={handleNext}
                  onPrev={handlePrev}
                />
              )}
              {step === 3 && (
                <Step3Photos
                  theme={theme}
                  form={form}
                  draftId={draftId}
                  onChange={handleUpdate}
                  onNext={handleNext}
                  onPrev={handlePrev}
                />
              )}
              {step === 4 && (
                <Step4Letter
                  theme={theme}
                  form={form}
                  onChange={handleUpdate}
                  onNext={handleNext}
                  onPrev={handlePrev}
                />
              )}
              {step === 5 && (
                <Step5Review
                  theme={theme}
                  form={form}
                  onPrev={handlePrev}
                  onBake={handleBakeSurprise}
                  onReset={handleReset}
                />
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Footer info */}
        <p className="text-center text-xs text-slate-400 flex items-center justify-center gap-1">
          Made with 💛 for unforgettable surprise moments
        </p>
      </div>
    </div>
  );
};
