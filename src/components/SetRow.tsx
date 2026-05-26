import { useState, useEffect } from 'react';
import type { SetData, Exercise } from '../types';
import { I } from './icons';
import { numInput, inputLabel, btnP } from '../styles/shared';

interface Props {
  setIdx: number;
  set: SetData;
  last: SetData | null | undefined;
  exercise: Exercise;
  setType?: string;
  readOnly?: boolean;
  onComplete: (setIdx: number, data: SetData) => void;
}

// Negative weight means assisted; display with − prefix and "assist" label.
const weightDisplay = (w: number | null | undefined): string => {
  if (w == null) return '';
  if (w < 0) return `−${Math.abs(w)}kg assist × `;
  return `${w}kg × `;
};

export function SetRow({ setIdx, set, last, exercise, setType, readOnly, onComplete }: Props) {
  const isAssist = setType === 'assist';

  const initWeight = () => {
    const w = set.weight ?? last?.weight;
    if (w == null) return '';
    return String(isAssist ? Math.abs(w) : w);
  };

  const [editing, setEditing] = useState(!set.done);
  const [weight, setWeight] = useState<string>(initWeight);
  const [reps, setReps] = useState<string>(() => {
    const r = set.reps ?? last?.reps;
    return r != null ? String(r) : '';
  });

  useEffect(() => {
    if (!set.done) {
      const w = set.weight ?? last?.weight;
      setWeight(w != null ? String(isAssist ? Math.abs(w) : w) : '');
      const r = set.reps ?? last?.reps;
      setReps(r != null ? String(r) : '');
    }
    // intentionally only resets when exercise or set index changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [exercise.name, setIdx]);

  const confirm = () => {
    const rawW = weight === '' ? null : parseFloat(weight);
    const w = rawW == null || isNaN(rawW) ? null : (isAssist ? -Math.abs(rawW) : rawW);
    const r = reps === '' ? null : parseInt(reps, 10);
    if (r === null || isNaN(r)) return;
    onComplete(setIdx, { weight: w, reps: r, done: true });
    setEditing(false);
  };

  // Read-only: completed set
  if (readOnly && set.done) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', borderRadius: 10, background: 'var(--cardHi)', border: '1px solid rgba(125,212,154,0.3)' }}>
        <div style={{ width: 26, height: 26, borderRadius: '50%', background: 'rgba(125,212,154,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <I.Check size={14} color="var(--success)" sw={3} />
        </div>
        <div style={{ flex: 1, display: 'flex', alignItems: 'baseline', gap: 12 }}>
          <span style={{ color: 'var(--muted)', fontSize: 11, fontWeight: 600, letterSpacing: '0.08em' }}>SET {setIdx + 1}</span>
          <span className="mono" style={{ fontSize: 16, fontWeight: 600 }}>
            {weightDisplay(set.weight)}{set.reps}
          </span>
        </div>
      </div>
    );
  }

  // Read-only: unlogged set
  if (readOnly && !set.done) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', borderRadius: 10, background: 'var(--card)', border: '1px solid var(--border)', opacity: 0.45 }}>
        <div style={{ width: 26, height: 26, borderRadius: '50%', background: 'var(--bg)', border: '1px solid var(--border)', flexShrink: 0 }} />
        <span style={{ color: 'var(--muted)', fontSize: 11, fontWeight: 600, letterSpacing: '0.08em' }}>SET {setIdx + 1}</span>
        <span className="mono" style={{ color: 'var(--dim)', fontSize: 14 }}>—</span>
      </div>
    );
  }

  if (set.done && !editing) {
    return (
      <div onClick={() => setEditing(true)} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', borderRadius: 10, background: 'var(--cardHi)', border: '1px solid rgba(125,212,154,0.3)', cursor: 'pointer' }}>
        <div style={{ width: 26, height: 26, borderRadius: '50%', background: 'rgba(125,212,154,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <I.Check size={14} color="var(--success)" sw={3} />
        </div>
        <div style={{ flex: 1, display: 'flex', alignItems: 'baseline', gap: 12 }}>
          <span style={{ color: 'var(--muted)', fontSize: 11, fontWeight: 600, letterSpacing: '0.08em' }}>SET {setIdx + 1}</span>
          <span className="mono" style={{ fontSize: 16, fontWeight: 600 }}>
            {weightDisplay(set.weight)}{set.reps}
          </span>
        </div>
        <I.ChevR size={14} color="var(--dim)" />
      </div>
    );
  }

  return (
    <div style={{ padding: 12, borderRadius: 10, background: 'var(--cardHi)', border: '1px solid var(--borderHi)' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
        <span style={{ color: isAssist ? 'var(--accent)' : 'var(--accent)', fontSize: 11, fontWeight: 700, letterSpacing: '0.1em' }}>
          SET {setIdx + 1}{isAssist ? ' · ASSISTED' : ''}
        </span>
        {last && (
          <span className="mono" style={{ fontSize: 11, color: 'var(--dim)' }}>
            last: {last.weight != null ? `${weightDisplay(last.weight)}` : ''}{last.reps ?? '—'}
          </span>
        )}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr auto', gap: 8, alignItems: 'center' }}>
        <div>
          <label style={inputLabel}>{isAssist ? 'ASSIST (kg)' : 'WEIGHT (kg)'}</label>
          <input
            type="number"
            inputMode="decimal"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            placeholder={isAssist ? 'e.g. 20' : exercise.bodyweight ? 'BW' : '0'}
            style={numInput}
          />
        </div>
        <div>
          <label style={inputLabel}>REPS</label>
          <input
            type="number"
            inputMode="numeric"
            value={reps}
            onChange={(e) => setReps(e.target.value)}
            placeholder="0"
            style={numInput}
          />
        </div>
        <button onClick={confirm} style={{ ...btnP(46), width: 46, padding: 0, marginTop: 14 }}>
          <I.Check size={18} sw={2.5} />
        </button>
      </div>
    </div>
  );
}
