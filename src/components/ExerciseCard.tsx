import type { Exercise, LiftSession, SetData } from '../types';
import { I } from './icons';
import { SetRow } from './SetRow';

interface Props {
  exercise: Exercise;
  exerciseIdx: number;
  sets: SetData[];
  lastSession: LiftSession | undefined;
  startingWeight: number | undefined;
  onSetComplete: (exIdx: number, setIdx: number, data: SetData) => void;
  expanded: boolean;
  onToggle: () => void;
}

export function ExerciseCard({ exercise, exerciseIdx, sets, lastSession, startingWeight, onSetComplete, expanded, onToggle }: Props) {
  const doneCount = sets.filter((s) => s.done).length;
  const allDone = doneCount === exercise.sets;
  const lastSets = lastSession?.sessionData?.find((e) => e.name === exercise.name)?.sets ?? [];
  const syntheticLast: SetData | null = startingWeight != null
    ? { weight: startingWeight, reps: typeof exercise.reps === 'number' ? exercise.reps : null }
    : null;

  return (
    <div style={{ background: 'var(--card)', border: `1px solid ${allDone ? 'rgba(125,212,154,0.4)' : 'var(--border)'}`, borderRadius: 14, overflow: 'hidden', transition: 'border-color 0.3s' }}>
      <div onClick={onToggle} style={{ padding: '14px 16px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 12 }}>
        <div className="anton" style={{ width: 36, height: 36, borderRadius: 8, background: allDone ? 'rgba(125,212,154,0.13)' : 'var(--bg)', border: `1px solid ${allDone ? 'rgba(125,212,154,0.4)' : 'var(--border)'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, color: allDone ? 'var(--success)' : 'var(--muted)' }}>
          {allDone ? <I.Check size={18} sw={3} /> : exerciseIdx + 1}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 14, fontWeight: 600, lineHeight: 1.2, marginBottom: 3 }}>{exercise.name}</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span className="mono" style={{ fontSize: 11, color: 'var(--accent)', fontWeight: 600 }}>{exercise.sets} × {exercise.reps}</span>
            {exercise.note && <span style={{ color: 'var(--dim)', fontSize: 11 }}>· {exercise.note}</span>}
          </div>
        </div>
        <div className="mono" style={{ fontSize: 12, color: 'var(--muted)', fontVariantNumeric: 'tabular-nums' }}>{doneCount}/{exercise.sets}</div>
        <I.ChevR size={16} color="var(--dim)" style={{ transform: expanded ? 'rotate(90deg)' : 'rotate(0)', transition: 'transform 0.2s' }} />
      </div>
      {expanded && (
        <div style={{ padding: '0 12px 12px', display: 'flex', flexDirection: 'column', gap: 8 }}>
          {Array.from({ length: exercise.sets }).map((_, i) => (
            <SetRow
              key={i}
              setIdx={i}
              set={sets[i] || {}}
              last={lastSets[i]?.done ? lastSets[i] : syntheticLast}
              exercise={exercise}
              onComplete={(idx, d) => onSetComplete(exerciseIdx, idx, d)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
