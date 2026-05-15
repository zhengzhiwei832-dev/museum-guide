import { useEffect, useRef, useState, useCallback } from 'react';

export function useSnapScroll(totalPages: number) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const rafId = useRef<number | null>(null);
  const pendingIndex = useRef<number | null>(null);

  // RAF-throttled state update to reduce render pressure
  const updateCurrentPage = useCallback((index: number) => {
    if (pendingIndex.current === index) return;
    pendingIndex.current = index;

    if (rafId.current === null) {
      rafId.current = requestAnimationFrame(() => {
        if (pendingIndex.current !== null) {
          setCurrentPage(pendingIndex.current);
          pendingIndex.current = null;
        }
        rafId.current = null;
      });
    }
  }, []);

  const scrollToPage = useCallback((index: number) => {
    const container = containerRef.current;
    if (!container) return;
    const pages = container.querySelectorAll<HTMLElement>('.snap-page');
    if (pages[index]) {
      pages[index].scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let scrollRafId: number;
    const handleScroll = () => {
      cancelAnimationFrame(scrollRafId);
      scrollRafId = requestAnimationFrame(() => {
        const pageHeight = container.clientHeight;
        const scrollTop = container.scrollTop;
        const maxScroll = container.scrollHeight - pageHeight;

        // At the very bottom, always show the last page
        if (maxScroll > 0 && scrollTop >= maxScroll - 2) {
          updateCurrentPage(totalPages - 1);
          return;
        }

        const index = Math.round(scrollTop / pageHeight);
        updateCurrentPage(Math.max(0, Math.min(index, totalPages - 1)));
      });
    };

    container.addEventListener('scroll', handleScroll, { passive: true });
    // Initialise on mount in case we are not at page 0
    handleScroll();

    return () => {
      container.removeEventListener('scroll', handleScroll);
      cancelAnimationFrame(scrollRafId);
      if (rafId.current !== null) {
        cancelAnimationFrame(rafId.current);
      }
    };
  }, [totalPages, updateCurrentPage]);

  return { containerRef, currentPage, scrollToPage };
}
