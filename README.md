# 💽 Disk Scheduling Simulator

A visual simulator for disk scheduling algorithms built with **C** (algorithm engine) and **React** (interactive UI). Compare how different scheduling strategies affect seek time, throughput, and head movement patterns.

## About

Operating systems use disk scheduling algorithms to determine the order in which disk I/O requests are serviced. The choice of algorithm directly impacts system performance. This simulator lets you visualize and compare four classic algorithms side-by-side with real-time metrics and interactive charts.

---

## Algorithms Implemented

| Algorithm | Description |
|-----------|-------------|
| **FCFS** | First Come First Served — requests are processed in the order they arrive |
| **SSTF** | Shortest Seek Time First — the nearest pending request is served next |
| **SCAN** | Elevator Algorithm — the head moves in one direction servicing requests, reverses at the boundary |
| **C-SCAN** | Circular SCAN — like SCAN but jumps back to the start after reaching the boundary |

Each algorithm is implemented in both **C** (`c_algo/`) for native execution and **JavaScript** (`frontend/src/algo.js`) for browser-based simulation.

---
## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18+)
- GCC (optional — for running the C algorithms natively)

### Run the React Frontend

```bash
cd frontend
npm install
npm run dev
```
### Compile & Run the C Algorithms (Optional)

```bash
cd c_algo
gcc -O2 -o disk_sched disk_scheduling.c -lm
./disk_sched
```

This runs a built-in test with requests `[98, 183, 37, 122, 14, 124, 65, 67]`, head position `50`, and max cylinder `200`.

---

## How to Use

1. **Enter disk requests** — comma-separated cylinder numbers (e.g., `98, 183, 37, 122, 14, 124, 65, 67`)
2. **Set initial head position** — where the disk head starts (e.g., `50`)
3. **Set max cylinder** — total number of cylinders on the disk (e.g., `200`)
4. **Choose an algorithm** — FCFS, SSTF, SCAN, or C-SCAN
5. **Select direction** (for SCAN/C-SCAN) — Up or Down
6. **Click Simulate** — view the results instantly

---

## Metrics Displayed

| Metric | Formula | Description |
|--------|---------|-------------|
| **Total Seek Distance** | Σ\|current - next\| | Total cylinders traversed by the head |
| **Avg. Seek Time** | Total Distance / Number of Requests | Average distance per request |
| **Throughput** | Number of Requests / Total Distance | Requests serviced per cylinder of movement |

---

## Design Features

- Dark navy/purple gradient background with glassmorphism cards
- Inter + JetBrains Mono typography
- Animated metric counters with smooth interpolation
- Interactive Chart.js visualization with per-step seek tooltips
- Responsive layout — works on desktop and mobile
- Direction selector auto-shows/hides for SCAN and C-SCAN

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Algorithm Engine | C (ISO C11) |
| Frontend Framework | React 19 |
| Build Tool | Vite |
| Charting | Chart.js + react-chartjs-2 |
| Styling | Vanilla CSS (custom design system) |
| Fonts | Google Fonts (Inter, JetBrains Mono) |

---

## License

This project is open source and available for educational use.

---
