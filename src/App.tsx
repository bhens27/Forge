import { useState, useEffect, useRef, useCallback } from 'react';
import type { Session, LiftSession, RunSession, WeighIn, ViewName, SetData, Gym } from './types';
import { PROGRAM } from './data/program';
import { store } from './lib/store';
import { todayKey, dayName } from './lib/utils';
import { GymPicker } from './components/GymPicker';
import { RestTimerOverlay } from './components/RestTimerOverlay';
import { HomeView } from './views/HomeView';
import { WorkoutView } from './views/WorkoutView';
import { RunView } from './views/RunView';
import { BodyView } from './views/BodyView';
import { HistoryView } from './views/HistoryView';
import { SettingsView } from './views/SettingsView';
import { StartingWeightsView } from './views/StartingWeightsView';

export function App() {
  const [view, setView] = useState<ViewName>('home');
  const [currentSession, setCurrentSession] = useState<Session | null>(null);
  const [history, setHistory] = useState<Session[]>([]);
  const [weighIns, setWeighIns] = useState<WeighIn[]>([]);
  const [startingWeights, setStartingWeights] = useState<Record<string, number>>({});
  const [gymPickerDay, setGymPickerDay] = useState<string | null>(null);
  const [restActive, setRestActive] = useState(false);
  const [restRemaining, setRestRemaining] = useState(0);
  const [restTotal, setRestTotal] = useState(0);
  const restEndRef = useRef(0);
  const tickRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const beepFiredRef = useRef(false);

  useEffect(() => {
    const sessionKeys = store.listKeys('session:');
    const sessions = sessionKeys.map((k) => store.get<Session>(k)).filter(Boolean) as Session[];
    sessions.sort((a, b) => (b.date || '').localeCompare(a.date || ''));
    setHistory(sessions);
    setWeighIns(store.get<WeighIn[]>('weighIns', []) ?? []);
    setStartingWeights(store.get<Record<string, number>>('startingWeights', {}) ?? {});
  }, []);

  useEffect(() => {
    if (!restActive) {
      if (tickRef.current) clearInterval(tickRef.current);
      return;
    }
    const tick = () => {
      const remaining = Math.max(0, Math.ceil((restEndRef.current - Date.now()) / 1000));
      setRestRemaining(remaining);
      if (remaining === 0 && !beepFiredRef.current) {
        beepFiredRef.current = true;
        try {
          const AudioCtx = window.AudioContext || (window as Window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
          if (AudioCtx) {
            const ctx = new AudioCtx();
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.frequency.value = 880;
            gain.gain.setValueAtTime(0.001, ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.25, ctx.currentTime + 0.01);
            gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5);
            osc.start();
            osc.stop(ctx.currentTime + 0.5);
          }
        } catch { /* noop */ }
        if (navigator.vibrate) navigator.vibrate([220, 100, 220]);
        if ('Notification' in window && Notification.permission === 'granted') {
          try { new Notification('FORGE', { body: 'Rest complete — next set', tag: 'forge-rest' }); } catch { /* noop */ }
        }
        setTimeout(() => setRestActive(false), 800);
      }
    };
    tick();
    tickRef.current = setInterval(tick, 250);
    return () => { if (tickRef.current) clearInterval(tickRef.current); };
  }, [restActive]);

  useEffect(() => {
    const handler = () => {
      if (restActive && !document.hidden) {
        const remaining = Math.max(0, Math.ceil((restEndRef.current - Date.now()) / 1000));
        setRestRemaining(remaining);
      }
    };
    document.addEventListener('visibilitychange', handler);
    return () => document.removeEventListener('visibilitychange', handler);
  }, [restActive]);

  const dn = dayName();
  const todaysSession = { ...PROGRAM[dn], day: dn };

  const ensureSession = (day: string): Session => {
    const cfg = PROGRAM[day];
    if (cfg.type === 'lift' && cfg.exercises) {
      return {
        date: todayKey(), day, name: cfg.name, subtitle: cfg.subtitle, type: 'lift',
        exercises: cfg.exercises,
        sessionData: cfg.exercises.map((e) => ({
          name: e.name,
          sets: Array.from({ length: e.sets }).map(() => ({} as SetData)),
        })),
      };
    }
    if (cfg.type === 'run') {
      return { date: todayKey(), day, name: cfg.name, subtitle: cfg.subtitle, type: 'run', runType: cfg.runType! };
    }
    return { date: todayKey(), day, name: cfg.name, subtitle: cfg.subtitle, type: 'rest' };
  };

  const saveCurrentSession = useCallback((s: Session) => {
    store.set(`session:${s.date}:${s.day}`, s);
    setHistory((prev) => {
      const filtered = prev.filter((p) => !(p.date === s.date && p.day === s.day));
      const next = [s, ...filtered];
      next.sort((a, b) => (b.date || '').localeCompare(a.date || ''));
      return next;
    });
  }, []);

  const launchSession = (day: string, gym: Gym) => {
    const cfg = PROGRAM[day];
    const existing = store.get<Session>(`session:${todayKey()}:${day}`);
    const session: Session = { ...(existing ?? ensureSession(day)), gym } as Session;
    setCurrentSession(session);
    setView(cfg.type === 'lift' ? 'workout' : 'run');
    if ('Notification' in window && Notification.permission === 'default') {
      try { Notification.requestPermission(); } catch { /* noop */ }
    }
  };

  const startSession = (day = dn) => {
    const cfg = PROGRAM[day];
    if (cfg.type === 'rest') return;
    // If reopening an in-progress session that already has a gym, skip the picker
    const existing = store.get<Session>(`session:${todayKey()}:${day}`);
    if (existing && (existing as LiftSession | RunSession).gym) {
      setCurrentSession(existing);
      setView(cfg.type === 'lift' ? 'workout' : 'run');
      return;
    }
    setGymPickerDay(day);
  };

  const handleGymSelect = (gym: Gym) => {
    const day = gymPickerDay;
    setGymPickerDay(null);
    if (!day) return;
    launchSession(day, gym);
  };

  const handleSetComplete = (exIdx: number, setIdx: number, data: SetData) => {
    setCurrentSession((prev) => {
      if (!prev || prev.type !== 'lift') return prev;
      const copy: LiftSession = {
        ...prev,
        sessionData: prev.sessionData.map((e, i) =>
          i === exIdx ? { ...e, sets: e.sets.map((s, j) => j === setIdx ? data : s) } : e
        ),
      };
      saveCurrentSession(copy);
      const restSec = prev.exercises[exIdx]?.rest ?? 90;
      restEndRef.current = Date.now() + restSec * 1000;
      beepFiredRef.current = false;
      setRestTotal(restSec);
      setRestRemaining(restSec);
      setRestActive(true);
      return copy;
    });
  };

  const handleIntentChange = useCallback((exIdx: number, intent: 'up' | 'stay' | 'down') => {
    setCurrentSession((prev) => {
      if (!prev || prev.type !== 'lift') return prev;
      const copy: LiftSession = {
        ...prev,
        sessionData: prev.sessionData.map((e, i) =>
          i === exIdx ? { ...e, intent } : e
        ),
      };
      saveCurrentSession(copy);
      return copy;
    });
  }, [saveCurrentSession]);

  const lastSessionFor = (day: string): LiftSession | undefined =>
    history.find((s) => s.day === day && s.date !== todayKey() && s.type === 'lift') as LiftSession | undefined;

  const finishWorkout = () => {
    if (currentSession) saveCurrentSession(currentSession);
    setView('home');
    setCurrentSession(null);
    setRestActive(false);
  };

  const handleEndSession = () => {
    if (!currentSession || currentSession.type !== 'lift') return;
    const completedAt = Date.now();
    const completed: LiftSession = { ...(currentSession as LiftSession), completed: true, completedAt };
    // Store under a unique timestamped key so the standard key is free for a new session
    store.set(`session:${completed.date}:${completed.day}:${completedAt}`, completed);
    // Clear the in-progress key
    store.del(`session:${completed.date}:${completed.day}`);
    // Update history: replace the in-progress entry with the completed one
    setHistory((prev) => {
      const filtered = prev.filter((p) => !(p.date === completed.date && p.day === completed.day && !(p as LiftSession).completed));
      return [completed, ...filtered].sort((a, b) => b.date.localeCompare(a.date));
    });
    setView('home');
    setCurrentSession(null);
    setRestActive(false);
  };

  const handleReopenSession = () => {
    if (!currentSession || currentSession.type !== 'lift') return;
    const s = currentSession as LiftSession;
    const reopened: LiftSession = { ...s, completed: false, completedAt: undefined };
    // Delete any timestamped completed keys for this session
    store.listKeys(`session:${s.date}:${s.day}:`).forEach((k) => store.del(k));
    // Save at the standard in-progress key
    store.set(`session:${reopened.date}:${reopened.day}`, reopened);
    // Update history: remove the completed entry, add the reopened one
    setHistory((prev) => {
      const filtered = prev.filter((p) => !(p.date === s.date && p.day === s.day));
      return [reopened, ...filtered].sort((a, b) => b.date.localeCompare(a.date));
    });
    setCurrentSession(reopened);
  };

  const handleRunSave = (data: Partial<RunSession>) => {
    if (!currentSession) return;
    const s: RunSession = { ...(currentSession as RunSession), ...data, saved: true };
    saveCurrentSession(s);
    setView('home');
    setCurrentSession(null);
  };

  const addWeighIn = (entry: WeighIn) => {
    const next = [...weighIns.filter((w) => w.date !== entry.date), entry];
    setWeighIns(next);
    store.set('weighIns', next);
  };

  const updateStartingWeight = (name: string, w: number | null) => {
    const next = { ...startingWeights };
    if (w == null) delete next[name]; else next[name] = w;
    setStartingWeights(next);
    store.set('startingWeights', next);
  };

  const deleteSession = (s: Session) => {
    store.del(`session:${s.date}:${s.day}`);
    store.listKeys(`session:${s.date}:${s.day}:`).forEach((k) => store.del(k));
    setHistory((prev) => prev.filter((p) => !(p.date === s.date && p.day === s.day)));
  };

  const resetAll = () => {
    if (!confirm('Delete all sessions, weigh-ins and starting weights? Cannot be undone.')) return;
    for (const k of store.listKeys('')) store.del(k);
    setHistory([]);
    setWeighIns([]);
    setStartingWeights({});
  };

  const latestWeight = weighIns.length
    ? [...weighIns].sort((a, b) => b.date.localeCompare(a.date))[0]?.kg ?? null
    : null;

  return (
    <div className="root">
      {view === 'home' && (
        <HomeView
          todaysSession={todaysSession}
          lastWeight={latestWeight}
          onStart={() => startSession()}
          onPickDay={(d) => startSession(d)}
          onNav={setView}
        />
      )}
      {view === 'workout' && currentSession && (
        <WorkoutView
          session={currentSession as LiftSession}
          lastSession={lastSessionFor((currentSession as LiftSession).day)}
          startingWeights={startingWeights}
          history={history}
          onSetComplete={handleSetComplete}
          onIntentChange={handleIntentChange}
          onEndSession={handleEndSession}
          onReopenSession={handleReopenSession}
          onFinish={finishWorkout}
          onBack={() => { setView('home'); setRestActive(false); }}
        />
      )}
      {view === 'run' && currentSession && (
        <RunView
          session={currentSession as RunSession}
          saved={history.find((s) => s.date === currentSession.date && s.day === currentSession.day) as RunSession | undefined}
          onSave={handleRunSave}
          onBack={() => setView('home')}
        />
      )}
      {view === 'body' && (
        <BodyView weighIns={weighIns} onAdd={addWeighIn} onBack={() => setView('home')} />
      )}
      {view === 'history' && (
        <HistoryView
          history={history}
          onBack={() => setView('home')}
          onDelete={deleteSession}
          onOpen={(s) => {
            if (s.type === 'lift') { setCurrentSession(s); setView('workout'); }
            else if (s.type === 'run') { setCurrentSession(s); setView('run'); }
          }}
        />
      )}
      {view === 'settings' && (
        <SettingsView onBack={() => setView('home')} onReset={resetAll} dataSize={history.length} onNav={setView} />
      )}
      {view === 'starting-weights' && (
        <StartingWeightsView startingWeights={startingWeights} onUpdate={updateStartingWeight} onBack={() => setView('home')} />
      )}
      <RestTimerOverlay
        active={restActive}
        remaining={restRemaining}
        total={restTotal}
        onSkip={() => setRestActive(false)}
        onExtend={(s) => { restEndRef.current += s * 1000; setRestTotal((t) => t + s); setRestRemaining((r) => r + s); }}
        onCancel={() => setRestActive(false)}
      />
      {gymPickerDay && (
        <GymPicker onSelect={handleGymSelect} onCancel={() => setGymPickerDay(null)} />
      )}
    </div>
  );
}
