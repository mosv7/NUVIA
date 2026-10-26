import { useLayoutEffect, useRef, useState } from 'react';

// Preserve the chart's Figma geometry while fitting its complete canvas to the card.
export default function ResponsiveChart({ width, height, children, fillDesktop = false }) {
  const ref = useRef(null),
    [scale, setScale] = useState(1);
  useLayoutEffect(() => {
    const node = ref.current;
    const resize = () => {
      const availableScale = node.clientWidth / width;
      setScale(
        fillDesktop && window.innerWidth > 850 ? availableScale : Math.min(1, availableScale),
      );
    };
    resize();
    const observer = new ResizeObserver(resize);
    observer.observe(node);
    window.addEventListener('resize', resize);
    return () => {
      observer.disconnect();
      window.removeEventListener('resize', resize);
    };
  }, [width, fillDesktop]);
  return (
    <div
      ref={ref}
      className="responsive-chart"
      style={{ height: height * scale, '--chart-width': width + 'px' }}
    >
      <div
        className="responsive-chart-canvas"
        style={{ width, height, transform: `scale(${scale})` }}
      >
        {children}
      </div>
    </div>
  );
}
