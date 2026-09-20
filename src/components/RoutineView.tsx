import React, { useState } from 'react';
import {
  Dumbbell,
  CheckCircle2,
  Clock,
  Timer,
  Zap,
  Flame,
  Info,
  ChevronRight,
  ShieldCheck,
  RotateCcw
} from 'lucide-react';
import { GoalType, Routine, Exercise, UserProfile } from '../types';
import { ROUTINES } from '../data/gymData';
import { RestTimerModal } from './RestTimerModal';
import { WorkoutModal } from './WorkoutModal';
import { playBeepSound } from '../utils/audio';

interface RoutineViewProps {
  userProfile: UserProfile;
  onUpdateGoal: (goal: GoalType) => void;
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

export const RoutineView: React.FC<RoutineViewProps> = ({
  userProfile,
  onUpdateGoal,
  onSaveWorkout,
}) => {
  const currentRoutine = ROUTINES[userProfile.goal] || ROUTINES['Mejorar condición física'];

  // Exercises completed state for active routine
  const [completedExercises, setCompletedExercises] = useState<Record<string, boolean>>({
    [`${currentRoutine.exercises[0]?.id}`]: true,
  });

  // Timer modal state
  const [timerOpen, setTimerOpen] = useState(false);
  const [timerSeconds, setTimerSeconds] = useState(60);
  const [timerExerciseName, setTimerExerciseName] = useState('');

  // Workout register modal state
  const [workoutModalOpen, setWorkoutModalOpen] = useState(false);

  // Goal options for switching
  const goals: { label: GoalType; icon: string; desc: string }[] = [
    { label: 'Ganar fuerza', icon: '🏋️', desc: 'Sobrecarga y potencia' },
    { label: 'Mejorar resistencia', icon: '🏃', desc: 'Intervalos y cardio' },
    { label: 'Mejorar condición física', icon: '⚡', desc: 'Tonificación integral' },
    { label: 'Mantenerse activo', icon: '🧘', desc: 'Movilidad y bienestar' },
  ];

  const handleToggleExercise = (exerciseId: string) => {
    playBeepSound('click');
    setCompletedExercises((prev) => ({
      ...prev,
      [exerciseId]: !prev[exerciseId],
    }));
  };

  const handleOpenTimer = (exercise: Exercise) => {
    playBeepSound('click');
    setTimerSeconds(exercise.restSeconds);
    setTimerExerciseName(exercise.name);
    setTimerOpen(true);
  };

  const completedCount = currentRoutine.exercises.filter((ex) => completedExercises[ex.id]).length;
  const totalCount = currentRoutine.exercises.length;
  const progressPercent = Math.round((completedCount / totalCount) * 100);

  const handleResetExercises = () => {
    playBeepSound('click');
    setCompletedExercises({});
  };

  return (
    <div className="space-y-8 pb-16 animate-in fade-in">
      {/* Header with Goal Selector Tabs */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-amber-500/10 border border-amber-500/20 px-3 py-1 text-xs font-bold text-amber-400">
              <span>Rutina Personalizada</span>
              <span className="text-slate-500">•</span>
              <span>Adaptada a {userProfile.name}</span>
            </div>
            <h1 className="mt-2 text-2xl sm:text-3xl font-black text-white uppercase tracking-tight font-sans">
              Mi Rutina de Entrenamiento
            </h1>
            <p className="text-xs sm:text-sm text-slate-400">
              Diseñada específicamente para alcanzar tu meta con técnica correcta y descansos óptimos.
            </p>
          </div>

          <button
            onClick={() => setWorkoutModalOpen(true)}
            className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-black px-5 py-3 text-xs sm:text-sm shadow-lg shadow-amber-400/20 transition-all active:scale-95 whitespace-nowrap"
          >
            <CheckCircle2 className="h-4 w-4" />
            <span>Finalizar y Registrar Sesión</span>
          </button>
        </div>

        {/* Goal Selector Switcher */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-2 sm:p-3">
          <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 px-2 pb-2">
            Cambiar Objetivo de Entrenamiento (Demostración interactiva):
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
            {goals.map((g) => {
              const isSelected = userProfile.goal === g.label;
              return (
                <button
                  key={g.label}
                  onClick={() => {
                    playBeepSound('click');
                    onUpdateGoal(g.label);
                  }}
                  className={`flex items-center gap-2.5 rounded-xl p-2.5 text-left transition-all border ${
                    isSelected
                      ? 'bg-amber-400/15 border-amber-400 text-white shadow-sm'
                      : 'bg-slate-950 border-slate-800/80 text-slate-300 hover:border-slate-700'
                  }`}
                >
                  <span className="text-2xl select-none">{g.icon}</span>
                  <div className="min-w-0">
                    <p className={`text-xs font-bold truncate ${isSelected ? 'text-amber-300' : 'text-slate-200'}`}>
                      {g.label}
                    </p>
                    <p className="text-[10px] text-slate-400 truncate">{g.desc}</p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Active Routine Highlight Card */}
      <div className="relative overflow-hidden rounded-3xl border border-slate-800 bg-gradient-to-r from-slate-900 via-slate-900/90 to-slate-950 p-6 sm:p-7 shadow-xl">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-amber-400/20 px-3 py-0.5 text-xs font-bold text-amber-300">
                {currentRoutine.goal}
              </span>
              <span className="rounded-full bg-slate-800 px-3 py-0.5 text-xs font-medium text-slate-300">
                Intensidad: <strong className="text-white">{currentRoutine.intensity}</strong>
              </span>
              <span className="rounded-full bg-slate-800 px-3 py-0.5 text-xs font-medium text-slate-300 flex items-center gap-1">
                <Clock className="h-3 w-3 text-amber-400" />
                ~{currentRoutine.estimatedMinutes} min
              </span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-tight">
              {currentRoutine.title}
            </h2>
            <p className="text-sm font-semibold text-amber-300/90">
              {currentRoutine.subtitle}
            </p>
            <p className="text-xs sm:text-sm text-slate-400 max-w-2xl leading-relaxed">
              {currentRoutine.description}
            </p>
          </div>

          {/* Routine Progress Meter */}
          <div className="w-full lg:w-72 rounded-2xl bg-slate-950/80 border border-slate-800 p-4 space-y-3">
            <div className="flex items-center justify-between text-xs font-bold">
              <span className="text-slate-300">Progreso de la sesión:</span>
              <span className="text-amber-400">{progressPercent}%</span>
            </div>

            {/* Progress bar */}
            <div className="h-3 w-full overflow-hidden rounded-full bg-slate-800">
              <div
                className="h-full bg-gradient-to-r from-amber-500 to-amber-300 transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              ></div>
            </div>

            <div className="flex items-center justify-between text-[11px] text-slate-400">
              <span>{completedCount} de {totalCount} completados</span>
              <button
                onClick={handleResetExercises}
                className="text-slate-500 hover:text-slate-300 flex items-center gap-1 transition-colors"
                title="Reiniciar casillas"
              >
                <RotateCcw className="h-3 w-3" />
                <span>Reiniciar</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Exercises List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-black uppercase text-white flex items-center gap-2">
            <Dumbbell className="h-5 w-5 text-amber-400" />
            <span>Ejercicios de la Rutina ({totalCount})</span>
          </h3>
          <span className="text-xs text-slate-400">
            Marca el checkbox al terminar cada ejercicio
          </span>
        </div>

        <div className="space-y-3">
          {currentRoutine.exercises.map((exercise, index) => {
            const isCompleted = !!completedExercises[exercise.id];
            return (
              <div
                key={exercise.id}
                id={`exercise-card-${exercise.id}`}
                className={`group relative overflow-hidden rounded-2xl border transition-all duration-200 ${
                  isCompleted
                    ? 'border-emerald-500/40 bg-emerald-950/10 shadow-sm'
                    : 'border-slate-800 bg-slate-900/70 hover:border-slate-700'
                } p-4 sm:p-5`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  {/* Left: Checkbox & Name */}
                  <div className="flex items-start gap-3.5">
                    <button
                      id={`checkbox-exercise-${exercise.id}`}
                      onClick={() => handleToggleExercise(exercise.id)}
                      className={`mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border transition-all ${
                        isCompleted
                          ? 'bg-emerald-500 border-emerald-400 text-slate-950 shadow-md shadow-emerald-500/25'
                          : 'border-slate-700 bg-slate-950 hover:border-amber-400/80 text-transparent'
                      }`}
                    >
                      <CheckCircle2 className="h-4 w-4 stroke-[3]" />
                    </button>

                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="flex h-5 w-5 items-center justify-center rounded-md bg-slate-800 text-[10px] font-bold text-slate-300">
                          {index + 1}
                        </span>
                        <h4 className={`text-base font-bold transition-colors ${
                          isCompleted ? 'text-emerald-300 line-through decoration-emerald-500/50' : 'text-white'
                        }`}>
                          {exercise.name}
                        </h4>
                        <span className="rounded-full bg-slate-800 px-2.5 py-0.5 text-[10px] font-semibold text-amber-300">
                          {exercise.targetMuscle}
                        </span>
                      </div>

                      <p className="text-xs text-slate-300 leading-relaxed max-w-2xl">
                        {exercise.instructions}
                      </p>

                      {exercise.tips && (
                        <p className="text-[11px] text-slate-400 flex items-center gap-1.5 pt-0.5">
                          <Info className="h-3 w-3 text-cyan-400 shrink-0" />
                          <span><strong className="text-slate-300">Tip de técnica:</strong> {exercise.tips}</span>
                        </p>
                      )}

                      <div className="pt-1 flex items-center gap-2 text-[10px] text-slate-400">
                        <span>Equipamiento: {exercise.equipment}</span>
                      </div>
                    </div>
                  </div>

                  {/* Right: Series & Reps Badges & Rest Timer button */}
                  <div className="flex flex-wrap sm:flex-col items-end gap-2 shrink-0 self-end sm:self-center">
                    <div className="flex items-center gap-2">
                      <span className="rounded-xl bg-slate-950 border border-slate-800 px-3 py-1.5 text-xs font-black text-amber-400 whitespace-nowrap">
                        {exercise.series} Series
                      </span>
                      <span className="rounded-xl bg-slate-950 border border-slate-800 px-3 py-1.5 text-xs font-black text-white whitespace-nowrap">
                        {exercise.reps}
                      </span>
                    </div>

                    <button
                      onClick={() => handleOpenTimer(exercise)}
                      className="flex items-center gap-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 px-3 py-1.5 text-xs font-bold text-slate-300 hover:text-white transition-colors"
                      title="Abrir temporizador para este ejercicio"
                    >
                      <Timer className="h-3.5 w-3.5 text-amber-400" />
                      <span>Descanso: {exercise.restSeconds}s</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Completion CTA Banner */}
      <div className="rounded-2xl border border-amber-500/30 bg-gradient-to-r from-amber-500/10 via-slate-900 to-slate-950 p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-400 text-slate-950 text-2xl font-bold">
            ⭐
          </div>
          <div>
            <h4 className="text-base font-black text-white uppercase">
              {progressPercent === 100 ? '¡Rutina Completada al 100%!' : '¿Terminaste tu entrenamiento?'}
            </h4>
            <p className="text-xs text-slate-400">
              Registra tu sesión para sumar tus estrellas, avanzar en los retos semanales y mantener tu racha activa.
            </p>
          </div>
        </div>

        <button
          onClick={() => setWorkoutModalOpen(true)}
          className="w-full sm:w-auto rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black px-6 py-3 text-sm shadow-md shadow-amber-400/25 transition-all active:scale-95 whitespace-nowrap"
        >
          Registrar Entrenamiento Ahora
        </button>
      </div>

      {/* Rest Timer Modal */}
      <RestTimerModal
        isOpen={timerOpen}
        onClose={() => setTimerOpen(false)}
        defaultSeconds={timerSeconds}
        exerciseName={timerExerciseName}
      />

      {/* Workout Register Modal */}
      <WorkoutModal
        isOpen={workoutModalOpen}
        onClose={() => setWorkoutModalOpen(false)}
        currentRoutine={currentRoutine}
        completedExercisesCount={completedCount}
        totalExercisesCount={totalCount}
        onSaveWorkout={onSaveWorkout}
      />
    </div>
  );
};
