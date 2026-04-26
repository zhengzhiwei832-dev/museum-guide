import { motion } from 'framer-motion';
import type { GuideMode } from '../context/GuidePreferenceContext';

interface Props {
  mode: GuideMode;
  onChange: (mode: GuideMode) => void;
}

export default function GuideModeTabs({ mode, onChange }: Props) {
  return (
    <div className="guide-mode-selector-compact">
      <div className="guide-mode-tabs-compact">
        {/* Background pill that slides */}
        <motion.div
          className="guide-mode-pill-compact"
          layoutId="guideModePillCompact"
          initial={false}
          animate={{
            x: mode === 'popular' ? 0 : '100%',
          }}
          transition={{
            type: 'spring',
            stiffness: 500,
            damping: 35,
          }}
        />

        {/* Popular tab */}
        <button
          className={`guide-mode-tab-compact ${mode === 'popular' ? 'active' : ''}`}
          onClick={() => onChange('popular')}
        >
          <span className="tab-icon-compact">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
            </svg>
          </span>
          <span className="tab-label-compact">大众版</span>
        </button>

        {/* Enthusiast tab */}
        <button
          className={`guide-mode-tab-compact ${mode === 'enthusiast' ? 'active' : ''}`}
          onClick={() => onChange('enthusiast')}
        >
          <span className="tab-icon-compact">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </span>
          <span className="tab-label-compact">爱好者版</span>
        </button>
      </div>
    </div>
  );
}
