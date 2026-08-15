import { useEffect, useState } from 'react';

// Counts up from 0 to `value` when mounted (typically inside a scroll-reveal
// section). Accepts a leading "$" or trailing non-digit suffix (e.g. "$2",
// "21") and preserves it around the animated digits.
export default function AnimatedNumber({ value, duration = 1200 }) {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    let startTimestamp = null;
    const end = parseInt(value, 10);
    if (isNaN(end)) return;

    let animationFrameId;

    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      // Ease out quad
      const easeProgress = progress * (2 - progress);
      setCurrent(Math.floor(easeProgress * end));

      if (progress < 1) {
        animationFrameId = requestAnimationFrame(step);
      }
    };

    animationFrameId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(animationFrameId);
  }, [value, duration]);

  const suffix = typeof value === 'string' ? value.replace(/[0-9]/g, '') : '';
  const prefix = typeof value === 'string' ? (value.match(/^\$/) ? '$' : '') : '';
  const cleanSuffix = suffix.replace(/^\$/, '');

  return (
    <span>{prefix}{current}{cleanSuffix}</span>
  );
}
