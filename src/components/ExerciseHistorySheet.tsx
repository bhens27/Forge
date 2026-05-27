import type { Session, LiftSession } from '../types';
import { I } from './icons';
import { btnG } from '../styles/shared';

type Intent = 'up' | 'stay' | 'down';

const INTENT_BADGE: Record<Intent, { label: string; color: string; bg: string }> = {
  up:   { label: '↑ UP',   color: 'var(--success)', bg: 'rgba(125,212,154,0.12)' },
  stay: { label: '— STAY', color: 'var(--muted)',   bg: 'rgba(140,148,164,0.10)' },
  down: { label: '↓ DOWN', color: '#D4960A',        bg: 'rgba(212,150,10,0.10)'  },
};

interface Props {
  exerciseName: string;
  history: Session[];
  onClose: () => void;
}

export function ExerciseHistorySheet({ exerciseName, history, onClose }: Props) {
  const entries = (history.filter((s): s is LiftSession => s.type === 'lift'))
    .filter((s) => s.sessionData?.some((e) => e.name === exerciseName))
    .slice(0, 5)
    .map((s) => {
      const ex = s.sessionData.find((e) => e.name === exerciseName);
      return {
        date: s.date,
        gym: s.gym,
        intent: ex?.intent as Intent | undefined,
        sets: ex?.sets.filter((st) => st.done) ?? [],
      };
    });

  return (
    <div
      onClick={onClose}
      style={{ position: 'fixed', inset: 0, zIndex: 60, background: 'rgba(10,14,20,0.7)', backdropFilter: 'blur(4px)', WebkitBackdropFilter: 'blur(4px)' }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{ position: 'absolute', left: 0, right: 0, bottom: 0, background: 'var(--bg2)', borderRadius: '16px 16px 0 0', border: '1px solid var(--border)', borderBottom: 'none', maxHeight: '72vh', display: 'flex', flexDirection: 'column' }}
      >
        <div style={{ padding: '16px 16px 12px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
          <div>
            <div style={{ color: 'var(--muted)', fontSize: 10, fontWeight: 700, letterSpacing: '0.1em' }}>EXERCISE HISTORY</div>
            <div style={{ fontSize: 15, fontWeight: 600, marginTop: 2 }}>{exerciseName}</div>
          </div>
          <button onClick={onClose} style={btnG(32)}><I.X size={16} color="var(--muted)" /></button>
        </div>

        <div style={{ overflowY: 'auto', padding: '12px 16px calc(16px + env(safe-area-inset-bottom))', display: 'flex', flexDirection: 'column', gap: 10 }}>
          {entries.length === 0 ? (
            <div style={{ padding: '32px 0', textAlign: 'center', color: 'var(--muted)', fontSize: 13 }}>
              No history yet for this exercise.
            </div>
          ) : entries.map((entry, i) => (
            <div key={i} style={{ padding: '12px 14px', borderRadius: 12, background: 'var(--card)', border: '1px solid var(--border)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: entry.sets.length > 0 ? 10 : 0 }}>
                <span className="mono" style={{ fontSize: 12, color: 'var(--muted)', flex: 1 }}>{entry.date}</span>
                {entry.intent && (() => {
                  const cfg = INTENT_BADGE[entry.intent];
                  return (
                    <span style={{ fontSize: 10, fontWeight: 700, padding: '2px 7px', borderRadius: 8, color: cfg.color, background: cfg.bg, letterSpacing: '0.06em' }}>
                      {cfg.label}
                    </span>
                  );
                })()}
                {entry.gym && (
                  <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--accent)', letterSpacing: '0.06em', background: 'rgba(229,138,90,0.1)', padding: '2px 8px', borderRadius: 10 }}>
                    {entry.gym}
                  </span>
                )}
              </div>
              {entry.sets.length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                  {entry.sets.map((set, j) => (
                    <div key={j} style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
                      <span style={{ color: 'var(--dim)', fontSize: 10, fontWeight: 700, letterSpacing: '0.08em', width: 40 }}>SET {j + 1}</span>
                      <span className="mono" style={{ fontSize: 14, fontWeight: 600 }}>
                        {set.weight != null ? `${set.weight}kg × ` : ''}{set.reps}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div style={{ fontSize: 12, color: 'var(--dim)' }}>No completed sets recorded</div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
