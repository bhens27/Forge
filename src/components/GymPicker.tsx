import type { Gym } from '../types';

interface Props {
  onSelect: (gym: Gym) => void;
  onCancel: () => void;
}

const gymStyles: Record<Gym, { background: string; border: string }> = {
  Dropgym: { background: 'rgba(229,138,90,0.1)', border: '1px solid rgba(229,138,90,0.35)' },
  Dilly:   { background: 'rgba(125,212,154,0.08)', border: '1px solid rgba(125,212,154,0.3)' },
  Other:   { background: 'rgba(88,130,183,0.08)', border: '1px solid rgba(88,130,183,0.3)' },
};

export function GymPicker({ onSelect, onCancel }: Props) {
  return (
    <div
      onClick={onCancel}
      style={{ position: 'fixed', inset: 0, zIndex: 60, background: 'rgba(10,14,20,0.88)', backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}
    >
      <div onClick={(e) => e.stopPropagation()} style={{ width: '100%', maxWidth: 340, background: 'var(--card)', borderRadius: 20, border: '1px solid var(--border)', padding: '28px 20px 20px', boxShadow: '0 24px 64px rgba(0,0,0,0.6)' }}>
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <div className="anton" style={{ fontSize: 20, letterSpacing: '0.1em' }}>SELECT GYM</div>
          <div style={{ color: 'var(--muted)', fontSize: 13, marginTop: 6 }}>Where are you training today?</div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {(['Dropgym', 'Dilly', 'Other'] as Gym[]).map((gym) => (
            <button
              key={gym}
              onClick={() => onSelect(gym)}
              style={{ height: 60, width: '100%', borderRadius: 14, fontSize: 17, fontWeight: 700, cursor: 'pointer', letterSpacing: '0.02em', color: 'var(--text)', ...gymStyles[gym] }}
            >
              {gym}
            </button>
          ))}
        </div>
        <button
          onClick={onCancel}
          style={{ display: 'block', width: '100%', marginTop: 14, padding: '10px 0', color: 'var(--dim)', fontSize: 13, fontWeight: 600, background: 'none', border: 'none', cursor: 'pointer' }}
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
