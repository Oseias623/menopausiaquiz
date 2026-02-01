
import React, { useState, useEffect } from 'react';
import { CheckCircle2, Circle, Sun, Moon, Utensils, Award, Zap, Battery, Droplets, Dumbbell, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';
import QuizModal from './QuizModal';

interface DailyLog {
    morning_light: boolean;
    morning_water: boolean;
    no_screens: boolean;
    protein_meals: boolean;
    movement: boolean;
    night_routine: boolean;
    gut_health: boolean; // For Phase 3
}

interface UserProgress {
    startDate: string;
    totalDaysCompleted: number;
    lastLogDate: string;
    level: string;
    logs: Record<string, DailyLog>;
    profile?: 'SINCRONIZACION' | 'DESINFLAMACION' | 'VITALIDAD';
}

const PHASES = {
    1: { name: 'Fase 1: Reset Circadiano', days: [1, 7], color: 'text-amber-600', bg: 'bg-amber-100', border: 'border-amber-200' },
    2: { name: 'Fase 2: Ativação Metabólica', days: [8, 15], color: 'text-green-600', bg: 'bg-green-100', border: 'border-green-200' },
    3: { name: 'Fase 3: Vitalidade Total', days: [16, 30], color: 'text-purple-600', bg: 'bg-purple-100', border: 'border-purple-200' }
};

const PROFILE_CONFIG = {
    'SINCRONIZACION': { label: 'Sincronización', color: 'text-blue-600', bg: 'bg-blue-50', focus: ['morning_light', 'night_routine', 'no_screens'] },
    'DESINFLAMACION': { label: 'Desinflamación', color: 'text-emerald-600', bg: 'bg-emerald-50', focus: ['morning_water', 'protein_meals'] },
    'VITALIDAD': { label: 'Vitalidad', color: 'text-rose-600', bg: 'bg-rose-50', focus: ['movement', 'gut_health'] }
};

export default function DailyTracker() {
    const [progress, setProgress] = useState<UserProgress | null>(null);
    const [todayStr, setTodayStr] = useState('');
    const [showQuiz, setShowQuiz] = useState(false);

    // Initialize
    useEffect(() => {
        const saved = localStorage.getItem('menopausa_gamification_v1');
        const now = new Date();
        const dateStr = now.toISOString().split('T')[0];
        setTodayStr(dateStr);

        if (saved) {
            setProgress(JSON.parse(saved));
        } else {
            // New User
            const newProgress: UserProgress = {
                startDate: dateStr,
                totalDaysCompleted: 0,
                lastLogDate: '',
                level: 'Iniciante',
                logs: {}
            };
            setProgress(newProgress);
            localStorage.setItem('menopausa_gamification_v1', JSON.stringify(newProgress));
        }
    }, []);

    if (!progress) return null;

    // Calculate Day Number
    const start = new Date(progress.startDate);
    const today = new Date();
    const diffTime = Math.abs(today.getTime() - start.getTime());
    const dayNumber = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) || 1;

    // Determine Phase
    let phase = 1;
    if (dayNumber > 7) phase = 2;
    if (dayNumber > 15) phase = 3;

    // Get today's log or default
    const todayLog = progress.logs[todayStr] || {
        morning_light: false,
        morning_water: false,
        no_screens: false,
        protein_meals: false,
        movement: false,
        night_routine: false,
        gut_health: false
    };

    const activeTasks = getActiveTasks(phase);

    // Calculate Progress
    const completedCount = activeTasks.filter(t => todayLog[t.key as keyof DailyLog]).length;
    const totalCount = activeTasks.length;
    const percent = Math.round((completedCount / totalCount) * 100);

    const handleToggle = (key: keyof DailyLog) => {
        const newVal = !todayLog[key];
        const newLog = { ...todayLog, [key]: newVal };

        // Check for 100% completion
        const newCompletedCount = activeTasks.filter(t => newLog[t.key as keyof DailyLog]).length;
        if (newCompletedCount === totalCount && newVal === true) {
            confetti({
                particleCount: 100,
                spread: 70,
                origin: { y: 0.6 }
            });
        }

        const newProgress = {
            ...progress,
            logs: {
                ...progress.logs,
                [todayStr]: newLog
            }
        };

        setProgress(newProgress);
        localStorage.setItem('menopausa_gamification_v1', JSON.stringify(newProgress));
    };

    const handleQuizComplete = (profile: 'SINCRONIZACION' | 'DESINFLAMACION' | 'VITALIDAD') => {
        const newProgress = { ...progress, profile };
        setProgress(newProgress);
        localStorage.setItem('menopausa_gamification_v1', JSON.stringify(newProgress));
        setShowQuiz(false);
        confetti({ particleCount: 50, spread: 50 });
    };

    // Helper to get task list based on phase
    function getActiveTasks(phase: number) {
        const basic = [
            { key: 'morning_light', label: 'Luz Natural (15 min)', icon: Sun, desc: 'Antes das 10h' },
            { key: 'morning_water', label: 'Água Morna + Limão', icon: Droplets, desc: 'Jejum' },
            { key: 'night_routine', label: 'Luz Baixa após 19h', icon: Moon, desc: 'Prepare-se para dormir' }
        ];

        if (phase >= 2) {
            basic.push({ key: 'protein_meals', label: 'Proteína (25g+)', icon: Utensils, desc: 'Em todas as refeições' });
            basic.push({ key: 'movement', label: 'Força (15 min)', icon: Dumbbell, desc: 'Ou caminhada rápida' });
        }

        if (phase >= 3) {
            basic.push({ key: 'gut_health', label: 'Alimento Vivo', icon: Zap, desc: 'Iogurte, Kefir ou Fermentado' });
        }
        return basic;
    }

    const phaseConfig = PHASES[phase as 1 | 2 | 3] || PHASES[3];

    // Sort tasks: Focus tasks first if profile is set
    const sortedTasks = [...activeTasks].sort((a, b) => {
        if (!progress.profile) return 0;
        const config = PROFILE_CONFIG[progress.profile];
        const aFocus = config.focus.includes(a.key);
        const bFocus = config.focus.includes(b.key);
        if (aFocus && !bFocus) return -1;
        if (!aFocus && bFocus) return 1;
        return 0;
    });

    return (
        <div className="w-full max-w-4xl mx-auto px-4 mb-12">
            {showQuiz && <QuizModal onComplete={handleQuizComplete} onClose={() => setShowQuiz(false)} />}

            <div className={`bg-white rounded-2xl shadow-xl border overflow-hidden ${phaseConfig.border}`}>

                {/* HEADER */}
                <div className={`${phaseConfig.bg} p-6 flex flex-col md:flex-row items-center justify-between gap-4`}>
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <span className={`text-xs font-bold uppercase tracking-widest px-2 py-1 rounded bg-white/50 ${phaseConfig.color}`}>
                                {phaseConfig.name}
                            </span>
                            <span className="text-zinc-500 text-xs font-medium uppercase tracking-wider">
                                Dia {dayNumber}
                            </span>
                        </div>
                        <h2 className={`text-2xl font-serif font-bold ${phaseConfig.color} flex items-center gap-2`}>
                            <Award className="w-6 h-6" />
                            {progress.level}
                        </h2>

                        {/* Profile Badge or CTA */}
                        {progress.profile ? (
                            <div className="mt-2 flex items-center gap-2 text-sm font-medium bg-white/60 px-3 py-1 rounded-full w-fit">
                                <Sparkles className={`w-4 h-4 ${PROFILE_CONFIG[progress.profile].color}`} />
                                <span className="text-zinc-600">Foco: </span>
                                <span className={PROFILE_CONFIG[progress.profile].color}>{PROFILE_CONFIG[progress.profile].label}</span>
                            </div>
                        ) : (
                            <button
                                onClick={() => setShowQuiz(true)}
                                className="mt-3 text-xs font-bold bg-white text-brand-600 px-3 py-1.5 rounded-full shadow-sm hover:shadow-md hover:bg-brand-50 transition-all flex items-center gap-1"
                            >
                                <Sparkles className="w-3 h-3" />
                                Personalizar Minha Jornada
                            </button>
                        )}
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full md:w-48">
                        <div className="flex justify-between text-xs font-bold text-zinc-500 mb-1">
                            <span>Progresso Hoje</span>
                            <span>{percent}%</span>
                        </div>
                        <div className="h-3 w-full bg-white/50 rounded-full overflow-hidden">
                            <div
                                className={`h-full transition-all duration-500 ${phase === 1 ? 'bg-amber-500' : phase === 2 ? 'bg-green-500' : 'bg-purple-500'}`}
                                style={{ width: `${percent}%` }}
                            />
                        </div>
                    </div>
                </div>

                {/* TASKS GRID */}
                <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {sortedTasks.map((task) => {
                        const isDone = !!todayLog[task.key as keyof DailyLog];
                        const Icon = task.icon;

                        // Check if prioritized
                        const isFocus = progress.profile && PROFILE_CONFIG[progress.profile].focus.includes(task.key);

                        return (
                            <div
                                key={task.key}
                                onClick={() => handleToggle(task.key as keyof DailyLog)}
                                className={`
                    cursor-pointer p-4 rounded-xl border transition-all duration-200 flex items-start gap-4 hover:shadow-md relative
                    ${isDone ? 'bg-zinc-50 border-brand-200' : 'bg-white border-zinc-100 hover:border-brand-200'}
                    ${isFocus && !isDone ? 'ring-2 ring-brand-200 ring-offset-1' : ''}
                 `}
                            >
                                {isFocus && (
                                    <div className="absolute -top-2 -right-2 bg-brand-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm flex items-center gap-1">
                                        <Sparkles className="w-2.5 h-2.5" /> FOCO
                                    </div>
                                )}

                                <div className={`
                    p-2 rounded-full shrink-0 transition-colors
                    ${isDone ? 'bg-brand-100 text-brand-600' : 'bg-zinc-100 text-zinc-400'}
                 `}>
                                    <Icon className="w-5 h-5" />
                                </div>

                                <div className="flex-1">
                                    <h4 className={`font-bold text-sm ${isDone ? 'text-zinc-800' : 'text-zinc-500'}`}>
                                        {task.label}
                                    </h4>
                                    <p className="text-xs text-zinc-400 mt-0.5">{task.desc}</p>
                                </div>

                                <div className={isDone ? 'text-brand-500' : 'text-zinc-200'}>
                                    {isDone ? <CheckCircle2 className="w-6 h-6" /> : <Circle className="w-6 h-6" />}
                                </div>
                            </div>
                        )
                    })}
                </div>

            </div>
        </div>
    );
}
