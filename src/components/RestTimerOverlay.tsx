import { I } from './icons';
import { formatTime } from '../lib/utils';
import { btnS, btnP, btnG } from '../styles/shared';

interface Props {
  active: boolean;
  remaining: number;
  total: number;
  onSkip: () => void;
  onExtend: (seconds: number) => void;
  onCancel: () => void;
}

export function RestTimerOverlay({ active, remaining, total, onSkip, onExtend, onCancel }: Props) {
  if (!active) return null;
  const pct = total > 0 ? Math.max(0, Math.min(100, (remaining / total) * 100)) : 0;

  return (
    <div style={{ position: 'fixed', left: 0, right: 0, bottom: 0, zIndex: 50, background: 'var(--bg2)', borderTop: '1px solid var(--border)', padding: 'calc(16px + env(safe-area-inset-bottom)) 16px 16px', boxShadow: '0 -8px 32px rgba(0,0,0,0.6)' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <I.Timer size={16} color="var(--accent)" />
          <span style={{ color: 'var(--muted)', fontSize: 12, letterSpacing: '0.08em', textTransform: 'uppercase', fontWeight: 600 }}>Rest</span>
        </div>
        <button onClick={onCancel} style={btnG(28)}><I.X size={14} color="var(--muted)" /></button>
      </div>
      <div className="anton" style={{ fontSize: 56, textAlign: 'center', lineHeight: 1, marginBottom: 12 }}>{formatTime(remaining)}</div>
      <div style={{ height: 4, borderRadius: 2, background: 'var(--border)', overflow: 'hidden', marginBottom: 14 }}>
        <div style={{ width: `${pct}%`, height: '100%', background: remaining <= 10 ? 'var(--warn)' : 'var(--accent)', transition: 'width 0.4s linear, background 0.3s ease' }} />
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
        <button onClick={() => onExtend(30)} style={btnS()}>
          <I.Plus size={14} /> 30s
        </button>
        <button onClick={onSkip} style={btnP()}>
          Skip <I.ChevR size={14} />
        </button>
      </div>
    </div>
  );
}
