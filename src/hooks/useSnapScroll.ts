import { useEffect, useRef, useState, useCallback } from 'react';

export function useSnapScroll(totalPages: number) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [currentPage, setCurrentPage] = useState(0);

  const scrollToPage = useCallback((index: number) => {
    const container = containerRef.current;
    if (!container) return;
    const pages = container.querySelectorAll<HTMLElement>('.snap-page');
    if (pages[index]) {
      pages[index].scrollIntoView({ behavior: 'smooth' });
    }
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.intersectionRatio > 0.5) {
            const index = Number(entry.target.getAttribute('data-page-index'));
            if (!isNaN(index)) setCurrentPage(index);
          }
        });
      },
      { root: container, threshold: 0.5 }
    );

    const pages = container.querySelectorAll('.snap-page');
    pages.forEach((page) => observer.observe(page));

    return () => observer.disconnect();
  }, [totalPages]);

  return { containerRef, currentPage, scrollToPage };
}
