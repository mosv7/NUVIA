import React, { useLayoutEffect, useRef, useState } from 'react';

// Preserve the chart's Figma geometry while fitting its complete canvas to the card.
export default function ResponsiveChart({ width, height, children }) {
  const ref = useRef(null),
    [scale, setScale] = useState(1);
  useLayoutEffect(() => {
    const node = ref.current;
    const resize = () => setScale(Math.min(1, node.clientWidth / width));
    resize();
    const observer = new ResizeObserver(resize);
    observer.observe(node);
    return () => observer.disconnect();
  }, [width]);
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
