
import React, { useState } from 'react';
import { X, ArrowRight, Check } from 'lucide-react';

interface QuizProps {
    onComplete: (profile: 'SINCRONIZACION' | 'DESINFLAMACION' | 'VITALIDAD', duration: 7 | 15 | 30) => void;
    onClose: () => void;
}

const QUESTIONS = [
    {
        question: "¿Cómo te sientes al despertar?",
        options: [
            { id: 'A', text: "Exhausta, como si no hubiera dormido nada.", type: 'SINCRONIZACION' },
            { id: 'B', text: "Con poca energía, que va cayendo durante el día.", type: 'DESINFLAMACION' },
            { id: 'C', text: "Bien, pero siento mi cuerpo pesado o hinchado.", type: 'VITALIDAD' }
        ]
    },
    {
        question: "¿Qué haces en tus primeros 20 minutos?",
        options: [
            { id: 'A', text: "Reviso el celular y notificaciones.", type: 'SINCRONIZACION' },
            { id: 'B', text: "Tomo café negro y empiezo tareas.", type: 'DESINFLAMACION' },
            { id: 'C', text: "Bebo agua, pero no veo luz natural.", type: 'VITALIDAD' }
        ]
    },
    {
        question: "¿Tu mayor desafío con la alimentación?",
        options: [
            { id: 'A', text: "Hambre emocional y dulces por la noche.", type: 'SINCRONIZACION' },
            { id: 'B', text: "Me siento inflamada tras comer.", type: 'DESINFLAMACION' },
            { id: 'C', text: "Siento que perdí fuerza y gané peso abdominal.", type: 'VITALIDAD' }
        ]
    },
    {
        question: "¿Cómo es tu rutina de sueño?",
        options: [
            { id: 'A', text: "Uso pantallas hasta cerrar los ojos.", type: 'SINCRONIZACION' },
            { id: 'B', text: "Ceno tarde o comidas pesadas.", type: 'DESINFLAMACION' },
            { id: 'C', text: "Duermo en horarios irregulares.", type: 'VITALIDAD' }
        ]
    },
    {
        question: "¿Cuántos días quieres seguir tu rutina personalizada?",
        options: [
            { id: '7', text: "7 días - Inicio Rápido", type: 'DURATION', duration: 7 },
            { id: '15', text: "15 días - Transformación Media", type: 'DURATION', duration: 15 },
            { id: '30', text: "30 días - Cambio Completo", type: 'DURATION', duration: 30 }
        ]
    }
];

export default function QuizModal({ onComplete, onClose }: QuizProps) {
    const [step, setStep] = useState(0);
    const [scores, setScores] = useState({ SINCRONIZACION: 0, DESINFLAMACION: 0, VITALIDAD: 0 });
    const [selectedDuration, setSelectedDuration] = useState<7 | 15 | 30>(15);

    const handleAnswer = (type: string, duration?: number) => {
        // If this is the duration question, store it
        if (type === 'DURATION' && duration) {
            setSelectedDuration(duration as 7 | 15 | 30);
        } else {
            // Otherwise, update profile scores
            const newScores = { ...scores, [type]: scores[type as keyof typeof scores] + 1 };
            setScores(newScores);
        }

        if (step < QUESTIONS.length - 1) {
            setStep(step + 1);
        } else {
            // Calculate Winner
            const winner = Object.keys(scores).reduce((a, b) =>
                scores[a as keyof typeof scores] > scores[b as keyof typeof scores] ? a : b
            );
            onComplete(winner as 'SINCRONIZACION' | 'DESINFLAMACION' | 'VITALIDAD', selectedDuration);
        }
    };

    const currentQ = QUESTIONS[step];

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 animate-in fade-in p-4">
            <div className="bg-white text-zinc-900 rounded-2xl max-w-lg w-full p-6 relative overflow-hidden shadow-2xl">
                <button onClick={onClose} className="absolute top-4 right-4 p-2 hover:bg-zinc-100 rounded-full">
                    <X className="w-5 h-5 text-zinc-400" />
                </button>

                {/* Progress */}
                <div className="w-full bg-zinc-100 h-1 mt-2 mb-6 rounded-full overflow-hidden">
                    <div
                        className="bg-brand-500 h-full transition-all duration-300"
                        style={{ width: `${((step + 1) / QUESTIONS.length) * 100}%` }}
                    />
                </div>

                <h3 className="text-xl font-serif font-bold mb-6">
                    {step + 1}. {currentQ.question}
                </h3>

                <div className="space-y-3">
                    {currentQ.options.map((opt, idx) => (
                        <button
                            key={idx}
                            onClick={() => handleAnswer(opt.type, (opt as any).duration)}
                            className="w-full text-left p-4 rounded-xl border-2 border-zinc-100 hover:border-brand-500 hover:bg-brand-50 transition-all flex items-center justify-between group"
                        >
                            <span className="font-medium text-zinc-700 group-hover:text-brand-900">{opt.text}</span>
                            <ArrowRight className="w-4 h-4 text-zinc-300 group-hover:text-brand-500 opacity-0 group-hover:opacity-100 transition-all" />
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}
