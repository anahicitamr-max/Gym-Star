import React, { useState } from 'react';
import { X, Dumbbell, Clock, CheckCircle, Sparkles, Smile } from 'lucide-react';
import confetti from 'canvas-confetti';
import { GoalType, Routine } from '../types';
import { playBeepSound } from '../utils/audio';

interface WorkoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentRoutine: Routine;
  completedExercisesCount: number;
  totalExercisesCount: number;
  onSaveWorkout: (workout: {
    durationMinutes: number;
    routineTitle: string;
    goal: GoalType;
    exercisesCompleted: number;
    totalExercises: number;
    notes: string;
    feeling: string;
  }) => void;
}

export const WorkoutModal: React.FC<WorkoutModalProps> = ({
  isOpen,
  onClose,
  currentRoutine,
  completedExercisesCount,
  totalExercisesCount,
  onSaveWorkout,
}) => {
  const [duration, setDuration] = useState(currentRoutine.estimatedMinutes || 45);
  const [feeling, setFeeling] = useState('💪 Fuerte y motivado');
  const [notes, setNotes] = useState('');

  if (!isOpen) return null;

  const feelings = [
    '🔥 Con mucha energía',
    '💪 Fuerte y motivado',
    '😅 Exigente pero cumplí',
    '🧘 Sesión de recuperación',
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    playBeepSound('success');

    // Confetti celebration
    try {
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#fbbf24', '#f59e0b', '#10b981', '#06b6d4', '#f97316'],
      });
    } catch {
      // safe fallback
    }

    onSaveWorkout({
      durationMinutes: Number(duration),
      routineTitle: currentRoutine.title,
      goal: currentRoutine.goal,
      exercisesCompleted: completedExercisesCount > 0 ? completedExercisesCount : totalExercisesCount,
      totalExercises: totalExercisesCount,
      notes,
      feeling,
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-sm animate-in fade-in">
      <div className="relative w-full max-w-md rounded-3xl border border-slate-700 bg-slate-900 p-6 sm:p-7 shadow-2xl space-y-6">
        
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/20 text-emerald-400 font-bold">
              <Dumbbell className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-lg font-black uppercase text-white">
                Registrar Entrenamiento
              </h3>
              <p className="text-xs text-slate-400">
                ¡Gran trabajo! Guarda tus avances en Gym Star
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="rounded-full p-2 text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Routine info summary */}
          <div className="rounded-2xl bg-slate-950/70 border border-slate-800 p-4 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-400">Rutina Realizada:</span>
              <span className="text-xs font-bold text-amber-400">{currentRoutine.title}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-400">Ejercicios marcados:</span>
              <span className="text-xs font-bold text-emerald-400">
                {completedExercisesCount > 0 ? completedExercisesCount : totalExercisesCount} de {totalExercisesCount} completados
              </span>
            </div>
            <div className="flex items-center justify-between pt-1 border-t border-slate-800/80">
              <span className="text-xs font-semibold text-slate-400 flex items-center gap-1">
                <Sparkles className="h-3 w-3 text-amber-400" />
                Recompensa estimada:
              </span>
              <span className="text-xs font-black text-amber-300">+35 Estrellas ⭐</span>
            </div>
          </div>

          {/* Duration input */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5 text-amber-400" />
              Duración de la sesión (minutos)
            </label>
            <div className="flex items-center gap-3">
              <input
                type="number"
                min="10"
                max="180"
                value={duration}
                onChange={(e) => setDuration(Number(e.target.value))}
                className="w-full rounded-xl bg-slate-950 border border-slate-800 px-4 py-2.5 text-sm font-bold text-white focus:border-amber-400 focus:outline-none"
                required
              />
              <span className="text-xs font-medium text-slate-400 whitespace-nowrap">minutos</span>
            </div>
          </div>

          {/* Feeling Selection */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
              <Smile className="h-3.5 w-3.5 text-amber-400" />
              ¿Cómo te sentiste hoy?
            </label>
            <div className="grid grid-cols-2 gap-2">
              {feelings.map((item) => (
                <button
                  type="button"
                  key={item}
                  onClick={() => setFeeling(item)}
                  className={`rounded-xl p-2 text-xs font-semibold text-left transition-all border ${
                    feeling === item
                      ? 'bg-amber-400/20 border-amber-400 text-amber-200'
                      : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'
                  }`}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>

          {/* Notes */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-300">
              Notas o logros del día (opcional)
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Ej: Aumenté 2 repeticiones en sentadilla, buena hidratación..."
              className="w-full rounded-xl bg-slate-950 border border-slate-800 px-4 py-2 text-xs text-white placeholder-slate-500 focus:border-amber-400 focus:outline-none resize-none"
            />
          </div>

          {/* Submit */}
          <div className="pt-3">
            <button
              type="submit"
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 py-3 text-sm font-black text-slate-950 shadow-lg shadow-amber-400/25 transition-all active:scale-95"
            >
              <CheckCircle className="h-4 w-4" />
              <span>Confirmar y Sumar Estrellas ⭐</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
