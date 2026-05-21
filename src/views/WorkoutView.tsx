import { useState } from 'react';
import type { LiftSession, SetData } from '../types';
import { I } from '../components/icons';
import { ExerciseCard } from '../components/ExerciseCard';
import { btnG, topBar } from '../styles/shared';

interface Props {
  session: LiftSession;
  lastSession: LiftSession | undefined;
  startingWeights: Record<string, number>;
  onSetComplete: (exIdx: number, setIdx: number, data: SetData) => void;
  onFinish: () => void;
  onBack: () => void;
}

export function WorkoutView({ session, lastSession, startingWeights, onSetComplete, onFinish, onBack }: Props) {
  const [expanded, setExpanded] = useState(0);
  const totalSets = session.exercises.reduce((s, e) => s + e.sets, 0);
  const doneSets = session.sessionData.reduce((s, e) => s + (e?.sets || []).filter((x) => x?.done).length, 0);
  const pct = totalSets > 0 ? Math.round((doneSets / totalSets) * 100) : 0;

  return (
    <div style={{ paddingBottom: 140 }}>
      <div style={topBar}>
        <button onClick={onBack} style={btnG()}><I.ChevL size={20} /></button>
        <div style={{ flex: 1, textAlign: 'center' }}>
          <div style={{ color: 'var(--muted)', fontSize: 10, letterSpacing: '0.15em', fontWeight: 700 }}>{session.day.toUpperCase()}</div>
          <div className="anton" style={{ fontSize: 18 }}>{session.name.toUpperCase()}</div>
        </div>
        <button onClick={onFinish} style={btnG()}><I.Check size={20} color="var(--accent)" /></button>
      </div>
      <div style={{ padding: '0 16px 16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 16px', borderRadius: 12, background: 'linear-gradient(135deg, var(--bg2), var(--card))', border: '1px solid var(--border)', marginBottom: 14 }}>
          <div>
            <div style={{ color: 'var(--muted)', fontSize: 10, fontWeight: 700, letterSpacing: '0.1em' }}>PROGRESS</div>
            <div className="anton" style={{ fontSize: 28, lineHeight: 1 }}>{doneSets}<span style={{ color: 'var(--dim)', fontSize: 18 }}>/{totalSets}</span></div>
          </div>
          <div style={{ width: 56, height: 56, borderRadius: '50%', background: `conic-gradient(var(--accent) ${pct}%, var(--border) 0)`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
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
              expanded={expanded === i}
              onToggle={() => setExpanded(expanded === i ? -1 : i)}
              onSetComplete={onSetComplete}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
