/**
 * Procedural feather. ViewBox 0 0 260 760: quill at the bottom, tip at the top.
 * Deterministic (seeded), so the same feather is drawn on every render.
 */

export type FeatherGeometry = { barbs: string; down: string; rachis: string };

// Rachis (shaft) as a cubic bezier, base -> tip, with a gentle S-curve.
const X = [128, 116, 158, 134];
const Y = [748, 500, 210, 16];

function bez(t: number, p: number[]) {
  const u = 1 - t;
  return u * u * u * p[0] + 3 * u * u * t * p[1] + 3 * u * t * t * p[2] + t * t * t * p[3];
}

function bezD(t: number, p: number[]) {
  const u = 1 - t;
  return 3 * u * u * (p[1] - p[0]) + 6 * u * t * (p[2] - p[1]) + 3 * t * t * (p[3] - p[2]);
}

export function rng(seed: number) {
  let s = seed >>> 0;
  return () => {
    s = (s + 0x6d2b79f5) >>> 0;
    let t = s;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const r1 = (v: number) => Math.round(v * 10) / 10;

function at(t: number) {
  const dx = bezD(t, X);
  const dy = bezD(t, Y);
  const m = Math.hypot(dx, dy) || 1;
  return { x: bez(t, X), y: bez(t, Y), tx: dx / m, ty: dy / m };
}

// Where the vane "splits", as real feathers do. u = 0 at vane base, 1 at tip.
const SPLITS: Record<number, number[]> = { 1: [0.33, 0.57, 0.8], [-1]: [0.45, 0.72] };

export function buildFeather(perSide = 118, seed = 7, shaft = 1): FeatherGeometry {
  const rand = rng(seed);
  const T0 = 0.2;
  const T1 = 0.994;
  let barbs = "";

  for (const side of [1, -1]) {
    const maxLen = side === 1 ? 90 : 72; // feathers are asymmetric
    for (let i = 0; i < perSide; i++) {
      const u = i / (perSide - 1);
      const { x, y, tx, ty } = at(T0 + (T1 - T0) * u);
      const nx = -ty * side;
      const ny = tx * side;

      let ang = 64 - 30 * u + (rand() - 0.5) * 3.2;
      for (const s of SPLITS[side]) {
        const d = u - s;
        if (d > -0.03 && d < 0) ang += 8 * (1 + d / 0.03);
        else if (d >= 0 && d < 0.028) ang -= 10 * (1 - d / 0.028);
      }

      let shape: number;
      if (u < 0.1) shape = 0.46 + 0.54 * Math.sin(((u / 0.1) * Math.PI) / 2);
      else if (u < 0.64) shape = 1 - 0.1 * ((u - 0.1) / 0.54);
      else {
        const k = (u - 0.64) / 0.36;
        shape = 0.9 * Math.sqrt(Math.max(0, 1 - k * k));
      }
      const len = maxLen * shape * (0.96 + rand() * 0.08);
      if (len < 1.5) continue;

      const a = (ang * Math.PI) / 180;
      const bx = tx * Math.cos(a) + nx * Math.sin(a);
      const by = ty * Math.cos(a) + ny * Math.sin(a);
      const ex = x + bx * len;
      const ey = y + by * len;
      // Control point pulled toward the base, so each barb sweeps tipward at its end.
      const cx = x + bx * len * 0.52 - tx * len * 0.1;
      const cy = y + by * len * 0.52 - ty * len * 0.1;
      barbs += `M${r1(x)} ${r1(y)}Q${r1(cx)} ${r1(cy)} ${r1(ex)} ${r1(ey)}`;
    }
  }

  // Downy afterfeather near the quill: short wisps that curl and droop.
  let down = "";
  for (const side of [1, -1]) {
    for (let i = 0; i < 30; i++) {
      const { x, y, tx, ty } = at(0.1 + rand() * 0.12);
      const nx = -ty * side;
      const ny = tx * side;
      const a = ((70 + rand() * 70) * Math.PI) / 180; // outward, often drooping back
      const len = 22 + rand() * 40;
      const bx = tx * Math.cos(a) + nx * Math.sin(a);
      const by = ty * Math.cos(a) + ny * Math.sin(a);
      // Perpendicular to the wisp, rotated toward the tip; most wisps curl that way.
      const px = side * by;
      const py = -side * bx;
      const curl = (0.35 + rand() * 0.65) * len * 0.55 * (rand() < 0.75 ? 1 : -1);
      const droop = len * (0.15 + rand() * 0.25);
      down +=
        `M${r1(x)} ${r1(y)}` +
        `C${r1(x + bx * len * 0.3 + px * curl * 0.35)} ${r1(y + by * len * 0.3 + py * curl * 0.35)} ` +
        `${r1(x + bx * len * 0.75 + px * curl * 0.9 - tx * droop * 0.5)} ${r1(y + by * len * 0.75 + py * curl * 0.9 - ty * droop * 0.5)} ` +
        `${r1(x + bx * len + px * curl * 0.4 - tx * droop)} ${r1(y + by * len + py * curl * 0.4 - ty * droop)}`;
    }
  }

  // Tapered shaft.
  const sideA: string[] = [];
  const sideB: string[] = [];
  for (let i = 0; i <= 56; i++) {
    const t = i / 56;
    const { x, y, tx, ty } = at(t);
    const w = (3.4 * Math.pow(1 - t, 0.85) + 0.3) * shaft;
    sideA.push(`${r1(x - ty * w)} ${r1(y + tx * w)}`);
    sideB.push(`${r1(x + ty * w)} ${r1(y - tx * w)}`);
  }
  const rachis = `M${sideA.join("L")}L${sideB.reverse().join("L")}Z`;

  return { barbs, down, rachis };
}
