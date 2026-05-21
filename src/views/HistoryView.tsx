import type { Session } from '../types';
import { I } from '../components/icons';
import { btnG, topBar } from '../styles/shared';

interface Props {
  history: Session[];
  onBack: () => void;
  onOpen: (s: Session) => void;
}

export function HistoryView({ history, onBack, onOpen }: Props) {
  return (
    <div style={{ paddingBottom: 100 }}>
      <div style={topBar}>
        <button onClick={onBack} style={btnG()}><I.ChevL size={20} /></button>
        <div style={{ flex: 1, textAlign: 'center' }}>
          <div className="anton" style={{ fontSize: 18 }}>HISTORY</div>
        </div>
        <div style={{ width: 36 }} />
      </div>
      <div style={{ padding: '0 16px' }}>
        {history.length === 0 ? (
          <div style={{ padding: '40px 20px', textAlign: 'center', color: 'var(--muted)', fontSize: 13 }}>
            No sessions logged yet. Start your first workout to build history.
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {history.map((s, i) => (
              <div key={i} onClick={() => onOpen(s)} style={{ padding: '14px 16px', borderRadius: 12, background: 'var(--card)', border: '1px solid var(--border)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ width: 6, height: 38, borderRadius: 3, background: s.type === 'lift' ? 'var(--accent)' : s.type === 'run' ? 'var(--success)' : 'var(--dim)' }} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 14, fontWeight: 600 }}>{s.name}</div>
                  <div className="mono" style={{ color: 'var(--muted)', fontSize: 11, marginTop: 2 }}>
                    {s.date} · {s.type === 'lift'
                      ? `${(s.sessionData || []).reduce((sum, e) => sum + (e?.sets || []).filter((x) => x?.done).length, 0)} sets`
                      : s.type === 'run' ? 'run' : 'session'}
                  </div>
                </div>
                <I.ChevR size={16} color="var(--dim)" />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
