import React, { useState, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Gift, ChevronDown, Clock, Sparkles } from 'lucide-react';
import { SurpriseData } from '../../../types/surprise';
import { sound } from '../../../utils/sound';

interface Props {
  surprise: SurpriseData;
  containerRef: React.RefObject<HTMLDivElement>;
  onUnwrap?: () => void;
}

export const Scene1Cover: React.FC<Props> = ({ surprise, containerRef }) => {
  const [timeLeft, setTimeLeft] = useState<{ hours: number; minutes: number; seconds: number } | null>(null);
  const [isBypassed, setIsBypassed] = useState(false);
  const [isUnwrapped, setIsUnwrapped] = useState(false);

  // Check if today is before birthday
  const checkBirthdayStatus = () => {
    if (!surprise.dob) return false;
    const today = new Date();
    const dobDate = new Date(surprise.dob);

    const isSameDay =
      today.getMonth() === dobDate.getMonth() &&
      today.getDate() === dobDate.getDate();

    if (isSameDay) return false;

    // Check if birthday is coming up today/tonight
    const nextBday = new Date(today.getFullYear(), dobDate.getMonth(), dobDate.getDate());
    if (today > nextBday) {
      nextBday.setFullYear(today.getFullYear() + 1);
    }
    const diffMs = nextBday.getTime() - today.getTime();
    return diffMs > 0 && diffMs < 24 * 60 * 60 * 1000;
  };

  const isBeforeBirthday = checkBirthdayStatus();

  useEffect(() => {
    if (!isBeforeBirthday || isBypassed) return;

    const timer = setInterval(() => {
      const today = new Date();
      const dobDate = new Date(surprise.dob!);
      const midnight = new Date(today.getFullYear(), dobDate.getMonth(), dobDate.getDate(), 0, 0, 0);

      const diff = Math.max(0, midnight.getTime() - today.getTime());
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      setTimeLeft({ hours, minutes, seconds });
    }, 1000);

    return () => clearInterval(timer);
  }, [isBeforeBirthday, isBypassed, surprise.dob]);

  const handleUnwrap = () => {
    sound.playUnwrap();
    setIsUnwrapped(true);
    // Smooth scroll to scene 2
    if (containerRef.current) {
      const nextEl = document.getElementById('scene-2');
      nextEl?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div
      id="scene-1"
      className="min-h-screen w-full flex flex-col justify-between items-center p-6 text-center relative overflow-hidden bg-gradient-to-b from-slate-950 via-pink-950/40 to-slate-950 snap-start"
    >
      {/* Glow Backdrops */}
      <div className="absolute top-1/3 w-80 h-80 bg-pink-500/20 rounded-full blur-3xl animate-pulse-glow" />

      <div className="pt-12 space-y-3 z-10 max-w-lg">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-pink-500/20 text-pink-300 border border-pink-500/30 text-xs font-bold uppercase tracking-widest"
        >
          <Sparkles className="w-3.5 h-3.5" /> Birthday Surprise
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="text-4xl sm:text-6xl font-extrabold text-white font-heading tracking-tight leading-tight"
        >
          A surprise for <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-rose-300 to-amber-300">
            {surprise.first_name} {surprise.last_name}
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-sm sm:text-base text-slate-300"
        >
          Someone who loves you made this — just for you 💌
        </motion.p>
      </div>

      {/* Countdown overlay if before birthday */}
      {isBeforeBirthday && !isBypassed ? (
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="glass-card p-6 rounded-3xl max-w-sm w-full my-auto space-y-4 z-10 border-pink-500/30"
        >
          <div className="flex items-center justify-center gap-2 text-amber-300 text-xs font-bold uppercase tracking-wider">
            <Clock className="w-4 h-4" /> Unlocks at Midnight!
          </div>

          <div className="flex items-center justify-center gap-4 text-white">
            <div className="text-center">
              <span className="text-3xl font-extrabold font-mono text-pink-400">
                {String(timeLeft?.hours || 0).padStart(2, '0')}
              </span>
              <span className="text-[10px] text-slate-400 block uppercase">Hours</span>
            </div>
            <span className="text-2xl font-bold text-slate-600">:</span>
            <div className="text-center">
              <span className="text-3xl font-extrabold font-mono text-pink-400">
                {String(timeLeft?.minutes || 0).padStart(2, '0')}
              </span>
              <span className="text-[10px] text-slate-400 block uppercase">Mins</span>
            </div>
            <span className="text-2xl font-bold text-slate-600">:</span>
            <div className="text-center">
              <span className="text-3xl font-extrabold font-mono text-pink-400">
                {String(timeLeft?.seconds || 0).padStart(2, '0')}
              </span>
              <span className="text-[10px] text-slate-400 block uppercase">Secs</span>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setIsBypassed(true)}
            className="text-xs text-pink-300 hover:text-white underline cursor-pointer pt-2"
          >
            Can't wait? ...peek right now ✨
          </button>
        </motion.div>
      ) : (
        /* Present Box Unwrap Interactive Card */
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.5, type: 'spring' }}
          onClick={handleUnwrap}
          className="my-auto z-10 cursor-pointer group flex flex-col items-center space-y-4"
        >
          <motion.div
            animate={{
              rotate: [0, -4, 4, -4, 0],
              scale: [1, 1.05, 1],
            }}
            transition={{ repeat: Infinity, duration: 3 }}
            className={`w-32 h-32 sm:w-40 sm:h-40 rounded-3xl bg-gradient-to-tr from-pink-500 via-rose-500 to-amber-400 p-1 shadow-2xl glow-pink flex items-center justify-center relative ${
              isUnwrapped ? 'scale-110 opacity-0 transition-all duration-500' : ''
            }`}
          >
            <div className="w-full h-full bg-slate-950/80 rounded-[22px] flex flex-col items-center justify-center text-4xl sm:text-5xl border border-pink-400/30">
              🎁
            </div>
          </motion.div>

          <div className="space-y-1">
            <span className="px-5 py-2.5 rounded-full bg-pink-500 text-white font-bold text-sm shadow-lg group-hover:scale-105 transition-transform flex items-center gap-2">
              <Gift className="w-4 h-4" /> Unwrap it ✨
            </span>
            <p className="text-[11px] text-slate-400">Tap or scroll down to open</p>
          </div>
        </motion.div>
      )}

      {/* Bottom Scroll Cue */}
      <div className="pb-8 z-10 flex flex-col items-center gap-1 text-slate-400 text-xs animate-bounce">
        <span>Scroll down to enter</span>
        <ChevronDown className="w-4 h-4 text-pink-400" />
      </div>
    </div>
  );
};
