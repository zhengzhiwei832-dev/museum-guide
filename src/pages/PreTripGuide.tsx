import { useParams, Navigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { getMuseumById } from '../data';
import { useSnapScroll } from '../hooks/useSnapScroll';
import { useNestedScroll } from '../hooks/useNestedScroll';
import PageIndicator from '../components/PageIndicator';
import ExhibitCard from '../components/ExhibitCard';
import InfoBlock from '../components/InfoBlock';
import { useState } from 'react';

export default function PreTripGuide() {
  const { museumId } = useParams<{ museumId: string }>();
  const museum = getMuseumById(museumId || '');

  if (!museum) return <Navigate to="/" replace />;

  const allExhibits = [...museum.highlights, ...museum.hiddenGems];
  // Pages: cover + practical info + floor map + exhibits (one per page) + ending
  const totalPages = 3 + allExhibits.length + 1;
  const { containerRef, currentPage, scrollToPage } = useSnapScroll(totalPages);

  // Generate page titles
  const pageTitles = [
    museum.name, // Cover
    '出行必备信息', // Practical info
    '博物馆导览', // Floor map
    ...allExhibits.map(e => e.name), // Exhibits
    '旅途愉快', // Ending
  ];

  return (
    <div ref={containerRef} className="snap-container">
      {/* Fixed back button */}
      <div className="glass-nav fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4 py-3 safe-top">
        <Link to={`/${museum.id}`} className="text-sm text-brown-muted hover:text-brown transition-colors min-h-[44px] min-w-[44px] flex items-center">← 返回</Link>
        <span className="text-xs text-brown-muted">{museum.name}</span>
      </div>

      <PageIndicator total={totalPages} current={currentPage} onDotClick={scrollToPage} pageTitles={pageTitles} />
        {/* Page 0: Cover */}
        <CoverPage museum={museum} index={0} />

        {/* Page 1: Practical Info */}
        <PracticalInfoPage museum={museum} index={1} />

        {/* Page 2: Floor Map */}
        <FloorMapPage museum={museum} index={2} />

        {/* Pages 3+: Exhibits */}
        {allExhibits.map((exhibit, i) => (
          <ExhibitCard
            key={exhibit.id}
            exhibit={exhibit}
            index={3 + i}
            total={totalPages}
            museumId={museum.id}
          />
        ))}

        {/* Ending page */}
        <EndingPage museum={museum} index={totalPages - 1} />
    </div>
  );
}

function CoverPage({ museum, index }: { museum: ReturnType<typeof getMuseumById>; index: number }) {
  const [imageLoaded, setImageLoaded] = useState(false);
  if (!museum) return null;

  return (
    <div className="snap-page" data-page-index={index}>
      <div className="relative h-[65vh] h-[65dvh] overflow-hidden">
        {!imageLoaded && <div className="shimmer w-full h-full" />}
        <img
          src={museum.coverImage}
          alt={museum.name}
          loading="eager"
          decoding="async"
          onLoad={() => setImageLoaded(true)}
          className={`w-full h-full object-cover transition-opacity duration-700 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-cream via-cream/20 to-transparent" />
      </div>
      <div className="flex-1 px-6 -mt-20 relative z-10">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <p className="text-xs text-brown-muted">{museum.city}，{museum.country}</p>
          <h1 className="font-serif text-3xl font-bold text-brown mt-1 leading-tight">{museum.name}</h1>
          <p className="text-xs text-brown-muted mt-1 italic">{museum.nameEn}</p>
          <p className="text-sm text-brown-light mt-4 leading-relaxed">{museum.description}</p>
          <div className="flex items-center gap-2 mt-5 text-xs text-accent">
            <span>↓ 向下滑动开始探索</span>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

function PracticalInfoPage({ museum, index }: { museum: ReturnType<typeof getMuseumById>; index: number }) {
  if (!museum) return null;
  const info = museum.practicalInfo;
  const { scrollRef, scrollProps } = useNestedScroll();

  return (
    <div className="snap-page relative" data-page-index={index}>
      {/* Ambient Background */}
      <div className="ambient-background" />

      <div className="page-content" />
      <div ref={scrollRef} className="exhibit-content-scroll" {...scrollProps}>
        {/* Title Section */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="title-block mb-6"
        >
          <h2 className="exhibit-title text-xl">出行必备信息</h2>
        </motion.div>

        <InfoBlock
          items={[
            { icon: '🎫', title: '门票价格', content: info.ticketPrice },
            { icon: '🕐', title: '开放时间', content: info.openingHours },
            { icon: '📱', title: '预约方式', content: info.reservation },
            { icon: '🚇', title: '交通指引', content: info.transportation },
          ]}
        />
        {info.tips.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity:1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.3 }}
            className="mt-5 p-4 rounded-xl bg-accent/5 border border-accent/10"
          >
            <h4 className="text-sm font-semibold text-brown mb-2">💡 注意事项</h4>
            <ul className="space-y-1.5">
              {info.tips.map((tip, i) => (
                <li key={i} className="text-xs text-brown-light leading-relaxed flex gap-2">
                  <span className="text-accent flex-shrink-0">·</span>
                  <span>{tip}</span>
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </div>
    </div>
  );
}

function FloorMapPage({ museum, index }: { museum: ReturnType<typeof getMuseumById>; index: number }) {
  if (!museum) return null;
  const { scrollRef, scrollProps } = useNestedScroll();

  return (
    <div className="snap-page relative" data-page-index={index}>
      {/* Ambient Background */}
      <div className="ambient-background" />

      <div className="page-content" />
      <div ref={scrollRef} className="exhibit-content-scroll" {...scrollProps}>
        {/* Title Section */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="title-block mb-5"
        >
          <h2 className="exhibit-title text-xl">博物馆导览</h2>
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="text-sm text-brown-light leading-relaxed mb-5"
        >
          {museum.floorMap.overview}
        </motion.p>

        <div className="space-y-3">
          {museum.floorMap.floors.map((floor, i) => (
            <motion.div
              key={floor.id}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: 0.15 + i * 0.08 }}
              className="p-4 rounded-xl bg-white/60 border border-brown/5"
            >
              <h4 className="text-sm font-semibold text-brown mb-1">{floor.name}</h4>
              <p className="text-xs text-brown-light leading-relaxed mb-2">{floor.description}</p>
              <div className="flex flex-wrap gap-1.5">
                {floor.zones.map((zone) => (
                  <span key={zone} className="text-[10px] px-2 py-0.5 bg-cream-dark rounded-full text-brown-muted">{zone}</span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

function EndingPage({ museum, index }: { museum: ReturnType<typeof getMuseumById>; index: number }) {
  if (!museum) return null;

  return (
    <div className="snap-page flex flex-col items-center justify-center px-6 text-center" data-page-index={index}>
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <span className="text-4xl mb-4 block">🎨</span>
        <h2 className="font-serif text-xl font-bold text-brown mb-2">攻略到这里就结束了</h2>
        <p className="text-sm text-brown-muted leading-relaxed max-w-xs mx-auto">
          愿这份攻略能帮你更好地探索{museum.name}。<br/>祝你旅途愉快！
        </p>

        <div className="mt-8 space-y-3 w-full max-w-xs safe-bottom-btn">
          <Link
            to={`/${museum.id}/on-site`}
            className="block w-full py-3 rounded-xl bg-accent text-white text-sm font-medium text-center hover:bg-accent-dark transition-colors"
          >
            切换到「在现场」模式
          </Link>
          <Link
            to="/"
            className="block w-full py-3 rounded-xl bg-white/70 border border-brown/10 text-sm text-brown-muted text-center hover:bg-white transition-colors"
          >
            探索其他博物馆
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
