import { useState } from 'react';
import { useParams, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { getExhibitById, getMuseumById } from '../data';
import { useGuidePreference } from '../context/GuidePreferenceContext';
import type { GuideMode } from '../context/GuidePreferenceContext';
import GuideModeTabs from '../components/GuideModeTabs';
import PopularGuideView from '../components/PopularGuideView';
import EnthusiastGuideView from '../components/EnthusiastGuideView';
import ImageViewer from '../components/ImageViewer';

export default function ExhibitDetail() {
  const { museumId, exhibitId } = useParams<{ museumId: string; exhibitId: string }>();
  const location = useLocation();
  const museum = getMuseumById(museumId || '');
  const exhibit = getExhibitById(museumId || '', exhibitId || '');
  const { mode: globalMode } = useGuidePreference();
  const [localMode, setLocalMode] = useState<GuideMode>(globalMode);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [isViewerOpen, setIsViewerOpen] = useState(false);
  const navigate = useNavigate();

  if (!museum || !exhibit) return <Navigate to="/" replace />;

  const hasPopular = !!exhibit.popularGuide;
  const hasEnthusiast = !!exhibit.enthusiastGuide;
  const hasGuide = hasPopular || hasEnthusiast;

  // Determine back path based on navigation state
  const fromRoute = location.state?.from;
  const handleBack = () => {
    if (fromRoute) {
      navigate(-1); // Go back to previous page if we know where we came from
    } else {
      // Default fallback: go to on-site explore mode
      navigate(`/${museum.id}/on-site/explore`);
    }
  };

  return (
    <div className="exhibit-detail-page">
      {/* 毛玻璃导航栏 */}
      <div className="glass-nav fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4 py-3 safe-top">
        <button
          onClick={handleBack}
          className="text-sm text-brown-muted hover:text-brown transition-colors min-h-[44px] min-w-[44px] flex items-center"
        >
          ← 返回
        </button>
        <span className="text-xs text-brown-muted truncate max-w-[60%]">{museum.name}</span>
      </div>

      {/* 封面图 */}
      <div
        className="exhibit-detail-hero cursor-zoom-in"
        onClick={() => setIsViewerOpen(true)}
      >
        {!imageLoaded && <div className="shimmer w-full h-full absolute inset-0" />}
        <motion.img
          src={exhibit.image}
          alt={exhibit.name}
          loading="eager"
          onLoad={() => setImageLoaded(true)}
          initial={{ opacity: 0 }}
          animate={{ opacity: imageLoaded ? 1 : 0 }}
          transition={{ duration: 0.5 }}
          className="w-full h-full object-cover"
        />
        {/* Zoom hint */}
        {imageLoaded && (
          <div className="absolute bottom-20 right-4 z-10 p-2.5 rounded-full bg-black/20 backdrop-blur-sm">
            <svg className="w-5 h-5 text-white/80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
            </svg>
          </div>
        )}
        <div className="cover-gradient" />
        <div className="absolute bottom-0 left-0 right-0 px-5 pb-4 z-10">
          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="font-serif text-2xl font-bold text-brown leading-tight"
          >
            {exhibit.name}
          </motion.h1>
          {exhibit.nameOriginal && (
            <p className="text-sm text-brown-muted mt-1 italic">{exhibit.nameOriginal}</p>
          )}
          <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs text-brown-muted mt-2">
            {exhibit.artist && <span>✦ {exhibit.artist}</span>}
            <span>✦ {exhibit.period}</span>
            <span>✦ {exhibit.location}</span>
          </div>
        </div>
      </div>

      {/* 版本切换 Tab */}
      {hasGuide && (
        <div className="exhibit-detail-tabs-wrapper">
          <GuideModeTabs mode={localMode} onChange={setLocalMode} />
        </div>
      )}

      {/* 内容区 */}
      <div className="exhibit-detail-content">
        {hasGuide ? (
          <>
            {localMode === 'popular' && hasPopular && (
              <PopularGuideView guide={exhibit.popularGuide!} />
            )}
            {localMode === 'enthusiast' && hasEnthusiast && (
              <EnthusiastGuideView guide={exhibit.enthusiastGuide!} />
            )}
            {localMode === 'popular' && !hasPopular && (
              <FallbackContent description={exhibit.description} funFact={exhibit.funFact} />
            )}
            {localMode === 'enthusiast' && !hasEnthusiast && (
              <FallbackContent description={exhibit.description} funFact={exhibit.funFact} />
            )}
          </>
        ) : (
          <FallbackContent description={exhibit.description} funFact={exhibit.funFact} />
        )}
      </div>

      {/* Image Viewer */}
      <ImageViewer
        src={exhibit.image}
        alt={exhibit.name}
        isOpen={isViewerOpen}
        onClose={() => setIsViewerOpen(false)}
      />
    </div>
  );
}

/** 没有深度内容时的降级展示 */
function FallbackContent({ description, funFact }: { description: string; funFact?: string }) {
  return (
    <div className="popular-guide">
      <section className="guide-section">
        <h3 className="guide-section-title">展品介绍</h3>
        <p className="guide-body">{description}</p>
      </section>
      {funFact && (
        <section className="guide-section">
          <div className="fun-fact">
            <p className="text-xs font-semibold text-accent mb-1">💡 你可能不知道</p>
            <p className="text-sm leading-relaxed text-brown-light">{funFact}</p>
          </div>
        </section>
      )}
    </div>
  );
}
