import {
  GeneratedRoutine,
  RoutineProgress,
  RoutineStorage,
  DayProgress,
  TaskProgress
} from '../types/routine.types';

const STORAGE_KEY = 'menopausa_ai_routine_v2';
const LEGACY_KEY = 'menopausa_gamification_v1';

// Initialize or get storage
export function getRoutineStorage(): RoutineStorage {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error('Error reading routine storage:', error);
  }

  // Return empty storage
  return {
    version: 'v2_ai_routine',
    activeRoutine: null,
    progress: null,
    history: []
  };
}

// Save storage
export function saveRoutineStorage(storage: RoutineStorage): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(storage));
  } catch (error) {
    console.error('Error saving routine storage:', error);
    throw error;
  }
}

// Save new generated routine
export function saveGeneratedRoutine(routine: GeneratedRoutine): void {
  const storage = getRoutineStorage();

  // Add current active to history if exists
  if (storage.activeRoutine) {
    storage.history.unshift(storage.activeRoutine);
    storage.history = storage.history.slice(0, 3); // Keep last 3
  }

  // Set as active
  storage.activeRoutine = routine;

  // Initialize progress
  storage.progress = {
    routineId: routine.id,
    startDate: new Date().toISOString().split('T')[0],
    currentDay: 1,
    dailyProgress: [],
    lastUpdated: new Date().toISOString()
  };

  saveRoutineStorage(storage);
}

// Get active routine
export function getActiveRoutine(): GeneratedRoutine | null {
  return getRoutineStorage().activeRoutine;
}

// Get progress
export function getRoutineProgress(): RoutineProgress | null {
  return getRoutineStorage().progress;
}

// Update task completion
export function updateTaskCompletion(
  day: number,
  slotIndex: number,
  completed: boolean
): void {
  const storage = getRoutineStorage();

  if (!storage.progress) {
    throw new Error('No active routine progress');
  }

  // Find or create day progress
  let dayProgress = storage.progress.dailyProgress.find(dp => dp.day === day);

  if (!dayProgress) {
    dayProgress = {
      day,
      date: new Date().toISOString().split('T')[0],
      tasks: [],
      completionPercentage: 0
    };
    storage.progress.dailyProgress.push(dayProgress);
  }

  // Update task
  let taskProgress = dayProgress.tasks.find(t => t.slotIndex === slotIndex);

  if (!taskProgress) {
    taskProgress = { slotIndex, completed: false };
    dayProgress.tasks.push(taskProgress);
  }

  taskProgress.completed = completed;
  taskProgress.completedAt = completed ? new Date().toISOString() : undefined;

  // Recalculate completion percentage
  const routine = storage.activeRoutine;
  if (routine) {
    const dayRoutine = routine.routines.find(r => r.day === day);
    if (dayRoutine) {
      const totalTasks = dayRoutine.slots.length;
      const completedTasks = dayProgress.tasks.filter(t => t.completed).length;
      dayProgress.completionPercentage = Math.round((completedTasks / totalTasks) * 100);
    }
  }

  // Update current day
  storage.progress.currentDay = day;
  storage.progress.lastUpdated = new Date().toISOString();

  saveRoutineStorage(storage);
}

// Check if migration needed from legacy
export function needsMigration(): boolean {
  const hasLegacy = localStorage.getItem(LEGACY_KEY) !== null;
  const hasNew = localStorage.getItem(STORAGE_KEY) !== null;
  return hasLegacy && !hasNew;
}

// Migrate from legacy (optional - just clear old data)
export function migrateLegacyData(): void {
  if (needsMigration()) {
    // We don't migrate data, just acknowledge the change
    console.log('Legacy gamification data detected. New AI routine will replace it.');
    // Optionally: localStorage.removeItem(LEGACY_KEY);
  }
}

// Clear all data (for regeneration)
export function clearRoutineData(): void {
  localStorage.removeItem(STORAGE_KEY);
}

// Get overall progress percentage across all days
export function getOverallProgress(): number {
  const storage = getRoutineStorage();

  if (!storage.activeRoutine || !storage.progress) {
    return 0;
  }

  const totalDays = storage.activeRoutine.duration;
  const completedDays = storage.progress.dailyProgress.filter(
    dp => dp.completionPercentage === 100
  ).length;

  return Math.round((completedDays / totalDays) * 100);
}

// Check if a specific day is completed
export function isDayCompleted(day: number): boolean {
  const progress = getRoutineProgress();

  if (!progress) {
    return false;
  }

  const dayProgress = progress.dailyProgress.find(dp => dp.day === day);
  return dayProgress?.completionPercentage === 100;
}

// Get progress for a specific day
export function getDayProgress(day: number): DayProgress | undefined {
  const progress = getRoutineProgress();
  return progress?.dailyProgress.find(dp => dp.day === day);
}

// Check if a specific task is completed
export function isTaskCompleted(day: number, slotIndex: number): boolean {
  const dayProgress = getDayProgress(day);

  if (!dayProgress) {
    return false;
  }

  const taskProgress = dayProgress.tasks.find(t => t.slotIndex === slotIndex);
  return taskProgress?.completed || false;
}
