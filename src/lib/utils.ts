import { DAY_NAMES } from '../data/program';

export const todayKey = (): string => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
};

export const dayName = (d = new Date()): string => DAY_NAMES[d.getDay()];

export const formatTime = (s: number): string => {
  if (s < 0) s = 0;
  const m = Math.floor(s / 60);
  const sec = s % 60;
  return `${m}:${String(sec).padStart(2, '0')}`;
};
