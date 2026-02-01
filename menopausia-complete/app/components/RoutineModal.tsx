import React from 'react';
import { X } from 'lucide-react';
import AIRoutineTracker from './AIRoutineTracker';
import QuizModal from './QuizModal';
import { ProfileType, RoutineDuration } from '../types/routine.types';

interface RoutineModalProps {
  isOpen: boolean;
  onClose: () => void;
  isGeneratingRoutine: boolean;
  routineError: string | null;
  forceUpdate: number;
  showQuizModal: boolean;
  onQuizComplete: (profile: ProfileType, duration: RoutineDuration) => void;
  onQuizClose: () => void;
  onOpenQuiz: () => void;
}

const RoutineModal: React.FC<RoutineModalProps> = ({
  isOpen,
  onClose,
  isGeneratingRoutine,
  routineError,
  forceUpdate,
  showQuizModal,
  onQuizComplete,
  onQuizClose,
  onOpenQuiz
}) => {
  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 animate-in fade-in">
        <div className="min-h-screen px-4 py-8">
          {/* Header */}
          <div className="sticky top-0 z-10 bg-gradient-to-r from-brand-500 to-brand-600 rounded-2xl shadow-2xl max-w-7xl mx-auto mb-6">
            <div className="p-6 text-white flex items-center justify-between">
              <div>
                <h2 className="text-2xl md:text-3xl font-bold mb-1">Mi Rutina Personalizada</h2>
                <p className="text-brand-100">Generada con IA · Progreso sobre Perfección</p>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-white/20 rounded-full transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="max-w-7xl mx-auto">
            {isGeneratingRoutine ? (
              <div className="text-center py-20 bg-white rounded-2xl shadow-xl">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-brand-200 border-t-brand-600 mb-4"></div>
                <p className="text-lg font-medium text-brand-800">Generando tu rutina personalizada...</p>
                <p className="text-sm text-brand-600 mt-2">Esto puede tomar 30-60 segundos</p>
              </div>
            ) : routineError ? (
              <div className="text-center py-20 bg-white rounded-2xl shadow-xl">
                <p className="text-red-600 font-medium mb-4">{routineError}</p>
                <button
                  onClick={onOpenQuiz}
                  className="px-6 py-2 bg-brand-600 text-white rounded-lg hover:bg-brand-700 transition-colors"
                >
                  Intentar de Nuevo
                </button>
              </div>
            ) : (
              <AIRoutineTracker
                key={forceUpdate}
                onRegenerateRequest={onOpenQuiz}
              />
            )}
          </div>
        </div>
      </div>

      {/* Quiz Modal */}
      {showQuizModal && (
        <QuizModal
          onComplete={onQuizComplete}
          onClose={onQuizClose}
        />
      )}
    </>
  );
};

export default RoutineModal;
