import React, { useEffect, useRef} from 'react';
import styles from './ScrollProgressBar.module.scss';   // see the CSS below

export default function ScrollProgressBar() {
  // ref that will always hold the *current* percentage
  const pctRef = useRef<number>(0);
  // ref to keep the requestAnimationFrame id so we can cancel it
  const rafRef = useRef<number | null>(null);

  // This function will be called on every scroll/resize event
  const computePercent = () => {
    const { scrollTop, scrollHeight, clientHeight } =
      document.documentElement;

    const maxScrollable = scrollHeight - clientHeight;
    const newPct = maxScrollable > 0
      ? (scrollTop / maxScrollable) * 100
      : 0;

    // Update only if the value actually changed (to avoid flicker)
    if (pctRef.current !== newPct) {
      pctRef.current = newPct;
      // directly modify the DOM element (no React state)
      const barEl = document.getElementById('reactive-scroll-bar');
      if (barEl) {
        barEl.style.width = `${newPct}%`;
      }
    }
  };

  useEffect(() => {
    // Wrapper that throttles with requestAnimationFrame
    const onScroll = () => {
      if (rafRef.current === null) {
        rafRef.current = requestAnimationFrame(() => {
          computePercent();
          rafRef.current = null;
        });
      }
    };

    window.addEventListener('scroll', onScroll);
    window.addEventListener('resize', onScroll);

    // Initial call
    computePercent();

    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <div id="reactive-scroll-bar" className={styles.scrollbar} />
  );
};