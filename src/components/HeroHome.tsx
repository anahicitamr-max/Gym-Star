import React, { useState } from 'react';
import {
  Dumbbell,
  TrendingUp,
  Flame,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  Bell,
  RefreshCw,
  Award,
  Zap,
  Target,
  Bot
} from 'lucide-react';
import { UserProfile, UserStats, Routine } from '../types';
import { MOTIVATIONAL_QUOTES } from '../data/gymData';
import { playBeepSound } from '../utils/audio';

interface HeroHomeProps {
  onNavigate: (tab: string) => void;
  userProfile: UserProfile;
  stats: UserStats;
  currentRoutine: Routine;
  onOpenQuickLog: () => void;
}

export const HeroHome: React.FC<HeroHomeProps> = ({
  onNavigate,
  userProfile,
  stats,
  currentRoutine,
  onOpenQuickLog,
}) => {
  const [quoteIndex, setQuoteIndex] = useState(0);
  const [reminderDismissed, setReminderDismissed] = useState(false);

  const nextQuote = () => {
    playBeepSound('click');
    setQuoteIndex((prev) => (prev + 1) % MOTIVATIONAL_QUOTES.length);
  };

  const currentQuote = MOTIVATIONAL_QUOTES[quoteIndex];

  return (
    <div className="space-y-10 pb-16">
      {/* Interactive Reminder Banner */}
      {!reminderDismissed && userProfile.reminderEnabled && (
        <div 
          id="reminder-banner-card"
          className="relative overflow-hidden rounded-2xl border border-amber-500/40 bg-gradient-to-r from-amber-500/15 via-orange-500/10 to-transparent p-4 sm:p-5 shadow-lg backdrop-blur-sm"
        >
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3.5">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-amber-400 text-slate-950 font-bold shadow-md shadow-amber-400/30">
                <Bell className="h-5 w-5 animate-bounce" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
                    Recordatorio Gym Star ({userProfile.reminderTime} hrs)
                  </span>
                  <span className="rounded-full bg-emerald-500/20 px-2 py-0.5 text-[10px] font-bold text-emerald-300">
                    Hoy Toca Entrenar
                  </span>
                </div>
                <p className="mt-0.5 text-sm sm:text-base font-semibold text-white">
                  ¡Hola {userProfile.name}! Tu rutina de <span className="text-amber-300 font-bold">{currentRoutine.title}</span> está lista para hoy.
                </p>
                <p className="text-xs text-slate-400">
                  {currentRoutine.exercises.length} ejercicios · ~{currentRoutine.estimatedMinutes} min · Objetivo: {userProfile.goal}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2.5 self-end sm:self-center">
              <button
                id="btn-start-today-routine"
                onClick={() => {
                  playBeepSound('click');
                  onNavigate('rutina');
                }}
                className="flex items-center gap-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 px-4 py-2 text-xs sm:text-sm font-bold shadow-md shadow-amber-400/25 transition-all active:scale-95 whitespace-nowrap"
              >
                <span>Entrenar ahora</span>
                <ArrowRight className="h-4 w-4" />
              </button>
              <button
                onClick={() => setReminderDismissed(true)}
                className="rounded-lg p-2 text-slate-400 hover:text-white hover:bg-slate-800/60 text-xs transition-colors"
                title="Descartar por ahora"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Hero Headline Section for Crea y Emprende */}
      <section className="relative overflow-hidden rounded-3xl border border-slate-800 bg-gradient-to-b from-slate-900/90 via-slate-900/50 to-slate-950 p-6 sm:p-10 lg:p-12 shadow-2xl">
        {/* Glow ambient decoration */}
        <div className="pointer-events-none absolute -top-24 -right-24 h-96 w-96 rounded-full bg-amber-500/10 blur-3xl"></div>
        <div className="pointer-events-none absolute -bottom-24 -left-24 h-96 w-96 rounded-full bg-orange-500/10 blur-3xl"></div>

        <div className="relative z-10 mx-auto max-w-4xl text-center space-y-5">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-3.5 py-1 text-xs font-bold text-amber-300">
            <Sparkles className="h-3.5 w-3.5 text-amber-400" />
            <span>Proyecto de Innovación & Emprendimiento Deportivo</span>
          </div>

          {/* Main Title & Slogans */}
          <div className="space-y-2">
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-white uppercase font-sans">
              GYM <span className="bg-gradient-to-r from-amber-400 via-amber-300 to-orange-400 bg-clip-text text-transparent">STAR</span> ⭐
            </h1>
            <p className="text-xl sm:text-2xl lg:text-3xl font-bold tracking-tight text-slate-100">
              “Entrena. Avanza. Mantente constante.”
            </p>
            <p className="text-sm sm:text-lg font-medium text-amber-400/90 max-w-2xl mx-auto">
              Tu entrenamiento, organizado en un solo lugar.
            </p>
          </div>

          <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Gym Star es la plataforma digital de apoyo para personas que asisten al gimnasio. 
            Solucionamos la falta de constancia, la desmotivación y la falta de orientación personalizada con rutinas adaptadas, seguimiento visual y desafíos estimulantes.
          </p>

          {/* Primary Action CTAs */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              id="hero-btn-start-now"
              onClick={() => {
                playBeepSound('click');
                onNavigate('rutina');
              }}
              className="flex items-center gap-2.5 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-black px-6 py-3.5 text-sm sm:text-base shadow-lg shadow-amber-500/30 transition-all transform hover:-translate-y-0.5 active:scale-95"
            >
              <Zap className="h-5 w-5 fill-slate-950" />
              <span>Comenzar ahora</span>
              <ArrowRight className="h-5 w-5" />
            </button>

            <button
              id="hero-btn-open-assistant"
              onClick={() => {
                playBeepSound('click');
                onNavigate('asistente');
              }}
              className="flex items-center gap-2.5 rounded-xl bg-slate-800/90 hover:bg-slate-700/90 text-white font-bold px-5 py-3.5 text-sm sm:text-base border border-slate-700 transition-all hover:border-cyan-400/60"
            >
              <Bot className="h-5 w-5 text-cyan-400" />
              <span>Preguntar al Asistente IA</span>
            </button>

            <button
              id="hero-btn-quick-log"
              onClick={onOpenQuickLog}
              className="flex items-center gap-2 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/40 text-emerald-300 font-bold px-5 py-3.5 text-sm sm:text-base transition-all"
            >
              <span>+ Registrar Entrenamiento</span>
            </button>
          </div>

          {/* Value Proposition: 3 Core Pillars */}
          <div className="pt-6 border-t border-slate-800/80 grid grid-cols-1 sm:grid-cols-3 gap-3 text-center">
            <div className="flex items-center justify-center gap-2 rounded-xl bg-slate-800/30 p-2.5 border border-slate-800/60">
              <CheckCircle2 className="h-4 w-4 text-amber-400 shrink-0" />
              <span className="text-xs sm:text-sm font-semibold text-slate-200">
                Rutinas personalizadas
              </span>
            </div>
            <div className="flex items-center justify-center gap-2 rounded-xl bg-slate-800/30 p-2.5 border border-slate-800/60">
              <TrendingUp className="h-4 w-4 text-cyan-400 shrink-0" />
              <span className="text-xs sm:text-sm font-semibold text-slate-200">
                Seguimiento de progreso
              </span>
            </div>
            <div className="flex items-center justify-center gap-2 rounded-xl bg-slate-800/30 p-2.5 border border-slate-800/60">
              <Flame className="h-4 w-4 text-orange-400 shrink-0" />
              <span className="text-xs sm:text-sm font-semibold text-slate-200">
                Motivación y retos
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* The 3 Main Interactive Hero Cards Requested */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-white uppercase tracking-wide">
              Módulos Principales
            </h2>
            <p className="text-xs sm:text-sm text-slate-400">
              Acceso directo a las funciones clave de Gym Star
            </p>
          </div>
          <span className="text-xs font-bold text-amber-400 bg-amber-400/10 px-3 py-1 rounded-full border border-amber-400/20">
            Nivel: {stats.levelTitle}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Card 1: MI RUTINA */}
          <div
            id="home-card-routine"
            onClick={() => {
              playBeepSound('click');
              onNavigate('rutina');
            }}
            className="group relative cursor-pointer overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/80 p-6 transition-all duration-300 hover:-translate-y-1 hover:border-amber-400/60 hover:shadow-xl hover:shadow-amber-500/10"
          >
            <div className="absolute top-0 right-0 h-28 w-28 rounded-bl-full bg-amber-500/10 transition-transform group-hover:scale-125"></div>
            
            <div className="flex items-center justify-between mb-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-400/10 border border-amber-400/30 text-3xl group-hover:scale-110 transition-transform">
                🏋️
              </div>
              <span className="rounded-full bg-slate-800 px-3 py-1 text-xs font-bold text-amber-400">
                {currentRoutine.exercises.length} Ejercicios
              </span>
            </div>

            <h3 className="text-xl font-black uppercase tracking-tight text-white group-hover:text-amber-400 transition-colors">
              MI RUTINA
            </h3>
            <p className="mt-1 text-sm font-semibold text-amber-300/80">
              Tu entrenamiento personalizado.
            </p>
            <p className="mt-2 text-xs text-slate-400 leading-relaxed">
              Ejercicios con series, repeticiones, descansos con temporizador y guía paso a paso para <strong className="text-slate-200">{userProfile.goal}</strong>.
            </p>

            <div className="mt-5 flex items-center justify-between pt-4 border-t border-slate-800/80 text-xs font-bold text-amber-400">
              <span>Abrir mi rutina diaria</span>
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </div>
          </div>

          {/* Card 2: MI PROGRESO */}
          <div
            id="home-card-progress"
            onClick={() => {
              playBeepSound('click');
              onNavigate('progreso');
            }}
            className="group relative cursor-pointer overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/80 p-6 transition-all duration-300 hover:-translate-y-1 hover:border-cyan-400/60 hover:shadow-xl hover:shadow-cyan-500/10"
          >
            <div className="absolute top-0 right-0 h-28 w-28 rounded-bl-full bg-cyan-500/10 transition-transform group-hover:scale-125"></div>

            <div className="flex items-center justify-between mb-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-cyan-400/10 border border-cyan-400/30 text-3xl group-hover:scale-110 transition-transform">
                📈
              </div>
              <span className="rounded-full bg-slate-800 px-3 py-1 text-xs font-bold text-cyan-400">
                {stats.daysTrainedThisWeek} de {userProfile.daysPerWeekTarget} días
              </span>
            </div>

            <h3 className="text-xl font-black uppercase tracking-tight text-white group-hover:text-cyan-400 transition-colors">
              MI PROGRESO
            </h3>
            <p className="mt-1 text-sm font-semibold text-cyan-300/80">
              Observa tu constancia y avances.
            </p>
            <p className="mt-2 text-xs text-slate-400 leading-relaxed">
              Visualiza tus días entrenados en la semana, racha consecutiva de constancia y estadísticas de cumplimiento de tu meta.
            </p>

            <div className="mt-5 flex items-center justify-between pt-4 border-t border-slate-800/80 text-xs font-bold text-cyan-400">
              <span>Ver métricas y calendario</span>
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </div>
          </div>

          {/* Card 3: MIS RETOS */}
          <div
            id="home-card-challenges"
            onClick={() => {
              playBeepSound('click');
              onNavigate('retos');
            }}
            className="group relative cursor-pointer overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/80 p-6 transition-all duration-300 hover:-translate-y-1 hover:border-orange-400/60 hover:shadow-xl hover:shadow-orange-500/10"
          >
            <div className="absolute top-0 right-0 h-28 w-28 rounded-bl-full bg-orange-500/10 transition-transform group-hover:scale-125"></div>

            <div className="flex items-center justify-between mb-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-orange-400/10 border border-orange-400/30 text-3xl group-hover:scale-110 transition-transform">
                🔥
              </div>
              <span className="rounded-full bg-slate-800 px-3 py-1 text-xs font-bold text-amber-300">
                ⭐ {stats.stars} acumuladas
              </span>
            </div>

            <h3 className="text-xl font-black uppercase tracking-tight text-white group-hover:text-orange-400 transition-colors">
              MIS RETOS
            </h3>
            <p className="mt-1 text-sm font-semibold text-orange-300/80">
              Pequeños desafíos para mantenerte motivado.
            </p>
            <p className="mt-2 text-xs text-slate-400 leading-relaxed">
              Cumple retos semanales (ej. completar 3 entrenamientos), gana estrellas virtuales y desbloquea medallas de superación.
            </p>

            <div className="mt-5 flex items-center justify-between pt-4 border-t border-slate-800/80 text-xs font-bold text-orange-400">
              <span>Explorar retos activos</span>
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </div>
          </div>
        </div>
      </section>

      {/* Motivational Quote & Problem/Solution Showcase */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quote Card */}
        <div className="lg:col-span-1 rounded-2xl border border-slate-800 bg-slate-900/60 p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                <Sparkles className="h-3.5 w-3.5" />
                Dosis Diaria de Motivación
              </span>
              <button
                onClick={nextQuote}
                className="flex items-center gap-1 text-[11px] font-semibold text-slate-400 hover:text-white bg-slate-800 px-2 py-1 rounded-md transition-colors"
                title="Ver otra frase motivacional"
              >
                <RefreshCw className="h-3 w-3" />
                <span>Cambiar</span>
              </button>
            </div>
            <blockquote className="text-base sm:text-lg font-bold text-slate-100 italic leading-relaxed">
              “{currentQuote.text}”
            </blockquote>
            <p className="mt-2 text-xs font-medium text-slate-400">
              — {currentQuote.author}
            </p>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
            <span>Racha actual: <strong className="text-orange-400">{stats.streakDays} días consecutivos</strong></span>
            <span className="text-amber-400 font-bold">¡No te detengas!</span>
          </div>
        </div>

        {/* Crea y Emprende Problem & Value Proposition Card */}
        <div className="lg:col-span-2 rounded-2xl border border-slate-800 bg-gradient-to-br from-slate-900/90 to-slate-950 p-6 sm:p-7 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-400/20 text-amber-400 font-bold">
                🎯
              </div>
              <h3 className="text-lg font-black uppercase text-white">
                ¿Por qué Gym Star? (Propuesta de Valor)
              </h3>
            </div>
            <span className="rounded-full bg-blue-500/10 border border-blue-500/20 px-2.5 py-1 text-xs font-medium text-blue-300">
              Enfoque Crea y Emprende
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
            <div className="rounded-xl bg-red-500/5 border border-red-500/20 p-4 space-y-1.5">
              <span className="text-xs font-bold uppercase tracking-wider text-red-400 flex items-center gap-1.5">
                ❌ El Problema Real
              </span>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Gran parte de las personas abandonan el gimnasio en sus primeros meses debido a la <strong>falta de constancia</strong>, desmotivación solitaria y el desconocimiento sobre qué ejercicios realizar según sus objetivos específicos.
              </p>
            </div>

            <div className="rounded-xl bg-emerald-500/5 border border-emerald-500/20 p-4 space-y-1.5">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                ✅ La Solución Gym Star
              </span>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Una <strong>plataforma tecnológica de acompañamiento</strong> que gamifica el entrenamiento, entrega rutinas claras con descansos cronometrados, premia cada sesión con estrellas y ofrece asistencia guiada con IA.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
            <div className="flex items-center gap-4 text-xs text-slate-400">
              <span className="flex items-center gap-1">
                <Target className="h-4 w-4 text-amber-400" />
                Objetivo: {userProfile.goal}
              </span>
              <span className="flex items-center gap-1">
                <Award className="h-4 w-4 text-amber-400" />
                {stats.totalWorkouts} entrenamientos totales
              </span>
            </div>

            <button
              onClick={() => onNavigate('perfil')}
              className="text-xs font-bold text-amber-400 hover:text-amber-300 underline underline-offset-4"
            >
              Configurar o cambiar mi perfil →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
