import { useState } from 'react';

const ALGORITHMS = ['FCFS', 'SSTF', 'SCAN', 'C-SCAN'];

export default function ConfigPanel({ onSimulate }) {
  const [requestInput, setRequestInput] = useState('98, 183, 37, 122, 14, 124, 65, 67');
  const [initialHead, setInitialHead] = useState(50);
  const [maxCylinder, setMaxCylinder] = useState(200);
  const [algorithm, setAlgorithm] = useState('FCFS');
  const [direction, setDirection] = useState('Up');
  const [error, setError] = useState('');

  const showDirection = algorithm === 'SCAN' || algorithm === 'C-SCAN';

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    // parse requests
    const parts = requestInput.split(',').map((s) => s.trim()).filter(Boolean);
    const parsed = parts.map(Number);

    if (parsed.some(isNaN)) {
      setError('Enter valid integers separated by commas.');
      return;
    }

    const requests = parsed.filter((r) => r >= 0 && r < maxCylinder);
    if (requests.length === 0) {
      setError('No valid requests in range [0, ' + (maxCylinder - 1) + '].');
      return;
    }

    if (initialHead < 0 || initialHead >= maxCylinder) {
      setError('Head position must be in [0, ' + (maxCylinder - 1) + '].');
      return;
    }

    onSimulate({ requests, initialHead, maxCylinder, algorithm, direction });
  };

  return (
    <aside className="sidebar glass-card">
      <div className="sidebar-logo">
        <span className="icon">💽</span>
        <h1>Disk Scheduling Simulator</h1>
      </div>
      <p className="sidebar-subtitle">Visualize &amp; compare algorithms</p>

      <form onSubmit={handleSubmit}>
        {error && (
          <div className="error-message">
            <span>⚠</span> {error}
          </div>
        )}

        <div className="form-group">
          <label className="form-label" htmlFor="requests">
            Disk Requests
          </label>
          <input
            id="requests"
            className="form-input"
            type="text"
            value={requestInput}
            onChange={(e) => setRequestInput(e.target.value)}
            placeholder="e.g. 98, 183, 37, 122"
          />
          <p className="form-hint">Comma-separated cylinder numbers</p>
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="head">
            Initial Head Position
          </label>
          <input
            id="head"
            className="form-input"
            type="number"
            min={0}
            value={initialHead}
            onChange={(e) => setInitialHead(Number(e.target.value))}
          />
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="maxcyl">
            Max Cylinder
          </label>
          <input
            id="maxcyl"
            className="form-input"
            type="number"
            min={1}
            value={maxCylinder}
            onChange={(e) => setMaxCylinder(Number(e.target.value))}
          />
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="algo">
            Algorithm
          </label>
          <select
            id="algo"
            className="form-select"
            value={algorithm}
            onChange={(e) => setAlgorithm(e.target.value)}
          >
            {ALGORITHMS.map((a) => (
              <option key={a} value={a}>
                {a}
              </option>
            ))}
          </select>
        </div>

        <div className={`direction-group ${showDirection ? 'visible' : ''}`}>
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label" htmlFor="dir">
              Direction
            </label>
            <select
              id="dir"
              className="form-select"
              value={direction}
              onChange={(e) => setDirection(e.target.value)}
            >
              <option value="Up">Up (→ higher)</option>
              <option value="Down">Down (→ lower)</option>
            </select>
          </div>
        </div>

        <div className="divider" />

        <button type="submit" className="btn-simulate" id="simulate-btn">
          ▶ &nbsp;Simulate
        </button>
      </form>
    </aside>
  );
}
