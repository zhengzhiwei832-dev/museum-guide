import { useState, useRef, memo } from 'react';
import type { Exhibit } from '../data/types';
import { useGuidePreference } from '../context/GuidePreferenceContext';
import type { GuideMode } from '../context/GuidePreferenceContext';
import { useNestedScroll } from '../hooks/useNestedScroll';
import ImageViewer from './ImageViewer';
import GuideModeTabs from './GuideModeTabs';
import PopularGuideView from './PopularGuideView';
import EnthusiastGuideView from './EnthusiastGuideView';

interface ExhibitCardProps {
  exhibit: Exhibit;
  index: number;
  total: number;
  museumId?: string;
}

// Memo 优化，避免不必要的重渲染
function ExhibitCard({ exhibit, index, total }: ExhibitCardProps) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [isViewerOpen, setIsViewerOpen] = useState(false);
  const [imageOrientation, setImageOrientation] = useState<'landscape' | 'portrait' | 'unknown'>('unknown');
  const wrapperRef = useRef<HTMLDivElement>(null);
  const { mode: globalMode } = useGuidePreference();
  const [localMode, setLocalMode] = useState<GuideMode>(globalMode);
  const { scrollRef, scrollProps } = useNestedScroll();

  const hasPopular = !!exhibit.popularGuide;
  const hasEnthusiast = !!exhibit.enthusiastGuide;
  const hasGuide = hasPopular || hasEnthusiast;

  // Detect image orientation
  const handleImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    setImageLoaded(true);
    const img = e.currentTarget;
    const aspectRatio = img.naturalWidth / img.naturalHeight;
    setImageOrientation(aspectRatio > 1 ? 'landscape' : 'portrait');
  };

  return (
    <div className="snap-page exhibit-card" data-page-index={index}>
      {/* Ambient Background */}
      <div className="ambient-background" />

      {/* Image Section - 简化为普通 div，使用 CSS transition */}
      <div
        className={`exhibit-image-theater ${imageOrientation === 'landscape' ? 'landscape' : ''} ${imageOrientation === 'portrait' ? 'portrait' : ''}`}
        onClick={() => setIsViewerOpen(true)}
      >
        {/* Vignette Overlay */}
        <div className="image-vignette" />

        <div ref={wrapperRef} className="theater-frame">
          {/* Loading State - 简化为 CSS 动画 */}
          {!imageLoaded && (
            <div className="image-loading">
              <div className="loading-pulse" />
              <div className="loading-text">正在呈现展品...</div>
            </div>
          )}

          {/* Main Image - 使用 CSS transition */}
          <img
            src={exhibit.image}
            alt={exhibit.name}
            loading="lazy"
            decoding="async"
            onLoad={handleImageLoad}
            className={`theater-image ${imageLoaded ? 'loaded' : ''}`}
          />

          {/* Zoom Indicator - 简化为 CSS */}
          <div className={`zoom-indicator ${imageLoaded ? 'visible' : ''}`}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <circle cx="11" cy="11" r="8" />
              <path d="M21 21l-4.35-4.35" />
              <path d="M11 8v6M8 11h6" />
            </svg>
            <span>查看细节</span>
          </div>
        </div>
      </div>

      {/* Content Scroll Area */}
      <div
        ref={scrollRef}
        className="exhibit-content-scroll"
        {...scrollProps}
      >
        {/* Title Section */}
        <div className="title-block">
          <div className="title-divider">
            <span className="divider-line" />
            <span className="divider-ornament">◆</span>
            <span className="divider-line" />
          </div>

          <h1 className="exhibit-title">{exhibit.name}</h1>

          {exhibit.nameOriginal && (
            <p className="exhibit-title-original">{exhibit.nameOriginal}</p>
          )}
        </div>

        {/* Meta Information */}
        <div className="meta-placard-compact">
          <div className="placard-row">
            {exhibit.artist && (
              <>
                <div className="placard-chip">
                  <span className="chip-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                      <circle cx="12" cy="7" r="4" />
                    </svg>
                  </span>
                  <span className="chip-text">{exhibit.artist}</span>
                </div>
                <span className="placard-divider" />
              </>
            )}
            <div className="placard-chip">
              <span className="chip-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <circle cx="12" cy="12" r="10" />
                  <path d="M12 6v6l4 2" />
                </svg>
              </span>
              <span className="chip-text">{exhibit.period}</span>
            </div>
            <span className="placard-divider" />
            <div className="placard-chip">
              <span className="chip-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
              </span>
              <span className="chip-text">{exhibit.location}</span>
            </div>
          </div>
        </div>

        {/* Guide Mode Selector */}
        {hasGuide && (
          <div>
            <GuideModeTabs mode={localMode} onChange={setLocalMode} />
          </div>
        )}

        {/* Guide Content - 简化为普通 div */}
        <div className="guide-content-wrapper">
          {hasGuide ? (
            <div key={localMode} className="guide-mode-content">
              {localMode === 'popular' && hasPopular && (
                <PopularGuideView guide={exhibit.popularGuide!} />
              )}
              {localMode === 'enthusiast' && hasEnthusiast && (
                <EnthusiastGuideView guide={exhibit.enthusiastGuide!} />
              )}
              {(localMode === 'popular' && !hasPopular) || (localMode === 'enthusiast' && !hasEnthusiast) ? (
                <FallbackContent description={exhibit.description} funFact={exhibit.funFact} />
              ) : null}
            </div>
          ) : (
            <FallbackContent description={exhibit.description} funFact={exhibit.funFact} />
          )}
        </div>

        {/* Page Footer */}
        <div className="exhibit-footer">
          <div className="footer-line" />
          <span className="footer-hint">
            {index < total - 1 ? '↓ 继续探索下一件展品' : '↑ 返回顶部'}
          </span>
          <div className="footer-progress">
            <span className="progress-current">{index + 1}</span>
            <span className="progress-divider">/</span>
            <span className="progress-total">{total}</span>
          </div>
        </div>
      </div>

      {/* Image Viewer Modal */}
      <ImageViewer
        src={exhibit.image}
        alt={exhibit.name}
        isOpen={isViewerOpen}
        onClose={() => setIsViewerOpen(false)}
      />
    </div>
  );
}

/** Fallback content when no deep guide is available */
function FallbackContent({ description, funFact }: { description: string; funFact?: string }) {
  return (
    <div className="fallback-guide">
      <section className="guide-narrative">
        <div className="narrative-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
        </div>
        <h3 className="narrative-title">展品介绍</h3>
        <p className="narrative-body">{description}</p>
      </section>

      {funFact && (
        <section className="guide-narrative narrative-highlight">
          <div className="narrative-icon icon-accent">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
          </div>
          <h3 className="narrative-title">你可能不知道</h3>
          <p className="narrative-body">{funFact}</p>
        </section>
      )}
    </div>
  );
}

// Memo 导出，避免父组件重渲染时子组件也重渲染
export default memo(ExhibitCard);
