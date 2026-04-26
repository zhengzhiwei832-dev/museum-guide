import { useRef, useCallback } from 'react';

/**
 * 处理嵌套滚动区域的翻页问题
 * 当内层滚动区域滚动到底部/顶部后，继续滚动应触发外层 snap 翻页
 */
export function useNestedScroll() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const touchStartY = useRef(0);
  const isAtTop = useRef(true);
  const isAtBottom = useRef(false);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    touchStartY.current = e.touches[0].clientY;
    const el = scrollRef.current;
    if (el) {
      isAtTop.current = el.scrollTop <= 0;
      isAtBottom.current = el.scrollTop + el.clientHeight >= el.scrollHeight - 1;
    }
  }, []);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    const el = scrollRef.current;
    if (!el) return;

    const touchY = e.touches[0].clientY;
    const deltaY = touchStartY.current - touchY;

    // 向上滑动（向下滚动）且已经在底部，允许外层滚动
    if (deltaY > 0 && isAtBottom.current) {
      return;
    }

    // 向下滑动（向上滚动）且已经在顶部，允许外层滚动
    if (deltaY < 0 && isAtTop.current) {
      return;
    }

    // 阻止事件冒泡，让内层滚动处理
    e.stopPropagation();
  }, []);

  const handleWheel = useCallback((e: React.WheelEvent) => {
    const el = scrollRef.current;
    if (!el) return;

    const atTop = el.scrollTop <= 0;
    const atBottom = el.scrollTop + el.clientHeight >= el.scrollHeight - 1;

    // 向下滚动且已经在底部，允许外层滚动
    if (e.deltaY > 0 && atBottom) {
      return;
    }

    // 向上滚动且已经在顶部，允许外层滚动
    if (e.deltaY < 0 && atTop) {
      return;
    }

    // 阻止事件冒泡
    e.stopPropagation();
  }, []);

  return {
    scrollRef,
    scrollProps: {
      onTouchStart: handleTouchStart,
      onTouchMove: handleTouchMove,
      onWheel: handleWheel,
    },
  };
}
