import { Link, useParams, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { getMuseumById } from '../data';

export default function OnSiteGuide() {
  const { museumId } = useParams<{ museumId: string }>();
  const museum = getMuseumById(museumId || '');

  if (!museum) return <Navigate to="/" replace />;

  return (
    <div className="min-h-screen bg-cream flex flex-col">
      {/* Nav */}
      <div className="glass-nav sticky top-0 z-30 flex items-center px-4 py-3 safe-top">
        <Link to={`/${museum.id}`} className="text-sm text-brown-muted hover:text-brown transition-colors min-h-[44px] min-w-[44px] flex items-center">← 返回</Link>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center px-6 pb-12 max-w-lg mx-auto w-full safe-bottom-btn">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-8"
        >
          <span className="text-3xl mb-3 block">📍</span>
          <h2 className="font-serif text-xl font-bold text-brown">你想怎么逛？</h2>
          <p className="text-xs text-brown-muted mt-2">{museum.name}</p>
        </motion.div>

        <div className="w-full space-y-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Link to={`/${museum.id}/on-site/route`} className="block">
              <div className="museum-card p-6 rounded-2xl bg-white/70 border border-brown/5 text-center">
                <span className="text-4xl mb-3 block">🗺</span>
                <h3 className="font-serif text-lg font-bold text-brown">智能推荐路线</h3>
                <p className="text-xs text-brown-muted mt-2 leading-relaxed">
                  告诉我你有多少时间，<br/>我帮你规划最佳游览路线
                </p>
              </div>
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <Link to={`/${museum.id}/on-site/explore`} className="block">
              <div className="museum-card p-6 rounded-2xl bg-white/70 border border-brown/5 text-center">
                <span className="text-4xl mb-3 block">🔍</span>
                <h3 className="font-serif text-lg font-bold text-brown">自由探索</h3>
                <p className="text-xs text-brown-muted mt-2 leading-relaxed">
                  查看所有展品信息，<br/>按自己的节奏探索博物馆
                </p>
              </div>
            </Link>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
