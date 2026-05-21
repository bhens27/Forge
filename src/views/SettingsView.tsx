import type { ViewName } from '../types';
import { I } from '../components/icons';
import { btnG, btnS, topBar } from '../styles/shared';

interface Props {
  onBack: () => void;
  onReset: () => void;
  dataSize: number;
  onNav: (view: ViewName) => void;
}

export function SettingsView({ onBack, onReset, dataSize, onNav }: Props) {
  return (
    <div style={{ paddingBottom: 100 }}>
      <div style={topBar}>
        <button onClick={onBack} style={btnG()}><I.ChevL size={20} /></button>
        <div style={{ flex: 1, textAlign: 'center' }}>
          <div className="anton" style={{ fontSize: 18 }}>SETTINGS</div>
        </div>
        <div style={{ width: 36 }} />
      </div>
      <div style={{ padding: '0 16px' }}>
        <button onClick={() => onNav('starting-weights')} style={{ width: '100%', padding: '14px 16px', borderRadius: 12, background: 'var(--card)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: 12, marginBottom: 10, textAlign: 'left' }}>
          <I.Dumbbell size={18} color="var(--accent)" />
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 13, fontWeight: 600 }}>Starting Weights</div>
            <div style={{ color: 'var(--muted)', fontSize: 11, marginTop: 2 }}>Set current working weight per exercise</div>
          </div>
          <I.ChevR size={16} color="var(--dim)" />
        </button>
        <div style={{ padding: 16, borderRadius: 12, background: 'var(--card)', border: '1px solid var(--border)', marginBottom: 10 }}>
          <div style={{ color: 'var(--muted)', fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', marginBottom: 8 }}>ABOUT</div>
          <div style={{ fontSize: 13, lineHeight: 1.5 }}>FORGE · workout tracker built for the 2026 program. Auto-loads today's session. Rest timers auto-start with skip / +30s. Data saved locally on your phone.</div>
        </div>
        <div style={{ padding: 16, borderRadius: 12, background: 'var(--card)', border: '1px solid var(--border)', marginBottom: 10 }}>
          <div style={{ color: 'var(--muted)', fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', marginBottom: 8 }}>DATA</div>
          <div style={{ fontSize: 13, marginBottom: 12 }}>{dataSize} sessions stored</div>
          <button onClick={onReset} style={{ ...btnS(40), width: '100%', color: 'var(--danger)', borderColor: 'rgba(229,106,106,0.4)' }}>Reset all data</button>
        </div>
      </div>
    </div>
  );
}
