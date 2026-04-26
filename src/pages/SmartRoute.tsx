import { useState } from 'react';
import { useParams, Navigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { getMuseumById } from '../data';
import type { Route, Exhibit } from '../data/types';
import { useSnapScroll } from '../hooks/useSnapScroll';
import { useNestedScroll } from '../hooks/useNestedScroll';
import PageIndicator from '../components/PageIndicator';
import ExhibitCard from '../components/ExhibitCard';
import TimeSelector from '../components/TimeSelector';
import RouteTimeline from '../components/RouteTimeline';

export default function SmartRoute() {
  const { museumId } = useParams<{ museumId: string }>();
  const museum = getMuseumById(museumId || '');
  const [selectedRoute, setSelectedRoute] = useState<Route | null>(null);

  if (!museum) return <Navigate to="/" replace />;

  if (!selectedRoute) {
    return (
      <div className="min-h-screen bg-cream">
        <div className="glass-nav sticky top-0 z-30 flex items-center px-4 py-3 safe-top">
          <Link to={`/${museum.id}/on-site`} className="text-sm text-brown-muted hover:text-brown transition-colors min-h-[44px] min-w-[44px] flex items-center">← 返回</Link>
        </div>
        <div>
          <TimeSelector routes={museum.recommendedRoutes} onSelect={setSelectedRoute} />
        </div>
      </div>
    );
  }

  return <RouteGuide museum={museum} route={selectedRoute} onBack={() => setSelectedRoute(null)} />;
}

function RouteGuide({ museum, route, onBack }: {
  museum: NonNullable<ReturnType<typeof getMuseumById>>;
  route: Route;
  onBack: () => void;
}) {
  // Gather exhibits for this route
  const allExhibits = [...museum.highlights, ...museum.hiddenGems];
  const routeExhibits = route.stops
    .map((stop) => allExhibits.find((e) => e.id === stop.exhibitId))
    .filter((e): e is Exhibit => !!e);

  // Pages: overview + design thought + exhibits + ending
  const totalPages = 2 + routeExhibits.length + 1;
  const { containerRef, currentPage, scrollToPage } = useSnapScroll(totalPages);
  const { scrollRef: overviewScrollRef, scrollProps: overviewScrollProps } = useNestedScroll();
  const { scrollRef: designScrollRef, scrollProps: designScrollProps } = useNestedScroll();

  // Generate page titles
  const pageTitles = [
    route.durationLabel, // Route overview
    '设计思路', // Design thought
    ...(routeExhibits.map(e => e?.name || '展品') as string[]), // Exhibits
    '路线完毕', // Ending
  ];

  return (
    <div ref={containerRef} className="snap-container">
      <div className="glass-nav fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4 py-3 safe-top">
        <button onClick={onBack} className="text-sm text-brown-muted hover:text-brown transition-colors min-h-[44px] min-w-[44px] flex items-center">← 重选时间</button>
        <span className="text-xs text-brown-muted">{route.durationLabel}</span>
      </div>

      <PageIndicator total={totalPages} current={currentPage} onDotClick={scrollToPage} pageTitles={pageTitles} />
        {/* Page 0: Route overview */}
        <div className="snap-page" data-page-index={0}>
          <div className="page-content" />
          <div ref={overviewScrollRef} className="text-scroll-area" {...overviewScrollProps}>
            <motion.div initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
              <span className="text-2xl mb-2 block">🗺</span>
              <h2 className="font-serif text-xl font-bold text-brown mb-2">{route.durationLabel}</h2>
              <p className="text-sm text-brown-light leading-relaxed mb-5">{route.overview}</p>
            </motion.div>

            <h3 className="text-sm font-semibold text-brown mb-3">路线站点</h3>
            <RouteTimeline stops={route.stops} />
          </div>
        </div>

        {/* Page 1: Design thought */}
        <div className="snap-page" data-page-index={1}>
          <div className="page-content" />
          <div ref={designScrollRef} className="text-scroll-area flex flex-col justify-center min-h-[70vh]" {...designScrollProps}>
            <motion.div initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
              <span className="text-2xl mb-3 block">💡</span>
              <h2 className="font-serif text-xl font-bold text-brown mb-3">设计思路</h2>
              <p className="text-sm text-brown-light leading-relaxed">{route.designThought}</p>
              <div className="mt-5 p-3 rounded-xl bg-accent/5 border border-accent/10">
                <p className="text-xs text-brown-muted">
                  共 {route.stops.length} 个站点 · 
                  建议总用时 {route.stops.reduce((sum, s) => sum + s.stayMinutes, 0)} 分钟 · 
                  向下滑动查看每个展品的详细介绍
                </p>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Exhibit pages */}
        {routeExhibits.map((exhibit, i) => {
          if (!exhibit) return null;
          return (
            <ExhibitCard
              key={exhibit.id}
              exhibit={exhibit}
              index={2 + i}
              total={totalPages}
              museumId={museum.id}
            />
          );
        })}

        {/* Ending */}
        <div className="snap-page flex flex-col items-center justify-center px-6 text-center" data-page-index={totalPages - 1}>
          <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }}>
            <span className="text-4xl mb-4 block">🎉</span>
            <h2 className="font-serif text-xl font-bold text-brown mb-2">路线介绍完毕</h2>
            <p className="text-sm text-brown-muted leading-relaxed max-w-xs mx-auto">
              现在出发吧！愿你在{museum.name}收获美好回忆。
            </p>
            <div className="mt-8 space-y-3 w-full max-w-xs safe-bottom-btn">
              <button
                onClick={onBack}
                className="block w-full py-3 rounded-xl bg-accent text-white text-sm font-medium text-center"
              >
                选择其他时长
              </button>
              <Link to={`/${museum.id}/on-site/explore`} className="block w-full py-3 rounded-xl bg-white/70 border border-brown/10 text-sm text-brown-muted text-center">
                切换到自由探索
              </Link>
              <Link to="/" className="block w-full py-3 rounded-xl text-sm text-brown-muted text-center">
                返回首页
              </Link>
            </div>
          </motion.div>
        </div>
    </div>
  );
}
