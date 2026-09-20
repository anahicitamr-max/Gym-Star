/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { HeroHome } from './components/HeroHome';
import { RoutineView } from './components/RoutineView';
import { ProgressView } from './components/ProgressView';
import { ChallengesView } from './components/ChallengesView';
import { AssistantView } from './components/AssistantView';
import { ProfileView } from './components/ProfileView';
import { WorkoutModal } from './components/WorkoutModal';
import {
  UserProfile,
  UserStats,
  Routine,
  Challenge,
  WeeklyDayProgress,
  WorkoutLog,
  GoalType
} from './types';
import {
  DEFAULT_USER_PROFILE,
  INITIAL_STATS,
  INITIAL_CHALLENGES,
  INITIAL_WEEKLY_DAYS,
  INITIAL_WORKOUT_LOGS,
  ROUTINES
} from './data/gymData';
import { playBeepSound } from './utils/audio';
import { Dumbbell, TrendingUp, Trophy, Bot, User, Sparkles, Heart } from 'lucide-react';

export default function App() {
  const [currentTab, setCurrentTab] = useState<string>('inicio');

  // Hydrate state from localStorage or use defaults
  const [userProfile, setUserProfile] = useState<UserProfile>(() => {
    try {
      const saved = localStorage.getItem('gymstar_user_profile');
      return saved ? JSON.parse(saved) : DEFAULT_USER_PROFILE;
    } catch {
      return DEFAULT_USER_PROFILE;
    }
  });

  const [stats, setStats] = useState<UserStats>(() => {
    try {
      const saved = localStorage.getItem('gymstar_stats');
      return saved ? JSON.parse(saved) : INITIAL_STATS;
    } catch {
      return INITIAL_STATS;
    }
  });

  const [challenges, setChallenges] = useState<Challenge[]>(() => {
    try {
      const saved = localStorage.getItem('gymstar_challenges');
      return saved ? JSON.parse(saved) : INITIAL_CHALLENGES;
    } catch {
      return INITIAL_CHALLENGES;
    }
  });

  const [weeklyDays, setWeeklyDays] = useState<WeeklyDayProgress[]>(() => {
    try {
      const saved = localStorage.getItem('gymstar_weekly_days');
      return saved ? JSON.parse(saved) : INITIAL_WEEKLY_DAYS;
    } catch {
      return INITIAL_WEEKLY_DAYS;
    }
  });

  const [workoutLogs, setWorkoutLogs] = useState<WorkoutLog[]>(() => {
    try {
      const saved = localStorage.getItem('gymstar_workout_logs');
      return saved ? JSON.parse(saved) : INITIAL_WORKOUT_LOGS;
    } catch {
      return INITIAL_WORKOUT_LOGS;
    }
  });

  const [quickLogOpen, setQuickLogOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Sync with localStorage
  useEffect(() => {
    try {
      localStorage.setItem('gymstar_user_profile', JSON.stringify(userProfile));
    } catch {
      // ignore
    }
  }, [userProfile]);

  useEffect(() => {
    try {
      localStorage.setItem('gymstar_stats', JSON.stringify(stats));
    } catch {
      // ignore
    }
  }, [stats]);

  useEffect(() => {
    try {
      localStorage.setItem('gymstar_challenges', JSON.stringify(challenges));
    } catch {
      // ignore
    }
  }, [challenges]);

  useEffect(() => {
    try {
      localStorage.setItem('gymstar_weekly_days', JSON.stringify(weeklyDays));
    } catch {
      // ignore
    }
  }, [weeklyDays]);

  useEffect(() => {
    try {
      localStorage.setItem('gymstar_workout_logs', JSON.stringify(workoutLogs));
    } catch {
      // ignore
    }
  }, [workoutLogs]);

  // Trigger temporary toast notification
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  // Get active routine
  const currentRoutine: Routine = ROUTINES[userProfile.goal] || ROUTINES['Mejorar condición física'];

  // Handle saving a completed workout
  const handleSaveWorkout = (workoutData: {
    durationMinutes: number;
    routineTitle: string;
    goal: GoalType;
    exercisesCompleted: number;
    totalExercises: number;
    notes: string;
    feeling: string;
  }) => {
    const today = new Date();
    const formattedDate = `${today.getDate()} Sep 2026, ${today.getHours().toString().padStart(2, '0')}:${today.getMinutes().toString().padStart(2, '0')}`;
    const dayNames = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
    const currentDayName = dayNames[today.getDay()];

    const newLog: WorkoutLog = {
      id: `log-${Date.now()}`,
      date: formattedDate,
      dayName: currentDayName,
      durationMinutes: workoutData.durationMinutes,
      routineTitle: workoutData.routineTitle,
      goal: workoutData.goal,
      exercisesCompleted: workoutData.exercisesCompleted,
      totalExercises: workoutData.totalExercises,
      starsEarned: 35,
      notes: workoutData.notes ? `${workoutData.notes} (${workoutData.feeling})` : workoutData.feeling,
    };

    setWorkoutLogs((prev) => [newLog, ...prev]);

    // Update weekly days calendar (mark current day index or first available)
    const dayIndexMap: Record<string, number> = {
      Lunes: 0,
      Martes: 1,
      Miércoles: 2,
      Jueves: 3,
      Viernes: 4,
      Sábado: 5,
      Domingo: 6,
    };
    const targetIdx = dayIndexMap[currentDayName] ?? 4;

    setWeeklyDays((prev) =>
      prev.map((day, idx) => {
        if (idx === targetIdx || (!day.trained && idx <= targetIdx)) {
          return {
            ...day,
            trained: true,
            routineTitle: workoutData.routineTitle,
            durationMinutes: workoutData.durationMinutes,
          };
        }
        return day;
      })
    );

    // Update stats
    setStats((prev) => {
      const newTotal = prev.totalWorkouts + 1;
      const newStreak = prev.streakDays + 1;
      const newStars = prev.stars + 35;
      const newPoints = prev.points + 175;
      const daysCount = Math.min(userProfile.daysPerWeekTarget, prev.daysTrainedThisWeek + 1);

      let newLevel = prev.levelTitle;
      if (newStars >= 400) newLevel = 'Leyenda Gym Star 👑';
      else if (newStars >= 250) newLevel = 'Titán del Gym 🛡️';
      else if (newStars >= 100) newLevel = 'Estrella en Ascenso ⭐';

      return {
        ...prev,
        totalWorkouts: newTotal,
        streakDays: newStreak,
        stars: newStars,
        points: newPoints,
        daysTrainedThisWeek: daysCount,
        completionRatePercent: Math.min(100, Math.round((daysCount / userProfile.daysPerWeekTarget) * 100)),
        levelTitle: newLevel,
      };
    });

    // Update challenges progress
    setChallenges((prev) =>
      prev.map((ch) => {
        if (ch.id === 'ch-1') {
          // Trilogía de Fuerza (3 workouts)
          const newProgress = Math.min(ch.maxProgress, ch.progress + 1);
          return { ...ch, progress: newProgress, completed: newProgress >= ch.maxProgress };
        }
        if (ch.id === 'ch-2' && workoutData.exercisesCompleted >= workoutData.totalExercises) {
          // Rutina impecable
          return { ...ch, progress: ch.maxProgress, completed: true };
        }
        if (ch.id === 'ch-3' && workoutData.notes) {
          // Diario del guerrero
          const newProgress = Math.min(ch.maxProgress, ch.progress + 1);
          return { ...ch, progress: newProgress, completed: newProgress >= ch.maxProgress };
        }
        return ch;
      })
    );

    showToast(`¡Entrenamiento registrado! Ganaste +35 Estrellas ⭐ y extendiste tu racha a ${stats.streakDays + 1} días.`);
  };

  // Claim reward for a completed challenge
  const handleClaimChallenge = (challengeId: string) => {
    const targetChallenge = challenges.find((c) => c.id === challengeId);
    if (!targetChallenge || targetChallenge.claimed) return;

    setChallenges((prev) =>
      prev.map((c) => (c.id === challengeId ? { ...c, claimed: true } : c))
    );

    setStats((prev) => ({
      ...prev,
      stars: prev.stars + targetChallenge.rewardStars,
      points: prev.points + targetChallenge.rewardPoints,
    }));

    showToast(`¡Reclamaste ${targetChallenge.rewardStars} Estrellas ⭐ en el reto "${targetChallenge.title}"!`);
  };

  // Toggle day training in weekly calendar
  const handleToggleWeeklyDay = (index: number) => {
    setWeeklyDays((prev) => {
      const updated = prev.map((d, i) => (i === index ? { ...d, trained: !d.trained } : d));
      const trainedCount = updated.filter((d) => d.trained).length;
      setStats((st) => ({
        ...st,
        daysTrainedThisWeek: trainedCount,
        completionRatePercent: Math.min(100, Math.round((trainedCount / userProfile.daysPerWeekTarget) * 100)),
      }));
      return updated;
    });
  };

  // Update Goal
  const handleUpdateGoal = (newGoal: GoalType) => {
    setUserProfile((prev) => ({ ...prev, goal: newGoal }));
    showToast(`Objetivo actualizado a: ${newGoal}. Tu rutina personalizada ha sido adaptada.`);
  };

  // Update full Profile
  const handleUpdateProfile = (updatedProfile: UserProfile) => {
    setUserProfile(updatedProfile);
    showToast('Perfil de atleta guardado exitosamente.');
  };

  // Reset Demo Data (for school presentations in Crea y Emprende)
  const handleResetDemoData = () => {
    localStorage.removeItem('gymstar_user_profile');
    localStorage.removeItem('gymstar_stats');
    localStorage.removeItem('gymstar_challenges');
    localStorage.removeItem('gymstar_weekly_days');
    localStorage.removeItem('gymstar_workout_logs');

    setUserProfile(DEFAULT_USER_PROFILE);
    setStats(INITIAL_STATS);
    setChallenges(INITIAL_CHALLENGES);
    setWeeklyDays(INITIAL_WEEKLY_DAYS);
    setWorkoutLogs(INITIAL_WORKOUT_LOGS);

    showToast('Datos de demostración restablecidos para la exposición de Crea y Emprende.');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 right-4 z-50 max-w-sm rounded-2xl border border-amber-400/50 bg-slate-900/95 p-4 shadow-2xl backdrop-blur-md animate-in slide-in-from-top-4 fade-in">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-amber-400 text-slate-950 font-bold">
              ⭐
            </div>
            <p className="text-xs font-semibold text-white leading-snug">
              {toastMessage}
            </p>
          </div>
        </div>
      )}

      {/* Main Navbar */}
      <Navbar
        currentTab={currentTab}
        onSelectTab={(tab) => {
          playBeepSound('click');
          setCurrentTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        stats={stats}
        userProfile={userProfile}
        onOpenQuickLog={() => setQuickLogOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 pt-8">
        {currentTab === 'inicio' && (
          <HeroHome
            onNavigate={(tab) => {
              setCurrentTab(tab);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            userProfile={userProfile}
            stats={stats}
            currentRoutine={currentRoutine}
            onOpenQuickLog={() => setQuickLogOpen(true)}
          />
        )}

        {currentTab === 'rutina' && (
          <RoutineView
            userProfile={userProfile}
            onUpdateGoal={handleUpdateGoal}
            onSaveWorkout={handleSaveWorkout}
          />
        )}

        {currentTab === 'progreso' && (
          <ProgressView
            stats={stats}
            userProfile={userProfile}
            weeklyDays={weeklyDays}
            workoutLogs={workoutLogs}
            onOpenQuickLog={() => setQuickLogOpen(true)}
            onToggleWeeklyDay={handleToggleWeeklyDay}
          />
        )}

        {currentTab === 'retos' && (
          <ChallengesView
            challenges={challenges}
            stats={stats}
            onClaimReward={handleClaimChallenge}
            onAddCustomChallenge={() => {}}
          />
        )}

        {currentTab === 'asistente' && (
          <AssistantView
            userProfile={userProfile}
            stats={stats}
            currentRoutine={currentRoutine}
          />
        )}

        {currentTab === 'perfil' && (
          <ProfileView
            userProfile={userProfile}
            stats={stats}
            onUpdateProfile={handleUpdateProfile}
            onResetDemoData={handleResetDemoData}
          />
        )}
      </main>

      {/* Quick Workout Log Modal (accessible from anywhere) */}
      <WorkoutModal
        isOpen={quickLogOpen}
        onClose={() => setQuickLogOpen(false)}
        currentRoutine={currentRoutine}
        completedExercisesCount={currentRoutine.exercises.length}
        totalExercisesCount={currentRoutine.exercises.length}
        onSaveWorkout={handleSaveWorkout}
      />

      {/* Modern Footer for Crea y Emprende */}
      <footer className="border-t border-slate-900 bg-slate-950/90 py-10 mt-16 text-slate-400 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-400 text-slate-950 font-bold text-lg">
                ⭐
              </div>
              <div>
                <span className="font-black text-white uppercase tracking-wider text-sm">
                  Gym Star
                </span>
                <p className="text-[11px] text-slate-500">
                  “Entrena. Avanza. Mantente constante.”
                </p>
              </div>
            </div>

            {/* Quick Navigation in footer */}
            <div className="flex flex-wrap items-center justify-center gap-4 text-xs font-semibold text-slate-400">
              <button onClick={() => setCurrentTab('inicio')} className="hover:text-white transition-colors">Inicio</button>
              <span>•</span>
              <button onClick={() => setCurrentTab('rutina')} className="hover:text-white transition-colors">Mi Rutina</button>
              <span>•</span>
              <button onClick={() => setCurrentTab('progreso')} className="hover:text-white transition-colors">Mi Progreso</button>
              <span>•</span>
              <button onClick={() => setCurrentTab('retos')} className="hover:text-white transition-colors">Retos</button>
              <span>•</span>
              <button onClick={() => setCurrentTab('asistente')} className="hover:text-white transition-colors">Asistente IA</button>
              <span>•</span>
              <button onClick={() => setCurrentTab('perfil')} className="hover:text-white transition-colors">Perfil</button>
            </div>

            <div className="rounded-full bg-amber-500/10 border border-amber-500/20 px-3 py-1 text-[11px] font-bold text-amber-300">
              Plataforma Deportiva Digital · Crea y Emprende 2026
            </div>
          </div>

          <div className="border-t border-slate-900 pt-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-slate-500">
            <p>© 2026 Gym Star. Prototipo funcional para exposición escolar.</p>
            <p className="flex items-center gap-1">
              Diseñado con <Heart className="h-3 w-3 text-red-500 fill-red-500" /> para inspirar hábitos saludables y constancia.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
