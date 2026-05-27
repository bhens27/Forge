export interface SetData {
  weight?: number | null;
  reps?: number | null;
  done?: boolean;
}

export interface ExerciseSessionData {
  name: string;
  sets: SetData[];
  intent?: 'up' | 'stay' | 'down';
}

export interface Exercise {
  name: string;
  sets: number;
  reps: number | string;
  rest: number;
  note?: string;
  bodyweight?: boolean;
  setTypes?: string[];
  assistable?: boolean;
}

export type IconName = 'flame' | 'wind' | 'moon';

export interface DayConfig {
  name: string;
  subtitle: string;
  type: 'lift' | 'run' | 'rest';
  icon: IconName;
  exercises?: Exercise[];
  runType?: 'intervals' | 'tempo';
}

export interface RunPhase {
  weeks: string;
  intervals: string;
  tempo: string;
}

export type Gym = 'Dropgym' | 'Dilly' | 'Other';

export interface LiftSession {
  date: string;
  day: string;
  name: string;
  subtitle: string;
  type: 'lift';
  gym?: Gym;
  completed?: boolean;
  completedAt?: number;
  exercises: Exercise[];
  sessionData: ExerciseSessionData[];
}

export interface RunSession {
  date: string;
  day: string;
  name: string;
  subtitle: string;
  type: 'run';
  gym?: Gym;
  runType: 'intervals' | 'tempo';
  phase?: number;
  warmupSpeed?: string;
  distPerRep?: string;
  reps?: string;
  speed?: string;
  duration?: string;
  rpe?: number;
  notes?: string;
  saved?: boolean;
}

export interface RestSession {
  date: string;
  day: string;
  name: string;
  subtitle: string;
  type: 'rest';
}

export type Session = LiftSession | RunSession | RestSession;

export interface WeighIn {
  date: string;
  kg: number;
  bf?: number | null;
}

export type ViewName =
  | 'home'
  | 'workout'
  | 'run'
  | 'body'
  | 'history'
  | 'settings'
  | 'starting-weights';
