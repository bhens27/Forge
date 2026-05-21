import type { DayConfig, RunPhase } from '../types';

export const REST = {
  heavy: 90,
  compound: 90,
  accessory: 90,
  isolation: 90,
  pullup: 90,
} as const;

export const DAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'] as const;
export const DAY_LONG = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'] as const;

export const PROGRAM: Record<string, DayConfig> = {
  Mon: {
    name: 'Chest & Back', subtitle: 'Heavy Bench Day', type: 'lift', icon: 'flame',
    exercises: [
      { name: 'Smith machine flat bench', sets: 4, reps: 5, rest: REST.heavy, note: '+2.5kg/wk when all reps clean' },
      { name: 'Pull-ups', sets: 4, reps: '1 RIR', rest: REST.pullup, note: 'Per phase progression', bodyweight: true },
      { name: 'Incline DB press', sets: 3, reps: 8, rest: REST.compound },
      { name: 'Machine pec fly', sets: 3, reps: 12, rest: REST.isolation },
      { name: 'Barbell bent-over row', sets: 3, reps: 6, rest: REST.compound, note: 'Heavy' },
      { name: 'Cable row, close grip', sets: 3, reps: 8, rest: REST.accessory },
      { name: 'Tricep pushdown machine', sets: 3, reps: 10, rest: REST.isolation },
    ],
  },
  Tue: { name: 'Intervals', subtitle: '5k Speed Work', type: 'run', icon: 'wind', runType: 'intervals' },
  Wed: {
    name: 'Shoulders & Arms', subtitle: 'Heavy OHP', type: 'lift', icon: 'flame',
    exercises: [
      { name: 'OHP (barbell or DB)', sets: 4, reps: 6, rest: REST.heavy, note: 'Heavy' },
      { name: 'Lateral raises', sets: 3, reps: 12, rest: REST.isolation },
      { name: 'Rear delt fly machine', sets: 3, reps: 12, rest: REST.isolation },
      { name: 'Chin-ups', sets: 3, reps: 8, rest: REST.pullup, note: 'Per phase', bodyweight: true },
      { name: 'Machine dip (loaded)', sets: 3, reps: 8, rest: REST.compound },
      { name: 'Incline DB curl', sets: 3, reps: 10, rest: REST.accessory },
      { name: 'Rope tricep extension', sets: 3, reps: 12, rest: REST.isolation },
    ],
  },
  Thu: {
    name: 'Legs', subtitle: 'Lower Body', type: 'lift', icon: 'flame',
    exercises: [
      { name: 'DB front-foot elevated lunges', sets: 3, reps: '10 ea', rest: REST.compound },
      { name: 'Seated hamstring curls', sets: 3, reps: 10, rest: REST.accessory },
      { name: 'Leg press', sets: 3, reps: 10, rest: REST.compound },
      { name: 'Machine hip thrust', sets: 3, reps: 10, rest: REST.compound },
      { name: 'Leg extensions', sets: 3, reps: 10, rest: REST.isolation },
      { name: 'Calf raises', sets: 3, reps: '12-15', rest: REST.isolation },
      { name: 'Weighted sit-ups', sets: 3, reps: 12, rest: REST.isolation },
      { name: 'Lying leg raises', sets: 3, reps: 12, rest: REST.isolation, bodyweight: true },
    ],
  },
  Fri: {
    name: 'Full Upper', subtitle: 'Volume Bench', type: 'lift', icon: 'flame',
    exercises: [
      { name: 'Pull-ups', sets: 5, reps: '1-2 RIR', rest: REST.pullup, note: 'Per phase', bodyweight: true },
      { name: 'Smith machine flat bench', sets: 3, reps: 8, rest: REST.compound, note: '80% of Mon' },
      { name: 'Close-grip Smith bench', sets: 3, reps: 8, rest: REST.compound },
      { name: 'Chest-supported DB row', sets: 3, reps: 10, rest: REST.accessory },
      { name: 'Seated DB shoulder press', sets: 3, reps: 10, rest: REST.compound, note: 'Moderate' },
      { name: 'Hammer curls', sets: 3, reps: 10, rest: REST.accessory },
      { name: 'Weighted sit-ups', sets: 3, reps: 12, rest: REST.isolation },
    ],
  },
  Sat: { name: 'Peloton / Rest', subtitle: 'Active Recovery', type: 'rest', icon: 'moon' },
  Sun: { name: 'Tempo Run', subtitle: '5k Threshold', type: 'run', icon: 'wind', runType: 'tempo' },
};

export const RUN_PHASES: RunPhase[] = [
  { weeks: '1-2',   intervals: '5-6 × 500m @ 12.5 km/h, 90s rest', tempo: '18 min @ 12 km/h' },
  { weeks: '3-4',   intervals: '5 × 600m @ 13 km/h, 90s rest',      tempo: '20 min @ 12.4 km/h' },
  { weeks: '5',     intervals: '4 × 600m @ 13 km/h (deload)',        tempo: '18 min @ 12.4 km/h' },
  { weeks: '6-8',   intervals: '5 × 800m @ 13.3 km/h, 90s rest',    tempo: '22 min @ 12.85 km/h' },
  { weeks: '9-10',  intervals: '5 × 800m @ 13.6 km/h',              tempo: '24 min @ 13 km/h' },
  { weeks: '11-14', intervals: '5-6 × 800m @ 13.85-14.3 km/h',      tempo: '25 min @ 13.2 km/h' },
];
