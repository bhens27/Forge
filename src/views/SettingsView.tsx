import { useState } from 'react';
import * as XLSX from 'xlsx';
import type { ViewName, LiftSession, RunSession, WeighIn } from '../types';
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

  const handleBackup = () => {
    setBackupState('working');
    try {
      const sessions = store
        .listKeys('session:')
        .map((k) => store.get(k))
        .filter(Boolean) as (LiftSession | RunSession)[];

      sessions.sort((a, b) => a.date.localeCompare(b.date));

      // ── Sheet 1: Sessions ──────────────────────────────────────────────
      const sessionHeader = [
        'Date', 'Day', 'Workout Name', 'Gym',
        'Exercise / Run Type', 'Set #', 'Weight (kg)', 'Reps',
        'Warmup Speed (km/h)', 'Dist/Rep (m)', 'Working Speed (km/h)',
        'Duration (min)', 'RPE', 'Notes',
      ];
      const sessionRows: (string | number)[][] = [sessionHeader];

      for (const s of sessions) {
        if (s.type === 'lift') {
          for (const ex of s.sessionData) {
            s.sessionData
              .find((e) => e.name === ex.name)
              ?.sets.forEach((set, j) => {
                if (!set.done) return;
                sessionRows.push([
                  s.date, s.day, s.name, s.gym ?? '',
                  ex.name, j + 1,
                  set.weight ?? '', set.reps ?? '',
                  '', '', '', '', '', '',
                ]);
              });
          }
        } else if (s.type === 'run') {
          const rs = s as RunSession;
          sessionRows.push([
            rs.date, rs.day, rs.name, rs.gym ?? '',
            rs.runType, '', '', rs.reps ?? '',
            rs.warmupSpeed ?? '', rs.distPerRep ?? '',
            rs.speed ?? '', rs.duration ?? '',
            rs.rpe ?? '', rs.notes ?? '',
          ]);
        }
      }

      const wsSessions = XLSX.utils.aoa_to_sheet(sessionRows);
      wsSessions['!cols'] = [
        { wch: 12 }, { wch: 6 }, { wch: 20 }, { wch: 10 },
        { wch: 28 }, { wch: 6 }, { wch: 12 }, { wch: 6 },
        { wch: 18 }, { wch: 12 }, { wch: 20 }, { wch: 14 }, { wch: 5 }, { wch: 30 },
      ];

      // ── Sheet 2: Weigh-ins ─────────────────────────────────────────────
      const weighIns = (store.get<WeighIn[]>('weighIns', []) ?? [])
        .slice()
        .sort((a, b) => a.date.localeCompare(b.date));

      const weighInRows: (string | number)[][] = [['Date', 'Weight (kg)', 'Body Fat %']];
      for (const w of weighIns) {
        weighInRows.push([w.date, w.kg, w.bf ?? '']);
      }
      const wsWeighIns = XLSX.utils.aoa_to_sheet(weighInRows);
      wsWeighIns['!cols'] = [{ wch: 12 }, { wch: 12 }, { wch: 12 }];

      // ── Sheet 3: Starting Weights ──────────────────────────────────────
      const startingWeights = store.get<Record<string, number>>('startingWeights', {}) ?? {};
      const swRows: (string | number)[][] = [['Exercise', 'Weight (kg)']];
      for (const [ex, w] of Object.entries(startingWeights)) {
        swRows.push([ex, w]);
      }
      const wsStartingWeights = XLSX.utils.aoa_to_sheet(swRows);
      wsStartingWeights['!cols'] = [{ wch: 28 }, { wch: 12 }];

      // ── Build workbook & download ──────────────────────────────────────
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, wsSessions, 'Sessions');
      XLSX.utils.book_append_sheet(wb, wsWeighIns, 'Weigh-ins');
      XLSX.utils.book_append_sheet(wb, wsStartingWeights, 'Starting Weights');

      const filename = `forge-backup-${todayKey()}.xlsx`;
      const buf = XLSX.write(wb, { bookType: 'xlsx', type: 'array' }) as ArrayBuffer;
      const blob = new Blob([buf], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      });

      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      setBackupState('done');
      setTimeout(() => setBackupState('idle'), 2000);
    } catch {
      setBackupState('error');
      setTimeout(() => setBackupState('idle'), 3000);
    }
  };

  const backupLabel =
    backupState === 'working' ? 'Preparing…' :
    backupState === 'done'    ? 'Downloaded' :
    backupState === 'error'   ? 'Failed — try again' :
    'Backup data (.xlsx)';

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
            style={{
              ...btnS(40), width: '100%', marginBottom: 8,
              color: backupState === 'error' ? 'var(--danger)' : backupState === 'done' ? 'var(--success)' : 'var(--text)',
              borderColor: backupState === 'error' ? 'rgba(229,106,106,0.4)' : backupState === 'done' ? 'rgba(125,212,154,0.4)' : 'var(--border)',
              opacity: backupState === 'working' ? 0.6 : 1,
            }}
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
