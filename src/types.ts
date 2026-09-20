export type GoalType =
  | 'Ganar fuerza'
  | 'Mejorar resistencia'
  | 'Mejorar condición física'
  | 'Mantenerse activo';

export type FitnessLevel = 'Principiante' | 'Intermedio' | 'Avanzado';

export interface Exercise {
  id: string;
  name: string;
  targetMuscle: string;
  series: number;
  reps: string;
  restSeconds: number;
  instructions: string;
  tips: string;
  equipment: string;
  completed?: boolean;
}

export interface Routine {
  id: string;
  goal: GoalType;
  title: string;
  subtitle: string;
  description: string;
  estimatedMinutes: number;
  intensity: 'Moderada' | 'Media' | 'Alta';
  color: string;
  exercises: Exercise[];
}

export interface WorkoutLog {
  id: string;
  date: string;
  dayName: string;
  durationMinutes: number;
  routineTitle: string;
  goal: GoalType;
  exercisesCompleted: number;
  totalExercises: number;
  starsEarned: number;
  notes?: string;
}

export interface WeeklyDayProgress {
  dayName: string;
  dayShort: string;
  dateStr: string;
  trained: boolean;
  routineTitle?: string;
  durationMinutes?: number;
}

export interface Challenge {
  id: string;
  title: string;
  description: string;
  rewardStars: number;
  rewardPoints: number;
  progress: number;
  maxProgress: number;
  completed: boolean;
  claimed: boolean;
  iconName: string;
  category: 'Constancia' | 'Rendimiento' | 'Hábitos';
}

export interface UserProfile {
  name: string;
  age: number;
  goal: GoalType;
  level: FitnessLevel;
  daysPerWeekTarget: number;
  reminderTime: string;
  reminderEnabled: boolean;
  preferredTimeOfDay: 'Mañana' | 'Tarde' | 'Noche';
  avatarEmoji: string;
  joinDate: string;
}

export interface UserStats {
  totalWorkouts: number;
  streakDays: number;
  stars: number;
  points: number;
  completionRatePercent: number;
  daysTrainedThisWeek: number;
  levelTitle: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  source?: string;
}
