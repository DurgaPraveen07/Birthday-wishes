import React, { useState } from 'react';
import { Sparkles, Lightbulb, Heart, ArrowLeft } from 'lucide-react';
import { CreatorFormState } from '../../types/surprise';
import { ThemeConfig } from '../../config/themes';

interface Props {
  theme: ThemeConfig;
  form: CreatorFormState;
  onChange: (fields: Partial<CreatorFormState>) => void;
  onNext: () => void;
  onPrev: () => void;
}

export const Step4Letter: React.FC<Props> = ({ theme, form, onChange, onNext, onPrev }) => {
  const [showPresets, setShowPresets] = useState(false);

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const text = e.target.value.slice(0, 500);
    onChange({ letter: text });
  };

  const isFormValid = form.letter.trim().length > 0;

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="text-center space-y-2">
        <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider ${theme.badgeBg}`}>
          <Sparkles className="w-3.5 h-3.5" /> Step 4 of 5
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold font-heading text-white">
          {theme.letterTitle}
        </h2>
        <p className="text-sm text-slate-300">{theme.letterSubtitle}</p>
      </div>

      {/* Header controls */}
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={() => setShowPresets(!showPresets)}
          className="px-3 py-1.5 rounded-lg bg-amber-500/20 text-amber-300 hover:bg-amber-500/30 border border-amber-500/30 text-xs font-semibold flex items-center gap-1.5 transition-all"
        >
          <Lightbulb className="w-3.5 h-3.5" />
          <span>Need inspiration? Sample letter</span>
        </button>

        <span className={`text-xs font-semibold ${form.letter.length >= 480 ? 'text-amber-400 font-bold' : 'text-slate-400'}`}>
          {form.letter.length}/500 chars
        </span>
      </div>

      {/* Preset Modal */}
      {showPresets && (
        <div className="p-4 rounded-xl bg-amber-950/40 border border-amber-500/30 space-y-3 animate-fadeIn">
          <h4 className="text-xs font-bold text-amber-200 uppercase tracking-wider">
            Select a sample letter to customize:
          </h4>
          <div className="space-y-2">
            {theme.letterPresets.map((preset, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  onChange({ letter: preset.text });
                  setShowPresets(false);
                }}
                className="w-full text-left p-3 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-xs text-slate-200 transition-all border border-slate-700 space-y-1 group"
              >
                <div className="font-bold text-pink-300">{preset.title}</div>
                <div className="text-slate-300 line-clamp-2">{preset.text}</div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Text Area Input */}
      <div className="relative">
        <textarea
          rows={6}
          maxLength={500}
          placeholder={theme.letterPrompt}
          value={form.letter}
          onChange={handleTextChange}
          className="w-full bg-slate-900/90 border border-slate-700/80 rounded-2xl p-4 text-white text-sm leading-relaxed placeholder-slate-500 focus:outline-none focus:border-pink-500 focus:ring-1 focus:ring-pink-500 transition-all resize-none font-serif"
        />
        <div className="absolute right-3 bottom-3 text-slate-500 text-xs flex items-center gap-1">
          <Heart className="w-3.5 h-3.5 text-pink-400" />
          <span>Written with love</span>
        </div>
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
          disabled={!isFormValid}
          className={`flex-1 py-3.5 rounded-xl bg-gradient-to-r ${theme.buttonGradient} text-white font-semibold shadow-lg shadow-pink-500/25 active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2 text-base`}
        >
          <span>Review & Bake Magic ✨</span>
        </button>
      </div>
    </div>
  );
};
