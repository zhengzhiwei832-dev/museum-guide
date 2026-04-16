import { useState, useEffect, useRef } from 'react';

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

  // Hide indicator on page change, show compact after delay
  useEffect(() => {
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
