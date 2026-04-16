import { motion } from 'framer-motion';
import type { Route } from '../data/types';

interface TimeSelectorProps {
  routes: Route[];
  onSelect: (route: Route) => void;
}

export default function TimeSelector({ routes, onSelect }: TimeSelectorProps) {
  return (
    <div className="snap-page bg-cream flex flex-col items-center justify-center px-6" data-page-index={0}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-8"
      >
        <span className="text-3xl mb-3 block">⏱</span>
        <h2 className="font-serif text-xl font-bold text-brown mb-2">你今天有多少时间？</h2>
        <p className="text-sm text-brown-muted">选择游览时长，我来帮你规划最佳路线</p>
      </motion.div>

      <div className="w-full max-w-sm space-y-3">
        {routes.map((route, i) => (
          <motion.button
            key={route.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.15 + i * 0.1 }}
            onClick={() => onSelect(route)}
            className="w-full text-left p-4 min-h-[56px] rounded-xl bg-white/70 border border-brown/5 
                       hover:bg-white hover:border-accent/20 transition-all duration-300
                       active:scale-[0.98]"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-semibold text-brown">{route.durationLabel}</h3>
                <p className="text-xs text-brown-muted mt-1 line-clamp-1">{route.overview}</p>
              </div>
              <span className="text-brown-muted text-lg ml-3">→</span>
            </div>
          </motion.button>
        ))}
      </div>
    </div>
  );
}
