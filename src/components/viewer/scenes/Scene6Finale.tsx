import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { Sparkles, CheckCircle } from 'lucide-react';
import { SurpriseData } from '../../../types/surprise';
import { ThemeConfig } from '../../../config/themes';
import { sound } from '../../../utils/sound';
import { deleteSurprisePhotos } from '../../../lib/supabase';

interface Props {
  theme: ThemeConfig;
  surprise: SurpriseData;
}

export const Scene6Finale: React.FC<Props> = ({ theme, surprise }) => {
  const [accepted, setAccepted] = useState(false);
  const [cleanupDone, setCleanupDone] = useState(false);

  useEffect(() => {
    const duration = 3.5 * 1000;
    const end = Date.now() + duration;

    const interval: any = setInterval(() => {
      if (Date.now() > end) {
        return clearInterval(interval);
      }
      confetti({
        startVelocity: 30,
        spread: 360,
        ticks: 60,
        origin: { x: Math.random(), y: Math.random() - 0.2 },
        colors: ['#f472b6', '#fbbf24', '#c084fc', '#38bdf8', '#34d399'],
      });
    }, 300);

    return () => clearInterval(interval);
  }, []);

  const handleAccept = async () => {
    setAccepted(true);
    sound.playSparkle();

    confetti({
      particleCount: 150,
      spread: 100,
      origin: { y: 0.6 },
    });

    if (!cleanupDone) {
      setCleanupDone(true);
      await deleteSurprisePhotos(surprise.id);
    }
  };

  const primaryName = surprise.first_name || surprise.details?.primaryName || '';
  const secondaryName = surprise.last_name || surprise.details?.secondaryName || '';
  const senderName = surprise.sender_name || surprise.details?.senderName || 'Someone Special';
  const detailsObj = { primaryName, secondaryName, senderName };

  return (
    <div
      id="scene-6"
      className={`min-h-screen w-full flex flex-col justify-between items-center p-6 text-center relative overflow-hidden bg-gradient-to-b ${theme.bgGradient} snap-start pt-16 pb-8`}
    >
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gradient-to-tr from-pink-500/20 via-purple-500/20 to-amber-500/20 rounded-full blur-3xl animate-pulse-glow pointer-events-none" />

      <div className="my-auto max-w-xl z-10 space-y-6">
        <div className="space-y-3">
          <span className={`px-4 py-1.5 rounded-full border text-xs font-bold uppercase tracking-widest inline-block ${theme.badgeBg}`}>
            🎉 Celebration Time
          </span>

          <h2 className="text-4xl sm:text-6xl font-extrabold font-heading text-white tracking-tight leading-tight">
            {theme.finaleTitle(detailsObj)}
          </h2>

          <p className="text-base sm:text-lg text-slate-300 font-serif italic">
            May your journey be filled with endless smiles, sweet moments, and warmth.
          </p>
        </div>

        {/* Interactive Acceptance Card */}
        <div className="pt-4">
          <AnimatePresence mode="wait">
            {!accepted ? (
              <motion.button
                key="accept-btn"
                onClick={handleAccept}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`px-8 py-4 rounded-2xl bg-gradient-to-r ${theme.buttonGradient} text-white font-extrabold text-lg shadow-2xl shadow-pink-500/40 hover:brightness-110 transition-all flex items-center justify-center gap-3 mx-auto glow-gold cursor-pointer`}
              >
                <Sparkles className="w-6 h-6" />
                <span>{theme.acceptButtonText}</span>
              </motion.button>
            ) : (
              <motion.div
                key="closing-card"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="glass-card p-6 rounded-3xl space-y-3 border-pink-400/40 max-w-md mx-auto"
              >
                <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
                  <CheckCircle className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-bold font-heading text-white">
                  Surprise Accepted 💛
                </h3>
                <p className="text-sm text-slate-200 font-serif italic">
                  "{theme.finaleMessage(detailsObj)}"
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <div className="z-10 text-xs text-slate-400 space-y-1">
        <p>Made with 💛 by <strong className="text-pink-300">{senderName}</strong></p>
        <p className="text-[10px] text-slate-500">{theme.name} Experience ✨</p>
      </div>
    </div>
  );
};
