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

    // Use IntersectionObserver to track current page
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.intersectionRatio > 0.5) {
            const index = Number(entry.target.getAttribute('data-page-index'));
            if (!isNaN(index)) {
              updateCurrentPage(index);
            }
          }
        });
      },
      {
        root: container,
        threshold: [0.5, 0.75],
        rootMargin: '0px'
      }
    );

    const pages = container.querySelectorAll('.snap-page');
    pages.forEach((page) => observer.observe(page));

    return () => {
      observer.disconnect();
      if (rafId.current !== null) {
        cancelAnimationFrame(rafId.current);
      }
    };
  }, [totalPages, updateCurrentPage]);

  return { containerRef, currentPage, scrollToPage };
}
