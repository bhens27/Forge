import type { CSSProperties } from 'react';

export const btnP = (h = 44): CSSProperties => ({
  height: h, border: 'none', borderRadius: 10,
  background: 'var(--accent)', color: 'var(--bg)',
  fontWeight: 700, fontSize: 14, letterSpacing: '0.04em',
  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
  cursor: 'pointer', boxShadow: '0 2px 8px rgba(229,138,90,0.3)',
});

export const btnS = (h = 44): CSSProperties => ({
  height: h, borderRadius: 10, background: 'transparent', color: 'var(--text)',
  border: '1px solid var(--border)', fontWeight: 600, fontSize: 14,
  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
  cursor: 'pointer',
});

export const btnG = (size = 36): CSSProperties => ({
  width: size, height: size, borderRadius: 8, background: 'transparent',
  display: 'flex', alignItems: 'center', justifyContent: 'center',
});

export const topBar: CSSProperties = {
  position: 'sticky', top: 0, zIndex: 30, background: 'rgba(10,14,20,0.92)',
  backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)',
  borderBottom: '1px solid var(--border)',
  padding: '12px 12px', display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14,
};

export const numInput: CSSProperties = {
  width: '100%', height: 46, background: 'var(--bg)', color: 'var(--text)',
  border: '1px solid var(--border)', borderRadius: 8, padding: '0 12px',
  fontFamily: "'JetBrains Mono', monospace", fontSize: 18, fontWeight: 600,
  outline: 'none', textAlign: 'center',
};

export const inputLabel: CSSProperties = {
  display: 'block', color: 'var(--muted)', fontSize: 9, fontWeight: 700,
  letterSpacing: '0.1em', marginBottom: 4,
};

export const statCard = (): CSSProperties => ({
  padding: 14, borderRadius: 12, background: 'var(--card)', border: '1px solid var(--border)',
  textAlign: 'left', display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 6,
});
