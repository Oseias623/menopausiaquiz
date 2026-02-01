// Core routine types for AI-generated personalized routines

export type ProfileType = 'SINCRONIZACION' | 'DESINFLAMACION' | 'VITALIDAD';
export type RoutineDuration = 7 | 15 | 30;

// AI-generated routine structure
export interface TimeSlot {
  time: string; // e.g., "07:00"
  title: string; // e.g., "Morning Hydration"
  description: string; // Detailed instructions
  category: 'morning' | 'midday' | 'afternoon' | 'evening' | 'night';
  estimatedMinutes: number;
}

export interface DailyRoutine {
  day: number; // 1-30
  phase: string; // e.g., "Reset Circadiano", "Ativação Metabólica", "Vitalidade Total"
  date: string; // ISO date when routine is for
  slots: TimeSlot[];
  focusArea: string; // Daily focus theme
}

export interface GeneratedRoutine {
  id: string; // Unique ID for this routine generation
  profile: ProfileType;
  duration: RoutineDuration;
  generatedAt: string; // ISO timestamp
  routines: DailyRoutine[]; // Array of daily routines
  metadata: {
    geminiModel: string;
    promptVersion: string;
  };
}

// Progress tracking
export interface TaskProgress {
  slotIndex: number;
  completed: boolean;
  completedAt?: string; // ISO timestamp
}

export interface DayProgress {
  day: number;
  date: string;
  tasks: TaskProgress[];
  completionPercentage: number;
}

export interface RoutineProgress {
  routineId: string; // Links to GeneratedRoutine.id
  startDate: string; // ISO date when user started
  currentDay: number;
  dailyProgress: DayProgress[];
  lastUpdated: string; // ISO timestamp
}

// Storage schema
export interface RoutineStorage {
  version: 'v2_ai_routine';
  activeRoutine: GeneratedRoutine | null;
  progress: RoutineProgress | null;
  history: GeneratedRoutine[]; // Keep last 3 generations
}
