import { useState, useEffect, useRef, useLayoutEffect } from 'react';

interface PageIndicatorProps {
  total: number;
  current: number;
  onDotClick?: (index: number) => void;
  pageTitles?: string[];
}

export default function PageIndicator({ total, current, onDotClick, pageTitles }: PageIndicatorProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const longPressTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const hideTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const prevCurrent = useRef(current);
  const containerRef = useRef<HTMLDivElement>(null);
  const touchStartedOutside = useRef(false);

  // Collapse and temporarily hide the indicator when the active page changes.
  /* eslint-disable react-hooks/set-state-in-effect */
  useLayoutEffect(() => {
    if (current !== prevCurrent.current) {
      // Hide immediately on page change
      setIsExpanded(false);
      setIsVisible(false);
      prevCurrent.current = current;

      // Show compact mode after 1.5s
      if (hideTimer.current) clearTimeout(hideTimer.current);
      hideTimer.current = setTimeout(() => {
        setIsVisible(true);
      }, 1500);
    }
  }, [current]);
  /* eslint-enable react-hooks/set-state-in-effect */

  // Click to expand/collapse
  const handleClick = () => {
    setIsExpanded(!isExpanded);
    setIsVisible(true);
    
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
      longPressTimer.current = null;
    }
  };

  // Long press to expand
  const handleTouchStart = () => {
    longPressTimer.current = setTimeout(() => {
      setIsExpanded(true);
      setIsVisible(true);
    }, 300);
  };

  const handleTouchEnd = () => {
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
      longPressTimer.current = null;
    }
  };

  // Close expanded panel when clicking/touching outside
  useEffect(() => {
    if (!isExpanded) return;

    const isOutsideByCoords = (clientX: number, clientY: number): boolean => {
      if (!containerRef.current) return false;
      const rect = containerRef.current.getBoundingClientRect();
      return clientX < rect.left || clientX > rect.right ||
             clientY < rect.top || clientY > rect.bottom;
    };

    const handleMouseDown = (e: MouseEvent) => {
      const target = e.target as Node;
      if (containerRef.current && !containerRef.current.contains(target)) {
        setIsExpanded(false);
      }
    };

    const handleTouchStart = (e: TouchEvent) => {
      const touch = e.touches[0];
      if (!touch) return;
      touchStartedOutside.current = isOutsideByCoords(touch.clientX, touch.clientY);
      if (touchStartedOutside.current) {
        setIsExpanded(false);
      }
    };

    const handleTouchMove = () => {
      if (!touchStartedOutside.current) return;
      setIsExpanded(false);
    };

    document.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('touchstart', handleTouchStart);
    document.addEventListener('touchmove', handleTouchMove);
    return () => {
      document.removeEventListener('mousedown', handleMouseDown);
      document.removeEventListener('touchstart', handleTouchStart);
      document.removeEventListener('touchmove', handleTouchMove);
    };
  }, [isExpanded]);

  // Cleanup timers
  useEffect(() => {
    return () => {
      if (longPressTimer.current) clearTimeout(longPressTimer.current);
      if (hideTimer.current) clearTimeout(hideTimer.current);
    };
  }, []);

  if (total <= 1) return null;

  return (
    <div
      ref={containerRef}
      className={`page-indicator ${isExpanded ? 'expanded' : ''} ${!isVisible ? 'hidden' : ''}`}
      onClick={handleClick}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Compact mode: only show current page progress */}
      {!isExpanded && isVisible && (
        <div className="page-indicator-compact">
          <div className="page-progress-track">
            <div 
              className="page-progress-fill" 
              style={{ height: `${((current + 1) / total) * 100}%` }}
            />
          </div>
          <div className="page-current-badge">
            {current + 1}<span className="text-total">/{total}</span>
          </div>
        </div>
      )}

      {/* Expanded mode: show all dots with titles */}
      {isExpanded && (
        <div className="page-indicator-expanded">
          <div className="page-indicator-header">
            <span className="page-indicator-title">目录</span>
            <span className="page-indicator-current">
              第 {current + 1} 页 / 共 {total} 页
            </span>
          </div>
          <div className="page-dots-container">
            {Array.from({ length: total }, (_, i) => (
              <button
                key={i}
                className={`page-dot ${i === current ? 'active' : ''}`}
                onClick={(e) => {
                  e.stopPropagation();
                  onDotClick?.(i);
                }}
                aria-label={`第 ${i + 1} 页`}
              >
                <span className="page-dot-indicator" />
                <span className="page-dot-label">{pageTitles?.[i] || `第${i + 1}页`}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
