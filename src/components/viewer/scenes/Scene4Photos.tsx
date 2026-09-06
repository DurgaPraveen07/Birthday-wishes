import React, { useEffect, useState, useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { SurpriseData } from '../../../types/surprise';
import { ThemeConfig } from '../../../config/themes';
import { getPhotoDisplayUrls } from '../../../lib/supabase';

interface Props {
  theme: ThemeConfig;
  surprise: SurpriseData;
}

export const Scene4Photos: React.FC<Props> = ({ theme, surprise }) => {
  const [photoList, setPhotoList] = useState<Array<{ url: string; caption: string }>>([]);
  const [loading, setLoading] = useState(true);

  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let isMounted = true;
    async function loadPhotos() {
      if (surprise.photos && surprise.photos.length > 0) {
        const urls = await getPhotoDisplayUrls(surprise.photos);
        if (isMounted) setPhotoList(urls);
      }
      if (isMounted) setLoading(false);
    }
    loadPhotos();
    return () => {
      isMounted = false;
    };
  }, [surprise.photos]);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  });

  const xTransform = useTransform(scrollYProgress, [0.2, 0.8], ['15%', '-60%']);

  if (loading) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-slate-950 text-slate-400 text-xs">
        Loading photo memories... 📸
      </div>
    );
  }

  if (photoList.length === 0) {
    return (
      <div
        id="scene-4"
        className={`min-h-screen w-full flex flex-col items-center justify-center p-6 text-center bg-slate-950 snap-start space-y-4`}
      >
        <div className="w-16 h-16 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center text-3xl">
          ✨
        </div>
        <h3 className="text-2xl sm:text-3xl font-bold font-heading text-white">
          A Trail of Magical Moments
        </h3>
        <p className="text-sm text-slate-300 max-w-md italic font-serif">
          "Every second spent together is a memory worth treasuring forever."
        </p>
      </div>
    );
  }

  return (
    <div
      id="scene-4"
      ref={sectionRef}
      className={`min-h-[140vh] w-full flex flex-col justify-center relative overflow-hidden bg-gradient-to-b ${theme.bgGradient} snap-start py-20`}
    >
      {/* Top Header */}
      <div className="text-center space-y-2 z-10 px-4">
        <span className={`px-4 py-1.5 rounded-full border text-xs font-bold uppercase tracking-widest inline-block ${theme.badgeBg}`}>
          📸 Photo Memories ({photoList.length} Photos)
        </span>
        <h2 className="text-3xl sm:text-5xl font-bold font-heading text-white">
          Woven in Golden Light ✨
        </h2>
        <p className="text-xs sm:text-sm text-slate-300">
          Scroll or drag sideways to journey through favorite memories
        </p>
      </div>

      {/* Horizontal Film Reel */}
      <div className="my-12 overflow-x-auto overflow-y-hidden no-scrollbar px-6 cursor-grab active:cursor-grabbing">
        <motion.div
          style={{ x: xTransform }}
          className="flex items-center gap-8 w-max py-8 px-8"
        >
          {photoList.map((photo, index) => (
            <motion.div
              key={index}
              whileHover={{ scale: 1.05, rotate: 0 }}
              initial={{ rotate: index % 2 === 0 ? -3 : 3 }}
              className="glass-card p-4 rounded-3xl w-72 sm:w-80 flex-shrink-0 space-y-3 shadow-2xl border-white/20 transform transition-all duration-300 relative group"
            >
              <div className="w-4 h-4 rounded-full bg-amber-400/80 border border-amber-200 shadow-md mx-auto -mt-6 mb-2" />

              <div className="w-full h-72 sm:h-80 rounded-2xl overflow-hidden bg-slate-900 relative">
                <img
                  src={photo.url}
                  alt={photo.caption || `Memory ${index + 1}`}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
              </div>

              {photo.caption ? (
                <p className="text-center text-sm font-semibold text-white font-serif italic line-clamp-2 px-2">
                  "{photo.caption}"
                </p>
              ) : (
                <p className="text-center text-xs text-slate-400 font-sans">
                  Memory #{index + 1}
                </p>
              )}
            </motion.div>
          ))}
        </motion.div>
      </div>

      <div className="text-center text-xs text-slate-400 z-10">
        Swipe or scroll to see all photos ✨
      </div>
    </div>
  );
};
