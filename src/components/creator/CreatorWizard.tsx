import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Step1BasicDetails } from './Step1BasicDetails';
import { Step2Wishes } from './Step2Wishes';
import { Step3Photos } from './Step3Photos';
import { Step4Letter } from './Step4Letter';
import { Step5Review } from './Step5Review';
import { CreatorFormState } from '../../types/surprise';
import { saveSurprise, uploadTempPhoto } from '../../lib/supabase';
import { Sparkles, Cake } from 'lucide-react';

export const CreatorWizard: React.FC = () => {
  const [step, setStep] = useState(1);

  const [form, setForm] = useState<CreatorFormState>({
    first_name: '',
    last_name: '',
    sender_name: '',
    dob: '',
    turning_age: '',
    wishes: [
      'May your year ahead be overflowing with pure joy, adventures & laughter! 🌟',
      'Wishing you courage to chase your biggest dreams and win! 🚀',
      'May your heart always be warm, peaceful, and surrounded by loved ones 💛',
    ],
    photos: [],
    skipPhotos: false,
    letter: '',
  });

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
    // Generate surprise ID
    const surpriseId = `bday_${Math.random().toString(36).substring(2, 10)}`;

    // Upload photos if any and not skipped
    const uploadedPhotos: Array<{ storage_path: string; caption: string }> = [];

    if (!form.skipPhotos && form.photos.length > 0) {
      for (let i = 0; i < form.photos.length; i++) {
        const p = form.photos[i];
        if (p.file) {
          const path = await uploadTempPhoto(surpriseId, i + 1, p.file);
          uploadedPhotos.push({ storage_path: path, caption: p.caption });
        } else if (p.previewUrl) {
          uploadedPhotos.push({ storage_path: p.previewUrl, caption: p.caption });
        }
      }
    }

    // Save surprise row
    await saveSurprise({
      id: surpriseId,
      first_name: form.first_name,
      last_name: form.last_name,
      sender_name: form.sender_name,
      dob: form.dob || null,
      turning_age: form.turning_age ? parseInt(form.turning_age, 10) : null,
      wishes: form.wishes.filter((w) => w.trim().length > 0),
      letter: form.letter,
      photos: uploadedPhotos,
    });

    return surpriseId;
  };

  const handleReset = () => {
    setStep(1);
    setForm({
      first_name: '',
      last_name: '',
      sender_name: '',
      dob: '',
      turning_age: '',
      wishes: [
        'May your year ahead be overflowing with pure joy, adventures & laughter! 🌟',
        'Wishing you courage to chase your biggest dreams and win! 🚀',
        'May your heart always be warm, peaceful, and surrounded by loved ones 💛',
      ],
      photos: [],
      skipPhotos: false,
      letter: '',
    });
  };

  const stepTitles = [
    'Basic Details',
    'Wishes & Blessings',
    'Photo Memories',
    'The Letter',
    'Review & Bake',
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-purple-950/60 to-slate-950 px-4 py-8 sm:py-12 flex flex-col justify-center items-center">
      {/* Background ambient sparkles */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-pink-500/15 rounded-full blur-3xl animate-pulse-glow" />
        <div className="absolute top-1/2 -right-32 w-96 h-96 bg-purple-500/15 rounded-full blur-3xl animate-pulse-glow" />
      </div>

      <div className="w-full max-w-xl relative z-10 space-y-6">
        {/* Top Header */}
        <div className="text-center space-y-2">
          <div className="flex items-center justify-center gap-2 text-pink-400 font-extrabold text-lg sm:text-xl font-heading">
            <Cake className="w-6 h-6" />
            <span>Birthday Magic Builder ✨</span>
          </div>

          {/* Progress Bar & Indicators */}
          <div className="space-y-2 pt-2">
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
        </div>

        {/* Wizard Form Container Card */}
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
                <Step1BasicDetails form={form} onChange={handleUpdate} onNext={handleNext} />
              )}
              {step === 2 && (
                <Step2Wishes
                  form={form}
                  onChange={handleUpdate}
                  onNext={handleNext}
                  onPrev={handlePrev}
                />
              )}
              {step === 3 && (
                <Step3Photos
                  form={form}
                  onChange={handleUpdate}
                  onNext={handleNext}
                  onPrev={handlePrev}
                />
              )}
              {step === 4 && (
                <Step4Letter
                  form={form}
                  onChange={handleUpdate}
                  onNext={handleNext}
                  onPrev={handlePrev}
                />
              )}
              {step === 5 && (
                <Step5Review
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
        <p className="text-center text-xs text-slate-500 flex items-center justify-center gap-1">
          Made with 💛 for unforgettable birthday moments
        </p>
      </div>
    </div>
  );
};
