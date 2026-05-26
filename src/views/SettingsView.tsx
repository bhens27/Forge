import { useState } from 'react';
import type { ViewName } from '../types';
import { I } from '../components/icons';
import { btnG, btnS, topBar } from '../styles/shared';
import { store } from '../lib/store';
import { todayKey } from '../lib/utils';

interface Props {
  onBack: () => void;
  onReset: () => void;
  dataSize: number;
  onNav: (view: ViewName) => void;
}

export function SettingsView({ onBack, onReset, dataSize, onNav }: Props) {
  const [backupState, setBackupState] = useState<'idle' | 'working' | 'done' | 'error'>('idle');

  const handleBackup = async () => {
    setBackupState('working');
    try {
      const sessions = store.listKeys('session:').map((k) => store.get(k)).filter(Boolean);
      const weighIns = store.get('weighIns', []);
      const startingWeights = store.get('startingWeights', {});
      const payload = {
        exportedAt: new Date().toISOString(),
        version: 1,
        sessions,
        weighIns,
        startingWeights,
      };
      const json = JSON.stringify(payload, null, 2);
      const filename = `forge-backup-${todayKey()}.json`;
      const file = new File([json], filename, { type: 'application/json' });

      if (
        typeof navigator.canShare === 'function' &&
        navigator.canShare({ files: [file] })
      ) {
        await navigator.share({ files: [file], title: 'FORGE Backup' });
        setBackupState('done');
        setTimeout(() => setBackupState('idle'), 2000);
        return;
      }

      // Download fallback
      const url = URL.createObjectURL(new Blob([json], { type: 'application/json' }));
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      setBackupState('done');
      setTimeout(() => setBackupState('idle'), 2000);
    } catch (err) {
      if ((err as Error).name === 'AbortError') {
        setBackupState('idle');
      } else {
        setBackupState('error');
        setTimeout(() => setBackupState('idle'), 3000);
      }
    }
  };

  const backupLabel =
    backupState === 'working' ? 'Preparing…' :
    backupState === 'done'    ? 'Done' :
    backupState === 'error'   ? 'Failed — try again' :
    'Backup data';

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
          <button
            onClick={handleBackup}
            disabled={backupState === 'working'}
            style={{ ...btnS(40), width: '100%', marginBottom: 8, color: backupState === 'error' ? 'var(--danger)' : backupState === 'done' ? 'var(--success)' : 'var(--text)', borderColor: backupState === 'error' ? 'rgba(229,106,106,0.4)' : backupState === 'done' ? 'rgba(125,212,154,0.4)' : 'var(--border)', opacity: backupState === 'working' ? 0.6 : 1 }}
          >
            <I.Share size={15} />
            {backupLabel}
          </button>
          <button onClick={onReset} style={{ ...btnS(40), width: '100%', color: 'var(--danger)', borderColor: 'rgba(229,106,106,0.4)' }}>Reset all data</button>
        </div>
      </div>
    </div>
  );
}
