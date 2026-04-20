import { useState } from 'react';
import ConfigPanel from './components/ConfigPanel';
import MetricsPanel from './components/MetricsPanel';
import MovementChart from './components/MovementChart';
import SequenceTable from './components/SequenceTable';
import { runAlgorithm } from './algo';

export default function App() {
  const [result, setResult] = useState(null);
  const [config, setConfig] = useState(null);

  const handleSimulate = (cfg) => {
    const { requests, initialHead, maxCylinder, algorithm, direction } = cfg;
    const res = runAlgorithm(algorithm, requests, initialHead, maxCylinder, direction);

    const avgSeekTime = requests.length > 0 ? res.totalDistance / requests.length : 0;
    const throughput = res.totalDistance > 0 ? requests.length / res.totalDistance : 0;

    setConfig(cfg);
    setResult({ ...res, avgSeekTime, throughput });
  };

  return (
    <>
      {/* background glow effects */}
      <div className="bg-glow bg-glow-1" />
      <div className="bg-glow bg-glow-2" />

      <div className="app-container">
        <ConfigPanel onSimulate={handleSimulate} />

        <main className="main-content">
          {result ? (
            <>
              <MetricsPanel
                totalDistance={result.totalDistance}
                avgSeekTime={result.avgSeekTime}
                throughput={result.throughput}
              />
              <MovementChart
                sequence={result.sequence}
                maxCylinder={config.maxCylinder}
                algorithm={config.algorithm}
              />
              <SequenceTable sequence={result.sequence} />
            </>
          ) : (
            <div className="glass-card empty-state animate-in">
              <span className="icon">💽</span>
              <p>
                Configure your disk requests and choose an algorithm, then hit{' '}
                <strong>Simulate</strong> to visualize the head movement.
              </p>
            </div>
          )}
        </main>
      </div>
    </>
  );
}
