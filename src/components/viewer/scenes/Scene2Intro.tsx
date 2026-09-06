import React, { useRef, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import confetti from 'canvas-confetti';
import { SurpriseData } from '../../../types/surprise';
import { ThemeConfig } from '../../../config/themes';

interface Props {
  theme: ThemeConfig;
  surprise: SurpriseData;
}

export const Scene2Intro: React.FC<Props> = ({ theme, surprise }) => {
  const sceneRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: sceneRef,
    offset: ['start end', 'end start'],
  });

  const opacity = useTransform(scrollYProgress, [0.1, 0.4, 0.7, 0.9], [0, 1, 1, 0]);
  const scale = useTransform(scrollYProgress, [0.1, 0.4], [0.85, 1]);
  const confettiTriggered = useRef(false);

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

  const primaryName = surprise.first_name || surprise.details?.primaryName || '';
  const secondaryName = surprise.last_name || surprise.details?.secondaryName || '';
  const detailsObj = { primaryName, secondaryName };

  const titleWords = theme.introTitle(detailsObj);

  return (
    <div
      id="scene-2"
      ref={sceneRef}
      className={`min-h-screen w-full flex flex-col justify-center items-center p-6 text-center relative overflow-hidden bg-slate-950 snap-start`}
    >
      <div className="absolute w-96 h-96 bg-purple-600/15 rounded-full blur-3xl animate-pulse-glow" />

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: false, amount: 0.3 }}
        transition={{ duration: 0.5 }}
        className="space-y-6 z-10 max-w-2xl"
      >
        <div className={`px-4 py-1.5 rounded-full inline-block text-xs font-bold uppercase tracking-widest ${theme.badgeBg}`}>
          ✨ Special Announcement
        </div>

        <h2 className="text-4xl sm:text-6xl md:text-7xl font-extrabold font-heading text-white tracking-tight leading-tight flex flex-wrap justify-center gap-x-3 gap-y-2">
          {titleWords.map((word, i) => (
            <motion.span
              key={i}
              className={
                i === 1 || i === 3
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
          {theme.introSubtitle}
        </motion.p>
      </motion.div>
    </div>
  );
};
