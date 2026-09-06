import React, { useState } from 'react';
import { Sparkles, Copy, Check, Share2, Eye, ArrowLeft, Loader2, Heart, Gift } from 'lucide-react';
import { CreatorFormState } from '../../types/surprise';

interface Props {
  form: CreatorFormState;
  onPrev: () => void;
  onBake: () => Promise<string>;
  onReset: () => void;
}

export const Step5Review: React.FC<Props> = ({ form, onPrev, onBake, onReset }) => {
  const [isBaking, setIsBaking] = useState(false);
  const [bakingStep, setBakingStep] = useState(0);
  const [generatedId, setGeneratedId] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const BAKING_STEPS = [
    '🥣 Mixing sweet birthday wishes...',
    '🎈 Inflating custom celebration balloons...',
    '📸 Stringing up fairy-light photo memories...',
    '✉️ Sealing letter with golden wax...',
    '✨ Baking final magic link!',
  ];

  const handleStartBaking = async () => {
    setIsBaking(true);
    setBakingStep(0);

    const stepInterval = setInterval(() => {
      setBakingStep((prev) => {
        if (prev < BAKING_STEPS.length - 1) return prev + 1;
        return prev;
      });
    }, 700);

    try {
      const id = await onBake();
      clearInterval(stepInterval);
      setGeneratedId(id);
    } catch (e) {
      console.error(e);
    } finally {
      setIsBaking(false);
    }
  };

  const getShareableUrl = () => {
    if (!generatedId) return '';
    const base = window.location.origin + window.location.pathname;
    return `${base}#/view/${generatedId}`;
  };

  const handleCopyLink = () => {
    const url = getShareableUrl();
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleWhatsAppShare = () => {
    const url = getShareableUrl();
    const message = encodeURIComponent(
      `Hey ${form.first_name}! 🎂 Someone who loves you created a personalized birthday surprise just for you! Unwrap it here: ${url}`
    );
    window.open(`https://wa.me/?text=${message}`, '_blank');
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold-500/20 text-amber-300 text-xs font-semibold uppercase tracking-wider border border-amber-500/30">
          <Sparkles className="w-3.5 h-3.5" /> Step 5 of 5
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold font-heading text-white">
          Review & Bake Magic ✨
        </h2>
        <p className="text-sm text-slate-300">
          Double-check your creation before generating the final surprise link!
        </p>
      </div>

      {/* Summary Card */}
      {!generatedId && (
        <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-700/80 space-y-4 shadow-xl">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div>
              <span className="text-[11px] font-semibold text-pink-400 uppercase tracking-wider">
                Recipient & Sender
              </span>
              <h3 className="text-lg font-bold text-white font-heading">
                {form.first_name} {form.last_name}
              </h3>
              <p className="text-xs text-slate-400">
                Created with 💛 by <strong>{form.sender_name}</strong>
              </p>
            </div>
            {form.turning_age && (
              <div className="text-center bg-pink-500/20 border border-pink-500/30 px-3 py-1.5 rounded-xl">
                <span className="text-[10px] text-pink-300 uppercase block">Turning</span>
                <span className="text-lg font-extrabold text-pink-400">{form.turning_age}</span>
              </div>
            )}
          </div>

          {/* Wishes Summary */}
          <div className="space-y-1.5">
            <span className="text-xs font-semibold text-purple-300 uppercase tracking-wider flex items-center gap-1.5">
              🎈 Wishes ({form.wishes.length} Balloons)
            </span>
            <ul className="space-y-1 text-xs text-slate-300 pl-2">
              {form.wishes.map((w, i) => (
                <li key={i} className="line-clamp-1 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-purple-400 flex-shrink-0" />
                  <span>"{w}"</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Photos Summary */}
          <div className="space-y-1.5">
            <span className="text-xs font-semibold text-amber-300 uppercase tracking-wider flex items-center gap-1.5">
              📸 Photos ({form.skipPhotos ? 'Skipped' : `${form.photos.length} uploaded`})
            </span>
            {!form.skipPhotos && form.photos.length > 0 && (
              <div className="flex items-center gap-2 overflow-x-auto py-1">
                {form.photos.map((p, idx) => (
                  <img
                    key={idx}
                    src={p.previewUrl}
                    alt="Summary thumb"
                    className="w-12 h-12 rounded-lg object-cover border border-slate-700 flex-shrink-0"
                  />
                ))}
              </div>
            )}
          </div>

          {/* Letter Snippet */}
          <div className="space-y-1.5">
            <span className="text-xs font-semibold text-rose-300 uppercase tracking-wider">
              💌 Letter Preview
            </span>
            <p className="text-xs text-slate-300 bg-slate-950/60 p-3 rounded-xl border border-slate-800 line-clamp-3 italic font-serif">
              "{form.letter}"
            </p>
          </div>
        </div>
      )}

      {/* Bake Modal Loading Overlay */}
      {isBaking && (
        <div className="p-6 rounded-2xl bg-gradient-to-b from-slate-900 to-purple-950 border border-purple-500/30 text-center space-y-4 animate-fadeIn">
          <div className="w-16 h-16 rounded-full bg-pink-500/20 text-pink-400 flex items-center justify-center mx-auto animate-spin">
            <Loader2 className="w-8 h-8" />
          </div>
          <div className="space-y-1">
            <h3 className="text-lg font-bold text-white font-heading">
              Crafting the surprise... ✨
            </h3>
            <p className="text-xs text-pink-300 font-medium">
              {BAKING_STEPS[bakingStep]}
            </p>
          </div>
          <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
            <div
              className="bg-gradient-to-r from-pink-500 to-amber-400 h-full transition-all duration-300"
              style={{ width: `${((bakingStep + 1) / BAKING_STEPS.length) * 100}%` }}
            />
          </div>
        </div>
      )}

      {/* Generated Result View */}
      {generatedId && (
        <div className="p-6 rounded-2xl bg-gradient-to-b from-slate-900 via-purple-950 to-slate-900 border border-pink-500/40 text-center space-y-5 shadow-2xl animate-fadeIn">
          <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-pink-500 to-amber-400 text-white flex items-center justify-center mx-auto text-3xl shadow-lg glow-pink">
            🎁
          </div>

          <div className="space-y-2">
            <h3 className="text-2xl font-bold font-heading text-white">
              Surprise Ready for {form.first_name}! 🎉
            </h3>
            <p className="text-xs text-slate-300">
              Share this magic link with them. As soon as they finish scrolling through, temporary photos will automatically clean up!
            </p>
          </div>

          {/* Link Display Box */}
          <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 flex items-center gap-2">
            <input
              type="text"
              readOnly
              value={getShareableUrl()}
              className="flex-1 bg-transparent text-xs text-pink-300 font-mono truncate focus:outline-none"
            />
            <button
              type="button"
              onClick={handleCopyLink}
              className="px-3 py-2 rounded-lg bg-pink-500/20 hover:bg-pink-500/30 text-pink-300 border border-pink-500/30 text-xs font-semibold flex items-center gap-1.5 transition-all"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? 'Copied!' : 'Copy'}</span>
            </button>
          </div>

          {/* Share Actions */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <button
              type="button"
              onClick={handleWhatsAppShare}
              className="py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs flex items-center justify-center gap-2 shadow-lg transition-all"
            >
              <Share2 className="w-4 h-4" />
              <span>Share on WhatsApp</span>
            </button>

            <a
              href={getShareableUrl()}
              target="_blank"
              rel="noreferrer"
              className="py-3 px-4 rounded-xl bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-semibold text-xs flex items-center justify-center gap-2 shadow-lg transition-all"
            >
              <Eye className="w-4 h-4" />
              <span>Preview Page Now</span>
            </a>
          </div>

          <div className="pt-4 border-t border-slate-800">
            <button
              type="button"
              onClick={onReset}
              className="text-xs text-slate-400 hover:text-white underline"
            >
              Create another birthday surprise ✨
            </button>
          </div>
        </div>
      )}

      {/* Initial Bake Buttons */}
      {!generatedId && !isBaking && (
        <div className="flex items-center gap-3 pt-2">
          <button
            type="button"
            onClick={onPrev}
            className="px-5 py-3.5 rounded-xl border border-slate-700 text-slate-300 font-semibold hover:bg-slate-800 transition-all flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back</span>
          </button>
          <button
            type="button"
            onClick={handleStartBaking}
            className="flex-1 py-4 rounded-xl bg-gradient-to-r from-amber-400 via-pink-500 to-rose-500 text-white font-bold shadow-xl shadow-pink-500/30 hover:brightness-110 active:scale-[0.99] transition-all flex items-center justify-center gap-2 text-base glow-pink"
          >
            <Sparkles className="w-5 h-5" />
            <span>Bake the Magic ✨</span>
          </button>
        </div>
      )}
    </div>
  );
};
