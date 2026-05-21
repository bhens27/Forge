import { useState } from 'react';
import type { WeighIn } from '../types';
import { I } from '../components/icons';
import { todayKey } from '../lib/utils';
import { btnG, btnP, inputLabel, numInput, topBar } from '../styles/shared';

interface Props {
  weighIns: WeighIn[];
  onAdd: (entry: WeighIn) => void;
  onBack: () => void;
}

export function BodyView({ weighIns, onAdd, onBack }: Props) {
  const [kg, setKg] = useState('');
  const [bf, setBf] = useState('');
  const data = [...weighIns].sort((a, b) => a.date.localeCompare(b.date)).slice(-30);
  const min = data.length ? Math.min(...data.map((d) => d.kg)) : 0;
  const max = data.length ? Math.max(...data.map((d) => d.kg)) : 0;
  const range = Math.max(1, max - min);
  const latest = data[data.length - 1];
  const first = data[0];
  const change = latest && first ? latest.kg - first.kg : 0;

  const add = () => {
    const k = parseFloat(kg);
    if (isNaN(k)) return;
    const b = bf === '' ? null : parseFloat(bf);
    onAdd({ kg: k, bf: b === null || isNaN(b) ? null : b, date: todayKey() });
    setKg('');
    setBf('');
  };

  return (
    <div style={{ paddingBottom: 100 }}>
      <div style={topBar}>
        <button onClick={onBack} style={btnG()}><I.ChevL size={20} /></button>
        <div style={{ flex: 1, textAlign: 'center' }}>
          <div className="anton" style={{ fontSize: 18 }}>BODY</div>
        </div>
        <div style={{ width: 36 }} />
      </div>
      <div style={{ padding: '0 16px' }}>
        <div style={{ padding: 16, borderRadius: 14, background: 'linear-gradient(135deg, var(--bg2), var(--card))', border: '1px solid var(--border)', marginBottom: 14 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
            <div>
              <div style={{ color: 'var(--muted)', fontSize: 10, fontWeight: 700, letterSpacing: '0.1em' }}>CURRENT</div>
              <div className="anton" style={{ fontSize: 44, lineHeight: 1 }}>
                {latest ? latest.kg.toFixed(1) : '—'}<span style={{ fontSize: 18, color: 'var(--muted)', marginLeft: 4 }}>kg</span>
              </div>
              {latest?.bf && <div className="mono" style={{ color: 'var(--dim)', fontSize: 12, marginTop: 4 }}>{latest.bf}% BF</div>}
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ color: 'var(--muted)', fontSize: 10, fontWeight: 700, letterSpacing: '0.1em' }}>CHANGE</div>
              <div className="anton" style={{ fontSize: 24, lineHeight: 1.2, color: change < 0 ? 'var(--success)' : change > 0 ? 'var(--warn)' : 'var(--text)' }}>
                {change >= 0 ? '+' : ''}{change.toFixed(1)}<span style={{ fontSize: 12, color: 'var(--muted)', marginLeft: 2 }}>kg</span>
              </div>
            </div>
          </div>
          {data.length > 1 && (
            <div style={{ marginTop: 16, height: 60 }}>
              <svg width="100%" height="60" viewBox={`0 0 ${data.length * 10} 60`} preserveAspectRatio="none" style={{ width: '100%', height: 60 }}>
                <polyline
                  points={data.map((d, i) => `${i * 10},${60 - ((d.kg - min) / range) * 50 - 5}`).join(' ')}
                  fill="none"
                  stroke="var(--accent)"
                  strokeWidth="1.5"
                />
                {data.map((d, i) => (
                  <circle key={i} cx={i * 10} cy={60 - ((d.kg - min) / range) * 50 - 5} r="2" fill="var(--accent)" />
                ))}
              </svg>
            </div>
          )}
        </div>

        <div style={{ padding: 14, borderRadius: 12, background: 'var(--card)', border: '1px solid var(--border)', marginBottom: 14 }}>
          <div style={{ color: 'var(--muted)', fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', marginBottom: 10 }}>LOG WEIGH-IN · {todayKey()}</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr auto', gap: 8, alignItems: 'end' }}>
            <div>
              <label style={inputLabel}>WEIGHT (kg)</label>
              <input type="number" inputMode="decimal" value={kg} onChange={(e) => setKg(e.target.value)} placeholder="88.0" style={numInput} />
            </div>
            <div>
              <label style={inputLabel}>BF % (opt)</label>
              <input type="number" inputMode="decimal" value={bf} onChange={(e) => setBf(e.target.value)} placeholder="19" style={numInput} />
            </div>
            <button onClick={add} style={{ ...btnP(46), width: 46, padding: 0 }}><I.Plus size={18} sw={2.5} /></button>
          </div>
        </div>

        <div style={{ fontSize: 11, color: 'var(--muted)', fontWeight: 700, letterSpacing: '0.1em', padding: '0 4px 8px' }}>RECENT · {data.length} ENTRIES</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {[...data].reverse().slice(0, 10).map((d) => (
            <div key={d.date} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 14px', borderRadius: 10, background: 'var(--card)', border: '1px solid var(--border)' }}>
              <span className="mono" style={{ color: 'var(--muted)', fontSize: 12 }}>{d.date}</span>
              <span className="mono" style={{ fontSize: 14, fontWeight: 600 }}>{d.kg.toFixed(1)} kg{d.bf ? ` · ${d.bf}%` : ''}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
