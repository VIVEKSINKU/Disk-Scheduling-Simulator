/**
 * Disk Scheduling Algorithms — pure JavaScript implementation
 * (mirrors the C implementation in c_algo/disk_scheduling.c)
 *
 * Each function returns { sequence: number[], totalDistance: number }
 */

export function fcfs(requests, initialHead) {
  const sequence = [initialHead];
  let distance = 0;
  let current = initialHead;

  for (const req of requests) {
    distance += Math.abs(req - current);
    current = req;
    sequence.push(current);
  }

  return { sequence, totalDistance: distance };
}

export function sstf(requests, initialHead) {
  const sequence = [initialHead];
  let distance = 0;
  let current = initialHead;
  const pending = [...requests];
  const served = new Array(pending.length).fill(false);

  for (let done = 0; done < pending.length; done++) {
    let bestIdx = -1;
    let bestDist = Infinity;

    for (let i = 0; i < pending.length; i++) {
      if (!served[i]) {
        const d = Math.abs(pending[i] - current);
        if (d < bestDist) {
          bestDist = d;
          bestIdx = i;
        }
      }
    }

    served[bestIdx] = true;
    distance += bestDist;
    current = pending[bestIdx];
    sequence.push(current);
  }

  return { sequence, totalDistance: distance };
}

export function scan(requests, initialHead, maxCylinder, direction = 'Up') {
  const sorted = [...requests].sort((a, b) => a - b);
  const left = sorted.filter((r) => r < initialHead);
  const right = sorted.filter((r) => r >= initialHead);

  let path;
  if (direction === 'Up') {
    path = [...right, maxCylinder - 1, ...left.reverse()];
  } else {
    path = [...[...left].reverse(), 0, ...right];
  }

  const sequence = [initialHead];
  let distance = 0;
  let current = initialHead;

  for (const p of path) {
    if (p !== current) {
      distance += Math.abs(p - current);
      current = p;
      sequence.push(current);
    }
  }

  // deduplicate consecutive
  const clean = [sequence[0]];
  for (let i = 1; i < sequence.length; i++) {
    if (sequence[i] !== clean[clean.length - 1]) clean.push(sequence[i]);
  }

  return { sequence: clean, totalDistance: distance };
}

export function cscan(requests, initialHead, maxCylinder, direction = 'Up') {
  const sorted = [...requests].sort((a, b) => a - b);
  const left = sorted.filter((r) => r < initialHead);
  const right = sorted.filter((r) => r >= initialHead);

  let path;
  if (direction === 'Up') {
    path = [...right, maxCylinder - 1, 0, ...left];
  } else {
    path = [...[...left].reverse(), 0, maxCylinder - 1, ...[...right].reverse()];
  }

  const sequence = [initialHead];
  let distance = 0;
  let current = initialHead;

  for (const p of path) {
    if (p !== current) {
      distance += Math.abs(p - current);
      current = p;
      sequence.push(current);
    }
  }

  const clean = [sequence[0]];
  for (let i = 1; i < sequence.length; i++) {
    if (sequence[i] !== clean[clean.length - 1]) clean.push(sequence[i]);
  }

  return { sequence: clean, totalDistance: distance };
}

/**
 * Run a named algorithm
 */
export function runAlgorithm(name, requests, initialHead, maxCylinder, direction) {
  switch (name) {
    case 'FCFS':
      return fcfs(requests, initialHead);
    case 'SSTF':
      return sstf(requests, initialHead);
    case 'SCAN':
      return scan(requests, initialHead, maxCylinder, direction);
    case 'C-SCAN':
      return cscan(requests, initialHead, maxCylinder, direction);
    default:
      return fcfs(requests, initialHead);
  }
}
