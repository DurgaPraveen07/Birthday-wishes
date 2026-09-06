import React, { useEffect, useState, useRef } from 'react';
import { SurpriseData } from '../../types/surprise';
import { getSurprise } from '../../lib/supabase';
import { Scene1Cover } from './scenes/Scene1Cover';
import { Scene2Intro } from './scenes/Scene2Intro';
import { Scene3Wishes } from './scenes/Scene3Wishes';
import { Scene4Photos } from './scenes/Scene4Photos';
import { Scene5Letter } from './scenes/Scene5Letter';
import { Scene6Finale } from './scenes/Scene6Finale';
import { Loader2, AlertCircle, Volume2, VolumeX } from 'lucide-react';
import { sound } from '../../utils/sound';

interface Props {
  surpriseId: string;
}

export const SurpriseViewer: React.FC<Props> = ({ surpriseId }) => {
  const [surprise, setSurprise] = useState<SurpriseData | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let isMounted = true;
    async function loadData() {
      try {
        const data = await getSurprise(surpriseId);
        if (isMounted) {
          if (data) {
            setSurprise(data);
          } else {
            setNotFound(true);
          }
        }
      } catch (e) {
        console.error(e);
        if (isMounted) setNotFound(true);
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    loadData();
    return () => {
      isMounted = false;
    };
  }, [surpriseId]);

  const handleToggleMusic = () => {
    sound.toggleMusic((playing) => setIsMusicPlaying(playing));
  };

  if (loading) {
    return (
      <div className="min-h-screen w-full bg-slate-950 flex flex-col items-center justify-center text-white space-y-4 p-4">
        <div className="w-16 h-16 rounded-full bg-pink-500/20 text-pink-400 flex items-center justify-center animate-spin">
          <Loader2 className="w-8 h-8" />
        </div>
        <p className="text-sm font-semibold text-pink-300 animate-pulse">
          Unwrapping birthday magic... ✨
        </p>
      </div>
    );
  }

  if (notFound || !surprise) {
    return (
      <div className="min-h-screen w-full bg-slate-950 flex flex-col items-center justify-center p-6 text-center space-y-4 text-white">
        <div className="w-16 h-16 rounded-full bg-rose-500/20 text-rose-400 flex items-center justify-center text-3xl">
          <AlertCircle className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold font-heading">Surprise Not Found</h2>
        <p className="text-xs text-slate-400 max-w-sm">
          This birthday link might have expired, or the ID is incorrect.
        </p>
        <a
          href="#/create"
          className="px-6 py-3 rounded-xl bg-pink-500 hover:bg-pink-600 text-white text-xs font-bold shadow-lg transition-all"
        >
          Create a Birthday Surprise ✨
        </a>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="h-screen w-full overflow-y-auto overflow-x-hidden snap-y snap-mandatory scroll-smooth bg-slate-950 relative"
    >
      {/* Global Floating Festive Music Button */}
      <div className="fixed top-6 right-6 z-50">
        <button
          type="button"
          onClick={handleToggleMusic}
          className="p-3 rounded-full bg-slate-900/90 hover:bg-slate-800 text-pink-300 border border-pink-500/40 backdrop-blur-md shadow-2xl transition-all flex items-center justify-center gap-2 glow-pink cursor-pointer active:scale-95"
          title="Toggle Festive Music"
        >
          {isMusicPlaying ? (
            <>
              <Volume2 className="w-5 h-5 text-pink-400 animate-pulse" />
              <span className="text-xs font-bold text-pink-300 pr-1">Music ON 🔊</span>
            </>
          ) : (
            <>
              <VolumeX className="w-5 h-5 text-slate-400" />
              <span className="text-xs font-bold text-slate-400 pr-1">Play Music 🎵</span>
            </>
          )}
        </button>
      </div>

      {/* 1. Cover Scene */}
      <Scene1Cover surprise={surprise} containerRef={containerRef} />

      {/* 2. Intro Scene */}
      <Scene2Intro surprise={surprise} />

      {/* 3. Wishes Scene */}
      <Scene3Wishes wishes={surprise.wishes} />

      {/* 4. Photo Memories Scene */}
      <Scene4Photos surprise={surprise} />

      {/* 5. Letter Scene */}
      <Scene5Letter surprise={surprise} />

      {/* 6. Finale Scene */}
      <Scene6Finale surprise={surprise} />
    </div>
  );
};
