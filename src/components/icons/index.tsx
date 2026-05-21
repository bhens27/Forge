import type { CSSProperties } from 'react';

interface SvgProps {
  children: React.ReactNode;
  size?: number;
  color?: string;
  sw?: number;
  style?: CSSProperties;
}

const Svg = ({ children, size = 18, color = 'currentColor', sw = 2, style = {} }: SvgProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth={sw}
    strokeLinecap="round"
    strokeLinejoin="round"
    style={style}
  >
    {children}
  </svg>
);

export type IconProps = Omit<SvgProps, 'children'>;

export const I = {
  Dumbbell: (p: IconProps) => <Svg {...p}><path d="M6.5 6.5h11" /><path d="M6.5 17.5h11" /><path d="M14 12h-4" /><rect x="2" y="9" width="3" height="6" rx="1" /><rect x="19" y="9" width="3" height="6" rx="1" /></Svg>,
  Timer:    (p: IconProps) => <Svg {...p}><line x1="10" y1="2" x2="14" y2="2" /><line x1="12" y1="14" x2="15" y2="11" /><circle cx="12" cy="14" r="8" /></Svg>,
  ChevR:    (p: IconProps) => <Svg {...p}><polyline points="9 18 15 12 9 6" /></Svg>,
  ChevL:    (p: IconProps) => <Svg {...p}><polyline points="15 18 9 12 15 6" /></Svg>,
  Check:    (p: IconProps) => <Svg {...p}><polyline points="20 6 9 17 4 12" /></Svg>,
  X:        (p: IconProps) => <Svg {...p}><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></Svg>,
  Plus:     (p: IconProps) => <Svg {...p}><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></Svg>,
  Play:     (p: IconProps) => <Svg {...p}><polygon points="6 4 20 12 6 20 6 4" fill="currentColor" stroke="currentColor" /></Svg>,
  Flame:    (p: IconProps) => <Svg {...p}><path d="M8.5 14.5A2.5 2.5 0 0011 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 11-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 002.5 2.5z" /></Svg>,
  Wind:     (p: IconProps) => <Svg {...p}><path d="M9.59 4.59A2 2 0 1111 8H2" /><path d="M17.73 2.27A2.5 2.5 0 1119.5 6.5H2" /><path d="M14.59 16.41A2 2 0 1116 20" /></Svg>,
  Moon:     (p: IconProps) => <Svg {...p}><path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" /></Svg>,
  Scale:    (p: IconProps) => <Svg {...p}><path d="M5 17.13a1 1 0 01-.99-1.13l1.79-13a1 1 0 01.99-.87h10.42a1 1 0 01.99.87l1.79 13a1 1 0 01-.99 1.13z" /><line x1="12" y1="7" x2="12" y2="13" /></Svg>,
  History:  (p: IconProps) => <Svg {...p}><path d="M3 3v5h5" /><path d="M3.05 13A9 9 0 106 5.3L3 8" /><polyline points="12 7 12 12 16 14" /></Svg>,
  Gear:     (p: IconProps) => <Svg {...p}><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 11-2.83 2.83l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 11-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 11-2.83-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 110-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 112.83-2.83l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 114 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 112.83 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 110 4h-.09a1.65 1.65 0 00-1.51 1z" /></Svg>,
};
