import React from 'react';
import { Calendar, User, Sparkles, Heart } from 'lucide-react';
import { CreatorFormState } from '../../types/surprise';

interface Props {
  form: CreatorFormState;
  onChange: (fields: Partial<CreatorFormState>) => void;
  onNext: () => void;
}

export const Step1BasicDetails: React.FC<Props> = ({ form, onChange, onNext }) => {
  const handleDobChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const dobValue = e.target.value;
    let autoAge = form.turning_age;

    if (dobValue) {
      const birthDate = new Date(dobValue);
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

    onChange({ dob: dobValue, turning_age: autoAge });
  };

  const isFormValid = form.first_name.trim().length > 0 && form.sender_name.trim().length > 0;

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-pink-500/20 text-pink-300 text-xs font-semibold uppercase tracking-wider border border-pink-500/30">
          <Sparkles className="w-3.5 h-3.5" /> Step 1 of 5
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold font-heading text-white">
          Who are we celebrating? 🎂
        </h2>
        <p className="text-sm text-slate-300">
          Start by telling us who this special birthday surprise is for.
        </p>
      </div>

      <div className="space-y-4">
        {/* Birthday Person First & Last Name */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-pink-200 mb-1.5 uppercase tracking-wider">
              Their First Name <span className="text-pink-400">*</span>
            </label>
            <div className="relative">
              <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="e.g. Alex"
                value={form.first_name}
                onChange={(e) => onChange({ first_name: e.target.value })}
                className="w-full bg-slate-900/80 border border-slate-700/80 rounded-xl pl-10 pr-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-pink-500 focus:ring-1 focus:ring-pink-500 transition-all"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-pink-200 mb-1.5 uppercase tracking-wider">
              Their Last Name
            </label>
            <input
              type="text"
              placeholder="e.g. Morgan (optional)"
              value={form.last_name}
              onChange={(e) => onChange({ last_name: e.target.value })}
              className="w-full bg-slate-900/80 border border-slate-700/80 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-pink-500 focus:ring-1 focus:ring-pink-500 transition-all"
            />
          </div>
        </div>

        {/* Sender Name */}
        <div>
          <label className="block text-xs font-semibold text-pink-200 mb-1.5 uppercase tracking-wider">
            Your Name (Sender) <span className="text-pink-400">*</span>
          </label>
          <div className="relative">
            <Heart className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-pink-400" />
            <input
              type="text"
              placeholder="e.g. Your Bestie, Sam, or Mom"
              value={form.sender_name}
              onChange={(e) => onChange({ sender_name: e.target.value })}
              className="w-full bg-slate-900/80 border border-slate-700/80 rounded-xl pl-10 pr-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-pink-500 focus:ring-1 focus:ring-pink-500 transition-all"
              required
            />
          </div>
        </div>

        {/* Date of Birth & Turning Age */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-pink-200 mb-1.5 uppercase tracking-wider">
              Date of Birth (Optional)
            </label>
            <div className="relative">
              <Calendar className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="date"
                value={form.dob}
                onChange={handleDobChange}
                className="w-full bg-slate-900/80 border border-slate-700/80 rounded-xl pl-10 pr-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-pink-500 focus:ring-1 focus:ring-pink-500 transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-pink-200 mb-1.5 uppercase tracking-wider">
              Turning Age (Optional)
            </label>
            <input
              type="number"
              min="1"
              max="130"
              placeholder="e.g. 25"
              value={form.turning_age}
              onChange={(e) => onChange({ turning_age: e.target.value })}
              className="w-full bg-slate-900/80 border border-slate-700/80 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-pink-500 focus:ring-1 focus:ring-pink-500 transition-all"
            />
          </div>
        </div>

        {/* DOB Callout Note */}
        {form.dob && (
          <div className="p-3.5 rounded-xl bg-pink-950/40 border border-pink-500/30 flex items-start gap-3">
            <span className="text-xl">⏰</span>
            <p className="text-xs text-pink-200 leading-relaxed">
              <strong>Midnight Countdown Enabled:</strong> If they open the link before their birthday, a real-time countdown to midnight will build anticipation before unwrap!
            </p>
          </div>
        )}
      </div>

      <div className="pt-2">
        <button
          type="button"
          onClick={onNext}
          disabled={!isFormValid}
          className="w-full py-4 rounded-xl bg-gradient-to-r from-pink-500 to-rose-500 text-white font-semibold shadow-lg shadow-pink-500/25 hover:from-pink-600 hover:to-rose-600 active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2 text-base"
        >
          <span>Continue to Wishes & Blessings</span>
          <span>✨</span>
        </button>
      </div>
    </div>
  );
};
