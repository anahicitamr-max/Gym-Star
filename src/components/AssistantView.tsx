import React, { useState, useRef, useEffect } from 'react';
import {
  Bot,
  Send,
  Sparkles,
  AlertTriangle,
  RotateCcw,
  User,
  Zap,
  HelpCircle,
  Dumbbell
} from 'lucide-react';
import { ChatMessage, UserProfile, UserStats, Routine } from '../types';
import { playBeepSound } from '../utils/audio';

interface AssistantViewProps {
  userProfile: UserProfile;
  stats: UserStats;
  currentRoutine: Routine;
}

export const AssistantView: React.FC<AssistantViewProps> = ({
  userProfile,
  stats,
  currentRoutine,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-welcome',
      sender: 'assistant',
      text: `¡Hola ${userProfile.name}! Soy **Mi Asistente Gym Star ⭐**. Estoy aquí para orientarte en tus entrenamientos, recordarte tus metas y ayudarte a mantener la constancia en el gimnasio.\n\nTu objetivo actual es **${userProfile.goal}** y llevas una racha de **${stats.streakDays} días seguidos** 🔥. ¿En qué puedo orientarte hoy?`,
      timestamp: 'Ahora',
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const chatBottomRef = useRef<HTMLDivElement>(null);

  // Suggested prompt chips directly matching the user's prompt specifications!
  const quickPrompts = [
    '¿Qué ejercicio puedo hacer hoy?',
    '¿Qué ejercicios tiene mi rutina?',
    '¿Cuántos entrenamientos he completado?',
    'Recuérdame mi objetivo.',
    '¿Cómo mantener la motivación cuando estoy cansado?',
    '¿Cuánto tiempo debo descansar entre series?',
  ];

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleSendMessage = async (textToSend?: string) => {
    const messageText = (textToSend || input).trim();
    if (!messageText || isLoading) return;

    playBeepSound('click');
    const userMsg: ChatMessage = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text: messageText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/assistant', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: messageText,
          context: {
            userProfile,
            stats,
            currentRoutine,
          },
        }),
      });

      if (!response.ok) {
        throw new Error('Error al conectar con el servidor');
      }

      const data = await response.json();
      const aiReply = data.reply || '¡Sigue enfocado en tu entrenamiento de Gym Star!';

      const assistantMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        sender: 'assistant',
        text: aiReply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        source: data.source,
      };

      setMessages((prev) => [...prev, assistantMsg]);
    } catch (error) {
      console.error('Chat error:', error);
      const fallbackMsg: ChatMessage = {
        id: `ai-err-${Date.now()}`,
        sender: 'assistant',
        text: `¡Hola ${userProfile.name}! Recuerda que para tu objetivo de **${userProfile.goal}**, lo fundamental hoy es ejecutar tus series con buena postura y respiración rítmica. Revisa tu lista en "Mi Rutina" y da tu mejor esfuerzo. ¡La constancia supera todo!`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, fallbackMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearChat = () => {
    playBeepSound('click');
    setMessages([
      {
        id: `msg-welcome-${Date.now()}`,
        sender: 'assistant',
        text: `¡Chat reiniciado! ¿En qué otra duda sobre tu rutina de ${userProfile.goal} o tu constancia te puedo orientar?`,
        timestamp: 'Ahora',
      },
    ]);
  };

  return (
    <div className="space-y-6 pb-16 animate-in fade-in max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full bg-cyan-500/10 border border-cyan-500/20 px-3 py-1 text-xs font-bold text-cyan-400">
            <Bot className="h-3.5 w-3.5" />
            <span>Inteligencia Artificial Gym Star</span>
          </div>
          <h1 className="mt-2 text-2xl sm:text-3xl font-black text-white uppercase tracking-tight font-sans">
            Mi Asistente Gym Star
          </h1>
          <p className="text-xs sm:text-sm text-slate-400">
            Orientación general sobre tus entrenamientos, rutinas, avances y motivación diaria.
          </p>
        </div>

        <button
          onClick={handleClearChat}
          className="flex items-center gap-1.5 self-start sm:self-center text-xs font-medium text-slate-400 hover:text-white bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-xl transition-colors"
        >
          <RotateCcw className="h-3.5 w-3.5" />
          <span>Reiniciar Conversación</span>
        </button>
      </div>

      {/* Mandatory Health & Safety Disclaimer Box */}
      <div className="rounded-2xl border border-amber-500/30 bg-amber-500/10 p-4 flex items-start gap-3 text-xs text-amber-200/90 leading-relaxed">
        <AlertTriangle className="h-5 w-5 text-amber-400 shrink-0 mt-0.5" />
        <div>
          <strong className="text-amber-300 font-bold block mb-0.5">
            Aviso importante sobre salud y entrenamiento:
          </strong>
          Mi Asistente Gym Star es una herramienta digital de apoyo y acompañamiento para tus hábitos de entrenamiento. 
          <strong> No realiza diagnósticos médicos ni sustituye el asesoramiento o supervisión de un entrenador certificado o profesional de la salud.</strong> Si sientes dolor agudo o mareos, detén el ejercicio inmediatamente.
        </div>
      </div>

      {/* Suggested Quick Prompt Chips */}
      <div className="space-y-2">
        <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-400">
          <HelpCircle className="h-3.5 w-3.5 text-cyan-400" />
          <span>Preguntas Rápidas Frecuentes:</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {quickPrompts.map((prompt) => (
            <button
              key={prompt}
              onClick={() => handleSendMessage(prompt)}
              disabled={isLoading}
              className="rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-cyan-500/50 px-3 py-2 text-xs font-semibold text-slate-300 hover:text-cyan-300 transition-all text-left active:scale-95 disabled:opacity-50"
            >
              {prompt}
            </button>
          ))}
        </div>
      </div>

      {/* Chat Messages Box */}
      <div className="rounded-3xl border border-slate-800 bg-slate-900/90 shadow-2xl flex flex-col h-[480px] overflow-hidden">
        {/* Chat Status Bar */}
        <div className="border-b border-slate-800 px-5 py-3 bg-slate-950/60 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="relative flex h-8 w-8 items-center justify-center rounded-xl bg-cyan-500/20 text-cyan-400">
              <Bot className="h-4 w-4" />
              <span className="absolute bottom-0 right-0 h-2 w-2 rounded-full bg-emerald-400 ring-2 ring-slate-950"></span>
            </div>
            <div>
              <p className="text-xs font-bold text-white">Coach Virtual Gym Star</p>
              <p className="text-[10px] text-slate-400">Conectado con tu perfil ({userProfile.goal})</p>
            </div>
          </div>
          <span className="text-[11px] font-semibold text-slate-400">
            {stats.totalWorkouts} sesiones completadas
          </span>
        </div>

        {/* Messages Stream */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          {messages.map((msg) => {
            const isAi = msg.sender === 'assistant';
            return (
              <div
                key={msg.id}
                className={`flex items-start gap-3 ${isAi ? 'justify-start' : 'justify-end'}`}
              >
                {isAi && (
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 text-white shadow-md shadow-cyan-500/20">
                    <Bot className="h-4 w-4" />
                  </div>
                )}

                <div
                  className={`max-w-[85%] sm:max-w-[75%] rounded-2xl p-4 text-xs sm:text-sm leading-relaxed ${
                    isAi
                      ? 'bg-slate-950 border border-slate-800 text-slate-200'
                      : 'bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 font-medium font-sans shadow-md shadow-amber-400/20'
                  }`}
                >
                  <p className="whitespace-pre-line">{msg.text}</p>
                  <div
                    className={`mt-1.5 flex items-center justify-end text-[9px] ${
                      isAi ? 'text-slate-500' : 'text-slate-800 font-semibold'
                    }`}
                  >
                    <span>{msg.timestamp}</span>
                  </div>
                </div>

                {!isAi && (
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-slate-800 border border-slate-700 text-slate-200">
                    <User className="h-4 w-4" />
                  </div>
                )}
              </div>
            );
          })}

          {isLoading && (
            <div className="flex items-start gap-3">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-cyan-500/20 text-cyan-400">
                <Bot className="h-4 w-4 animate-spin" />
              </div>
              <div className="rounded-2xl bg-slate-950 border border-slate-800 p-4 text-xs text-slate-400 flex items-center gap-2">
                <div className="flex gap-1">
                  <span className="h-2 w-2 rounded-full bg-cyan-400 animate-bounce"></span>
                  <span className="h-2 w-2 rounded-full bg-cyan-400 animate-bounce [animation-delay:0.2s]"></span>
                  <span className="h-2 w-2 rounded-full bg-cyan-400 animate-bounce [animation-delay:0.4s]"></span>
                </div>
                <span>Gym Star IA pensando respuesta...</span>
              </div>
            </div>
          )}

          <div ref={chatBottomRef} />
        </div>

        {/* Input Bar */}
        <div className="border-t border-slate-800 p-3 bg-slate-950/80">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Escribe tu consulta sobre ejercicios, rutina o motivación..."
              disabled={isLoading}
              className="flex-1 rounded-xl bg-slate-900 border border-slate-800 px-4 py-3 text-xs sm:text-sm text-white placeholder-slate-500 focus:border-cyan-400 focus:outline-none"
            />
            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white shadow-md shadow-cyan-500/20 transition-all active:scale-95 disabled:opacity-40"
            >
              <Send className="h-4 w-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
