import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Heart } from 'lucide-react';
import { SurpriseData } from '../../../types/surprise';
import { ThemeConfig } from '../../../config/themes';
import { sound } from '../../../utils/sound';

interface Props {
  theme: ThemeConfig;
  surprise: SurpriseData;
}

export const Scene5Letter: React.FC<Props> = ({ theme, surprise }) => {
  const [isOpen, setIsOpen] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  const handleOpenEnvelope = () => {
    sound.playSparkle();
    setIsOpen(true);
  };

  const letterLines = surprise.letter ? surprise.letter.split('\n') : [];
  const primaryName = surprise.first_name || surprise.details?.primaryName || '';
  const senderName = surprise.sender_name || surprise.details?.senderName || 'Someone Special';

  if (!surprise.letter || !surprise.letter.trim()) {
    return null;
  }

  return (
    <div
      id="scene-5"
      ref={sectionRef}
      className={`min-h-screen w-full flex flex-col justify-center items-center p-6 text-center relative overflow-hidden bg-slate-950 snap-start py-16`}
    >
      <div className="absolute w-96 h-96 bg-rose-500/15 rounded-full blur-3xl animate-pulse-glow" />

      <div className="max-w-xl w-full z-10 space-y-6">
        <div className="space-y-2">
          <span className={`px-4 py-1.5 rounded-full border text-xs font-bold uppercase tracking-widest inline-block ${theme.badgeBg}`}>
            {theme.letterBadge}
          </span>
          <h2 className="text-3xl sm:text-5xl font-bold font-heading text-white">
            {theme.letterTitleViewer({ senderName })}
          </h2>
        </div>

        <AnimatePresence mode="wait">
          {!isOpen ? (
            <motion.div
              key="envelope"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0, rotate: -5 }}
              onClick={handleOpenEnvelope}
              className="glass-card p-8 rounded-3xl cursor-pointer group hover:border-pink-400/50 transition-all space-y-4 shadow-2xl border-pink-500/30 max-w-md mx-auto"
            >
              <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-pink-500 via-rose-500 to-amber-400 p-1 mx-auto shadow-xl glow-pink group-hover:scale-110 transition-transform">
                <div className="w-full h-full bg-slate-950 rounded-full flex items-center justify-center text-4xl text-pink-300">
                  ✉️
                </div>
              </div>

              <div className="space-y-1">
                <h3 className="text-xl font-bold text-white font-heading">
                  Tap to Break Golden Seal
                </h3>
                <p className="text-xs text-slate-300">
                  Written exclusively for {primaryName || 'You'}
                </p>
              </div>

              <button
                type="button"
                className={`px-6 py-2.5 rounded-full bg-gradient-to-r ${theme.buttonGradient} text-white font-bold text-xs shadow-lg group-hover:scale-105 transition-transform flex items-center justify-center gap-2 mx-auto`}
              >
                <Sparkles className="w-4 h-4" /> Open Letter ✨
              </button>
            </motion.div>
          ) : (
            <motion.div
              key="letter-content"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
              className="glass-card-light p-6 sm:p-8 rounded-3xl text-left space-y-4 text-slate-900 shadow-2xl border-white relative overflow-hidden"
            >
              <div className="flex items-center justify-between border-b border-rose-200 pb-3">
                <span className="text-xs font-bold text-rose-600 uppercase tracking-widest flex items-center gap-1.5">
                  <Heart className="w-4 h-4 text-rose-500 fill-rose-500" /> Dearest {primaryName || 'Friend'},
                </span>
                <span className="text-xs text-rose-500 font-serif italic">From {senderName}</span>
              </div>

              <div className="space-y-3 font-serif text-base sm:text-lg leading-relaxed text-slate-800 italic pt-2">
                {letterLines.map((line, idx) => (
                  <motion.p
                    key={idx}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.25 }}
                  >
                    {line}
                  </motion.p>
                ))}
              </div>

              <div className="pt-4 border-t border-rose-200 text-right">
                <span className="font-handwriting text-2xl text-rose-600 font-bold block">
                  With all my love,
                </span>
                <span className="font-heading text-base font-bold text-slate-900">
                  {senderName} 💛
                </span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
