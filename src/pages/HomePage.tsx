import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { museums } from '../data';
import { resolveImageUrl } from '../utils/imageUrl';
import { useState } from 'react';
import { useGuidePreference } from '../context/GuidePreferenceContext';
import type { GuideMode } from '../context/GuidePreferenceContext';
import { useInView } from '../hooks/useInView';

export default function HomePage() {
  const { mode, setMode } = useGuidePreference();
  const [showSettings, setShowSettings] = useState(false);

  return (
    <div className="min-h-screen bg-cream">
      {/* Header Area - Brand & Tagline */}
      <section
        className="relative h-[32vh] min-h-[260px] flex items-end overflow-hidden"
      >
        {/* Layered warm background */}
        {/* Base: warm cream to amber gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#f5ebe0] via-[#e8d5c4] to-[#d4a574]" />

        {/* Subtle texture overlay */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%236b4423' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />

        {/* Soft vignette */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#c9a86c]/30 via-transparent to-[#f5ebe0]/50" />

        {/* Bottom fade to cream */}
        <div className="absolute inset-0 bg-gradient-to-t from-cream via-cream/60 to-transparent" />

        {/* Decorative elements - subtle golden circles */}
        <div className="absolute top-20 right-10 w-32 h-32 rounded-full bg-[#d4a574]/20 blur-3xl" />
        <div className="absolute top-40 left-5 w-24 h-24 rounded-full bg-[#c9a86c]/15 blur-2xl" />

        {/* Header */}
        <header className="absolute top-0 left-0 right-0 z-40 px-6 py-5">
          <div className="max-w-lg mx-auto flex items-center justify-between">
            <span className="text-xs tracking-[0.3em] text-[#6b4423]/70 uppercase font-medium">
              Museum Stroll
            </span>
            <button
              onClick={() => setShowSettings(true)}
              className="p-2.5 rounded-full bg-[#6b4423]/5 backdrop-blur-sm text-[#6b4423]/70 hover:text-[#6b4423] hover:bg-[#6b4423]/10 transition-all"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </button>
          </div>
        </header>

        {/* Hero Content */}
        <div className="relative z-10 px-6 pb-8 w-full max-w-lg mx-auto">
          <div className="max-w-lg mx-auto w-full">
            <h1
              className="font-serif text-4xl sm:text-5xl text-[#4a3728] font-medium leading-[1.15] tracking-tight"
            >
              博物馆
              <br />
              <span className="text-[#a67c52]">漫步</span>
            </h1>

            <p
              className="text-[#6b5b4f] text-sm mt-4 font-light leading-relaxed"
            >
              在时光中穿行，与千年前的文明温柔相遇
            </p>
          </div>
        </div>
      </section>

      {/* Museum Collection */}
      <section className="relative px-6 py-12 max-w-lg mx-auto -mt-8 z-10">
        {/* Museum Cards */}
        <div className="space-y-10">
          {museums.map((museum, i) => (
            <MuseumCard key={museum.id} museum={museum} index={i} />
          ))}
        </div>

      </section>

      {/* Footer */}
      <motion.footer
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.3 }}
        className="py-12 text-center"
      >
        <div className="w-full max-w-[200px] mx-auto h-px bg-brown/10 mb-6" />
        <p className="font-serif text-[13px] tracking-[0.1em] text-brown/60">
          更多博物馆即将呈现
        </p>
        <p className="mt-1.5 text-[10px] tracking-[0.2em] text-brown-muted/40 uppercase">
          Museum Stroll
        </p>
      </motion.footer>

      {/* Settings Modal */}
      {showSettings && (
        <SettingsModal mode={mode} setMode={setMode} onClose={() => setShowSettings(false)} />
      )}
    </div>
  );
}

function MuseumCard({ museum, index }: { museum: typeof museums[0]; index: number }) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const { ref, isInView } = useInView<HTMLDivElement>('-80px');

  return (
    <div
      ref={ref}
      className="transition-all duration-700 ease-out"
      style={{
        opacity: isInView ? 1 : 0,
        transform: isInView ? 'translateY(0)' : 'translateY(40px)',
        transitionDelay: isInView ? `${index * 0.12}s` : '0s',
        willChange: 'transform, opacity',
        transitionTimingFunction: 'cubic-bezier(0.22, 1, 0.36, 1)',
      }}
    >
      <Link to={`/${museum.id}`} className="group block">
        <div className="relative">
          {/* Image Container - Refined proportions */}
          <div className="relative aspect-[3/2] overflow-hidden rounded-sm bg-cream-dark">
            {!imageLoaded && <div className="shimmer absolute inset-0" />}
            <img
              src={resolveImageUrl(museum.coverImage)}
              alt={museum.name}
              loading="lazy"
              decoding="async"
              onLoad={() => setImageLoaded(true)}
              className={`w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
            />
            {/* Elegant gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-brown/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          </div>

          {/* Content - Under image with generous spacing */}
          <div className="pt-4 pb-2">
            {/* Museum name with refined typography */}
            <h3 className="font-serif text-lg text-brown group-hover:text-accent transition-colors duration-300">
              {museum.name}
            </h3>

            {/* Location with subtle styling */}
            <p className="text-[11px] tracking-[0.1em] text-brown-muted/60 uppercase mt-2">
              {museum.city} · {museum.country}
            </p>

          </div>

        </div>
      </Link>
    </div>
  );
}

function SettingsModal({
  mode,
  setMode,
  onClose,
}: {
  mode: GuideMode;
  setMode: (mode: GuideMode) => void;
  onClose: () => void;
}) {
  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-brown/60 backdrop-blur-sm z-50"
        onClick={onClose}
      />
      <motion.div
        initial={{ opacity: 0, y: 100 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 100 }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        className="fixed bottom-0 left-0 right-0 z-50 bg-cream rounded-t-3xl p-6 pb-8 max-w-lg mx-auto"
      >
        <div className="w-12 h-1.5 bg-brown/20 rounded-full mx-auto mb-6" />

        <div className="flex items-center justify-between mb-6">
          <h2 className="font-serif text-xl font-medium text-brown">偏好设置</h2>
          <button onClick={onClose} className="p-2 text-brown-muted hover:text-brown">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="space-y-3">
          {(['enthusiast', 'popular'] as GuideMode[]).map((m) => (
            <label
              key={m}
              className={`flex items-center p-4 rounded-xl border cursor-pointer transition-all ${
                mode === m ? 'bg-white border-accent shadow-sm' : 'bg-white/50 border-brown/10'
              }`}
            >
              <input
                type="radio"
                name="guideMode"
                value={m}
                checked={mode === m}
                onChange={() => setMode(m)}
                className="sr-only"
              />
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-brown">{m === 'enthusiast' ? '爱好者版' : '大众版'}</span>
                  {mode === m && (
                    <span className="text-[10px] px-2 py-0.5 bg-accent text-white rounded-full">当前</span>
                  )}
                </div>
                <p className="text-xs text-brown-muted mt-1">
                  {m === 'enthusiast' ? '深度解读 · 专业视角' : '轻松有趣 · 故事讲述'}
                </p>
              </div>
            </label>
          ))}
        </div>

        <button onClick={onClose} className="w-full mt-6 py-3.5 rounded-xl bg-accent text-white font-medium text-sm">
          完成
        </button>
      </motion.div>
    </>
  );
}
