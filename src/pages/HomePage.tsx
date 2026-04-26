import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { museums } from '../data';
import { useState } from 'react';
import { useGuidePreference } from '../context/GuidePreferenceContext';
import type { GuideMode } from '../context/GuidePreferenceContext';

export default function HomePage() {
  const { mode, setMode } = useGuidePreference();
  const [showSettings, setShowSettings] = useState(false);

  return (
    <div className="min-h-screen bg-cream">
      {/* Hero section */}
      <div className="relative h-[45vh] flex items-end overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-brown/30 via-brown/10 to-cream" />
        <div className="absolute inset-0"
          style={{
            background: 'linear-gradient(135deg, #5d4e37 0%, #3d2c23 50%, #2a1f18 100%)',
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-cream via-cream/30 to-transparent" />

        {/* Settings button - top right corner */}
        <div className="absolute top-4 right-4 z-20">
          <button
            onClick={() => setShowSettings(true)}
            className="p-2.5 rounded-full bg-white/80 backdrop-blur-sm text-brown-muted hover:text-brown transition-colors shadow-sm"
            aria-label="设置"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </button>
        </div>

        <div className="relative z-10 px-6 pb-6 w-full max-w-lg mx-auto">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="font-serif text-3xl font-bold text-brown leading-tight"
          >
            博物馆漫步
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="text-sm text-brown-light mt-2 leading-relaxed"
          >
            探索世界顶级博物馆，发现艺术与文明的奇迹
          </motion.p>
        </div>
      </div>

      {/* Museum grid */}
      <div className="px-5 pb-10 max-w-lg mx-auto -mt-4 relative z-10">
        <div className="grid grid-cols-1 gap-4">
          {museums.map((museum, i) => (
            <MuseumCard key={museum.id} museum={museum} index={i} />
          ))}
        </div>

        {/* Coming soon hint */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="text-center mt-8 py-6 pb-10 border border-dashed border-brown/10 rounded-xl safe-bottom-btn"
        >
          <p className="text-sm text-brown-muted">🏛 更多博物馆即将上线</p>
          <p className="text-xs text-brown-muted/60 mt-1">卢浮宫 · 梵蒂冈博物馆 · 国家博物馆 · 陕西历史博物馆 ...</p>
        </motion.div>
      </div>

      {/* Settings Modal */}
      <AnimatePresence>
        {showSettings && (
          <SettingsModal
            mode={mode}
            setMode={setMode}
            onClose={() => setShowSettings(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

function MuseumCard({ museum, index }: { museum: typeof museums[0]; index: number }) {
  const [imageLoaded, setImageLoaded] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 + index * 0.1 }}
    >
      <Link to={`/${museum.id}`} className="block min-h-[44px]">
        <div className="museum-card rounded-2xl overflow-hidden bg-white/70 border border-brown/5 shadow-sm">
          <div className="relative h-48 overflow-hidden">
            {!imageLoaded && <div className="shimmer w-full h-full" />}
            <img
              src={museum.coverImage}
              alt={museum.name}
              loading="lazy"
              decoding="async"
              onLoad={() => setImageLoaded(true)}
              className={`w-full h-full object-cover transition-opacity duration-500 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
            />
            <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-black/40 to-transparent" />
            <div className="absolute bottom-3 left-4 right-4">
              <h3 className="font-serif text-lg font-bold text-white drop-shadow-md">{museum.name}</h3>
              <p className="text-xs text-white/80 mt-0.5 drop-shadow-sm">{museum.city}，{museum.country}</p>
            </div>
          </div>
          <div className="px-4 py-3">
            <p className="text-xs text-brown-muted leading-relaxed line-clamp-2">{museum.description}</p>
            <div className="flex items-center justify-between mt-3">
              <div className="flex gap-2">
                <span className="text-[10px] px-2 py-0.5 bg-accent/10 text-accent rounded-full">{museum.highlights.length} 件必看展品</span>
                <span className="text-[10px] px-2 py-0.5 bg-sage/10 text-sage rounded-full">{museum.recommendedRoutes.length} 条路线</span>
              </div>
              <span className="text-xs text-accent font-medium">查看攻略 →</span>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

function SettingsModal({
  mode,
  setMode,
  onClose
}: {
  mode: GuideMode;
  setMode: (mode: GuideMode) => void;
  onClose: () => void;
}) {
  return (
    <>
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/40 z-50"
        onClick={onClose}
      />

      {/* Modal */}
      <motion.div
        initial={{ opacity: 0, y: 100 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 100 }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        className="fixed bottom-0 left-0 right-0 z-50 bg-cream rounded-t-3xl p-6 pb-8 max-w-lg mx-auto"
      >
        {/* Handle bar */}
        <div className="w-12 h-1.5 bg-brown/20 rounded-full mx-auto mb-6" />

        <div className="flex items-center justify-between mb-6">
          <h2 className="font-serif text-xl font-bold text-brown">设置</h2>
          <button
            onClick={onClose}
            className="p-2 text-brown-muted hover:text-brown transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Guide Mode Preference */}
        <div className="mb-6">
          <h3 className="text-sm font-semibold text-brown mb-2">展品介绍偏好</h3>
          <p className="text-xs text-brown-muted mb-4">
            选择你喜欢的展品介绍风格，可随时切换
          </p>

          <div className="space-y-3">
            <label className={`flex items-center p-4 rounded-xl border cursor-pointer transition-all ${
              mode === 'enthusiast'
                ? 'bg-white border-accent shadow-sm'
                : 'bg-white/50 border-brown/10'
            }`}>
              <input
                type="radio"
                name="guideMode"
                value="enthusiast"
                checked={mode === 'enthusiast'}
                onChange={() => setMode('enthusiast')}
                className="sr-only"
              />
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-brown">爱好者版</span>
                  {mode === 'enthusiast' && (
                    <span className="text-[10px] px-2 py-0.5 bg-accent text-white rounded-full">当前选择</span>
                  )}
                </div>
                <p className="text-xs text-brown-muted mt-1">
                  深度解读、作品档案、历史背景、艺术分析
                </p>
              </div>
              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                mode === 'enthusiast' ? 'border-accent' : 'border-brown/30'
              }`}>
                {mode === 'enthusiast' && <div className="w-2.5 h-2.5 rounded-full bg-accent" />}
              </div>
            </label>

            <label className={`flex items-center p-4 rounded-xl border cursor-pointer transition-all ${
              mode === 'popular'
                ? 'bg-white border-accent shadow-sm'
                : 'bg-white/50 border-brown/10'
            }`}>
              <input
                type="radio"
                name="guideMode"
                value="popular"
                checked={mode === 'popular'}
                onChange={() => setMode('popular')}
                className="sr-only"
              />
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-brown">大众版</span>
                  {mode === 'popular' && (
                    <span className="text-[10px] px-2 py-0.5 bg-accent text-white rounded-full">当前选择</span>
                  )}
                </div>
                <p className="text-xs text-brown-muted mt-1">
                  轻松有趣、亮点速览、互动挑战、实用贴士
                </p>
              </div>
              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                mode === 'popular' ? 'border-accent' : 'border-brown/30'
              }`}>
                {mode === 'popular' && <div className="w-2.5 h-2.5 rounded-full bg-accent" />}
              </div>
            </label>
          </div>
        </div>

        {/* Close button */}
        <button
          onClick={onClose}
          className="w-full py-3.5 rounded-xl bg-accent text-white font-medium text-sm hover:bg-accent-dark transition-colors"
        >
          完成
        </button>
      </motion.div>
    </>
  );
}
