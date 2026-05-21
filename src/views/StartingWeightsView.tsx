import { I } from '../components/icons';
import { StartingWeightRow } from '../components/StartingWeightRow';
import { PROGRAM } from '../data/program';
import { btnG, topBar } from '../styles/shared';

interface Props {
  startingWeights: Record<string, number>;
  onUpdate: (name: string, w: number | null) => void;
  onBack: () => void;
}

export function StartingWeightsView({ startingWeights, onUpdate, onBack }: Props) {
  const days = ['Mon', 'Wed', 'Thu', 'Fri'] as const;
  const seen = new Set<string>();
  const grouped = days.map((day) => {
    const cfg = PROGRAM[day];
    if (cfg.type !== 'lift' || !cfg.exercises) return null;
    const exes = cfg.exercises.filter((ex) => {
      if (seen.has(ex.name)) return false;
      seen.add(ex.name);
      return true;
    });
    return { day, name: cfg.name, exercises: exes };
  }).filter(Boolean) as { day: string; name: string; exercises: NonNullable<typeof PROGRAM[string]['exercises']> }[];

  const filled = Object.values(startingWeights).filter((v) => v != null).length;
  const total = seen.size;

  return (
    <div style={{ paddingBottom: 100 }}>
      <div style={topBar}>
        <button onClick={onBack} style={btnG()}><I.ChevL size={20} /></button>
        <div style={{ flex: 1, textAlign: 'center' }}>
          <div style={{ color: 'var(--muted)', fontSize: 10, letterSpacing: '0.15em', fontWeight: 700 }}>SETUP</div>
          <div className="anton" style={{ fontSize: 18 }}>STARTING WEIGHTS</div>
        </div>
        <div className="mono" style={{ fontSize: 12, color: 'var(--muted)', width: 50, textAlign: 'right' }}>{filled}/{total}</div>
      </div>
      <div style={{ padding: '0 16px' }}>
        <div style={{ padding: '12px 14px', borderRadius: 10, background: 'rgba(229,138,90,0.07)', border: '1px solid rgba(229,138,90,0.25)', marginBottom: 16, fontSize: 12, lineHeight: 1.5 }}>
          Enter current working weight for each exercise. Saves on tap-out. Pre-fills the "last session" reference on new exercises. Blank for bodyweight.
        </div>
        {grouped.map((g) => (
          <div key={g.day} style={{ marginBottom: 18 }}>
            <div style={{ color: 'var(--accent)', fontSize: 11, fontWeight: 700, letterSpacing: '0.12em', marginBottom: 8, padding: '0 4px', display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ display: 'inline-block', width: 24, height: 2, background: 'var(--accent)' }} />
              {g.day.toUpperCase()} · {g.name.toUpperCase()}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {g.exercises.map((ex) => (
                <StartingWeightRow
                  key={ex.name}
                  exercise={ex}
                  value={startingWeights[ex.name]}
                  onChange={(v) => onUpdate(ex.name, v)}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
