import React from 'react';
import { Calendar, User, Sparkles, Heart } from 'lucide-react';
import { CreatorFormState } from '../../types/surprise';
import { ThemeConfig } from '../../config/themes';

interface Props {
  theme: ThemeConfig;
  form: CreatorFormState;
  onChange: (fields: Partial<CreatorFormState>) => void;
  onNext: () => void;
}

export const Step1BasicDetails: React.FC<Props> = ({ theme, form, onChange, onNext }) => {
  const f = theme.fields;

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    let autoAge = form.extraNumber;

    if (val && theme.type === 'birthday') {
      const birthDate = new Date(val);
      const today = new Date();
      let age = today.getFullYear() - birthDate.getFullYear();
      const m = today.getMonth() - birthDate.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }
      if (age > 0 && age < 130) {
        autoAge = age.toString();
      }
    }

    onChange({ dateValue: val, extraNumber: autoAge });
  };

  const isFormValid =
    form.primaryName.trim().length > 0 && form.senderName.trim().length > 0;

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="text-center space-y-2">
        <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider ${theme.badgeBg}`}>
          <Sparkles className="w-3.5 h-3.5" /> Step 1 of 5
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold font-heading text-white">
          {theme.step1Title}
        </h2>
        <p className="text-sm text-slate-300">{theme.step1Subtitle}</p>
      </div>

      <div className="space-y-4">
        {/* Primary & Secondary Name */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-pink-200 mb-1.5 uppercase tracking-wider">
              {f.primaryName.label} <span className="text-pink-400">*</span>
            </label>
            <div className="relative">
              <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder={f.primaryName.placeholder}
                value={form.primaryName}
                onChange={(e) => onChange({ primaryName: e.target.value })}
                className="w-full bg-slate-900/80 border border-slate-700/80 rounded-xl pl-10 pr-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-pink-500 focus:ring-1 focus:ring-pink-500 transition-all text-sm"
                required
              />
            </div>
          </div>

          {f.secondaryName && (
            <div>
              <label className="block text-xs font-semibold text-pink-200 mb-1.5 uppercase tracking-wider">
                {f.secondaryName.label}
              </label>
              <input
                type="text"
                placeholder={f.secondaryName.placeholder}
                value={form.secondaryName}
                onChange={(e) => onChange({ secondaryName: e.target.value })}
                className="w-full bg-slate-900/80 border border-slate-700/80 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-pink-500 focus:ring-1 focus:ring-pink-500 transition-all text-sm"
              />
            </div>
          )}
        </div>

        {/* Sender Name */}
        <div>
          <label className="block text-xs font-semibold text-pink-200 mb-1.5 uppercase tracking-wider">
            {f.senderName.label} <span className="text-pink-400">*</span>
          </label>
          <div className="relative">
            <Heart className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-pink-400" />
            <input
              type="text"
              placeholder={f.senderName.placeholder}
              value={form.senderName}
              onChange={(e) => onChange({ senderName: e.target.value })}
              className="w-full bg-slate-900/80 border border-slate-700/80 rounded-xl pl-10 pr-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-pink-500 focus:ring-1 focus:ring-pink-500 transition-all text-sm"
              required
            />
          </div>
        </div>

        {/* Date Value & Extra Number */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {f.dateLabel && (
            <div>
              <label className="block text-xs font-semibold text-pink-200 mb-1.5 uppercase tracking-wider">
                {f.dateLabel}
              </label>
              <div className="relative">
                <Calendar className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="date"
                  value={form.dateValue}
                  onChange={handleDateChange}
                  className="w-full bg-slate-900/80 border border-slate-700/80 rounded-xl pl-10 pr-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-pink-500 focus:ring-1 focus:ring-pink-500 transition-all text-sm"
                />
              </div>
            </div>
          )}

          {f.extraNumberLabel && (
            <div>
              <label className="block text-xs font-semibold text-pink-200 mb-1.5 uppercase tracking-wider">
                {f.extraNumberLabel}
              </label>
              <input
                type="number"
                min="1"
                max="130"
                placeholder={f.extraNumberPlaceholder || 'e.g. 25'}
                value={form.extraNumber}
                onChange={(e) => onChange({ extraNumber: e.target.value })}
                className="w-full bg-slate-900/80 border border-slate-700/80 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-pink-500 focus:ring-1 focus:ring-pink-500 transition-all text-sm"
              />
            </div>
          )}
        </div>

        {/* Callout Notice */}
        {form.dateValue && f.dateNotice && (
          <div className="p-3.5 rounded-xl bg-pink-950/40 border border-pink-500/30 flex items-start gap-3">
            <span className="text-xl">✨</span>
            <p className="text-xs text-pink-200 leading-relaxed">{f.dateNotice}</p>
          </div>
        )}
      </div>

      <div className="pt-2">
        <button
          type="button"
          onClick={onNext}
          disabled={!isFormValid}
          className={`w-full py-4 rounded-xl bg-gradient-to-r ${theme.buttonGradient} text-white font-semibold shadow-lg shadow-pink-500/25 active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2 text-base`}
        >
          <span>Continue to {theme.wishesTitle}</span>
          <span>✨</span>
        </button>
      </div>
    </div>
  );
};
