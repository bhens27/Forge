import { useState } from 'react';
import type { RunSession } from '../types';
import { I } from '../components/icons';
import { RUN_PHASES } from '../data/program';
import { btnG, btnP, inputLabel, numInput, topBar } from '../styles/shared';

interface Props {
  session: RunSession;
  saved: RunSession | undefined;
  onSave: (data: Partial<RunSession>) => void;
  onBack: () => void;
}

export function RunView({ session, saved, onSave, onBack }: Props) {
  const [phase, setPhase] = useState(saved?.phase ?? 0);
  const [warmupSpeed, setWarmupSpeed] = useState(saved?.warmupSpeed ?? '');
  const [distPerRep, setDistPerRep] = useState(saved?.distPerRep ?? '');
  const [reps, setReps] = useState(saved?.reps ?? '');
  const [speed, setSpeed] = useState(saved?.speed ?? '');
  const [duration, setDuration] = useState(saved?.duration ?? '');
  const [rpe, setRpe] = useState(saved?.rpe ?? 6);
  const [notes, setNotes] = useState(saved?.notes ?? '');
  const phaseData = RUN_PHASES[phase];
  const prescribed = session.runType === 'intervals' ? phaseData.intervals : phaseData.tempo;

  return (
    <div style={{ paddingBottom: 120 }}>
      <div style={topBar}>
        <button onClick={onBack} style={btnG()}><I.ChevL size={20} /></button>
        <div style={{ flex: 1, textAlign: 'center' }}>
          <div style={{ color: 'var(--muted)', fontSize: 10, letterSpacing: '0.15em', fontWeight: 700 }}>{session.day.toUpperCase()}</div>
          <div className="anton" style={{ fontSize: 18 }}>{session.name.toUpperCase()}</div>
        </div>
        <div style={{ width: 36 }} />
      </div>
      <div style={{ padding: '0 16px 16px' }}>
        <div style={{ padding: 16, borderRadius: 14, background: 'var(--card)', border: '1px solid var(--border)', marginBottom: 14 }}>
          <div style={{ color: 'var(--muted)', fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', marginBottom: 6 }}>PRESCRIBED · WEEKS {phaseData.weeks}</div>
          <div className="mono" style={{ fontSize: 15, lineHeight: 1.4, fontWeight: 500 }}>{prescribed}</div>
          <div style={{ display: 'flex', gap: 6, marginTop: 10, flexWrap: 'wrap' }}>
            {RUN_PHASES.map((p, i) => (
              <button key={i} onClick={() => setPhase(i)} style={{ height: 28, padding: '0 10px', borderRadius: 14, border: `1px solid ${i === phase ? 'var(--accent)' : 'var(--border)'}`, background: i === phase ? 'rgba(229,138,90,0.13)' : 'transparent', color: i === phase ? 'var(--accent)' : 'var(--muted)', fontSize: 11, fontWeight: 600 }}>
                W{p.weeks.split(' ')[0]}
              </button>
            ))}
          </div>
        </div>

        {session.runType === 'intervals' ? (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 10 }}>
            <div>
              <label style={inputLabel}>WARM-UP (KM/H)</label>
              <input type="number" inputMode="decimal" value={warmupSpeed} onChange={(e) => setWarmupSpeed(e.target.value)} placeholder="e.g. 9.0" style={numInput} />
            </div>
            <div>
              <label style={inputLabel}>DIST/REP (M)</label>
              <input type="number" inputMode="numeric" value={distPerRep} onChange={(e) => setDistPerRep(e.target.value)} placeholder="e.g. 400" style={numInput} />
            </div>
            <div>
              <label style={inputLabel}>REPS COMPLETED</label>
              <input type="number" inputMode="numeric" value={reps} onChange={(e) => setReps(e.target.value)} placeholder="e.g. 5" style={numInput} />
            </div>
            <div>
              <label style={inputLabel}>WORKING SPEED (KM/H)</label>
              <input type="number" inputMode="decimal" value={speed} onChange={(e) => setSpeed(e.target.value)} placeholder="e.g. 14.0" style={numInput} />
            </div>
          </div>
        ) : (
          <div style={{ marginBottom: 10 }}>
            <div style={{ marginBottom: 10 }}>
              <label style={inputLabel}>WARM-UP (KM/H)</label>
              <input type="number" inputMode="decimal" value={warmupSpeed} onChange={(e) => setWarmupSpeed(e.target.value)} placeholder="e.g. 9.0" style={numInput} />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              <div>
                <label style={inputLabel}>DURATION (MIN)</label>
                <input type="number" inputMode="numeric" value={duration} onChange={(e) => setDuration(e.target.value)} placeholder="e.g. 20" style={numInput} />
              </div>
              <div>
                <label style={inputLabel}>WORKING SPEED (KM/H)</label>
                <input type="number" inputMode="decimal" value={speed} onChange={(e) => setSpeed(e.target.value)} placeholder="e.g. 12.0" style={numInput} />
              </div>
            </div>
          </div>
        )}

        <div style={{ padding: 14, borderRadius: 12, background: 'var(--card)', border: '1px solid var(--border)', marginBottom: 10 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
            <label style={{ ...inputLabel, margin: 0 }}>RPE (1–10)</label>
            <span className="anton" style={{ fontSize: 24, color: 'var(--accent)' }}>{rpe}</span>
          </div>
          <input type="range" min="1" max="10" value={rpe} onChange={(e) => setRpe(parseInt(e.target.value, 10))} style={{ width: '100%', accentColor: 'var(--accent)' } as React.CSSProperties} />
          <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--dim)', fontSize: 10, marginTop: 4, fontWeight: 600 }}>
            <span>EASY</span><span>MOD</span><span>HARD</span><span>MAX</span>
          </div>
        </div>

        <div style={{ padding: 14, borderRadius: 12, background: 'var(--card)', border: '1px solid var(--border)', marginBottom: 14 }}>
          <label style={inputLabel}>NOTES</label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="How did it feel?"
            style={{ width: '100%', minHeight: 60, background: 'var(--bg)', color: 'var(--text)', border: '1px solid var(--border)', borderRadius: 8, padding: 10, fontSize: 13, outline: 'none', resize: 'vertical', fontFamily: 'inherit' }}
          />
        </div>

        <button onClick={() => onSave({ phase, warmupSpeed, distPerRep, reps, speed, duration, rpe, notes })} style={{ ...btnP(48), width: '100%' }}>
          <I.Check size={16} /> Save Session
        </button>
      </div>
    </div>
  );
}
