import type { DayConfig, ViewName } from '../types';
import { I } from '../components/icons';
import { Logo } from '../components/Logo';
import { DAY_LONG, PROGRAM } from '../data/program';
import { dayName, todayKey } from '../lib/utils';
import { btnG, btnP, statCard } from '../styles/shared';

interface Props {
  todaysSession: DayConfig & { day: string };
  lastWeight: number | null;
  onStart: () => void;
  onPickDay: (day: string) => void;
  onNav: (view: ViewName) => void;
}

export function HomeView({ todaysSession, lastWeight, onStart, onPickDay, onNav }: Props) {
  const today = new Date();
  const dn = dayName(today);

  return (
    <div style={{ paddingBottom: 100 }}>
      <div style={{ padding: '16px 16px 14px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Logo />
        <button onClick={() => onNav('settings')} style={btnG()}>
          <I.Gear size={18} color="var(--muted)" />
        </button>
      </div>
      <div style={{ padding: '0 16px' }}>
        <div style={{ color: 'var(--muted)', fontSize: 11, fontWeight: 700, letterSpacing: '0.15em', marginBottom: 4 }}>
          {DAY_LONG[today.getDay()].toUpperCase()} · {todayKey()}
        </div>
        <div style={{ padding: 20, borderRadius: 16, background: 'linear-gradient(135deg, var(--card) 0%, var(--bg2) 100%)', border: '1px solid var(--border)', marginBottom: 14, position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: -30, right: -30, width: 120, height: 120, borderRadius: '50%', background: 'radial-gradient(circle, rgba(229,138,90,0.13) 0%, transparent 70%)' }} />
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10, position: 'relative' }}>
            {todaysSession.icon === 'wind' ? <I.Wind size={16} color="var(--accent)" /> :
              todaysSession.icon === 'moon' ? <I.Moon size={16} color="var(--accent)" /> :
              <I.Flame size={16} color="var(--accent)" />}
            <span style={{ color: 'var(--accent)', fontSize: 11, fontWeight: 700, letterSpacing: '0.12em' }}>TODAY'S SESSION</span>
          </div>
          <div className="anton" style={{ fontSize: 36, lineHeight: 1, marginBottom: 4, position: 'relative' }}>{todaysSession.name.toUpperCase()}</div>
          <div style={{ color: 'var(--muted)', fontSize: 13, marginBottom: 16, position: 'relative' }}>{todaysSession.subtitle}</div>
          {todaysSession.type === 'rest' ? (
            <div style={{ color: 'var(--muted)', fontSize: 12, marginBottom: 10 }}>Pick another session below to train today instead.</div>
          ) : (
            <button onClick={onStart} style={{ ...btnP(50), width: '100%', fontSize: 15 }}>
              <I.Play size={14} color="var(--bg)" /> Start Session
            </button>
          )}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 14 }}>
          <button onClick={() => onNav('body')} style={statCard()}>
            <I.Scale size={16} color="var(--accent)" />
            <div style={{ color: 'var(--muted)', fontSize: 10, fontWeight: 700, letterSpacing: '0.1em' }}>BODYWEIGHT</div>
            <div className="anton" style={{ fontSize: 22, lineHeight: 1 }}>
              {lastWeight ? lastWeight.toFixed(1) : '—'}<span style={{ fontSize: 12, color: 'var(--muted)', marginLeft: 3 }}>kg</span>
            </div>
          </button>
          <button onClick={() => onNav('history')} style={statCard()}>
            <I.History size={16} color="var(--accent)" />
            <div style={{ color: 'var(--muted)', fontSize: 10, fontWeight: 700, letterSpacing: '0.1em' }}>HISTORY</div>
            <div className="anton" style={{ fontSize: 22, lineHeight: 1 }}>View</div>
          </button>
        </div>

        <div style={{ color: 'var(--muted)', fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', marginBottom: 8, padding: '0 4px' }}>THE WEEK</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {(['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] as const).map((d) => {
            const s = PROGRAM[d];
            const isToday = d === dn;
            return (
              <button key={d} onClick={() => onPickDay(d)} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 14px', background: isToday ? 'rgba(229,138,90,0.08)' : 'var(--card)', border: `1px solid ${isToday ? 'rgba(229,138,90,0.4)' : 'var(--border)'}`, borderRadius: 10, textAlign: 'left' }}>
                <div className="anton" style={{ width: 28, height: 28, borderRadius: 6, background: 'var(--bg)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, color: isToday ? 'var(--accent)' : 'var(--muted)' }}>{d.toUpperCase()}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 600 }}>{s.name}</div>
                  <div style={{ fontSize: 11, color: 'var(--muted)' }}>{s.subtitle}</div>
                </div>
                {s.icon === 'wind' ? <I.Wind size={14} color={isToday ? 'var(--accent)' : 'var(--dim)'} /> :
                  s.icon === 'moon' ? <I.Moon size={14} color={isToday ? 'var(--accent)' : 'var(--dim)'} /> :
                  <I.Flame size={14} color={isToday ? 'var(--accent)' : 'var(--dim)'} />}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
