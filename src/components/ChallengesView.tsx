import React, { useState } from 'react';
import {
  Trophy,
  Star,
  CheckCircle2,
  Flame,
  Award,
  Sparkles,
  Zap,
  Lock,
  Gift
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Challenge, UserStats } from '../types';
import { playBeepSound } from '../utils/audio';

interface ChallengesViewProps {
  challenges: Challenge[];
  stats: UserStats;
  onClaimReward: (challengeId: string) => void;
  onAddCustomChallenge: (challenge: Omit<Challenge, 'id' | 'claimed'>) => void;
}

export const ChallengesView: React.FC<ChallengesViewProps> = ({
  challenges,
  stats,
  onClaimReward,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<'Todos' | 'Constancia' | 'Rendimiento' | 'Hábitos'>('Todos');

  const filteredChallenges = challenges.filter((c) =>
    selectedCategory === 'Todos' ? true : c.category === selectedCategory
  );

  const handleClaim = (challenge: Challenge) => {
    playBeepSound('success');
    try {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.5 },
        colors: ['#fbbf24', '#f59e0b', '#10b981', '#6366f1'],
      });
    } catch {
      // safe fallback
    }
    onClaimReward(challenge.id);
  };

  const trophies = [
    { title: 'Primer Paso Firme', desc: 'Completaste tu 1er entrenamiento', unlocked: true, icon: '🥉' },
    { title: 'Constancia de Plata', desc: 'Racha de 3 días seguidos', unlocked: true, icon: '🥈' },
    { title: 'Semana Perfecta', desc: 'Cumpliste tu meta semanal al 100%', unlocked: true, icon: '🥇' },
    { title: 'Titán de Hierro', desc: 'Alcanzar 20 entrenamientos totales', unlocked: stats.totalWorkouts >= 20, icon: '🛡️' },
    { title: 'Leyenda Gym Star', desc: 'Acumular 500 estrellas ⭐', unlocked: stats.stars >= 500, icon: '👑' },
  ];

  return (
    <div className="space-y-8 pb-16 animate-in fade-in">
      {/* Header & Gamification Bar */}
      <div className="relative overflow-hidden rounded-3xl border border-amber-500/30 bg-gradient-to-r from-amber-500/15 via-orange-500/10 to-slate-900 p-6 sm:p-8 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 rounded-full bg-amber-400/20 px-3 py-1 text-xs font-bold text-amber-300">
              <Trophy className="h-3.5 w-3.5 text-amber-400" />
              <span>Sistema de Retos Semanales</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-black text-white uppercase tracking-tight font-sans">
              Retos Gym Star ⭐
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-xl leading-relaxed">
              Supera pequeños desafíos semanales para vencer la falta de constancia, acumular puntos y estrellas virtuales, y mantener tu motivación al máximo.
            </p>
          </div>

          {/* User Score Card */}
          <div className="flex flex-wrap sm:flex-nowrap items-center gap-3">
            <div className="rounded-2xl bg-slate-950/80 border border-amber-500/30 p-4 text-center min-w-[120px]">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                Estrellas
              </span>
              <span className="text-2xl sm:text-3xl font-black text-amber-400 flex items-center justify-center gap-1">
                ⭐ {stats.stars}
              </span>
            </div>

            <div className="rounded-2xl bg-slate-950/80 border border-slate-800 p-4 text-center min-w-[120px]">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                Puntos Gym
              </span>
              <span className="text-2xl sm:text-3xl font-black text-white">
                {stats.points} pts
              </span>
            </div>

            <div className="rounded-2xl bg-slate-950/80 border border-slate-800 p-4 text-center min-w-[140px]">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                Rango Actual
              </span>
              <span className="text-xs sm:text-sm font-black text-orange-400 mt-1 block">
                {stats.levelTitle}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Categories Filter */}
      <div className="flex flex-wrap items-center gap-2">
        {(['Todos', 'Constancia', 'Rendimiento', 'Hábitos'] as const).map((cat) => (
          <button
            key={cat}
            onClick={() => {
              playBeepSound('click');
              setSelectedCategory(cat);
            }}
            className={`rounded-full px-4 py-2 text-xs font-bold transition-all ${
              selectedCategory === cat
                ? 'bg-amber-400 text-slate-950 shadow-md shadow-amber-400/20'
                : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Challenges List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-black uppercase text-white flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-amber-400" />
            <span>Desafíos de la Semana ({filteredChallenges.length})</span>
          </h2>
          <span className="text-xs text-slate-400">
            Se actualizan con cada sesión registrada
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredChallenges.map((challenge) => {
            const isFinished = challenge.progress >= challenge.maxProgress;
            const progressPercent = Math.min(100, Math.round((challenge.progress / challenge.maxProgress) * 100));

            return (
              <div
                key={challenge.id}
                className={`relative overflow-hidden rounded-2xl border p-5 transition-all duration-200 ${
                  challenge.claimed
                    ? 'border-slate-800 bg-slate-950/60 opacity-80'
                    : isFinished
                    ? 'border-amber-400/60 bg-amber-500/10 shadow-lg shadow-amber-500/5'
                    : 'border-slate-800 bg-slate-900/80 hover:border-slate-700'
                } flex flex-col justify-between space-y-4`}
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="rounded-full bg-slate-800 px-2.5 py-0.5 text-[10px] font-bold text-slate-300">
                        {challenge.category}
                      </span>
                      {isFinished && !challenge.claimed && (
                        <span className="rounded-full bg-amber-400/20 border border-amber-400/40 px-2 py-0.5 text-[10px] font-bold text-amber-300 animate-pulse">
                          ¡Completado!
                        </span>
                      )}
                      {challenge.claimed && (
                        <span className="rounded-full bg-emerald-500/20 px-2 py-0.5 text-[10px] font-bold text-emerald-300 flex items-center gap-1">
                          <CheckCircle2 className="h-3 w-3" /> Reclamado
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-1.5 text-xs font-black text-amber-400">
                      <span>+{challenge.rewardStars} ⭐</span>
                      <span className="text-slate-500">•</span>
                      <span className="text-slate-400">+{challenge.rewardPoints} pts</span>
                    </div>
                  </div>

                  <h3 className="text-base font-bold text-white mt-2">
                    {challenge.title}
                  </h3>
                  <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                    {challenge.description}
                  </p>
                </div>

                {/* Progress bar and claim button */}
                <div className="space-y-2 pt-2 border-t border-slate-800/80">
                  <div className="flex items-center justify-between text-xs font-semibold">
                    <span className="text-slate-400">Progreso:</span>
                    <span className={isFinished ? 'text-amber-400 font-bold' : 'text-slate-300'}>
                      {challenge.progress} / {challenge.maxProgress}
                    </span>
                  </div>

                  <div className="h-2 w-full rounded-full bg-slate-950 overflow-hidden border border-slate-800">
                    <div
                      className={`h-full transition-all duration-500 ${
                        isFinished ? 'bg-gradient-to-r from-amber-500 to-amber-300' : 'bg-slate-600'
                      }`}
                      style={{ width: `${progressPercent}%` }}
                    ></div>
                  </div>

                  <div className="pt-2">
                    {isFinished && !challenge.claimed ? (
                      <button
                        onClick={() => handleClaim(challenge)}
                        className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-black py-2.5 text-xs shadow-md shadow-amber-400/25 transition-all active:scale-95"
                      >
                        <Gift className="h-4 w-4" />
                        <span>Reclamar {challenge.rewardStars} Estrellas ⭐</span>
                      </button>
                    ) : challenge.claimed ? (
                      <div className="w-full text-center py-2 text-[11px] font-semibold text-slate-500">
                        Recompensa acreditada a tu perfil
                      </div>
                    ) : (
                      <div className="w-full text-center py-2 text-[11px] font-medium text-slate-400">
                        Continúa entrenando para desbloquear
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Vitrina de Medallas & Logros */}
      <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6 sm:p-7 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-black uppercase text-white flex items-center gap-2">
              <Award className="h-5 w-5 text-amber-400" />
              <span>Vitrina de Trofeos & Medallas</span>
            </h3>
            <p className="text-xs text-slate-400">
              Reconocimientos desbloqueados por tu dedicación en el gimnasio
            </p>
          </div>
          <span className="text-xs font-bold text-amber-400 bg-amber-400/10 px-3 py-1 rounded-full border border-amber-400/20">
            {trophies.filter(t => t.unlocked).length} de {trophies.length} Desbloqueados
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 pt-2">
          {trophies.map((trophy) => (
            <div
              key={trophy.title}
              className={`rounded-2xl p-4 text-center border transition-all ${
                trophy.unlocked
                  ? 'bg-slate-950 border-amber-400/40 shadow-sm shadow-amber-500/5'
                  : 'bg-slate-950/40 border-slate-800/80 opacity-50'
              }`}
            >
              <div className="text-3xl sm:text-4xl my-1 select-none">
                {trophy.unlocked ? trophy.icon : '🔒'}
              </div>
              <h4 className="text-xs font-bold text-white mt-2 truncate">
                {trophy.title}
              </h4>
              <p className="text-[10px] text-slate-400 mt-1 line-clamp-2">
                {trophy.desc}
              </p>
              <div className="mt-2 text-[9px] font-bold uppercase tracking-wider">
                {trophy.unlocked ? (
                  <span className="text-emerald-400">Desbloqueado</span>
                ) : (
                  <span className="text-slate-500">Bloqueado</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
