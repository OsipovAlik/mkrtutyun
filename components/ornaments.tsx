import type { SVGProps } from "react";

type OrnamentProps = SVGProps<SVGSVGElement>;

/** A blossoming Armenian cross with trefoil terminals, as on khachkars. */
export function ArmenianCross(props: OrnamentProps) {
  const tip = (cx: number, cy: number, dx: number, dy: number) => (
    <g>
      <circle cx={cx + dx * 1.6} cy={cy + dy * 1.6} r="1.9" />
      <circle cx={cx - dy * 2.4 + dx * -0.4} cy={cy - dx * 2.4 + dy * -0.4} r="1.9" />
      <circle cx={cx + dy * 2.4 + dx * -0.4} cy={cy + dx * 2.4 + dy * -0.4} r="1.9" />
    </g>
  );
  return (
    <svg viewBox="0 0 40 56" fill="currentColor" aria-hidden="true" {...props}>
      <g stroke="currentColor" strokeWidth="2.6" strokeLinecap="round">
        <line x1="20" y1="6" x2="20" y2="48" />
        <line x1="6" y1="20" x2="34" y2="20" />
      </g>
      {tip(20, 6, 0, -1)}
      {tip(20, 48, 0, 1)}
      {tip(6, 20, -1, 0)}
      {tip(34, 20, 1, 0)}
      <circle cx="20" cy="20" r="3.4" fill="none" stroke="currentColor" strokeWidth="1.2" />
    </svg>
  );
}

/** Armenian eternity sign (Arevakhach) inside a carved rosette. */
export function EternityRosette(props: OrnamentProps) {
  const arms = Array.from({ length: 8 }, (_, i) => i * 45);
  return (
    <svg viewBox="-60 -60 120 120" fill="none" stroke="currentColor" aria-hidden="true" {...props}>
      <circle r="57" strokeWidth="0.6" />
      <circle r="52" strokeWidth="1.6" strokeDasharray="0.1 4.2" strokeLinecap="round" />
      <circle r="47" strokeWidth="0.6" />
      {Array.from({ length: 16 }, (_, i) => (
        <path
          key={i}
          d="M0 -47 C 6 -40, 6 -33, 0 -28 C -6 -33, -6 -40, 0 -47 Z"
          transform={`rotate(${i * 22.5})`}
          strokeWidth="0.6"
        />
      ))}
      <circle r="27" strokeWidth="0.6" />
      {arms.map((deg) => (
        <path
          key={deg}
          d="M0 0 C 4 -3, 9 -10, 6 -20 C 4 -24, 0 -24, -1 -21 C 3 -17, 3 -9, 0 0 Z"
          transform={`rotate(${deg})`}
          fill="currentColor"
          fillOpacity="0.85"
          stroke="none"
        />
      ))}
      <circle r="2.2" fill="currentColor" stroke="none" />
    </svg>
  );
}

/** Two-strand braid, the classic border of khachkar carvings. */
export function BraidBand({ className, ...props }: OrnamentProps) {
  return (
    <svg
      className={className}
      height="12"
      width="100%"
      fill="none"
      stroke="currentColor"
      aria-hidden="true"
      preserveAspectRatio="none"
      {...props}
    >
      <defs>
        <pattern id="braid" width="24" height="12" patternUnits="userSpaceOnUse">
          <path d="M0 6 C 4 0, 8 0, 12 6 S 20 12, 24 6" strokeWidth="0.8" />
          <path d="M0 6 C 4 12, 8 12, 12 6 S 20 0, 24 6" strokeWidth="0.8" />
          <circle cx="6" cy="6" r="0.9" fill="currentColor" stroke="none" />
          <circle cx="18" cy="6" r="0.9" fill="currentColor" stroke="none" />
        </pattern>
      </defs>
      <rect width="100%" height="12" fill="url(#braid)" stroke="none" />
    </svg>
  );
}

/** A slender olive sprig. Mirror it with `-scale-x-100`. */
export function OliveBranch(props: OrnamentProps) {
  const leaves: [number, number, number][] = [
    [18, 27, -35],
    [30, 21, 30],
    [42, 18, -28],
    [55, 13, 26],
    [67, 11, -22],
    [80, 8, 20],
    [92, 7, -14],
  ];
  return (
    <svg viewBox="0 0 110 36" fill="none" stroke="currentColor" aria-hidden="true" {...props}>
      <path d="M4 32 C 30 24, 60 12, 106 6" strokeWidth="0.9" strokeLinecap="round" />
      {leaves.map(([x, y, r], i) => (
        <g key={i} transform={`translate(${x} ${y}) rotate(${r + (r < 0 ? -40 : 40)})`}>
          <path d="M0 0 C 3 -3, 9 -3, 13 0 C 9 3, 3 3, 0 0 Z" fill="currentColor" fillOpacity="0.18" strokeWidth="0.7" />
          <path d="M1 0 L 12 0" strokeWidth="0.35" />
        </g>
      ))}
      <circle cx="104" cy="11" r="2.1" fill="currentColor" fillOpacity="0.35" strokeWidth="0.6" />
    </svg>
  );
}

/** Hairline — small cross — hairline. */
export function CrossDivider({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center justify-center gap-4 ${className}`} aria-hidden="true">
      <span className="h-px w-12 bg-gradient-to-r from-transparent to-current opacity-60 sm:w-20" />
      <ArmenianCross className="h-5 w-auto" />
      <span className="h-px w-12 bg-gradient-to-l from-transparent to-current opacity-60 sm:w-20" />
    </div>
  );
}

/** Corner flourish for framed panels. Rotate per corner. */
export function CornerFlourish(props: OrnamentProps) {
  return (
    <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" aria-hidden="true" {...props}>
      <path d="M2 46 V10 C2 5, 5 2, 10 2 H46" strokeWidth="0.9" />
      <path d="M8 46 V16 C8 11.5, 11.5 8, 16 8 H46" strokeWidth="0.5" />
      <path d="M14 14 C 18 18, 22 18, 26 14 C 22 10, 18 10, 14 14 Z" strokeWidth="0.6" transform="rotate(45 20 14)" />
      <circle cx="8" cy="8" r="1.4" fill="currentColor" stroke="none" />
    </svg>
  );
}
