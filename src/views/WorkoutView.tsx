import { useState } from 'react';
import type { LiftSession, Session, SetData } from '../types';
import { I } from '../components/icons';
import { ExerciseCard } from '../components/ExerciseCard';
import { ExerciseHistorySheet } from '../components/ExerciseHistorySheet';
import { btnG, btnP, btnS, topBar } from '../styles/shared';

interface Props {
  session: LiftSession;
  lastSession: LiftSession | undefined;
  startingWeights: Record<string, number>;
  history: Session[];
  onSetComplete: (exIdx: number, setIdx: number, data: SetData) => void;
  onEndSession: () => void;
  onReopenSession: () => void;
  onFinish: () => void;
  onBack: () => void;
}

export function WorkoutView({ session, lastSession, startingWeights, history, onSetComplete, onEndSession, onReopenSession, onFinish, onBack }: Props) {
  const [expanded, setExpanded] = useState(0);
  const [historyExercise, setHistoryExercise] = useState<string | null>(null);

  const isCompleted = session.completed === true;
  const totalSets = session.exercises.reduce((s, e) => s + e.sets, 0);
  const doneSets = session.sessionData.reduce((s, e) => s + (e?.sets || []).filter((x) => x?.done).length, 0);
  const pct = totalSets > 0 ? Math.round((doneSets / totalSets) * 100) : 0;

  return (
    <div style={{ paddingBottom: isCompleted ? 40 : 140 }}>
      <div style={topBar}>
        <button onClick={onBack} style={btnG()}><I.ChevL size={20} /></button>
        <div style={{ flex: 1, textAlign: 'center' }}>
          <div style={{ color: 'var(--muted)', fontSize: 10, letterSpacing: '0.15em', fontWeight: 700 }}>
            {session.day.toUpperCase()}{session.gym ? ` · ${session.gym.toUpperCase()}` : ''}
            {isCompleted && <span style={{ color: 'var(--success)', marginLeft: 6 }}>· DONE</span>}
          </div>
          <div className="anton" style={{ fontSize: 18 }}>{session.name.toUpperCase()}</div>
        </div>
        {isCompleted
          ? <div style={{ width: 36 }} />
          : <button onClick={onFinish} style={btnG()}><I.Check size={20} color="var(--accent)" /></button>
        }
      </div>

      <div style={{ padding: '0 16px 16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 16px', borderRadius: 12, background: 'linear-gradient(135deg, var(--bg2), var(--card))', border: '1px solid var(--border)', marginBottom: 14 }}>
          <div>
            <div style={{ color: 'var(--muted)', fontSize: 10, fontWeight: 700, letterSpacing: '0.1em' }}>PROGRESS</div>
            <div className="anton" style={{ fontSize: 28, lineHeight: 1 }}>{doneSets}<span style={{ color: 'var(--dim)', fontSize: 18 }}>/{totalSets}</span></div>
          </div>
          <div style={{ width: 56, height: 56, borderRadius: '50%', background: `conic-gradient(${isCompleted ? 'var(--success)' : 'var(--accent)'} ${pct}%, var(--border) 0)`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div className="mono" style={{ width: 44, height: 44, borderRadius: '50%', background: 'var(--bg2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700 }}>{pct}%</div>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {session.exercises.map((ex, i) => (
            <ExerciseCard
              key={i}
              exercise={ex}
              exerciseIdx={i}
              sets={session.sessionData[i]?.sets || []}
              lastSession={lastSession}
              startingWeight={startingWeights[ex.name]}
              readOnly={isCompleted}
              expanded={expanded === i}
              onToggle={() => setExpanded(expanded === i ? -1 : i)}
              onSetComplete={onSetComplete}
              onShowHistory={() => setHistoryExercise(ex.name)}
            />
          ))}
        </div>

        <div style={{ marginTop: 24 }}>
          {isCompleted ? (
            <button onClick={onReopenSession} style={{ ...btnS(52), width: '100%', fontSize: 15 }}>
              <I.History size={16} /> Re-open Session
            </button>
          ) : (
            <button onClick={onEndSession} style={{ ...btnP(52), width: '100%', fontSize: 15, background: 'var(--success)', color: 'var(--bg)', boxShadow: '0 2px 8px rgba(125,212,154,0.25)' }}>
              <I.Check size={16} sw={2.5} /> End &amp; Log Session
            </button>
          )}
        </div>
      </div>

      {historyExercise && (
        <ExerciseHistorySheet
          exerciseName={historyExercise}
          history={history}
          onClose={() => setHistoryExercise(null)}
        />
      )}
    </div>
  );
}
