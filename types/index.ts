export type LifeArea =
  | "health"
  | "business"
  | "finances"
  | "relationships"
  | "family"
  | "personal_growth"
  | "experience_fun"
  | "spirituality"
  | "other";

export type HabitFrequency = "daily" | "weekly";

export interface GoalMetric {
  label: string;
  unit: string;
  startValue: number;
  targetValue: number;
}

export interface Habit {
  id: string;
  description: string;
  frequency: HabitFrequency;
  targetPerPeriod: number;
}

export interface Milestone {
  id: string;
  title: string;
  targetDate: string; // ISO date string
  successDefinition: string;
}

export interface BigGoal {
  id: string;
  lifeArea: LifeArea;
  title: string;
  description: string;
  startDate: string; // ISO date string
  endDate: string; // ISO date string
  achievementDefinition: string;
  metric?: GoalMetric;
  whyMustSucceed: string;
  whatIfNothingChanges: string;
  milestones: Milestone[];
  habits: Habit[];
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
}

export interface DailyMindset {
  oneThingToday: string;
  possibleObstacle: string;
  bestSelfResponse: string;
  whyItMattersToday: string;
  gratitudeOrWin: string;
}

export interface DailyCheckIn {
  id: string;
  goalId: string;
  date: string; // ISO date string
  mindset: DailyMindset;
  score: number; // 1-10
  createdAt: string; // ISO date string
}

export interface WeeklyReview {
  id: string;
  goalId: string;
  weekStartDate: string; // ISO date string
  weekEndDate: string; // ISO date string
  wins: string;
  challenges: string;
  lessons: string;
  topThreeFocusItems: string[];
  progressScore: number; // 1-10
  metricUpdate?: {
    label: string;
    currentValue: number;
  };
  createdAt: string; // ISO date string
}

export interface MonthlyReview {
  id: string;
  goalId: string;
  month: string; // YYYY-MM format
  milestoneProgress: Array<{
    milestoneId: string;
    completed: boolean;
    notes?: string;
  }>;
  metricUpdate?: {
    label: string;
    currentValue: number;
  };
  proudOf: string;
  needToChange: string;
  newHabitsOrAdjustments: string;
  createdAt: string; // ISO date string
}

