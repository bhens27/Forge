import type { Session, LiftSession } from '../types';
import { I } from './icons';
import { btnG } from '../styles/shared';

interface Props {
  exerciseName: string;
  history: Session[];
  onClose: () => void;
}

export function ExerciseGraphSheet({ exerciseName, history, onClose }: Props) {
  const raw = (history.filter((s): s is LiftSession => s.type === 'lift'))
    .filter((s) => s.sessionData?.some((e) => e.name === exerciseName))
    .slice() // history is newest-first; reverse for chronological graph
    .reverse()
    .map((s) => {
      const sets = s.sessionData.find((e) => e.name === exerciseName)?.sets ?? [];
      const done = sets.filter((st) => st.done && st.weight != null);
      const maxWeight = done.length > 0 ? Math.max(...done.map((st) => st.weight as number)) : null;
      return { date: s.date, gym: s.gym, maxWeight, sets: sets.filter((st) => st.done) };
    });

  const chartData = raw.filter((d) => d.maxWeight != null) as (typeof raw[number] & { maxWeight: number })[];
  const allSessions = raw.slice().reverse(); // newest-first for the list below

  const minW = chartData.length ? Math.min(...chartData.map((d) => d.maxWeight)) : 0;
  const maxW = chartData.length ? Math.max(...chartData.map((d) => d.maxWeight)) : 0;
  const range = Math.max(1, maxW - minW);
  const latest = chartData[chartData.length - 1]?.maxWeight ?? null;
  const first  = chartData[0]?.maxWeight ?? null;
  const change = latest != null && first != null ? latest - first : null;

  const GW = 28; // pixels per point in viewBox
  const GH = 80;
  const vw = Math.max(chartData.length * GW, 80);
  const cx = (i: number) => i * GW + GW / 2;
  const cy = (w: number) => GH - ((w - minW) / range) * (GH - 16) - 8;

  return (
    <div
      onClick={onClose}
      style={{ position: 'fixed', inset: 0, zIndex: 60, background: 'rgba(10,14,20,0.7)', backdropFilter: 'blur(4px)', WebkitBackdropFilter: 'blur(4px)' }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{ position: 'absolute', left: 0, right: 0, bottom: 0, background: 'var(--bg2)', borderRadius: '16px 16px 0 0', border: '1px solid var(--border)', borderBottom: 'none', maxHeight: '82vh', display: 'flex', flexDirection: 'column' }}
      >
        {/* Header */}
        <div style={{ padding: '16px 16px 12px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
          <div>
            <div style={{ color: 'var(--muted)', fontSize: 10, fontWeight: 700, letterSpacing: '0.1em' }}>WEIGHT HISTORY</div>
            <div style={{ fontSize: 15, fontWeight: 600, marginTop: 2 }}>{exerciseName}</div>
          </div>
          <button onClick={onClose} style={btnG(32)}><I.X size={16} color="var(--muted)" /></button>
        </div>

        <div style={{ overflowY: 'auto', flex: 1 }}>
          {/* Stats */}
          {chartData.length > 0 && (
            <div style={{ padding: '14px 16px 0', display: 'flex', gap: 10 }}>
              <div style={{ flex: 1, padding: '10px 14px', borderRadius: 12, background: 'var(--card)', border: '1px solid var(--border)' }}>
                <div style={{ color: 'var(--muted)', fontSize: 10, fontWeight: 700, letterSpacing: '0.1em' }}>BEST</div>
                <div className="anton" style={{ fontSize: 26, lineHeight: 1.1 }}>{maxW}<span style={{ fontSize: 14, color: 'var(--muted)', marginLeft: 3 }}>kg</span></div>
              </div>
              {change !== null && (
                <div style={{ flex: 1, padding: '10px 14px', borderRadius: 12, background: 'var(--card)', border: '1px solid var(--border)' }}>
                  <div style={{ color: 'var(--muted)', fontSize: 10, fontWeight: 700, letterSpacing: '0.1em' }}>CHANGE</div>
                  <div className="anton" style={{ fontSize: 26, lineHeight: 1.1, color: change > 0 ? 'var(--success)' : change < 0 ? 'var(--danger)' : 'var(--text)' }}>
                    {change >= 0 ? '+' : ''}{change.toFixed(1)}<span style={{ fontSize: 14, color: 'var(--muted)', marginLeft: 3 }}>kg</span>
                  </div>
                </div>
              )}
              <div style={{ flex: 1, padding: '10px 14px', borderRadius: 12, background: 'var(--card)', border: '1px solid var(--border)' }}>
                <div style={{ color: 'var(--muted)', fontSize: 10, fontWeight: 700, letterSpacing: '0.1em' }}>SESSIONS</div>
                <div className="anton" style={{ fontSize: 26, lineHeight: 1.1 }}>{chartData.length}</div>
              </div>
            </div>
          )}

          {/* Graph */}
          <div style={{ padding: '14px 16px 0', overflowX: 'auto' }}>
            {chartData.length === 0 ? (
              <div style={{ padding: '24px 0', textAlign: 'center', color: 'var(--muted)', fontSize: 13 }}>No weight data logged yet.</div>
            ) : chartData.length === 1 ? (
              <div style={{ padding: '16px 0', textAlign: 'center' }}>
                <div className="mono" style={{ fontSize: 13, color: 'var(--muted)' }}>{chartData[0].date}</div>
                <div className="anton" style={{ fontSize: 32, color: 'var(--accent)' }}>{chartData[0].maxWeight}kg</div>
              </div>
            ) : (
              <div style={{ background: 'var(--card)', borderRadius: 12, border: '1px solid var(--border)', padding: '12px 8px 8px', minWidth: 0 }}>
                <svg
                  width="100%"
                  height={GH + 20}
                  viewBox={`0 0 ${vw} ${GH + 20}`}
                  preserveAspectRatio="none"
                  style={{ display: 'block' }}
                >
                  {/* Grid lines */}
                  {[0, 0.25, 0.5, 0.75, 1].map((t) => {
                    const y = GH - t * (GH - 16) - 8;
                    return <line key={t} x1={0} y1={y} x2={vw} y2={y} stroke="var(--border)" strokeWidth="0.5" />;
                  })}
                  {/* Line */}
                  <polyline
                    points={chartData.map((d, i) => `${cx(i)},${cy(d.maxWeight)}`).join(' ')}
                    fill="none"
                    stroke="var(--accent)"
                    strokeWidth="2"
                    strokeLinejoin="round"
                    strokeLinecap="round"
                  />
                  {/* Dots */}
                  {chartData.map((d, i) => (
                    <circle key={i} cx={cx(i)} cy={cy(d.maxWeight)} r="3.5" fill="var(--accent)" />
                  ))}
                  {/* Weight labels on first + last + peaks */}
                  {[0, chartData.length - 1].map((i) => {
                    const d = chartData[i];
                    if (!d) return null;
                    const y = cy(d.maxWeight);
                    const anchor = i === 0 ? 'start' : 'end';
                    return (
                      <text key={i} x={cx(i)} y={Math.max(y - 6, 10)} fill="var(--muted)" fontSize="8" textAnchor={anchor} fontFamily="monospace">
                        {d.maxWeight}kg
                      </text>
                    );
                  })}
                  {/* Date labels */}
                  {[0, chartData.length - 1].map((i) => {
                    const d = chartData[i];
                    if (!d) return null;
                    const anchor = i === 0 ? 'start' : 'end';
                    return (
                      <text key={i} x={cx(i)} y={GH + 16} fill="var(--dim)" fontSize="7" textAnchor={anchor} fontFamily="monospace">
                        {d.date.slice(5)}
                      </text>
                    );
                  })}
                </svg>
              </div>
            )}
          </div>

          {/* Session list */}
          <div style={{ padding: '14px 16px calc(16px + env(safe-area-inset-bottom))', display: 'flex', flexDirection: 'column', gap: 8 }}>
            <div style={{ color: 'var(--muted)', fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', padding: '0 2px 4px' }}>
              ALL SESSIONS
            </div>
            {allSessions.length === 0 && (
              <div style={{ padding: '16px 0', textAlign: 'center', color: 'var(--muted)', fontSize: 13 }}>No history yet.</div>
            )}
            {allSessions.map((entry, i) => (
              <div key={i} style={{ padding: '12px 14px', borderRadius: 12, background: 'var(--card)', border: '1px solid var(--border)' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: entry.sets.length > 0 ? 8 : 0 }}>
                  <span className="mono" style={{ fontSize: 12, color: 'var(--muted)' }}>{entry.date}</span>
                  {entry.gym && (
                    <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--accent)', letterSpacing: '0.06em', background: 'rgba(229,138,90,0.1)', padding: '2px 8px', borderRadius: 10 }}>
                      {entry.gym}
                    </span>
                  )}
                </div>
                {entry.sets.length > 0 ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
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
                  <div style={{ fontSize: 12, color: 'var(--dim)' }}>No completed sets</div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
