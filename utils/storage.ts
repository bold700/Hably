import {
  BigGoal,
  DailyCheckIn,
  WeeklyReview,
  MonthlyReview,
} from "@/types";

const STORAGE_KEYS = {
  GOALS: "hably_goals",
  DAILY_CHECK_INS: "hably_daily_check_ins",
  WEEKLY_REVIEWS: "hably_weekly_reviews",
  MONTHLY_REVIEWS: "hably_monthly_reviews",
};

// Goals
export const saveGoal = (goal: BigGoal): void => {
  const goals = getGoals();
  const existingIndex = goals.findIndex((g) => g.id === goal.id);
  if (existingIndex >= 0) {
    goals[existingIndex] = goal;
  } else {
    goals.push(goal);
  }
  localStorage.setItem(STORAGE_KEYS.GOALS, JSON.stringify(goals));
};

export const getGoals = (): BigGoal[] => {
  if (typeof window === "undefined") return [];
  const data = localStorage.getItem(STORAGE_KEYS.GOALS);
  return data ? JSON.parse(data) : [];
};

export const getGoal = (id: string): BigGoal | null => {
  const goals = getGoals();
  return goals.find((g) => g.id === id) || null;
};

export const deleteGoal = (id: string): void => {
  const goals = getGoals();
  const filtered = goals.filter((g) => g.id !== id);
  localStorage.setItem(STORAGE_KEYS.GOALS, JSON.stringify(filtered));
};

// Daily Check Ins
export const saveDailyCheckIn = (checkIn: DailyCheckIn): void => {
  const checkIns = getDailyCheckIns();
  const existingIndex = checkIns.findIndex((c) => c.id === checkIn.id);
  if (existingIndex >= 0) {
    checkIns[existingIndex] = checkIn;
  } else {
    checkIns.push(checkIn);
  }
  localStorage.setItem(STORAGE_KEYS.DAILY_CHECK_INS, JSON.stringify(checkIns));
};

export const getDailyCheckIns = (): DailyCheckIn[] => {
  if (typeof window === "undefined") return [];
  const data = localStorage.getItem(STORAGE_KEYS.DAILY_CHECK_INS);
  return data ? JSON.parse(data) : [];
};

export const getDailyCheckInsByGoal = (goalId: string): DailyCheckIn[] => {
  return getDailyCheckIns().filter((c) => c.goalId === goalId);
};

export const getDailyCheckInByDate = (
  goalId: string,
  date: string
): DailyCheckIn | null => {
  return (
    getDailyCheckIns().find(
      (c) => c.goalId === goalId && c.date === date
    ) || null
  );
};

// Weekly Reviews
export const saveWeeklyReview = (review: WeeklyReview): void => {
  const reviews = getWeeklyReviews();
  const existingIndex = reviews.findIndex((r) => r.id === review.id);
  if (existingIndex >= 0) {
    reviews[existingIndex] = review;
  } else {
    reviews.push(review);
  }
  localStorage.setItem(STORAGE_KEYS.WEEKLY_REVIEWS, JSON.stringify(reviews));
};

export const getWeeklyReviews = (): WeeklyReview[] => {
  if (typeof window === "undefined") return [];
  const data = localStorage.getItem(STORAGE_KEYS.WEEKLY_REVIEWS);
  return data ? JSON.parse(data) : [];
};

export const getWeeklyReviewsByGoal = (goalId: string): WeeklyReview[] => {
  return getWeeklyReviews().filter((r) => r.goalId === goalId);
};

// Monthly Reviews
export const saveMonthlyReview = (review: MonthlyReview): void => {
  const reviews = getMonthlyReviews();
  const existingIndex = reviews.findIndex((r) => r.id === review.id);
  if (existingIndex >= 0) {
    reviews[existingIndex] = review;
  } else {
    reviews.push(review);
  }
  localStorage.setItem(STORAGE_KEYS.MONTHLY_REVIEWS, JSON.stringify(reviews));
};

export const getMonthlyReviews = (): MonthlyReview[] => {
  if (typeof window === "undefined") return [];
  const data = localStorage.getItem(STORAGE_KEYS.MONTHLY_REVIEWS);
  return data ? JSON.parse(data) : [];
};

export const getMonthlyReviewsByGoal = (goalId: string): MonthlyReview[] => {
  return getMonthlyReviews().filter((r) => r.goalId === goalId);
};

