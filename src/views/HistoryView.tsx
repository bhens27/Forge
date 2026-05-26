import { useState } from 'react';
import type { Session, LiftSession } from '../types';
import { I } from '../components/icons';
import { ExerciseGraphSheet } from '../components/ExerciseGraphSheet';
import { btnG, topBar } from '../styles/shared';

interface Props {
  history: Session[];
  onBack: () => void;
  onOpen: (s: Session) => void;
  onDelete: (s: Session) => void;
}

export function HistoryView({ history, onBack, onOpen, onDelete }: Props) {
  const [graphExercise, setGraphExercise] = useState<string | null>(null);

  const liftSessions = history.filter((s): s is LiftSession => s.type === 'lift');
  const exerciseMap = new Map<string, number>();
  liftSessions.forEach((s) => {
    s.sessionData.forEach((e) => {
      exerciseMap.set(e.name, (exerciseMap.get(e.name) ?? 0) + 1);
    });
  });
  const exercises = [...exerciseMap.entries()]
    .sort((a, b) => b[1] - a[1])
    .map(([name, count]) => ({ name, count }));

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

        {/* Sessions */}
        {history.length === 0 ? (
          <div style={{ padding: '40px 20px', textAlign: 'center', color: 'var(--muted)', fontSize: 13 }}>
            No sessions logged yet. Start your first workout to build history.
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 28 }}>
            {history.map((s, i) => (
              <div key={i} style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: 0 }}>
                <div onClick={() => onOpen(s)} style={{ flex: 1, minWidth: 0, padding: '14px 16px', borderRadius: 12, background: 'var(--card)', border: '1px solid var(--border)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ width: 6, height: 38, borderRadius: 3, background: s.type === 'lift' ? ((s as LiftSession).completed ? 'var(--success)' : 'var(--accent)') : s.type === 'run' ? 'var(--success)' : 'var(--dim)', flexShrink: 0 }} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 14, fontWeight: 600 }}>{s.name}</div>
                    <div className="mono" style={{ color: 'var(--muted)', fontSize: 11, marginTop: 2 }}>
                      {s.date}
                      {s.type === 'lift' && (s as LiftSession).gym ? ` · ${(s as LiftSession).gym}` : ''}
                      {' · '}
                      {s.type === 'lift'
                        ? `${(s.sessionData || []).reduce((sum, e) => sum + (e?.sets || []).filter((x) => x?.done).length, 0)} sets${(s as LiftSession).completed ? ' · done' : ''}`
                        : s.type === 'run' ? 'run' : 'session'}
                    </div>
                  </div>
                  <I.ChevR size={16} color="var(--dim)" />
                </div>
                <button
                  onClick={(e) => { e.stopPropagation(); if (confirm('Delete this session? Cannot be undone.')) onDelete(s); }}
                  style={{ flexShrink: 0, marginLeft: 8, width: 34, height: 34, borderRadius: 8, background: 'none', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
                >
                  <I.Trash size={15} color="var(--muted)" />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Exercises */}
        {exercises.length > 0 && (
          <div style={{ marginBottom: 16 }}>
            <div style={{ color: 'var(--muted)', fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', marginBottom: 10, padding: '0 4px' }}>
              EXERCISES · {exercises.length}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {exercises.map(({ name, count }) => (
                <button
                  key={name}
                  onClick={() => setGraphExercise(name)}
                  style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 14px', background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 10, textAlign: 'left', width: '100%' }}
                >
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 13, fontWeight: 600 }}>{name}</div>
                  </div>
                  <span className="mono" style={{ color: 'var(--muted)', fontSize: 11, flexShrink: 0 }}>{count}×</span>
                  <I.ChevR size={14} color="var(--dim)" />
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {graphExercise && (
        <ExerciseGraphSheet
          exerciseName={graphExercise}
          history={history}
          onClose={() => setGraphExercise(null)}
        />
      )}
    </div>
  );
}
