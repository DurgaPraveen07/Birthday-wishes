import React, { useState } from 'react';
import { Sparkles, Plus, Trash2, Lightbulb, ArrowLeft } from 'lucide-react';
import { CreatorFormState } from '../../types/surprise';
import { ThemeConfig } from '../../config/themes';

interface Props {
  theme: ThemeConfig;
  form: CreatorFormState;
  onChange: (fields: Partial<CreatorFormState>) => void;
  onNext: () => void;
  onPrev: () => void;
}

export const Step2Wishes: React.FC<Props> = ({ theme, form, onChange, onNext, onPrev }) => {
  const [showInspiration, setShowInspiration] = useState(false);

  const wishes = form.wishes;

  const handleWishChange = (index: number, value: string) => {
    const updated = [...wishes];
    updated[index] = value.slice(0, 100);
    onChange({ wishes: updated });
  };

  const handleAddWish = () => {
    if (wishes.length < 5) {
      onChange({ wishes: [...wishes, ''] });
    }
  };

  const handleRemoveWish = (index: number) => {
    if (wishes.length > 3) {
      const updated = wishes.filter((_, i) => i !== index);
      onChange({ wishes: updated });
    }
  };

  const handleAutofill = () => {
    const shuffled = [...theme.wishesPresets].sort(() => 0.5 - Math.random());
    const count = Math.min(Math.max(wishes.length, 3), 5);
    const autofilled = shuffled.slice(0, count);
    onChange({ wishes: autofilled });
    setShowInspiration(false);
  };

  const isValid =
    wishes.length >= 3 &&
    wishes.length <= 5 &&
    wishes.every((w) => w.trim().length > 0);

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="text-center space-y-2">
        <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider ${theme.badgeBg}`}>
          <Sparkles className="w-3.5 h-3.5" /> Step 2 of 5
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold font-heading text-white">
          {theme.wishesTitle}
        </h2>
        <p className="text-sm text-slate-300">{theme.wishesSubtitle}</p>
      </div>

      {/* Progress & Counter */}
      <div className="flex items-center justify-between bg-slate-900/60 p-3 rounded-xl border border-slate-800">
        <span className="text-xs font-medium text-slate-300">
          🎈 Balloon Count: <strong className="text-pink-400">{wishes.length} Balloons</strong>
        </span>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setShowInspiration(!showInspiration)}
            className="px-3 py-1.5 rounded-lg bg-amber-500/20 text-amber-300 hover:bg-amber-500/30 border border-amber-500/30 text-xs font-semibold flex items-center gap-1.5 transition-all"
          >
            <Lightbulb className="w-3.5 h-3.5" />
            <span>Inspiration?</span>
          </button>
          <span className="text-xs font-bold text-pink-300 bg-pink-500/20 px-2.5 py-1 rounded-lg">
            {wishes.filter((w) => w.trim()).length}/5
          </span>
        </div>
      </div>

      {/* Inspiration Dropdown Modal */}
      {showInspiration && (
        <div className="p-4 rounded-xl bg-amber-950/40 border border-amber-500/30 space-y-3 animate-fadeIn">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold text-amber-200 uppercase tracking-wider flex items-center gap-1.5">
              <Lightbulb className="w-4 h-4 text-amber-400" /> Preset {theme.wishesLabel} Inspiration
            </h4>
            <button
              type="button"
              onClick={handleAutofill}
              className="text-xs font-semibold text-amber-300 underline hover:text-amber-200"
            >
              Autofill {wishes.length} items ✨
            </button>
          </div>
          <div className="space-y-1.5">
            {theme.wishesPresets.map((preset, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  const emptyIndex = wishes.findIndex((w) => !w.trim());
                  if (emptyIndex !== -1) {
                    handleWishChange(emptyIndex, preset);
                  } else if (wishes.length < 5) {
                    onChange({ wishes: [...wishes, preset] });
                  }
                  setShowInspiration(false);
                }}
                className="w-full text-left p-2 rounded-lg bg-slate-900/60 hover:bg-slate-800 text-xs text-slate-200 transition-all border border-slate-800 flex items-center justify-between group"
              >
                <span>{preset}</span>
                <span className="opacity-0 group-hover:opacity-100 text-pink-400 text-xs font-semibold">
                  + Add
                </span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Wishes Inputs List */}
      <div className="space-y-3.5">
        {wishes.map((wish, index) => (
          <div key={index} className="space-y-1">
            <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
              <span className="font-semibold text-pink-300">
                Item #{index + 1} {index === 0 && '(First Balloon 🎈)'}
              </span>
              <span>{wish.length}/100</span>
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                maxLength={100}
                placeholder={`Item #${index + 1}`}
                value={wish}
                onChange={(e) => handleWishChange(index, e.target.value)}
                className="flex-1 bg-slate-900/80 border border-slate-700/80 rounded-xl px-4 py-3 text-white text-sm placeholder-slate-500 focus:outline-none focus:border-pink-500 focus:ring-1 focus:ring-pink-500 transition-all"
              />
              {wishes.length > 3 && (
                <button
                  type="button"
                  onClick={() => handleRemoveWish(index)}
                  className="p-3 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-xl transition-all border border-transparent hover:border-rose-500/20"
                  title="Remove"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Add Wish Button */}
      {wishes.length < 5 && (
        <button
          type="button"
          onClick={handleAddWish}
          className="w-full py-2.5 rounded-xl border border-dashed border-pink-500/40 text-pink-300 hover:bg-pink-500/10 text-xs font-semibold transition-all flex items-center justify-center gap-2"
        >
          <Plus className="w-4 h-4" />
          <span>Add another item ({wishes.length}/5)</span>
        </button>
      )}

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
          disabled={!isValid}
          className={`flex-1 py-3.5 rounded-xl bg-gradient-to-r ${theme.buttonGradient} text-white font-semibold shadow-lg shadow-pink-500/25 active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2 text-base`}
        >
          <span>Continue to Photos 📸</span>
        </button>
      </div>
    </div>
  );
};
