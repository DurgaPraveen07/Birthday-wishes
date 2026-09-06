import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { sound } from '../../../utils/sound';

interface Props {
  wishes: string[];
}

const BALLOON_COLORS = [
  { bg: 'from-pink-500 to-rose-600', shadow: 'shadow-pink-500/40', text: 'text-pink-300' },
  { bg: 'from-purple-500 to-indigo-600', shadow: 'shadow-purple-500/40', text: 'text-purple-300' },
  { bg: 'from-amber-400 to-orange-500', shadow: 'shadow-amber-500/40', text: 'text-amber-300' },
  { bg: 'from-cyan-400 to-blue-600', shadow: 'shadow-cyan-500/40', text: 'text-cyan-300' },
  { bg: 'from-emerald-400 to-teal-600', shadow: 'shadow-emerald-500/40', text: 'text-emerald-300' },
];

export const Scene3Wishes: React.FC<Props> = ({ wishes }) => {
  // Track which balloons are popped (index -> boolean)
  const [poppedState, setPoppedState] = useState<boolean[]>(
    new Array(wishes.length).fill(false)
  );

  const popBalloon = (index: number) => {
    if (poppedState[index]) return;

    sound.playPop();

    // Trigger local canvas confetti
    confetti({
      particleCount: 40,
      spread: 60,
      origin: { y: 0.5 },
      colors: ['#f472b6', '#fbbf24', '#c084fc'],
    });

    setPoppedState((prev) => {
      const copy = [...prev];
      copy[index] = true;
      return copy;
    });
  };

  const allPopped = poppedState.every(Boolean);

  return (
    <div
      id="scene-3"
      className="min-h-screen w-full flex flex-col justify-center items-center p-6 text-center relative overflow-hidden bg-gradient-to-b from-slate-950 via-purple-950/30 to-slate-950 snap-start py-16"
    >
      <div className="max-w-2xl w-full space-y-8 z-10">
        <div className="space-y-2">
          <span className="px-4 py-1.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30 text-xs font-bold uppercase tracking-widest inline-block">
            🎈 Floating Blessings ({wishes.length} Wishes)
          </span>
          <h2 className="text-3xl sm:text-5xl font-bold font-heading text-white">
            Pop the balloons to reveal wishes! ✨
          </h2>
          <p className="text-xs sm:text-sm text-slate-400">
            Tap any balloon below to pop it and unwrap its hidden blessing
          </p>
        </div>

        {/* Balloons List Container */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 justify-center items-stretch pt-4">
          {wishes.map((wish, index) => {
            const isPopped = poppedState[index];
            const color = BALLOON_COLORS[index % BALLOON_COLORS.length];

            return (
              <div
                key={index}
                className="flex flex-col items-center justify-center min-h-[220px]"
              >
                <AnimatePresence mode="wait">
                  {!isPopped ? (
                    <motion.div
                      key="balloon"
                      onClick={() => popBalloon(index)}
                      initial={{ y: 50, opacity: 0 }}
                      whileInView={{ y: 0, opacity: 1 }}
                      whileHover={{ scale: 1.08 }}
                      whileTap={{ scale: 0.95 }}
                      transition={{ type: 'spring', stiffness: 200, delay: index * 0.15 }}
                      className={`cursor-pointer animate-float relative flex flex-col items-center`}
                    >
                      {/* Balloon Body */}
                      <div
                        className={`w-28 h-36 rounded-[50%_50%_50%_50%/40%_40%_60%_60%] bg-gradient-to-tr ${color.bg} shadow-2xl ${color.shadow} flex flex-col items-center justify-center text-white relative border border-white/20`}
                      >
                        <span className="text-xs font-bold uppercase opacity-80">
                          Wish #{index + 1}
                        </span>
                        <span className="text-2xl mt-1">🎈</span>
                        {/* Shine reflection */}
                        <div className="absolute top-4 left-4 w-5 h-8 bg-white/30 rounded-full blur-[1px] transform -rotate-12" />
                      </div>
                      {/* Knot */}
                      <div className="w-3 h-2 bg-pink-700 rounded-b-sm -mt-0.5" />
                      {/* String */}
                      <div className="w-0.5 h-12 bg-slate-400/40" />
                      <span className="text-[10px] text-pink-300 font-semibold mt-1 animate-pulse">
                        Tap to Pop 💥
                      </span>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="wish-card"
                      initial={{ scale: 0.5, opacity: 0, rotate: -5 }}
                      animate={{ scale: 1, opacity: 1, rotate: 0 }}
                      transition={{ type: 'spring', damping: 15 }}
                      className="glass-card p-5 rounded-2xl w-full text-left space-y-2 border-pink-500/30 relative overflow-hidden"
                    >
                      <div className="flex items-center justify-between">
                        <span className={`text-[10px] font-extrabold uppercase ${color.text}`}>
                          ✨ Wish #{index + 1} Revealed
                        </span>
                        <span className="text-xs">💛</span>
                      </div>
                      <p className="text-sm font-medium text-white leading-relaxed font-serif italic">
                        "{wish}"
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>

        {/* Keep Going Cue */}
        {allPopped && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="pt-4 space-y-2 text-center"
          >
            <span className="px-6 py-2.5 rounded-full bg-gradient-to-r from-amber-400 to-pink-500 text-white font-bold text-sm shadow-xl inline-block glow-gold">
              All Wishes Unlocked! Keep going 💛
            </span>
          </motion.div>
        )}
      </div>
    </div>
  );
};
