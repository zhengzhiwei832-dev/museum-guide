import { useParams, Navigate, Link } from 'react-router-dom';
import { getMuseumById } from '../data';
import { useSnapScroll } from '../hooks/useSnapScroll';
import { useNestedScroll } from '../hooks/useNestedScroll';
import PageIndicator from '../components/PageIndicator';
import ExhibitCard from '../components/ExhibitCard';

export default function ExploreMode() {
  const { museumId } = useParams<{ museumId: string }>();
  const museum = getMuseumById(museumId || '');
  const { scrollRef, scrollProps } = useNestedScroll();

  if (!museum) return <Navigate to="/" replace />;

  const allExhibits = [...museum.highlights, ...museum.hiddenGems];
  // Pages: floor map + exhibits + ending
  const totalPages = 1 + allExhibits.length + 1;
  const { containerRef, currentPage, scrollToPage } = useSnapScroll(totalPages);

  // Generate page titles
  const pageTitles = [
    '博物馆导览', // Floor map
    ...allExhibits.map(e => e.name), // Exhibits
    '尽情探索', // Ending
  ];

  return (
    <div ref={containerRef} className="snap-container">
      <div className="glass-nav fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4 safe-top">
        <Link to={`/${museum.id}/on-site`} className="text-sm text-brown-muted hover:text-brown transition-colors h-12 flex items-center">← 返回</Link>
        <span className="text-sm text-brown-muted truncate max-w-[60%]">自由探索 · {museum.name}</span>
      </div>

      <PageIndicator total={totalPages} current={currentPage} onDotClick={scrollToPage} pageTitles={pageTitles} />
        {/* Floor map page */}
        <div className="snap-page relative" data-page-index={0}>
          {/* Ambient Background */}
          <div className="ambient-background" />

          <div className="page-content" />
          <div ref={scrollRef} className="exhibit-content-scroll" {...scrollProps}>
            {/* Title Section */}
            <div className="title-block mb-5">
              <h2 className="exhibit-title text-xl">博物馆导览</h2>
            </div>

            <p className="text-sm text-brown-light leading-relaxed mb-5">
              {museum.floorMap.overview}
            </p>
            <div className="space-y-3">
              {museum.floorMap.floors.map((floor) => (
                <div
                  key={floor.id}
                  className="p-4 rounded-xl bg-white/60 border border-brown/5"
                >
                  <h4 className="text-sm font-semibold text-brown mb-1">{floor.name}</h4>
                  <p className="text-xs text-brown-light leading-relaxed mb-2">{floor.description}</p>
                  <div className="flex flex-wrap gap-1.5">
                    {floor.zones.map((zone) => (
                      <span key={zone} className="text-[10px] px-2 py-0.5 bg-cream-dark rounded-full text-brown-muted">{zone}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            <div className="flex items-center gap-2 mt-5 text-xs text-accent">
              <span>↓ 向下滑动查看展品</span>
            </div>
          </div>
        </div>

        {/* Exhibit pages */}
        {allExhibits.map((exhibit, i) => (
          <ExhibitCard
            key={exhibit.id}
            exhibit={exhibit}
            index={1 + i}
            total={totalPages}
            museumId={museum.id}
          />
        ))}

        {/* Ending */}
        <div className="snap-page flex flex-col items-center justify-center px-6 text-center" data-page-index={totalPages - 1}>
          <div>
            <span className="text-4xl mb-4 block">✨</span>
            <h2 className="font-serif text-xl font-bold text-brown mb-2">尽情探索吧</h2>
            <p className="text-sm text-brown-muted leading-relaxed max-w-xs mx-auto">祝你在{museum.name}度过美好时光！</p>
            <div className="mt-8 space-y-3 w-full max-w-xs safe-bottom-btn">
              <Link
                to={`/${museum.id}/on-site/route`}
                className="block w-full py-3 rounded-xl bg-accent text-white text-sm font-medium text-center"
              >
                切换到推荐路线
              </Link>
              <Link to="/" className="block w-full py-3 rounded-xl bg-white/70 border border-brown/10 text-sm text-brown-muted text-center">
                探索其他博物馆
              </Link>
            </div>
          </div>
        </div>
    </div>
  );
}
