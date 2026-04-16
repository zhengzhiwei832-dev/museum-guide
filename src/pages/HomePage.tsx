import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { museums } from '../data';
import { useState } from 'react';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-cream">
      {/* Hero section */}
      <div className="relative h-[45vh] flex items-end overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-brown/30 via-brown/10 to-cream" />
        <div className="absolute inset-0"
          style={{
            backgroundImage: 'url(https://images.unsplash.com/photo-1547981609-4b6bfe67ca0b?w=1200&q=80)',
            backgroundSize: 'cover',
            backgroundPosition: 'center 30%',
            filter: 'brightness(0.7) saturate(0.8)',
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-cream via-cream/30 to-transparent" />
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
