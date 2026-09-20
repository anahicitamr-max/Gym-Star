import React, { useState } from 'react';
import {
  User,
  Target,
  Bell,
  CheckCircle2,
  Sparkles,
  RotateCcw,
  Clock,
  Calendar,
  Zap,
  Shield,
  Save
} from 'lucide-react';
import { UserProfile, GoalType, FitnessLevel, UserStats } from '../types';
import { playBeepSound } from '../utils/audio';

interface ProfileViewProps {
  userProfile: UserProfile;
  stats: UserStats;
  onUpdateProfile: (updated: UserProfile) => void;
  onResetDemoData: () => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({
  userProfile,
  stats,
  onUpdateProfile,
  onResetDemoData,
}) => {
  const [formData, setFormData] = useState<UserProfile>(userProfile);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const goalOptions: { label: GoalType; icon: string; desc: string }[] = [
    {
      label: 'Ganar fuerza',
      icon: '🏋️',
      desc: 'Sobrecarga progresiva y aumento de masa muscular',
    },
    {
      label: 'Mejorar resistencia',
      icon: '🏃',
      desc: 'Intervalos aeróbicos, resistencia cardiovascular y ritmo',
    },
    {
      label: 'Mejorar condición física',
      icon: '⚡',
      desc: 'Equilibrio de fuerza, movilidad, postura y vitalidad',
    },
    {
      label: 'Mantenerse activo',
      icon: '🧘',
      desc: 'Hábito saludable, desestrés y movilidad funcional',
    },
  ];

  const levelOptions: FitnessLevel[] = ['Principiante', 'Intermedio', 'Avanzado'];
  const avatarOptions = ['⚡', '🦁', '🔥', '⭐', '💪', '🚀', '🎯'];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    playBeepSound('success');
    onUpdateProfile(formData);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  return (
    <div className="space-y-8 pb-16 animate-in fade-in max-w-4xl mx-auto">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-2 rounded-full bg-amber-500/10 border border-amber-500/20 px-3 py-1 text-xs font-bold text-amber-400">
          <User className="h-3.5 w-3.5" />
          <span>Configuración del Usuario</span>
        </div>
        <h1 className="mt-2 text-2xl sm:text-3xl font-black text-white uppercase tracking-tight font-sans">
          Perfil del Atleta Gym Star
        </h1>
        <p className="text-xs sm:text-sm text-slate-400">
          Personaliza tus datos, tu objetivo de entrenamiento y tus recordatorios de constancia.
        </p>
      </div>

      {/* Profile Overview Card */}
      <div className="rounded-3xl border border-slate-800 bg-gradient-to-r from-slate-900 via-slate-900/90 to-slate-950 p-6 sm:p-7 shadow-xl">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5">
          <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-amber-400/15 border-2 border-amber-400/40 text-4xl shadow-lg shadow-amber-400/10">
            {formData.avatarEmoji}
          </div>

          <div className="space-y-2 text-center sm:text-left flex-1">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
              <h2 className="text-xl sm:text-2xl font-black text-white">
                {formData.name}
              </h2>
              <span className="rounded-full bg-amber-400/20 px-3 py-0.5 text-xs font-bold text-amber-300">
                {formData.level}
              </span>
              <span className="rounded-full bg-slate-800 px-3 py-0.5 text-xs font-medium text-slate-300">
                {formData.age} años
              </span>
            </div>

            <p className="text-xs sm:text-sm text-slate-300">
              Objetivo: <strong className="text-amber-300">{formData.goal}</strong> · Miembro desde {formData.joinDate}
            </p>

            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 pt-2 text-xs">
              <span className="text-slate-400">
                ⭐ <strong className="text-amber-400">{stats.stars}</strong> estrellas
              </span>
              <span className="text-slate-400">
                🔥 <strong className="text-orange-400">{stats.streakDays} días</strong> racha
              </span>
              <span className="text-slate-400">
                🏋️ <strong className="text-emerald-400">{stats.totalWorkouts}</strong> entrenamientos
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic info */}
        <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6 sm:p-7 space-y-4">
          <h3 className="text-base font-black uppercase text-white flex items-center gap-2">
            <User className="h-4 w-4 text-amber-400" />
            <span>Datos Personales</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Nombre de Atleta
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full rounded-xl bg-slate-950 border border-slate-800 px-4 py-2.5 text-sm text-white focus:border-amber-400 focus:outline-none"
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Edad
              </label>
              <input
                type="number"
                min="12"
                max="90"
                value={formData.age}
                onChange={(e) => setFormData({ ...formData, age: Number(e.target.value) })}
                className="w-full rounded-xl bg-slate-950 border border-slate-800 px-4 py-2.5 text-sm text-white focus:border-amber-400 focus:outline-none"
                required
              />
            </div>
          </div>

          {/* Avatar Picker */}
          <div className="space-y-2 pt-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Ícono de Avatar
            </label>
            <div className="flex flex-wrap gap-2">
              {avatarOptions.map((emoji) => (
                <button
                  type="button"
                  key={emoji}
                  onClick={() => {
                    playBeepSound('click');
                    setFormData({ ...formData, avatarEmoji: emoji });
                  }}
                  className={`h-11 w-11 text-xl rounded-xl border flex items-center justify-center transition-all ${
                    formData.avatarEmoji === emoji
                      ? 'bg-amber-400/20 border-amber-400 text-2xl scale-105'
                      : 'bg-slate-950 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Goal Selection */}
        <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6 sm:p-7 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-black uppercase text-white flex items-center gap-2">
              <Target className="h-4 w-4 text-amber-400" />
              <span>Objetivo Principal de Entrenamiento</span>
            </h3>
            <span className="text-xs text-amber-400 font-bold">
              Selecciona uno
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {goalOptions.map((option) => {
              const isSelected = formData.goal === option.label;
              return (
                <div
                  key={option.label}
                  onClick={() => {
                    playBeepSound('click');
                    setFormData({ ...formData, goal: option.label });
                  }}
                  className={`cursor-pointer rounded-2xl p-4 border transition-all ${
                    isSelected
                      ? 'bg-amber-500/15 border-amber-400 shadow-md shadow-amber-500/5'
                      : 'bg-slate-950 border-slate-800 hover:border-slate-700'
                  } flex items-start gap-3.5`}
                >
                  <span className="text-3xl select-none">{option.icon}</span>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h4 className={`text-sm font-bold ${isSelected ? 'text-amber-300' : 'text-white'}`}>
                        {option.label}
                      </h4>
                      {isSelected && (
                        <CheckCircle2 className="h-4 w-4 text-amber-400 ml-auto" />
                      )}
                    </div>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      {option.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Level and Training Frequency */}
        <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6 sm:p-7 space-y-4">
          <h3 className="text-base font-black uppercase text-white flex items-center gap-2">
            <Calendar className="h-4 w-4 text-cyan-400" />
            <span>Frecuencia y Nivel de Experiencia</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Nivel Actual
              </label>
              <div className="grid grid-cols-3 gap-2">
                {levelOptions.map((lvl) => (
                  <button
                    type="button"
                    key={lvl}
                    onClick={() => {
                      playBeepSound('click');
                      setFormData({ ...formData, level: lvl });
                    }}
                    className={`rounded-xl py-2 text-xs font-bold border transition-all ${
                      formData.level === lvl
                        ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    {lvl}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Meta de Días a Entrenar por Semana
              </label>
              <div className="flex items-center gap-2">
                {[2, 3, 4, 5, 6].map((days) => (
                  <button
                    type="button"
                    key={days}
                    onClick={() => {
                      playBeepSound('click');
                      setFormData({ ...formData, daysPerWeekTarget: days });
                    }}
                    className={`flex-1 rounded-xl py-2 text-xs font-bold border transition-all ${
                      formData.daysPerWeekTarget === days
                        ? 'bg-amber-400 text-slate-950 font-black'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    {days}d
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Reminder Settings */}
        <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6 sm:p-7 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-black uppercase text-white flex items-center gap-2">
              <Bell className="h-4 w-4 text-amber-400" />
              <span>Recordatorios de Entrenamiento</span>
            </h3>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={formData.reminderEnabled}
                onChange={(e) => setFormData({ ...formData, reminderEnabled: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-400"></div>
            </label>
          </div>

          <p className="text-xs text-slate-400">
            Gym Star te mostrará avisos motivacionales en la plataforma a tu hora preferida para evitar que dejes de asistir al gimnasio.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5 text-amber-400" />
                Hora del Recordatorio
              </label>
              <input
                type="time"
                value={formData.reminderTime}
                onChange={(e) => setFormData({ ...formData, reminderTime: e.target.value })}
                disabled={!formData.reminderEnabled}
                className="w-full rounded-xl bg-slate-950 border border-slate-800 px-4 py-2.5 text-sm text-white focus:border-amber-400 focus:outline-none disabled:opacity-40"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Horario Preferido
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(['Mañana', 'Tarde', 'Noche'] as const).map((time) => (
                  <button
                    type="button"
                    key={time}
                    onClick={() => {
                      playBeepSound('click');
                      setFormData({ ...formData, preferredTimeOfDay: time });
                    }}
                    disabled={!formData.reminderEnabled}
                    className={`rounded-xl py-2.5 text-xs font-bold border transition-all ${
                      formData.preferredTimeOfDay === time
                        ? 'bg-amber-400/20 border-amber-400 text-amber-300'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white disabled:opacity-40'
                    }`}
                  >
                    {time}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
          <button
            type="submit"
            className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-black px-8 py-3.5 text-sm shadow-lg shadow-amber-400/25 transition-all active:scale-95"
          >
            <Save className="h-4 w-4" />
            <span>Guardar Cambios del Perfil</span>
          </button>

          {saveSuccess && (
            <span className="text-xs font-bold text-emerald-400 flex items-center gap-1.5 animate-in fade-in">
              <CheckCircle2 className="h-4 w-4" />
              ¡Perfil actualizado correctamente!
            </span>
          )}

          <button
            type="button"
            onClick={() => {
              playBeepSound('click');
              onResetDemoData();
            }}
            className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-red-400 bg-slate-900 border border-slate-800 px-4 py-2.5 rounded-xl transition-colors"
            title="Restablece datos para volver a exponer el proyecto en Crea y Emprende"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span>Restablecer Datos para Demostración</span>
          </button>
        </div>
      </form>
    </div>
  );
};
