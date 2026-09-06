import React, { useRef, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import confetti from 'canvas-confetti';
import { SurpriseData } from '../../../types/surprise';

interface Props {
  surprise: SurpriseData;
}

export const Scene2Intro: React.FC<Props> = ({ surprise }) => {
  const sceneRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: sceneRef,
    offset: ['start end', 'end start'],
  });

  const opacity = useTransform(scrollYProgress, [0.1, 0.4, 0.7, 0.9], [0, 1, 1, 0]);
  const scale = useTransform(scrollYProgress, [0.1, 0.4], [0.85, 1]);
  const confettiTriggered = useRef(false);

  // Trigger confetti burst on scroll enter
  useEffect(() => {
    const unsubscribe = scrollYProgress.on('change', (val) => {
      if (val > 0.35 && !confettiTriggered.current) {
        confettiTriggered.current = true;
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#f472b6', '#fbbf24', '#c084fc', '#60a5fa'],
        });
      }
    });
    return () => unsubscribe();
  }, [scrollYProgress]);

  const titleWords = `HAPPY BIRTHDAY ${surprise.first_name.toUpperCase()} ! 🎉`.split(' ');

  return (
    <div
      id="scene-2"
      ref={sceneRef}
      className="min-h-screen w-full flex flex-col justify-center items-center p-6 text-center relative overflow-hidden bg-slate-950 snap-start"
    >
      {/* Background glow */}
      <div className="absolute w-96 h-96 bg-purple-600/15 rounded-full blur-3xl animate-pulse-glow" />

      <motion.div style={{ opacity, scale }} className="space-y-6 z-10 max-w-2xl">
        <div className="text-pink-400 font-semibold text-xs uppercase tracking-widest bg-pink-500/10 border border-pink-500/20 px-4 py-1.5 rounded-full inline-block">
          ✨ Special Day Announcement
        </div>

        {/* Word by word scroll animation */}
        <h2 className="text-4xl sm:text-6xl md:text-7xl font-extrabold font-heading text-white tracking-tight leading-tight flex flex-wrap justify-center gap-x-3 gap-y-2">
          {titleWords.map((word, i) => (
            <motion.span
              key={i}
              className={
                word.includes(surprise.first_name.toUpperCase())
                  ? 'text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-rose-300 to-amber-300 underline decoration-pink-500/40 decoration-wavy'
                  : 'text-white'
              }
            >
              {word}
            </motion.span>
          ))}
        </h2>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-lg sm:text-2xl text-slate-300 font-serif italic"
        >
          It's officially your day to shine ✨
        </motion.p>

        {surprise.turning_age && (
          <div className="pt-2">
            <span className="inline-block px-5 py-2 rounded-2xl bg-gradient-to-r from-pink-500/20 to-purple-500/20 border border-pink-500/30 text-pink-300 font-bold text-base sm:text-lg">
              Celebrating {surprise.turning_age} Fabulous Years 🥂
            </span>
          </div>
        )}
      </motion.div>
    </div>
  );
};
