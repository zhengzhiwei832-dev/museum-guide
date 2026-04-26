import { useState, useRef, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface ImageViewerProps {
  src: string;
  alt: string;
  isOpen: boolean;
  onClose: () => void;
}

export default function ImageViewer({ src, alt, isOpen, onClose }: ImageViewerProps) {
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [isSwipingToClose, setIsSwipingToClose] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const pinchStartDistance = useRef(0);
  const pinchStartScale = useRef(1);
  const dragStartPos = useRef({ x: 0, y: 0 });
  const touchStartY = useRef(0);
  const touchStartX = useRef(0);
  const swipeStartTime = useRef(0);

  // Reset state when opening
  useEffect(() => {
    if (isOpen) {
      setScale(1);
      setPosition({ x: 0, y: 0 });
    }
  }, [isOpen]);

  // Handle close on escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Prevent body scroll when viewer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Calculate distance between two touch points
  const getTouchDistance = (touches: React.TouchList | TouchList) => {
    if (touches.length < 2) return 0;
    const dx = touches[0].clientX - touches[1].clientX;
    const dy = touches[0].clientY - touches[1].clientY;
    return Math.sqrt(dx * dx + dy * dy);
  };

  // Handle pinch zoom (touch) and swipe to close
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    if (e.touches.length === 2) {
      pinchStartDistance.current = getTouchDistance(e.touches);
      pinchStartScale.current = scale;
    } else if (e.touches.length === 1) {
      touchStartY.current = e.touches[0].clientY;
      touchStartX.current = e.touches[0].clientX;
      swipeStartTime.current = Date.now();
      setIsSwipingToClose(false);
    }
  }, [scale]);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (e.touches.length === 2) {
      e.preventDefault();
      const currentDistance = getTouchDistance(e.touches);
      const scaleRatio = currentDistance / pinchStartDistance.current;
      const newScale = Math.min(Math.max(pinchStartScale.current * scaleRatio, 1), 4);
      setScale(newScale);
    } else if (e.touches.length === 1 && scale === 1) {
      // Swipe to close when not zoomed
      const deltaY = e.touches[0].clientY - touchStartY.current;
      const deltaX = Math.abs(e.touches[0].clientX - touchStartX.current);

      // If swiping down more than 10px and mostly vertical
      if (deltaY > 10 && deltaX < deltaY) {
        setIsSwipingToClose(true);
        setPosition({ x: 0, y: deltaY * 0.5 });
      }
    }
  }, [scale]);

  const handleTouchEnd = useCallback(() => {
    if (isSwipingToClose) {
      const deltaY = position.y;
      const swipeDuration = Date.now() - swipeStartTime.current;
      const velocity = deltaY / swipeDuration;

      // Close if swiped down enough or fast enough
      if (deltaY > 80 || velocity > 0.5) {
        onClose();
      } else {
        // Snap back
        setPosition({ x: 0, y: 0 });
        setIsSwipingToClose(false);
      }
    }
  }, [isSwipingToClose, position.y, onClose]);

  // Handle double tap to zoom
  const lastTap = useRef(0);
  const handleTap = useCallback(() => {
    const now = Date.now();
    const diff = now - lastTap.current;
    lastTap.current = now;

    if (diff < 300) {
      // Double tap
      if (scale > 1) {
        setScale(1);
        setPosition({ x: 0, y: 0 });
      } else {
        setScale(2);
      }
    }
  }, [scale]);

  // Handle mouse wheel zoom
  const handleWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? 0.9 : 1.1;
    const newScale = Math.min(Math.max(scale * delta, 1), 4);
    setScale(newScale);
    if (newScale === 1) {
      setPosition({ x: 0, y: 0 });
    }
  }, [scale]);

  // Handle drag when zoomed
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (scale > 1) {
      setIsDragging(true);
      dragStartPos.current = {
        x: e.clientX - position.x,
        y: e.clientY - position.y
      };
    }
  }, [scale, position]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (isDragging && scale > 1) {
      const maxOffsetX = (containerRef.current?.clientWidth || 0) * (scale - 1) / 2;
      const maxOffsetY = (containerRef.current?.clientHeight || 0) * (scale - 1) / 2;

      const newX = Math.min(Math.max(e.clientX - dragStartPos.current.x, -maxOffsetX), maxOffsetX);
      const newY = Math.min(Math.max(e.clientY - dragStartPos.current.y, -maxOffsetY), maxOffsetY);

      setPosition({ x: newX, y: newY });
    }
  }, [isDragging, scale]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  // Close on background click
  const handleBackgroundClick = useCallback((e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  }, [onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center"
          onClick={handleBackgroundClick}
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 w-11 h-11 flex items-center justify-center rounded-full bg-white/10 text-white/80 hover:bg-white/20 transition-colors"
            aria-label="关闭"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* Done button */}
          <button
            onClick={onClose}
            className="absolute bottom-6 left-6 z-10 px-5 py-2.5 rounded-full bg-white/15 text-white/90 text-sm font-medium hover:bg-white/25 transition-colors"
          >
            完成
          </button>

          {/* Zoom controls */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-3 z-10">
            <button
              onClick={() => {
                const newScale = Math.max(scale * 0.8, 1);
                setScale(newScale);
                if (newScale === 1) setPosition({ x: 0, y: 0 });
              }}
              className="w-10 h-10 flex items-center justify-center rounded-full bg-white/10 text-white/80 hover:bg-white/20 transition-colors"
              aria-label="缩小"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
              </svg>
            </button>
            <span className="text-white/60 text-sm min-w-[60px] text-center">
              {Math.round(scale * 100)}%
            </span>
            <button
              onClick={() => setScale(Math.min(scale * 1.2, 4))}
              className="w-10 h-10 flex items-center justify-center rounded-full bg-white/10 text-white/80 hover:bg-white/20 transition-colors"
              aria-label="放大"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </button>
          </div>

          {/* Hint text */}
          <div className="absolute top-16 left-0 right-0 text-center pointer-events-none">
            <p className="text-white/40 text-xs">
              双击缩放 · 双指捏合 · 拖动查看 · 向下滑动退出
            </p>
          </div>

          {/* Image container */}
          <div
            ref={containerRef}
            className="w-full h-full flex items-center justify-center overflow-hidden"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onWheel={handleWheel}
          >
            <motion.img
              src={src}
              alt={alt}
              className={`max-w-full max-h-full object-contain transition-transform ${isDragging ? 'cursor-grabbing' : scale > 1 ? 'cursor-grab' : isSwipingToClose ? 'cursor-grabbing' : 'cursor-zoom-in'}`}
              style={{
                transform: `scale(${scale}) translate(${position.x / scale}px, ${position.y / scale}px)`,
                touchAction: 'none',
                opacity: isSwipingToClose ? 1 - Math.min(position.y / 200, 0.5) : 1,
              }}
              onClick={handleTap}
              draggable={false}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
