import { useState } from 'react';
import { motion } from 'framer-motion';
import type { Exhibit } from '../data/types';

interface ExhibitCardProps {
  exhibit: Exhibit;
  index: number;
  total: number;
  label?: string;
}

export default function ExhibitCard({ exhibit, index, label }: ExhibitCardProps) {
  const [imageLoaded, setImageLoaded] = useState(false);

  return (
    <div className="snap-page bg-cream" data-page-index={index}>
      {/* Label overlay at top (not fixed, within page) */}
      <div className="absolute top-0 left-0 right-0 z-20 flex items-center justify-between px-4 page-content">
        <span className="text-xs text-white/80 font-sans tracking-wide drop-shadow-md">
          {label || '展品介绍'}
        </span>
      </div>

      {/* Image area */}
      <div className="exhibit-image-container" style={{ willChange: 'transform' }}>
        {!imageLoaded && <div className="shimmer w-full h-full absolute inset-0" />}
        <motion.img
          src={exhibit.image}
          alt={exhibit.name}
          loading="lazy"
          decoding="async"
          onLoad={() => setImageLoaded(true)}
          initial={{ opacity: 0 }}
          animate={{ opacity: imageLoaded ? 1 : 0 }}
          transition={{ duration: 0.5 }}
          className="w-full h-full object-cover"
        />
        <div className="cover-gradient" />
        {/* Exhibit name overlaid on image bottom */}
        <div className="absolute bottom-0 left-0 right-0 px-5 pb-3 z-10">
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="font-serif text-xl font-bold text-brown leading-tight"
          >
            {exhibit.name}
          </motion.h2>
          {exhibit.nameOriginal && (
            <p className="text-sm text-brown-muted mt-0.5 italic">{exhibit.nameOriginal}</p>
          )}
        </div>
      </div>

      {/* Text content area */}
      <div className="text-scroll-area">
        {/* Meta info */}
        <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-brown-muted mb-3">
          {exhibit.artist && <span>✦ {exhibit.artist}</span>}
          <span>✦ {exhibit.period}</span>
          <span>✦ {exhibit.location}</span>
          {exhibit.audioGuideNo && <span>🎧 {exhibit.audioGuideNo}</span>}
        </div>

        {/* Description */}
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="text-sm leading-relaxed text-brown-light"
        >
          {exhibit.description}
        </motion.p>

        {/* Fun fact */}
        {exhibit.funFact && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.35 }}
            className="fun-fact mt-4"
          >
            <p className="text-xs font-semibold text-accent mb-1">💡 你可能不知道</p>
            <p className="text-sm leading-relaxed text-brown-light">{exhibit.funFact}</p>
          </motion.div>
        )}
      </div>
    </div>
  );
}
