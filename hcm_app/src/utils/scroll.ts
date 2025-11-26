import { clamp } from 'lodash';

export const smoothScrollTo = (targetY: number) => {
  const startY = window.scrollY;
  const distance = targetY - startY;
  const duration = 500; // Duration in milliseconds

  const start = 'now' in window.performance ? performance.now() : Date.now();

  const animateScroll = (currentTime: number) => {
    const timeElapsed = currentTime - start;
    const progress = clamp(timeElapsed / duration, 0, 1);

    const easeInOutQuad = (t: number) =>
      t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
    const easedProgress = easeInOutQuad(progress);

    window.scrollTo(0, startY + easedProgress * distance);

    if (timeElapsed < duration) {
      window.requestAnimationFrame(animateScroll);
    }
  };

  window.requestAnimationFrame(animateScroll);
};
