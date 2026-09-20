import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, X, Timer, Volume2 } from 'lucide-react';
import { playBeepSound } from '../utils/audio';

interface RestTimerModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultSeconds?: number;
  exerciseName?: string;
}

export const RestTimerModal: React.FC<RestTimerModalProps> = ({
  isOpen,
  onClose,
  defaultSeconds = 60,
  exerciseName,
}) => {
  const [totalSeconds, setTotalSeconds] = useState(defaultSeconds);
  const [timeLeft, setTimeLeft] = useState(defaultSeconds);
  const [isRunning, setIsRunning] = useState(true);

  useEffect(() => {
    setTotalSeconds(defaultSeconds);
    setTimeLeft(defaultSeconds);
    setIsRunning(true);
  }, [defaultSeconds, isOpen]);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            playBeepSound('timer');
            setIsRunning(false);
            return 0;
          }
          if (prev <= 4) {
            playBeepSound('click');
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning, timeLeft]);

  if (!isOpen) return null;

  const toggleRun = () => {
    playBeepSound('click');
    setIsRunning(!isRunning);
  };

  const resetTimer = (seconds: number = totalSeconds) => {
    playBeepSound('click');
    setTotalSeconds(seconds);
    setTimeLeft(seconds);
    setIsRunning(true);
  };

  const percent = totalSeconds > 0 ? ((totalSeconds - timeLeft) / totalSeconds) * 100 : 0;
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const formattedTime = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-sm animate-in fade-in">
      <div className="relative w-full max-w-sm rounded-3xl border border-slate-700 bg-slate-900 p-6 shadow-2xl space-y-5">
        
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-amber-400">
            <Timer className="h-5 w-5" />
            <h3 className="text-base font-black uppercase tracking-wider text-white">
              Temporizador de Descanso
            </h3>
          </div>
          <button
            onClick={onClose}
            className="rounded-full p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {exerciseName && (
          <p className="text-center text-xs font-semibold text-slate-400">
            Descanso para: <span className="text-amber-300">{exerciseName}</span>
          </p>
        )}

        {/* Circular Progress & Big Display */}
        <div className="flex flex-col items-center justify-center py-3">
          <div className="relative flex h-48 w-48 items-center justify-center rounded-full bg-slate-950 border-4 border-slate-800 shadow-inner">
            {/* SVG Circle progress */}
            <svg className="absolute inset-0 h-full w-full -rotate-90" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r="44"
                className="stroke-slate-800"
                strokeWidth="6"
                fill="none"
              />
              <circle
                cx="50"
                cy="50"
                r="44"
                className={`transition-all duration-300 ${
                  timeLeft <= 5 ? 'stroke-red-500' : 'stroke-amber-400'
                }`}
                strokeWidth="6"
                strokeDasharray="276.46"
                strokeDashoffset={276.46 - (276.46 * percent) / 100}
                strokeLinecap="round"
                fill="none"
              />
            </svg>

            <div className="flex flex-col items-center z-10">
              <span className={`text-4xl font-black font-mono tracking-tighter ${
                timeLeft === 0 ? 'text-emerald-400 animate-pulse' : 'text-white'
              }`}>
                {timeLeft === 0 ? '¡Listo!' : formattedTime}
              </span>
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-widest mt-1">
                {timeLeft === 0 ? 'A la siguiente serie' : isRunning ? 'Descansando' : 'En pausa'}
              </span>
            </div>
          </div>
        </div>

        {/* Preset quick buttons */}
        <div className="grid grid-cols-4 gap-2">
          {[30, 45, 60, 90].map((sec) => (
            <button
              key={sec}
              onClick={() => resetTimer(sec)}
              className={`rounded-xl py-1.5 text-xs font-bold transition-all ${
                totalSeconds === sec && timeLeft > 0
                  ? 'bg-amber-400 text-slate-950'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              {sec}s
            </button>
          ))}
        </div>

        {/* Action Controls */}
        <div className="flex items-center justify-center gap-3 pt-2">
          <button
            onClick={() => resetTimer()}
            className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 transition-colors"
            title="Reiniciar temporizador"
          >
            <RotateCcw className="h-5 w-5" />
          </button>

          <button
            onClick={toggleRun}
            className="flex h-14 w-32 items-center justify-center gap-2 rounded-2xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-sm shadow-lg shadow-amber-400/20 transition-all active:scale-95"
          >
            {isRunning ? (
              <>
                <Pause className="h-5 w-5" />
                <span>Pausar</span>
              </>
            ) : (
              <>
                <Play className="h-5 w-5 fill-slate-950" />
                <span>Reanudar</span>
              </>
            )}
          </button>

          <button
            onClick={onClose}
            className="rounded-2xl bg-slate-800 px-4 py-3 text-xs font-bold text-slate-300 hover:text-white hover:bg-slate-700 transition-colors"
          >
            Terminar
          </button>
        </div>

        <div className="flex items-center justify-center gap-1.5 text-[11px] text-slate-500">
          <Volume2 className="h-3.5 w-3.5" />
          <span>Aviso con sonido audible al finalizar</span>
        </div>
      </div>
    </div>
  );
};
