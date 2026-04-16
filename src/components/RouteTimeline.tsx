import { motion } from 'framer-motion';
import type { RouteStop } from '../data/types';

interface RouteTimelineProps {
  stops: RouteStop[];
}

export default function RouteTimeline({ stops }: RouteTimelineProps) {
  return (
    <div className="relative pl-10">
      <div className="timeline-line" />
      {stops.map((stop, i) => (
        <motion.div
          key={stop.order}
          initial={{ opacity: 0, x: -10 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.35, delay: i * 0.06 }}
          className="relative pb-5 last:pb-0"
        >
          <div className="absolute left-[-1.625rem]">
            <div className="timeline-dot" />
          </div>
          <div className="bg-white/60 rounded-lg p-3 border border-brown/5">
            <div className="flex items-center justify-between mb-1">
              <h4 className="text-sm font-semibold text-brown">
                {stop.order}. {stop.exhibitName}
              </h4>
              <span className="text-xs text-accent font-medium flex-shrink-0 ml-2">{stop.stayMinutes}分钟</span>
            </div>
            {stop.tip && (
              <p className="text-xs text-brown-muted leading-relaxed">{stop.tip}</p>
            )}
          </div>
        </motion.div>
      ))}
    </div>
  );
}
