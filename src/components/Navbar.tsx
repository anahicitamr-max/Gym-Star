import React, { useState } from 'react';
import {
  Flame,
  Sparkles,
  Dumbbell,
  TrendingUp,
  Trophy,
  Bot,
  User,
  Menu,
  X,
  PlusCircle,
  Home
} from 'lucide-react';
import { UserStats, UserProfile } from '../types';

interface NavbarProps {
  currentTab: string;
  onSelectTab: (tab: string) => void;
  stats: UserStats;
  userProfile: UserProfile;
  onOpenQuickLog: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  onSelectTab,
  stats,
  userProfile,
  onOpenQuickLog,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'inicio', label: 'Inicio', icon: Home },
    { id: 'rutina', label: 'Mi Rutina', icon: Dumbbell },
    { id: 'progreso', label: 'Mi Progreso', icon: TrendingUp },
    { id: 'retos', label: 'Retos', icon: Trophy, badge: '⭐' },
    { id: 'asistente', label: 'Mi Asistente IA', icon: Bot, isAi: true },
    { id: 'perfil', label: 'Perfil', icon: User },
  ];

  const handleNavClick = (id: string) => {
    onSelectTab(id);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-slate-950/85 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        
        {/* Brand Logo & Tagline */}
        <div 
          onClick={() => handleNavClick('inicio')}
          className="group flex cursor-pointer items-center gap-3 transition-transform active:scale-95"
          id="gymstar-logo-brand"
        >
          <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-amber-400 via-amber-500 to-orange-500 shadow-md shadow-amber-500/20 group-hover:shadow-amber-400/40 transition-all">
            <span className="text-xl select-none">⭐</span>
            <span className="absolute -top-1 -right-1 flex h-3 w-3">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-amber-400 opacity-75"></span>
              <span className="relative inline-flex h-3 w-3 rounded-full bg-amber-300"></span>
            </span>
          </div>

          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="text-lg font-black tracking-wider text-white uppercase font-sans">
                Gym <span className="text-amber-400">Star</span>
              </span>
              <span className="rounded-full bg-amber-500/10 border border-amber-500/30 px-1.5 py-0.5 text-[10px] font-semibold text-amber-300 tracking-wide">
                PRO
              </span>
            </div>
            <span className="hidden sm:inline-block text-[10px] font-medium text-slate-400 tracking-tight">
              Entrena · Avanza · Mantente constante
            </span>
          </div>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-1 bg-slate-900/60 p-1.5 rounded-full border border-slate-800/60 shadow-inner">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                id={`nav-link-${item.id}`}
                onClick={() => handleNavClick(item.id)}
                className={`flex items-center gap-2 rounded-full px-3.5 py-1.5 text-xs font-semibold transition-all duration-200 whitespace-nowrap ${
                  isActive
                    ? item.isAi
                      ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-md shadow-cyan-500/25'
                      : 'bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 font-bold shadow-md shadow-amber-500/20'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <Icon className={`h-4 w-4 ${isActive ? (item.isAi ? 'text-white' : 'text-slate-950') : 'text-slate-400'}`} />
                <span>{item.label}</span>
                {item.badge && !isActive && (
                  <span className="text-xs">{item.badge}</span>
                )}
              </button>
            );
          })}
        </nav>

        {/* User Stats & Action Buttons */}
        <div className="flex items-center gap-2.5">
          {/* Streak Badge */}
          <div 
            title="Racha activa de constancia"
            onClick={() => handleNavClick('progreso')}
            className="flex cursor-pointer items-center gap-1.5 rounded-full bg-orange-500/10 border border-orange-500/30 px-2.5 py-1 text-xs font-bold text-orange-400 hover:bg-orange-500/20 transition-colors"
          >
            <Flame className="h-4 w-4 text-orange-400 fill-orange-400 animate-pulse" />
            <span>{stats.streakDays}d</span>
          </div>

          {/* Stars Badge */}
          <div 
            title="Estrellas acumuladas en retos"
            onClick={() => handleNavClick('retos')}
            className="flex cursor-pointer items-center gap-1.5 rounded-full bg-amber-400/10 border border-amber-400/30 px-2.5 py-1 text-xs font-bold text-amber-300 hover:bg-amber-400/20 transition-colors"
          >
            <Sparkles className="h-3.5 w-3.5 text-amber-400" />
            <span>{stats.stars} ⭐</span>
          </div>

          {/* Quick Register Workout Button */}
          <button
            id="btn-quick-log-workout"
            onClick={onOpenQuickLog}
            className="hidden lg:flex items-center gap-1.5 rounded-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 px-3 py-1.5 text-xs font-bold transition-all shadow-md shadow-emerald-500/20 active:scale-95"
          >
            <PlusCircle className="h-4 w-4" />
            <span>Registrar</span>
          </button>

          {/* Avatar button */}
          <button
            onClick={() => handleNavClick('perfil')}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-800 border border-slate-700 hover:border-amber-400/60 transition-colors text-base"
            title={`Perfil de ${userProfile.name}`}
          >
            <span>{userProfile.avatarEmoji}</span>
          </button>

          {/* Mobile hamburger button */}
          <button
            id="mobile-menu-toggle"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="flex md:hidden h-9 w-9 items-center justify-center rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-white"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-slate-800 bg-slate-950/95 px-4 pt-2 pb-5 space-y-1.5 backdrop-blur-xl animate-in fade-in slide-in-from-top-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`flex w-full items-center justify-between rounded-xl px-4 py-3 text-sm font-semibold transition-all ${
                  isActive
                    ? item.isAi
                      ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white'
                      : 'bg-amber-400 text-slate-950 font-bold'
                    : 'text-slate-300 hover:bg-slate-900'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`h-5 w-5 ${isActive ? (item.isAi ? 'text-white' : 'text-slate-950') : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge && <span className="text-sm">{item.badge}</span>}
              </button>
            );
          })}
          <div className="pt-2">
            <button
              onClick={() => {
                onOpenQuickLog();
                setMobileMenuOpen(false);
              }}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-500 py-3 text-sm font-bold text-slate-950"
            >
              <PlusCircle className="h-4 w-4" />
              <span>Registrar Entrenamiento Ahora</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
