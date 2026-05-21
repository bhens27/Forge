import { useState, useEffect } from 'react';
import type { Exercise } from '../types';

interface Props {
  exercise: Exercise;
  value: number | undefined;
  onChange: (v: number | null) => void;
}

export function StartingWeightRow({ exercise, value, onChange }: Props) {
  const [val, setVal] = useState(value != null ? String(value) : '');

  useEffect(() => {
    setVal(value != null ? String(value) : '');
  }, [value]);

  const commit = () => {
    const n = parseFloat(val);
    onChange(val === '' || isNaN(n) ? null : n);
  };

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', borderRadius: 10, background: 'var(--card)', border: `1px solid ${value != null ? 'rgba(229,138,90,0.4)' : 'var(--border)'}` }}>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 13, fontWeight: 500, lineHeight: 1.3 }}>{exercise.name}</div>
        <div className="mono" style={{ fontSize: 10, color: 'var(--muted)', marginTop: 2 }}>{exercise.sets} × {exercise.reps}{exercise.note ? ` · ${exercise.note}` : ''}</div>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
        <input
          type="number"
          inputMode="decimal"
          value={val}
          onChange={(e) => setVal(e.target.value)}
          onBlur={commit}
          placeholder="—"
          style={{ width: 76, height: 38, background: 'var(--bg)', color: 'var(--text)', border: '1px solid var(--border)', borderRadius: 8, padding: '0 8px', fontFamily: "'JetBrains Mono', monospace", fontSize: 15, fontWeight: 600, outline: 'none', textAlign: 'center' }}
        />
        <span style={{ color: 'var(--muted)', fontSize: 11, fontWeight: 600, width: 18 }}>kg</span>
      </div>
    </div>
  );
}
