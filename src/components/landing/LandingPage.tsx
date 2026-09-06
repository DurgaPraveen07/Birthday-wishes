import React from 'react';
import { Sparkles, Heart, Gift, ArrowRight } from 'lucide-react';
import { THEMES, SurpriseType } from '../../config/themes';

interface Props {
  onSelectType: (type: SurpriseType) => void;
}

export const LandingPage: React.FC<Props> = ({ onSelectType }) => {
  const themeList = Object.values(THEMES);

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-900 via-rose-950 to-pink-950 px-4 py-12 flex flex-col justify-between items-center relative overflow-hidden">
      {/* Background Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-pink-500/20 rounded-full blur-3xl animate-pulse-glow pointer-events-none" />
      <div className="absolute bottom-10 -right-20 w-80 h-80 bg-rose-500/20 rounded-full blur-3xl animate-pulse-glow pointer-events-none" />

      {/* Header */}
      <div className="max-w-2xl text-center space-y-4 z-10 pt-4">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-pink-500/20 text-pink-300 border border-pink-500/30 text-xs font-bold uppercase tracking-widest">
          <Sparkles className="w-4 h-4" /> Celebration Platform
        </div>

        <h1 className="text-4xl sm:text-6xl font-extrabold font-heading text-white tracking-tight leading-tight">
          Craft Unforgettable <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-300 via-rose-200 to-amber-200">
            Surprise Experiences ✨
          </span>
        </h1>

        <p className="text-sm sm:text-base text-slate-200 font-serif italic max-w-lg mx-auto">
          Choose a occasion below to build a personalized, scroll-driven interactive surprise page with custom blessings, photo strings, and sealed letters.
        </p>
      </div>

      {/* 3 Theme Options */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-4xl w-full my-8 z-10 px-2">
        {themeList.map((theme) => (
          <div
            key={theme.type}
            onClick={() => onSelectType(theme.type)}
            className="glass-card p-6 rounded-3xl cursor-pointer group hover:scale-[1.03] transition-all duration-300 flex flex-col justify-between space-y-6 border-pink-500/30 hover:border-pink-400 shadow-2xl relative overflow-hidden"
          >
            <div className="space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-pink-500 to-rose-400 p-0.5 shadow-lg group-hover:rotate-6 transition-transform">
                <div className="w-full h-full bg-slate-950/80 rounded-[14px] flex items-center justify-center text-3xl">
                  {theme.emoji}
                </div>
              </div>

              <div className="space-y-1">
                <h3 className="text-xl font-bold font-heading text-white group-hover:text-pink-300 transition-colors">
                  {theme.name}
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed font-sans">
                  {theme.tagline}
                </p>
              </div>
            </div>

            <div className="pt-2 flex items-center justify-between border-t border-white/10 text-xs font-semibold text-pink-300 group-hover:text-white transition-colors">
              <span>Create {theme.name}</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        ))}
      </div>

      {/* Footer Credit */}
      <div className="text-center text-xs text-slate-300 z-10 space-y-1">
        <p className="flex items-center justify-center gap-1">
          Made with <Heart className="w-3.5 h-3.5 text-pink-400 fill-pink-400" /> for magical moments
        </p>
        <p className="text-xs font-semibold text-pink-300 tracking-wide">Build and developed By Durga Praveen</p>
        <p className="text-[10px] text-slate-500">Interactive Scroll-Driven Celebration Studio ✨</p>
      </div>
    </div>
  );
};
