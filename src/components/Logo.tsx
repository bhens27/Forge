import { I } from './icons';

export function Logo() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
      <div style={{ width: 32, height: 32, borderRadius: 6, background: 'linear-gradient(135deg, var(--accent), var(--accentDim))', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 12px rgba(229,138,90,0.25)' }}>
        <I.Dumbbell size={18} color="var(--bg)" sw={2.5} />
      </div>
      <div className="anton" style={{ fontSize: 22, letterSpacing: '0.12em' }}>FORGE</div>
    </div>
  );
}
