import { motion } from 'framer-motion';
import type { ExhibitEnthusiastGuide } from '../data/types';

interface Props {
  guide: ExhibitEnthusiastGuide;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.06,
      delayChildren: 0.05,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: [0.22, 1, 0.36, 1] as const,
    },
  },
};

export default function EnthusiastGuideView({ guide }: Props) {
  return (
    <motion.div
      className="enthusiast-guide"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Archive Table - Elegant Data Display */}
      <motion.section className="eg-section" variants={itemVariants}>
        <div className="eg-section-header">
          <span className="eg-section-line" />
          <h3 className="eg-section-title">作品档案</h3>
          <span className="eg-section-line" />
        </div>
        <div className="eg-archive">
          <div className="eg-archive-row">
            <span className="eg-archive-label">艺术家</span>
            <span className="eg-archive-value">{guide.archive.artist}</span>
          </div>
          <div className="eg-archive-row">
            <span className="eg-archive-label">年代</span>
            <span className="eg-archive-value">{guide.archive.year}</span>
          </div>
          <div className="eg-archive-row">
            <span className="eg-archive-label">媒介</span>
            <span className="eg-archive-value">{guide.archive.medium}</span>
          </div>
          <div className="eg-archive-row">
            <span className="eg-archive-label">尺寸</span>
            <span className="eg-archive-value">{guide.archive.dimensions}</span>
          </div>
          <div className="eg-archive-row">
            <span className="eg-archive-label">现藏地</span>
            <span className="eg-archive-value">{guide.archive.collection}</span>
          </div>
          <div className="eg-archive-row">
            <span className="eg-archive-label">委托方</span>
            <span className="eg-archive-value">{guide.archive.patron}</span>
          </div>
          <div className="eg-archive-row">
            <span className="eg-archive-label">题材</span>
            <span className="eg-archive-value">{guide.archive.genre}</span>
          </div>
        </div>
      </motion.section>

      {/* Historical Context */}
      <motion.section className="eg-section" variants={itemVariants}>
        <div className="eg-section-header">
          <span className="eg-section-line" />
          <h3 className="eg-section-title">时代背景</h3>
          <span className="eg-section-line" />
        </div>
        <div className="eg-content-block">
          <span className="eg-content-label">哲学与社会语境</span>
          <p className="eg-body">{guide.historicalContext}</p>
        </div>
      </motion.section>

      {/* Artist Phase */}
      <motion.section className="eg-section" variants={itemVariants}>
        <div className="eg-section-header">
          <span className="eg-section-line" />
          <h3 className="eg-section-title">走近艺术家</h3>
          <span className="eg-section-line" />
        </div>
        <div className="eg-content-block">
          <span className="eg-content-label">创作阶段</span>
          <p className="eg-body">{guide.artistPhase}</p>
        </div>
      </motion.section>

      {/* Visual Analysis */}
      <motion.section className="eg-section" variants={itemVariants}>
        <div className="eg-section-header">
          <span className="eg-section-line" />
          <h3 className="eg-section-title">画面解析</h3>
          <span className="eg-section-line" />
        </div>
        <div className="eg-content-block">
          <span className="eg-content-label">构图与美学视线</span>
          <p className="eg-body">{guide.visualAnalysis}</p>
        </div>
      </motion.section>

      {/* Core Elements - Visual Grid */}
      <motion.section className="eg-section" variants={itemVariants}>
        <div className="eg-section-header">
          <span className="eg-section-line" />
          <h3 className="eg-section-title">局部与图鉴</h3>
          <span className="eg-section-line" />
        </div>
        <div className="eg-elements">
          {guide.coreElements.map((el, i) => (
            <div key={i} className="eg-element-card">
              <span className="eg-element-number">{String(i + 1).padStart(2, '0')}</span>
              <h4 className="eg-element-name">{el.name}</h4>
              <div className="eg-element-details">
                <div className="eg-element-row">
                  <span className="eg-element-label">身份</span>
                  <span className="eg-element-value">{el.identity}</span>
                </div>
                <div className="eg-element-row">
                  <span className="eg-element-label">动态</span>
                  <span className="eg-element-value">{el.action}</span>
                </div>
                <div className="eg-element-row">
                  <span className="eg-element-label">象征</span>
                  <span className="eg-element-value">{el.symbolism}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </motion.section>

      {/* Thematic Core */}
      <motion.section className="eg-section" variants={itemVariants}>
        <div className="eg-section-header">
          <span className="eg-section-line" />
          <h3 className="eg-section-title">思想内核</h3>
          <span className="eg-section-line" />
        </div>
        <div className="eg-quote-block">
          <p className="eg-body">{guide.thematicCore}</p>
        </div>
      </motion.section>

      {/* Controversies */}
      <motion.section className="eg-section" variants={itemVariants}>
        <div className="eg-section-header">
          <span className="eg-section-line" />
          <h3 className="eg-section-title">解读争议</h3>
          <span className="eg-section-line" />
        </div>
        <div className="eg-content-block">
          <span className="eg-content-label">学界前沿</span>
          <div className="eg-controversies">
            {guide.controversies.map((c, i) => (
              <div key={i} className="eg-controversy-card">
                <span className="eg-controversy-school">{c.school}</span>
                <p className="eg-controversy-desc">{c.description}</p>
              </div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Hidden Details */}
      <motion.section className="eg-section" variants={itemVariants}>
        <div className="eg-section-header">
          <span className="eg-section-line" />
          <h3 className="eg-section-title">细节彩蛋</h3>
          <span className="eg-section-line" />
        </div>
        <div className="eg-details">
          {guide.hiddenDetails.map((detail, i) => (
            <div key={i} className="eg-detail-item">
              <span className="eg-detail-number">{String(i + 1).padStart(2, '0')}</span>
              <p className="eg-detail-text">{detail}</p>
            </div>
          ))}
        </div>
      </motion.section>
    </motion.div>
  );
}
