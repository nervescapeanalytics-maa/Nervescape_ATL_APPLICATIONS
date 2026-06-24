import { CSSProperties } from 'react';
import logoImg from '../assets/rtp-logo.png';

export default function Logo({ size = 36, style }: { size?: number; style?: CSSProperties }) {
  return (
    <img
      src={logoImg}
      alt="Robo TinkerPreneur"
      width={size}
      height={size}
      style={{ objectFit: 'contain', flexShrink: 0, ...style }}
    />
  );
}

/** Shared brand lockup for nav / footer / login */
export function BrandName() {
  return (
    <span className="rb-brand-name">
      Robo <b>Tinker</b>Preneur
    </span>
  );
}
