
import React, { useState, useEffect } from 'react';
import { GeneratedRoutine, DailyRoutine, TimeSlot, RoutineProgress } from '../types/routine.types';
import {
  getActiveRoutine,
  getRoutineProgress,
  updateTaskCompletion,
  getOverallProgress,
  isDayCompleted,
  getDayProgress
} from '../services/routineStorage';
import confetti from 'canvas-confetti';
import { CheckCircle2, Circle, Sun, Moon, Utensils, Award, Zap, Battery, Droplets, Sparkles } from 'lucide-react';

interface AIRoutineTrackerProps {
  onRegenerateRequest?: () => void;
}

const AIRoutineTracker: React.FC<AIRoutineTrackerProps> = ({ onRegenerateRequest }) => {
  const [routine, setRoutine] = useState<GeneratedRoutine | null>(null);
  const [progress, setProgress] = useState<RoutineProgress | null>(null);
  const [selectedDay, setSelectedDay] = useState<number>(1);
  const [loading, setLoading] = useState(true);

  // Load routine on mount
  useEffect(() => {
    loadRoutineData();
  }, []);

  const loadRoutineData = () => {
    setLoading(true);
    const activeRoutine = getActiveRoutine();
    const currentProgress = getRoutineProgress();

    setRoutine(activeRoutine);
    setProgress(currentProgress);

    if (currentProgress) {
      setSelectedDay(currentProgress.currentDay);
    }

    setLoading(false);
  };

  const handleTaskToggle = (slotIndex: number, completed: boolean) => {
    if (!routine) return;

    updateTaskCompletion(selectedDay, slotIndex, completed);
    loadRoutineData(); // Refresh data

    // Check if day is now 100% completed
    const dayProgress = getDayProgress(selectedDay);
    if (dayProgress?.completionPercentage === 100 && completed) {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    }
  };

  const getDayRoutine = (): DailyRoutine | undefined => {
    return routine?.routines.find(r => r.day === selectedDay);
  };

  const isTaskCompleted = (slotIndex: number): boolean => {
    const dayProgress = getDayProgress(selectedDay);
    const taskProgress = dayProgress?.tasks.find(t => t.slotIndex === slotIndex);
    return taskProgress?.completed || false;
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-brand-200 border-t-brand-600"></div>
        <p className="text-brand-700 mt-4">Cargando tu rutina...</p>
      </div>
    );
  }

  if (!routine) {
    return (
      <div className="text-center py-12 bg-white rounded-2xl shadow-xl p-8 mx-4">
        <Sparkles className="w-16 h-16 text-brand-500 mx-auto mb-4" />
        <h3 className="text-xl font-bold text-brand-900 mb-2">No hay rutina activa</h3>
        <p className="text-brand-600 mb-6">
          Completa el cuestionario para generar tu rutina personalizada con IA.
        </p>
        {onRegenerateRequest && (
          <button
            onClick={onRegenerateRequest}
            className="px-6 py-3 bg-brand-600 text-white rounded-lg hover:bg-brand-700 transition-colors font-medium"
          >
            Completar Cuestionario
          </button>
        )}
      </div>
    );
  }

  const dayRoutine = getDayRoutine();
  const dayProgress = getDayProgress(selectedDay);
  const overallProgress = getOverallProgress();

  // Get category icon
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'morning': return Sun;
      case 'midday': return Zap;
      case 'afternoon': return Battery;
      case 'evening': return Moon;
      case 'night': return Moon;
      default: return Sparkles;
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto px-4">
      {/* Header Section */}
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-6">
        <div className="bg-gradient-to-r from-brand-500 to-brand-600 p-6 text-white">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Award className="w-6 h-6" />
                <h2 className="text-2xl font-bold">Mi Rutina Personalizada</h2>
              </div>
              <div className="flex items-center gap-3 text-brand-100">
                <span className="px-3 py-1 bg-white/20 rounded-full text-sm font-medium">
                  {routine.profile}
                </span>
                <span className="text-sm">
                  Día {selectedDay} de {routine.duration}
                </span>
              </div>
            </div>
            <div className="text-center md:text-right">
              <div className="text-3xl font-bold mb-1">{overallProgress}%</div>
              <div className="text-sm text-brand-100">Progreso Total</div>
            </div>
          </div>
        </div>

        {/* Day Navigation */}
        <div className="p-6 bg-zinc-50">
          <div className="grid grid-cols-7 md:grid-cols-10 gap-2">
            {routine.routines.map((r) => (
              <button
                key={r.day}
                onClick={() => setSelectedDay(r.day)}
                className={`
                  relative p-3 rounded-lg font-bold transition-all text-center
                  ${selectedDay === r.day
                    ? 'bg-brand-600 text-white shadow-lg scale-105'
                    : isDayCompleted(r.day)
                      ? 'bg-green-100 text-green-700 hover:bg-green-200'
                      : 'bg-white text-zinc-600 hover:bg-brand-50 hover:text-brand-700'
                  }
                `}
              >
                {r.day}
                {isDayCompleted(r.day) && selectedDay !== r.day && (
                  <CheckCircle2 className="w-4 h-4 absolute top-1 right-1 text-green-600" />
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Phase Indicator */}
      {dayRoutine && (
        <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl shadow-xl p-6 text-white mb-6">
          <div className="flex items-center gap-3 mb-2">
            <Sparkles className="w-6 h-6" />
            <h3 className="text-xl font-bold">{dayRoutine.phase}</h3>
          </div>
          <p className="text-purple-100 text-lg">{dayRoutine.focusArea}</p>
        </div>
      )}

      {/* Daily Schedule */}
      {dayRoutine && (
        <div className="space-y-4 mb-6">
          {dayRoutine.slots.map((slot, index) => {
            const isDone = isTaskCompleted(index);
            const Icon = getCategoryIcon(slot.category);

            return (
              <div
                key={index}
                className={`
                  bg-white rounded-2xl shadow-md hover:shadow-lg transition-all overflow-hidden
                  ${isDone ? 'border-2 border-green-200 bg-green-50/30' : 'border-2 border-transparent'}
                `}
              >
                <div className="flex items-start gap-4 p-6">
                  {/* Time & Icon */}
                  <div className="flex flex-col items-center gap-2 min-w-[80px]">
                    <div className={`
                      w-12 h-12 rounded-full flex items-center justify-center
                      ${isDone ? 'bg-green-100 text-green-600' : 'bg-brand-100 text-brand-600'}
                    `}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-sm font-bold text-brand-700">{slot.time}</span>
                  </div>

                  {/* Content */}
                  <div className="flex-1">
                    <h4 className={`text-lg font-bold mb-2 ${isDone ? 'text-zinc-500 line-through' : 'text-zinc-900'}`}>
                      {slot.title}
                    </h4>
                    <p className="text-zinc-600 text-sm leading-relaxed mb-3">
                      {slot.description}
                    </p>
                    <div className="flex items-center gap-4 text-xs text-zinc-500">
                      <span className="flex items-center gap-1">
                        <Battery className="w-3 h-3" />
                        {slot.estimatedMinutes} min
                      </span>
                      <span className="px-2 py-1 bg-brand-50 text-brand-700 rounded-full capitalize">
                        {slot.category}
                      </span>
                    </div>
                  </div>

                  {/* Checkbox */}
                  <button
                    onClick={() => handleTaskToggle(index, !isDone)}
                    className="shrink-0"
                  >
                    {isDone ? (
                      <CheckCircle2 className="w-8 h-8 text-green-600" />
                    ) : (
                      <Circle className="w-8 h-8 text-zinc-300 hover:text-brand-500 transition-colors" />
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Day Progress Bar */}
      {dayProgress && (
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-6">
          <div className="flex justify-between items-center mb-3">
            <span className="text-sm font-bold text-zinc-700">Progreso del Día {selectedDay}</span>
            <span className="text-2xl font-bold text-brand-600">{dayProgress.completionPercentage}%</span>
          </div>
          <div className="h-4 w-full bg-zinc-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-green-400 to-green-600 transition-all duration-500"
              style={{ width: `${dayProgress.completionPercentage}%` }}
            />
          </div>
        </div>
      )}

      {/* Actions */}
      {onRegenerateRequest && (
        <div className="text-center pb-8">
          <button
            onClick={onRegenerateRequest}
            className="px-8 py-3 bg-white border-2 border-brand-300 text-brand-700 rounded-lg hover:bg-brand-50 hover:border-brand-500 transition-colors font-medium"
          >
            Generar Nueva Rutina
          </button>
        </div>
      )}
    </div>
  );
};

export default AIRoutineTracker;
