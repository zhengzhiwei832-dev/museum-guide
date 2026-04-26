import { motion } from 'framer-motion';
import type { ExhibitPopularGuide } from '../data/types';

interface Props {
  guide: ExhibitPopularGuide;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.22, 1, 0.36, 1] as const,
    },
  },
};

export default function PopularGuideView({ guide }: Props) {
  return (
    <motion.div
      className="popular-guide"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Hook Card - Hero Section */}
      <motion.section className="pg-section" variants={itemVariants}>
        <div className="pg-hook-card">
          <div className="pg-hook-accent" />
          <p className="pg-hook-text">{guide.hook}</p>
        </div>
      </motion.section>

      {/* Why It Matters */}
      <motion.section className="pg-section" variants={itemVariants}>
        <div className="pg-section-header">
          <span className="pg-section-number">01</span>
          <h3 className="pg-section-title">为什么重要</h3>
        </div>
        <p className="pg-body">{guide.importance}</p>
      </motion.section>

      {/* What's Happening */}
      <motion.section className="pg-section" variants={itemVariants}>
        <div className="pg-section-header">
          <span className="pg-section-number">02</span>
          <h3 className="pg-section-title">画面在发生什么</h3>
        </div>
        <p className="pg-body">{guide.visualScene}</p>
      </motion.section>

      {/* Characters */}
      <motion.section className="pg-section" variants={itemVariants}>
        <div className="pg-section-header">
          <span className="pg-section-number">03</span>
          <h3 className="pg-section-title">人物图鉴</h3>
        </div>
        <div className="pg-characters">
          {guide.characters.map((char, i) => (
            <div key={i} className="pg-character-card">
              <div className="pg-character-avatar">
                {char.name.charAt(0)}
              </div>
              <div className="pg-character-info">
                <div className="pg-character-header">
                  <span className="pg-character-name">{char.name}</span>
                  <span className="pg-character-label">{char.label}</span>
                </div>
                <p className="pg-character-detail">{char.detail}</p>
              </div>
            </div>
          ))}
        </div>
      </motion.section>

      {/* Viewing Tips */}
      <motion.section className="pg-section" variants={itemVariants}>
        <div className="pg-section-header">
          <span className="pg-section-number">04</span>
          <h3 className="pg-section-title">专业小贴士</h3>
        </div>
        <div className="pg-tips">
          {guide.viewingTips.map((tip, i) => (
            <div key={i} className="pg-tip-item">
              <span className="pg-tip-marker">{String(i + 1).padStart(2, '0')}</span>
              <p className="pg-tip-text">{tip}</p>
            </div>
          ))}
        </div>
      </motion.section>

      {/* Hidden Facts */}
      <motion.section className="pg-section" variants={itemVariants}>
        <div className="pg-section-header">
          <span className="pg-section-icon">✦</span>
          <h3 className="pg-section-title">冷知识</h3>
        </div>
        <div className="pg-facts">
          {guide.hiddenFacts.map((fact, i) => (
            <div key={i} className="pg-fact-item">
              <span className="pg-fact-bullet" />
              <p className="pg-fact-text">{fact}</p>
            </div>
          ))}
        </div>
      </motion.section>

      {/* Challenge Card */}
      <motion.section className="pg-section" variants={itemVariants}>
        <div className="pg-challenge-card">
          <div className="pg-challenge-header">
            <span className="pg-challenge-icon">🔍</span>
            <h3 className="pg-challenge-title">寻宝挑战</h3>
          </div>
          <p className="pg-challenge-task">{guide.challenge.task}</p>
          <p className="pg-challenge-meaning">{guide.challenge.meaning}</p>
        </div>
      </motion.section>

      {/* One Liner */}
      <motion.section className="pg-section" variants={itemVariants}>
        <div className="pg-oneliner">
          <span className="pg-quote-mark">"</span>
          <p className="pg-oneliner-text">{guide.oneLiner}</p>
        </div>
      </motion.section>
    </motion.div>
  );
}
