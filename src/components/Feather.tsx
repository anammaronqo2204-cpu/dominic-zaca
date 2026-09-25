import { useMemo } from "react";
import { buildFeather } from "./feather-geometry";

type FeatherProps = {
  /** Unique id prefix for the gradients (several feathers live on one page). */
  uid: string;
  className?: string;
  /** Barbs per side: lower for small renders so the lines don't mush together. */
  perSide?: number;
  seed?: number;
  /** Barb stroke width in viewBox units (the viewBox is 260 × 760). */
  stroke?: number;
  /** Multiplier for the shaft's thickness. */
  shaft?: number;
};

export function Feather({ uid, className, perSide = 118, seed = 7, stroke = 1.5, shaft = 1 }: FeatherProps) {
  const g = useMemo(() => buildFeather(perSide, seed, shaft), [perSide, seed, shaft]);
  const barb = `${uid}-barb`;
  const quill = `${uid}-quill`;

  return (
    <svg viewBox="0 0 260 760" className={className} fill="none" aria-hidden="true" focusable="false">
      <defs>
        <linearGradient id={barb} gradientUnits="userSpaceOnUse" x1="0" y1="748" x2="0" y2="16">
          <stop offset="0" stopColor="#C22A6D" />
          <stop offset="0.17" stopColor="#C8416B" />
          <stop offset="0.33" stopColor="#D9A02E" />
          <stop offset="0.8" stopColor="#E8BC5C" />
          <stop offset="1" stopColor="#F7DFA2" />
        </linearGradient>
        <linearGradient id={quill} gradientUnits="userSpaceOnUse" x1="0" y1="748" x2="0" y2="16">
          <stop offset="0" stopColor="#F3E9DC" stopOpacity="0.5" />
          <stop offset="0.24" stopColor="#F2D9A0" />
          <stop offset="1" stopColor="#F7E3B0" />
        </linearGradient>
      </defs>
      <path d={g.down} stroke="#C22A6D" strokeWidth={stroke * 0.7} strokeLinecap="round" opacity={0.85} />
      <path d={g.barbs} stroke={`url(#${barb})`} strokeWidth={stroke} strokeLinecap="round" />
      <path d={g.rachis} fill={`url(#${quill})`} />
    </svg>
  );
}
