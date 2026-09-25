import { useId, useMemo, type CSSProperties } from "react";
import { rng } from "./feather-geometry";

const safeId = (id: string) => id.replace(/[^a-zA-Z0-9_-]/g, "");

const VANE = "M20.5 3.5C13 3.8 7.1 9.4 6.6 17.4c8-.4 13.6-6.3 13.9-13.9z";

/** Small feather mark: a vane split by its shaft, with a few natural notches. */
export function FeatherGlyph({ className }: { className?: string }) {
  const id = safeId(useId());
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true" focusable="false">
      <defs>
        <mask id={`${id}m`} maskUnits="userSpaceOnUse" x="0" y="0" width="24" height="24">
          <rect width="24" height="24" fill="#fff" />
          <path d="M7.6 16.4 18.6 5.4" stroke="#000" strokeWidth="0.8" strokeLinecap="round" />
          <path
            d="M10.2 7.1 12.6 7.7M7.6 11.6 9.4 12M16.9 13.6 16.3 11.3"
            stroke="#000"
            strokeWidth="1"
            strokeLinecap="round"
          />
        </mask>
      </defs>
      <path mask={`url(#${id}m)`} fill="currentColor" d={VANE} />
      <path d="M3.5 20.5 7.4 16.6" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" fill="none" />
    </svg>
  );
}

function smoothClosed(pts: Array<[number, number]>) {
  const n = pts.length;
  const f = (v: number) => v.toFixed(1);
  let d = `M${f(pts[0][0])} ${f(pts[0][1])}`;
  for (let i = 0; i < n; i++) {
    const p0 = pts[(i - 1 + n) % n];
    const p1 = pts[i];
    const p2 = pts[(i + 1) % n];
    const p3 = pts[(i + 2) % n];
    d +=
      `C${f(p1[0] + (p2[0] - p0[0]) / 6)} ${f(p1[1] + (p2[1] - p0[1]) / 6)} ` +
      `${f(p2[0] - (p3[0] - p1[0]) / 6)} ${f(p2[1] - (p3[1] - p1[1]) / 6)} ${f(p2[0])} ${f(p2[1])}`;
  }
  return `${d}Z`;
}

/** Fuchsia wax seal with a feather pressed into it. */
export function WaxSeal({ className }: { className?: string }) {
  const id = safeId(useId());
  const blob = useMemo(() => {
    const rand = rng(31);
    const n = 26;
    const pts: Array<[number, number]> = [];
    for (let i = 0; i < n; i++) {
      const a = (i / n) * Math.PI * 2;
      const rad = 53 + (rand() - 0.5) * 5 + (i % 5 === 0 ? 2.5 : 0);
      pts.push([60 + Math.cos(a) * rad, 60 + Math.sin(a) * rad]);
    }
    return smoothClosed(pts);
  }, []);

  return (
    <svg viewBox="0 0 120 120" className={className} aria-hidden="true" focusable="false">
      <defs>
        <radialGradient id={`${id}w`} cx="38%" cy="30%" r="80%">
          <stop offset="0" stopColor="#E7609A" />
          <stop offset="0.5" stopColor="#C22A6D" />
          <stop offset="1" stopColor="#7A1442" />
        </radialGradient>
      </defs>
      <path d={blob} fill={`url(#${id}w)`} />
      <circle cx="60" cy="60" r="39" fill="none" stroke="#6E0F3A" strokeWidth="3.2" opacity="0.5" />
      <circle cx="60" cy="61.2" r="39" fill="none" stroke="#F59BC0" strokeWidth="1" opacity="0.35" />
      <g transform="translate(60 60) scale(2.1) translate(-12 -12)">
        <path d={VANE} fill="#F59BC0" opacity="0.35" transform="translate(.35 .45)" />
        <path d={VANE} fill="#7A1442" opacity="0.85" />
        <path d="M3.5 20.5 17 7" stroke="#D2447F" strokeWidth=".8" strokeLinecap="round" />
      </g>
      <path
        d="M29 36c6-9 16-14 28-15"
        stroke="#fff"
        strokeOpacity=".3"
        strokeWidth="3"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  );
}

export function Heart({ className, style }: { className?: string; style?: CSSProperties }) {
  return (
    <svg viewBox="0 0 24 24" className={className} style={style} aria-hidden="true" focusable="false">
      <path
        fill="currentColor"
        d="M12 21.2s-7.7-4.7-9.8-9.5C.7 8.2 2.8 4.2 6.8 4.2c2.2 0 3.8 1.2 5.2 3.1 1.4-1.9 3-3.1 5.2-3.1 4 0 6.1 4 4.6 7.5-2.1 4.8-9.8 9.5-9.8 9.5z"
      />
    </svg>
  );
}

/** Decorative garment-tag barcode. */
export function Barcode({ className }: { className?: string }) {
  const bars = useMemo(() => {
    const rand = rng(24);
    const out: Array<{ x: number; w: number }> = [];
    let x = 0;
    while (x < 200) {
      const w = [1, 1, 2, 3][Math.floor(rand() * 4)];
      const gap = [1, 2, 2, 3][Math.floor(rand() * 4)];
      out.push({ x, w });
      x += w + gap;
    }
    return out;
  }, []);
  return (
    <svg viewBox="0 0 200 40" preserveAspectRatio="none" className={className} aria-hidden="true" focusable="false">
      {bars.map((b) => (
        <rect key={b.x} x={b.x} y="0" width={b.w} height="40" fill="currentColor" />
      ))}
    </svg>
  );
}
