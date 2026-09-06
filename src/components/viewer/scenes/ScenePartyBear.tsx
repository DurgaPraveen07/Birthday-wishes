import React, { useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { motion, useScroll, useTransform } from 'framer-motion';
import { DancingTeddyBear } from './DancingTeddyBear';
import { ThemeConfig } from '../../../config/themes';

interface Props {
  theme: ThemeConfig;
}

export const ScenePartyBear: React.FC<Props> = ({ theme }) => {
  const sceneRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: sceneRef,
    offset: ['start end', 'end start'],
  });

  const opacity = useTransform(scrollYProgress, [0.1, 0.4, 0.7, 0.9], [0, 1, 1, 0]);
  const scale = useTransform(scrollYProgress, [0.1, 0.4], [0.85, 1]);

  return (
    <div
      id="scene-party-bear"
      ref={sceneRef}
      className={`min-h-screen w-full flex flex-col justify-between items-center p-6 text-center relative overflow-hidden bg-gradient-to-b ${theme.bgGradient} snap-start py-12`}
    >
      {/* Glow Backdrop */}
      <div className="absolute w-96 h-96 bg-amber-500/15 rounded-full blur-3xl animate-pulse-glow pointer-events-none" />

      {/* Header */}
      <div className="pt-8 space-y-2 z-10">
        <span className={`px-4 py-1.5 rounded-full border text-xs font-bold uppercase tracking-widest inline-block ${theme.badgeBg}`}>
          🧸 Party Time
        </span>
        <h2 className="text-3xl sm:text-5xl font-bold font-heading text-white">
          Get the party started! 🧸🎉
        </h2>
      </div>

      {/* 3D Canvas Area */}
      <motion.div
        style={{ opacity, scale }}
        className="w-full max-w-lg h-[360px] sm:h-[420px] my-auto z-10 relative cursor-grab active:cursor-grabbing"
      >
        <Canvas
          camera={{ position: [0, 1.2, 3.8], fov: 45 }}
          style={{ background: 'transparent' }}
        >
          <ambientLight intensity={0.7} />
          <directionalLight position={[3, 5, 2]} intensity={0.9} />
          <directionalLight position={[-3, -2, -2]} intensity={0.3} color="#f472b6" />

          <DancingTeddyBear />

          <OrbitControls
            enableZoom={false}
            enablePan={false}
            autoRotate
            autoRotateSpeed={0.8}
          />
        </Canvas>
      </motion.div>

      {/* Footer Caption */}
      <div className="pb-8 z-10 text-xs sm:text-sm text-slate-300 font-serif italic">
        "Get the party started! 🧸🎉"
      </div>
    </div>
  );
};
