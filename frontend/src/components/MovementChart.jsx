import { useMemo } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Filler);

export default function MovementChart({ sequence, maxCylinder, algorithm }) {
  const data = useMemo(
    () => ({
      labels: sequence.map((_, i) => `Step ${i}`),
      datasets: [
        {
          label: 'Head Position',
          data: sequence,
          borderColor: '#6366f1',
          backgroundColor: 'rgba(99, 102, 241, 0.08)',
          pointBackgroundColor: sequence.map((_, i) =>
            i === 0 ? '#34d399' : '#ec4899'
          ),
          pointBorderColor: '#fff',
          pointBorderWidth: 2,
          pointRadius: sequence.map((_, i) => (i === 0 ? 8 : 6)),
          pointHoverRadius: 10,
          borderWidth: 2.5,
          tension: 0,
          fill: true,
        },
      ],
    }),
    [sequence]
  );

  const options = useMemo(
    () => ({
      responsive: true,
      maintainAspectRatio: false,
      indexAxis: 'y',
      animation: {
        duration: 1200,
        easing: 'easeInOutQuart',
      },
      interaction: {
        mode: 'nearest',
        intersect: false,
      },
      plugins: {
        title: { display: false },
        legend: { display: false },
        tooltip: {
          backgroundColor: 'rgba(10, 14, 26, 0.95)',
          titleColor: '#f1f5f9',
          bodyColor: '#94a3b8',
          borderColor: 'rgba(99, 102, 241, 0.3)',
          borderWidth: 1,
          padding: 12,
          cornerRadius: 8,
          titleFont: { family: "'Inter', sans-serif", weight: 600, size: 13 },
          bodyFont: { family: "'JetBrains Mono', monospace", size: 12 },
          callbacks: {
            title: (items) => `Step ${items[0].dataIndex}`,
            label: (item) => `Cylinder: ${item.raw}`,
            afterLabel: (item) => {
              if (item.dataIndex === 0) return '(start)';
              const prev = sequence[item.dataIndex - 1];
              return `Seek: ${Math.abs(item.raw - prev)} cylinders`;
            },
          },
        },
      },
      scales: {
        x: {
          title: {
            display: true,
            text: 'Track / Cylinder Number',
            color: '#64748b',
            font: { family: "'Inter', sans-serif", size: 12, weight: 500 },
          },
          min: -5,
          max: maxCylinder + 5,
          ticks: {
            color: '#475569',
            font: { family: "'JetBrains Mono', monospace", size: 10 },
            stepSize: Math.max(1, Math.round(maxCylinder / 20)),
          },
          grid: {
            color: 'rgba(99, 102, 241, 0.06)',
          },
        },
        y: {
          reverse: true,
          title: {
            display: true,
            text: 'Time (Steps)',
            color: '#64748b',
            font: { family: "'Inter', sans-serif", size: 12, weight: 500 },
          },
          ticks: {
            color: '#475569',
            font: { family: "'JetBrains Mono', monospace", size: 10 },
          },
          grid: {
            display: false,
          },
        },
      },
    }),
    [maxCylinder, sequence]
  );

  return (
    <div className="chart-card glass-card animate-in">
      <h2>
        <span className="dot" />
        Head Movement Visualization
        <span className="algo-badge">{algorithm}</span>
      </h2>
      <div className="chart-wrapper">
        <Line data={data} options={options} />
      </div>
    </div>
  );
}
