import type { Exercise, LiftSession, SetData } from '../types';
import { I } from './icons';
import { SetRow } from './SetRow';
import { btnG } from '../styles/shared';

type Intent = 'up' | 'stay' | 'down';

interface IntentCfg {
  icon: React.ReactNode;
  label: string;
  color: string;
  bg: string;
  border: string;
}

const INTENT: Record<Intent, IntentCfg> = {
  up:   { icon: <I.ChevU size={11} />, label: '↑', color: 'var(--success)',  bg: 'rgba(125,212,154,0.15)', border: 'rgba(125,212,154,0.5)' },
  stay: { icon: <I.Minus  size={11} />, label: '—', color: 'var(--muted)',    bg: 'rgba(140,148,164,0.12)', border: 'rgba(140,148,164,0.4)' },
  down: { icon: <I.ChevD size={11} />, label: '↓', color: '#D4960A',         bg: 'rgba(212,150,10,0.12)',  border: 'rgba(212,150,10,0.4)' },
};

interface Props {
  exercise: Exercise;
  exerciseIdx: number;
  sets: SetData[];
  lastSession: LiftSession | undefined;
  startingWeight: number | undefined;
  intent?: Intent;
  readOnly?: boolean;
  onSetComplete: (exIdx: number, setIdx: number, data: SetData) => void;
  onIntentChange?: (intent: Intent) => void;
  onShowHistory: () => void;
  expanded: boolean;
  onToggle: () => void;
}

export function ExerciseCard({ exercise, exerciseIdx, sets, lastSession, startingWeight, intent, readOnly, onSetComplete, onIntentChange, onShowHistory, expanded, onToggle }: Props) {
  const doneCount = sets.filter((s) => s.done).length;
  const allDone = doneCount === exercise.sets;
  const lastSets = lastSession?.sessionData?.find((e) => e.name === exercise.name)?.sets ?? [];
  const syntheticLast: SetData | null = startingWeight != null
    ? { weight: startingWeight, reps: typeof exercise.reps === 'number' ? exercise.reps : null }
    : null;

  return (
    <div style={{ background: 'var(--card)', border: `1px solid ${allDone ? 'rgba(125,212,154,0.4)' : 'var(--border)'}`, borderRadius: 14, overflow: 'hidden', transition: 'border-color 0.3s' }}>
      <div onClick={onToggle} style={{ padding: '14px 16px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 10 }}>
        {/* Badge */}
        <div className="anton" style={{ width: 36, height: 36, borderRadius: 8, background: allDone ? 'rgba(125,212,154,0.13)' : 'var(--bg)', border: `1px solid ${allDone ? 'rgba(125,212,154,0.4)' : 'var(--border)'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, color: allDone ? 'var(--success)' : 'var(--muted)', flexShrink: 0 }}>
          {allDone ? <I.Check size={18} sw={3} /> : exerciseIdx + 1}
        </div>

        {/* Name + reps */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 14, fontWeight: 600, lineHeight: 1.2, marginBottom: 3 }}>{exercise.name}</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span className="mono" style={{ fontSize: 11, color: 'var(--accent)', fontWeight: 600 }}>{exercise.sets} × {exercise.reps}</span>
            {exercise.note && <span style={{ color: 'var(--dim)', fontSize: 11 }}>· {exercise.note}</span>}
          </div>
        </div>

        {/* Intent toggle */}
        <div onClick={(e) => e.stopPropagation()} style={{ display: 'flex', gap: 3, flexShrink: 0 }}>
          {(['up', 'stay', 'down'] as Intent[]).map((v) => {
            const cfg = INTENT[v];
            const active = intent === v;
            return (
              <button
                key={v}
                onClick={() => !readOnly && onIntentChange?.(v)}
                style={{
                  width: 24, height: 24, borderRadius: 6, flexShrink: 0,
                  background: active ? cfg.bg : 'transparent',
                  border: `1px solid ${active ? cfg.border : 'var(--border)'}`,
                  color: active ? cfg.color : 'var(--dim)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  cursor: readOnly ? 'default' : 'pointer',
                }}
              >
                {cfg.icon}
              </button>
            );
          })}
        </div>

        {/* Set count */}
        <div className="mono" style={{ fontSize: 12, color: 'var(--muted)', fontVariantNumeric: 'tabular-nums', flexShrink: 0 }}>{doneCount}/{exercise.sets}</div>

        {/* History */}
        <button onClick={(e) => { e.stopPropagation(); onShowHistory(); }} style={btnG(28)} title="Exercise history">
          <I.History size={14} color="var(--dim)" />
        </button>

        <I.ChevR size={16} color="var(--dim)" style={{ transform: expanded ? 'rotate(90deg)' : 'rotate(0)', transition: 'transform 0.2s', flexShrink: 0 }} />
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
              setType={exercise.setTypes?.[i]}
              readOnly={readOnly}
              onComplete={(idx, d) => onSetComplete(exerciseIdx, idx, d)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
