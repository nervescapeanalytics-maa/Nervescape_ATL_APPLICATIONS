import { CSSProperties } from 'react';

// Nervescape "NA" monogram — split circular emblem.
export default function Logo({ size = 36, style }: { size?: number; style?: CSSProperties }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="Nervescape Analytics"
      style={style}
    >
      <defs>
        <linearGradient id="nv-silver" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#ffffff" />
          <stop offset="0.5" stopColor="#cfd8e3" />
          <stop offset="1" stopColor="#8a97a8" />
        </linearGradient>
        <linearGradient id="nv-dark" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#1e88e5" />
          <stop offset="1" stopColor="#0a3d6e" />
        </linearGradient>
      </defs>
      {/* outer ring */}
      <circle cx="50" cy="50" r="46" fill="none" stroke="url(#nv-silver)" strokeWidth="5" />
      {/* split halves background */}
      <path d="M50 8 A42 42 0 0 0 50 92 Z" fill="url(#nv-dark)" opacity="0.92" />
      <path d="M50 8 A42 42 0 0 1 50 92 Z" fill="url(#nv-silver)" opacity="0.18" />
      {/* center divider */}
      <rect x="48.5" y="12" width="3" height="76" rx="1.5" fill="url(#nv-silver)" />
      {/* N */}
      <path
        d="M22 70 L22 34 L29 34 L42 56 L42 34 L48 34 L48 70 L41 70 L29 48 L29 70 Z"
        fill="url(#nv-silver)"
      />
      {/* A */}
      <path
        d="M52 70 L63 34 L70 34 L81 70 L74 70 L72 62 L61 62 L59 70 Z M63 56 L70 56 L66.5 43 Z"
        fill="url(#nv-silver)"
      />
    </svg>
  );
}
