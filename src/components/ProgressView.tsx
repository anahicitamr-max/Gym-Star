import React from 'react';
import {
  TrendingUp,
  Calendar,
  Flame,
  CheckCircle2,
  Award,
  Clock,
  Dumbbell,
  Sparkles,
  ArrowUpRight,
  Plus
} from 'lucide-react';
import { UserStats, UserProfile, WeeklyDayProgress, WorkoutLog } from '../types';
import { playBeepSound } from '../utils/audio';

interface ProgressViewProps {
  stats: UserStats;
  userProfile: UserProfile;
  weeklyDays: WeeklyDayProgress[];
  workoutLogs: WorkoutLog[];
  onOpenQuickLog: () => void;
  onToggleWeeklyDay: (index: number) => void;
}

export const ProgressView: React.FC<ProgressViewProps> = ({
  stats,
  userProfile,
  weeklyDays,
  workoutLogs,
  onOpenQuickLog,
  onToggleWeeklyDay,
}) => {
  const trainedDaysCount = weeklyDays.filter((d) => d.trained).length;
  const targetDays = userProfile.daysPerWeekTarget;
  const weeklyTargetPercent = Math.min(100, Math.round((trainedDaysCount / targetDays) * 100));

  // Evolution chart data for the past 4 weeks
  const weeklyEvolution = [
    { week: 'Semana 1', workouts: 2, minutes: 85, color: 'bg-slate-700' },
    { week: 'Semana 2', workouts: 3, minutes: 135, color: 'bg-slate-600' },
    { week: 'Semana 3', workouts: 4, minutes: 180, color: 'bg-amber-500/80' },
    { week: 'Semana Actual', workouts: trainedDaysCount, minutes: trainedDaysCount * 46, color: 'bg-amber-400' },
  ];

  // Muscle groups distribution (based on logs)
  const muscleDistribution = [
    { name: 'Piernas y Glúteos', percent: 35, color: 'bg-amber-400' },
    { name: 'Pecho, Hombro y Tríceps', percent: 25, color: 'bg-orange-400' },
    { name: 'Espalda y Bíceps', percent: 20, color: 'bg-cyan-400' },
    { name: 'Core y Cardio', percent: 20, color: 'bg-emerald-400' },
  ];

  return (
    <div className="space-y-8 pb-16 animate-in fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full bg-cyan-500/10 border border-cyan-500/20 px-3 py-1 text-xs font-bold text-cyan-400">
            <TrendingUp className="h-3.5 w-3.5" />
            <span>Panel de Rendimiento & Constancia</span>
          </div>
          <h1 className="mt-2 text-2xl sm:text-3xl font-black text-white uppercase tracking-tight font-sans">
            Mi Progreso en Gym Star
          </h1>
          <p className="text-xs sm:text-sm text-slate-400">
            Conoce tus avances objetivos, tu constancia semanal y el impacto de tu disciplina.
          </p>
        </div>

        <button
          onClick={onOpenQuickLog}
          className="flex items-center justify-center gap-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold px-4 py-2.5 text-xs sm:text-sm shadow-md shadow-emerald-500/20 transition-all active:scale-95 whitespace-nowrap"
        >
          <Plus className="h-4 w-4" />
          <span>Simular Registro para Demo</span>
        </button>
      </div>

      {/* 4 Key Requested Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1: Días entrenados esta semana */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Días Esta Semana</span>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-cyan-400/10 text-cyan-400">
              <Calendar className="h-4 w-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-3xl font-black text-white">{trainedDaysCount}</span>
            <span className="text-sm font-semibold text-slate-400">/ {targetDays} días meta</span>
          </div>
          <div className="h-1.5 w-full rounded-full bg-slate-800 overflow-hidden">
            <div
              className="h-full bg-cyan-400 transition-all duration-500"
              style={{ width: `${weeklyTargetPercent}%` }}
            ></div>
          </div>
          <p className="text-[11px] text-cyan-300/80 font-medium">
            {weeklyTargetPercent}% de la meta semanal cumplida
          </p>
        </div>

        {/* Metric 2: Entrenamientos completados */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Total Completados</span>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-400/10 text-emerald-400">
              <CheckCircle2 className="h-4 w-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-3xl font-black text-white">{stats.totalWorkouts}</span>
            <span className="text-sm font-semibold text-slate-400">sesiones</span>
          </div>
          <div className="flex items-center gap-1 text-[11px] text-emerald-400 font-bold">
            <ArrowUpRight className="h-3.5 w-3.5" />
            <span>+3 sesiones registradas este mes</span>
          </div>
          <p className="text-[11px] text-slate-400">
            Hábito en construcción activa
          </p>
        </div>

        {/* Metric 3: Racha de constancia */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Racha de Constancia</span>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-orange-400/10 text-orange-400">
              <Flame className="h-4 w-4 fill-orange-400" />
            </div>
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-3xl font-black text-orange-400">{stats.streakDays}</span>
            <span className="text-sm font-bold text-orange-300">días seguidos 🔥</span>
          </div>
          <div className="h-1.5 w-full rounded-full bg-slate-800 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-orange-500 to-amber-400"
              style={{ width: `${Math.min(100, (stats.streakDays / 7) * 100)}%` }}
            ></div>
          </div>
          <p className="text-[11px] text-slate-400">
            ¡Mantén el fuego encendido!
          </p>
        </div>

        {/* Metric 4: Porcentaje de cumplimiento */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Cumplimiento de Rutina</span>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-400/10 text-amber-400">
              <Sparkles className="h-4 w-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-3xl font-black text-amber-400">{stats.completionRatePercent}%</span>
            <span className="text-sm font-semibold text-slate-400">adhesión</span>
          </div>
          <div className="h-1.5 w-full rounded-full bg-slate-800 overflow-hidden">
            <div
              className="h-full bg-amber-400"
              style={{ width: `${stats.completionRatePercent}%` }}
            ></div>
          </div>
          <p className="text-[11px] text-amber-300/80 font-medium">
            Rango: {stats.levelTitle}
          </p>
        </div>
      </div>

      {/* Interactive 7-Day Weekly Calendar */}
      <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6 sm:p-7 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-lg font-black uppercase text-white flex items-center gap-2">
              <Calendar className="h-5 w-5 text-amber-400" />
              <span>Calendario Semanal de Entrenamientos</span>
            </h3>
            <p className="text-xs text-slate-400">
              Haz clic en cualquier día para alternar su estado en la demostración
            </p>
          </div>
          <div className="flex items-center gap-4 text-xs">
            <span className="flex items-center gap-1.5 text-emerald-400 font-bold">
              <span className="h-3 w-3 rounded-full bg-emerald-500"></span>
              Entrenado
            </span>
            <span className="flex items-center gap-1.5 text-slate-400 font-medium">
              <span className="h-3 w-3 rounded-full bg-slate-800 border border-slate-700"></span>
              Descanso
            </span>
          </div>
        </div>

        {/* 7 Day Grid */}
        <div className="grid grid-cols-7 gap-2 sm:gap-3">
          {weeklyDays.map((day, idx) => (
            <button
              key={day.dayName}
              onClick={() => {
                playBeepSound('click');
                onToggleWeeklyDay(idx);
              }}
              className={`group flex flex-col items-center justify-between rounded-2xl p-2.5 sm:p-4 border transition-all duration-200 ${
                day.trained
                  ? 'bg-emerald-950/30 border-emerald-500/50 text-white shadow-md shadow-emerald-500/10'
                  : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
              }`}
            >
              <span className="text-[10px] sm:text-xs font-semibold text-slate-400 group-hover:text-slate-200">
                {day.dayShort}
              </span>
              <span className="text-xs sm:text-sm font-bold my-1 text-slate-300">
                {day.dateStr}
              </span>

              <div className="my-1.5">
                {day.trained ? (
                  <div className="flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-full bg-emerald-500 text-slate-950 font-bold shadow-md shadow-emerald-500/30">
                    <CheckCircle2 className="h-5 w-5 stroke-[2.5]" />
                  </div>
                ) : (
                  <div className="flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-full bg-slate-900 border border-slate-800 text-slate-600">
                    <span className="text-xs font-bold">—</span>
                  </div>
                )}
              </div>

              <span className="text-[9px] sm:text-[11px] font-semibold truncate max-w-full">
                {day.trained ? `${day.durationMinutes || 45} min` : 'Descanso'}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Visual Graphs Section: Evolution & Muscle Group */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Evolution Chart */}
        <div className="lg:col-span-2 rounded-3xl border border-slate-800 bg-slate-900/80 p-6 sm:p-7 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-black uppercase text-white flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-cyan-400" />
                <span>Evolución Semanal de Entrenamientos</span>
              </h3>
              <p className="text-xs text-slate-400">
                Comparativa de sesiones y tiempo invertido en las últimas semanas
              </p>
            </div>
            <span className="text-xs font-bold text-amber-400 bg-amber-400/10 px-2.5 py-1 rounded-full border border-amber-400/20">
              Tendencia al Alza 🚀
            </span>
          </div>

          {/* Clean Visual Bar Chart */}
          <div className="pt-6 space-y-4">
            <div className="grid grid-cols-4 gap-4 h-48 items-end pb-3 border-b border-slate-800">
              {weeklyEvolution.map((item) => {
                const maxWorkouts = 5;
                const heightPercent = Math.max(15, (item.workouts / maxWorkouts) * 100);
                return (
                  <div key={item.week} className="flex flex-col items-center h-full justify-end group">
                    <div className="text-[11px] font-bold text-slate-300 mb-1 opacity-90 group-hover:text-amber-400 transition-colors">
                      {item.workouts} sesiones
                    </div>
                    <div
                      className={`w-full max-w-[48px] rounded-t-xl transition-all duration-500 ${item.color} group-hover:brightness-110 shadow-lg`}
                      style={{ height: `${heightPercent}%` }}
                    ></div>
                    <div className="text-[10px] sm:text-xs font-semibold text-slate-400 mt-2 truncate max-w-full text-center">
                      {item.week}
                    </div>
                    <div className="text-[9px] text-slate-500">
                      ~{item.minutes} min
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Muscle Distribution Breakdown */}
        <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6 sm:p-7 space-y-4 flex flex-col justify-between">
          <div>
            <h3 className="text-base font-black uppercase text-white flex items-center gap-2">
              <Dumbbell className="h-5 w-5 text-amber-400" />
              <span>Distribución Muscular</span>
            </h3>
            <p className="text-xs text-slate-400">
              Balance de zonas trabajadas en tu rutina
            </p>

            <div className="mt-5 space-y-3.5">
              {muscleDistribution.map((item) => (
                <div key={item.name} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-300">{item.name}</span>
                    <span className="font-bold text-white">{item.percent}%</span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-slate-950 overflow-hidden border border-slate-800">
                    <div
                      className={`h-full ${item.color}`}
                      style={{ width: `${item.percent}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-xl bg-slate-950 p-3 border border-slate-800 text-[11px] text-slate-400 flex items-center gap-2">
            <span className="text-amber-400 text-base">💡</span>
            <span>Rutina equilibrada para prevenir sobrecargas y fatiga muscular.</span>
          </div>
        </div>
      </div>

      {/* Recent Workout History Logs */}
      <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6 sm:p-7 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-black uppercase text-white flex items-center gap-2">
              <Clock className="h-5 w-5 text-emerald-400" />
              <span>Historial Reciente de Entrenamientos</span>
            </h3>
            <p className="text-xs text-slate-400">
              Registro cronológico de tus sesiones en el gimnasio
            </p>
          </div>
          <span className="text-xs text-slate-400 font-semibold">
            {workoutLogs.length} registros guardados
          </span>
        </div>

        <div className="divide-y divide-slate-800/80">
          {workoutLogs.map((log) => (
            <div key={log.id} className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs font-bold text-slate-400">{log.date}</span>
                  <span className="rounded-full bg-amber-400/10 border border-amber-400/20 px-2.5 py-0.5 text-[10px] font-bold text-amber-300">
                    {log.routineTitle}
                  </span>
                  <span className="rounded-full bg-slate-800 px-2 py-0.5 text-[10px] font-medium text-slate-300">
                    {log.durationMinutes} min
                  </span>
                </div>
                {log.notes && (
                  <p className="text-xs text-slate-300 italic">
                    “{log.notes}”
                  </p>
                )}
              </div>

              <div className="flex items-center gap-3 self-end sm:self-center">
                <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-lg border border-emerald-500/20">
                  {log.exercisesCompleted}/{log.totalExercises} ejercicios
                </span>
                <span className="text-xs font-black text-amber-300 bg-amber-400/10 px-2.5 py-1 rounded-lg border border-amber-400/20">
                  +{log.starsEarned} ⭐
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
