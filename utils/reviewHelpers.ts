import {
  DailyCheckIn,
  WeeklyReview,
  MonthlyReview,
  BigGoal,
} from "@/types";
import {
  getDailyCheckInsByGoal,
  getWeeklyReviewsByGoal,
  getMonthlyReviewsByGoal,
} from "./storage";
import { getTodayString, getWeekStartEnd, getMonthString } from "./dateHelpers";

export type ReviewType = "daily" | "weekly" | "monthly";

interface ReviewStatus {
  type: ReviewType;
  needsReview: boolean;
  message?: string;
}

/**
 * Bepaalt welk type review getoond moet worden voor een goal
 */
export const determineReviewType = (goal: BigGoal): ReviewStatus => {
  const today = getTodayString();
  const dailyCheckIns = getDailyCheckInsByGoal(goal.id);
  const weeklyReviews = getWeeklyReviewsByGoal(goal.id);
  const monthlyReviews = getMonthlyReviewsByGoal(goal.id);

  // Check voor maandelijkse review: na 4 wekelijkse reviews OF na 30 dagen dagelijkse check-ins
  const currentMonth = getMonthString(today);
  const hasMonthlyReviewThisMonth = monthlyReviews.some(
    (r) => r.month === currentMonth
  );

  if (!hasMonthlyReviewThisMonth) {
    // Check of er 4 wekelijkse reviews zijn (ongeveer een maand)
    if (weeklyReviews.length >= 4) {
      // Check de laatste maandelijkse review
      const lastMonthlyReview = monthlyReviews
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())[0];
      
      if (lastMonthlyReview) {
        const lastMonthDate = new Date(lastMonthlyReview.createdAt);
        const daysSinceLastMonthly = Math.floor(
          (new Date(today).getTime() - lastMonthDate.getTime()) / (1000 * 60 * 60 * 24)
        );
        
        if (daysSinceLastMonthly >= 28) {
          return {
            type: "monthly",
            needsReview: true,
            message: "Het is tijd voor je maandelijkse review!",
          };
        }
      } else {
        // Geen maandelijkse review ooit gedaan, en 4+ wekelijkse reviews
        return {
          type: "monthly",
          needsReview: true,
          message: "Het is tijd voor je eerste maandelijkse review!",
        };
      }
    }

    // Check of er 30+ dagelijkse check-ins zijn zonder maandelijkse review
    if (dailyCheckIns.length >= 30) {
      const firstCheckIn = dailyCheckIns
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())[0];
      const daysSinceFirst = Math.floor(
        (new Date(today).getTime() - new Date(firstCheckIn.date).getTime()) / (1000 * 60 * 60 * 24)
      );
      
      if (daysSinceFirst >= 28) {
        return {
          type: "monthly",
          needsReview: true,
          message: "Het is tijd voor je maandelijkse review!",
        };
      }
    }
  }

  // Check voor wekelijkse review: na 7 dagen dagelijkse check-ins
  const weekDates = getWeekStartEnd(today);
  const hasWeeklyReviewThisWeek = weeklyReviews.some(
    (r) => r.weekStartDate === weekDates.start
  );

  if (!hasWeeklyReviewThisWeek) {
    // Tel dagelijkse check-ins in de huidige week
    const checkInsThisWeek = dailyCheckIns.filter(
      (c) => c.date >= weekDates.start && c.date <= weekDates.end
    );

    // Check de laatste wekelijkse review
    const lastWeeklyReview = weeklyReviews
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())[0];

    if (lastWeeklyReview) {
      const lastWeekEnd = new Date(lastWeeklyReview.weekEndDate);
      const daysSinceLastWeek = Math.floor(
        (new Date(today).getTime() - lastWeekEnd.getTime()) / (1000 * 60 * 60 * 24)
      );

      if (daysSinceLastWeek >= 7 || checkInsThisWeek.length >= 7) {
        return {
          type: "weekly",
          needsReview: true,
          message: "Het is tijd voor je weekelijkse review!",
        };
      }
    } else {
      // Geen wekelijkse review ooit gedaan
      if (checkInsThisWeek.length >= 7 || dailyCheckIns.length >= 7) {
        return {
          type: "weekly",
          needsReview: true,
          message: "Het is tijd voor je eerste weekelijkse review!",
        };
      }
    }
  }

  // Standaard: dagelijkse check-in
  return {
    type: "daily",
    needsReview: true,
    message: "Hoe gaat het vandaag?",
  };
};

