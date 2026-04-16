import { Link, useParams, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { getMuseumById } from '../data';

export default function ModeSelect() {
  const { museumId } = useParams<{ museumId: string }>();
  const museum = getMuseumById(museumId || '');

  if (!museum) return <Navigate to="/" replace />;

  return (
    <div className="min-h-screen bg-cream flex flex-col">
      {/* Back nav */}
      <div className="glass-nav sticky top-0 z-30 flex items-center px-4 py-3 safe-top">
        <Link to="/" className="text-sm text-brown-muted hover:text-brown transition-colors min-h-[44px] min-w-[44px] flex items-center">← 返回</Link>
      </div>

      {/* Museum header */}
      <div className="px-6 pt-4 pb-2 max-w-lg mx-auto w-full">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <p className="text-xs text-brown-muted">{museum.city}，{museum.country}</p>
          <h1 className="font-serif text-2xl font-bold text-brown mt-1">{museum.name}</h1>
          <p className="text-xs text-brown-muted mt-0.5">{museum.nameEn}</p>
        </motion.div>
      </div>

      {/* Mode selection */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 pb-12 max-w-lg mx-auto w-full safe-bottom-btn">
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-sm text-brown-muted mb-6 text-center"
        >
          你现在是哪种状态？
        </motion.p>

        <div className="w-full space-y-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.25 }}
          >
            <Link to={`/${museum.id}/pre-trip`} className="block">
              <div className="museum-card p-6 rounded-2xl bg-white/70 border border-brown/5 text-center">
                <span className="text-4xl mb-3 block">📖</span>
                <h3 className="font-serif text-lg font-bold text-brown">我在做攻略</h3>
                <p className="text-xs text-brown-muted mt-2 leading-relaxed">
                  提前了解博物馆概况、票价交通、<br/>必看展品和冷门宝藏
                </p>
              </div>
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.35 }}
          >
            <Link to={`/${museum.id}/on-site`} className="block">
              <div className="museum-card p-6 rounded-2xl bg-white/70 border border-brown/5 text-center">
                <span className="text-4xl mb-3 block">📍</span>
                <h3 className="font-serif text-lg font-bold text-brown">我已在现场</h3>
                <p className="text-xs text-brown-muted mt-2 leading-relaxed">
                  直接开始游览吧，选择自由探索<br/>或跟随智能推荐路线
                </p>
              </div>
            </Link>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
