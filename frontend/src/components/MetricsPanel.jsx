import { useEffect, useRef, useState } from 'react';

function AnimatedNumber({ value, decimals = 0, duration = 600 }) {
  const [display, setDisplay] = useState(0);
  const raf = useRef(null);
  const start = useRef(null);
  const from = useRef(0);

  useEffect(() => {
    from.current = display;
    start.current = null;

    const animate = (ts) => {
      if (!start.current) start.current = ts;
      const progress = Math.min((ts - start.current) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
      setDisplay(from.current + (value - from.current) * eased);
      if (progress < 1) raf.current = requestAnimationFrame(animate);
    };

    raf.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(raf.current);

  }, [value, duration]);

  return <>{decimals > 0 ? display.toFixed(decimals) : Math.round(display)}</>;
}

export default function MetricsPanel({ totalDistance, avgSeekTime, throughput }) {
  return (
    <div className="metrics-grid">
      <div className="metric-card glass-card animate-in">
        <div className="metric-label">Total Seek Distance</div>
        <div className="metric-value">
          <AnimatedNumber value={totalDistance} />
        </div>
        <div className="metric-unit">cylinders</div>
      </div>

      <div className="metric-card glass-card animate-in">
        <div className="metric-label">Avg. Seek Time</div>
        <div className="metric-value">
          <AnimatedNumber value={avgSeekTime} decimals={2} />
        </div>
        <div className="metric-unit">cylinders / request</div>
      </div>

      <div className="metric-card glass-card animate-in">
        <div className="metric-label">Throughput</div>
        <div className="metric-value">
          <AnimatedNumber value={throughput} decimals={4} />
        </div>
        <div className="metric-unit">requests / cylinder</div>
      </div>
    </div>
  );
}
