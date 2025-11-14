"use client";

import React from "react";
import {
  Paper,
  Typography,
  Box,
  LinearProgress,
  Chip,
  Card,
  CardContent,
  Grid,
  Divider,
} from "@mui/material";
import {
  TrendingUp,
  CalendarToday,
  CheckCircle,
  EmojiEvents,
} from "@mui/icons-material";
import { BigGoal, DailyCheckIn, WeeklyReview, MonthlyReview } from "@/types";
import {
  getDailyCheckInsByGoal,
  getWeeklyReviewsByGoal,
  getMonthlyReviewsByGoal,
} from "@/utils/storage";
import { formatDate, getTodayString } from "@/utils/dateHelpers";

interface ProgressDashboardProps {
  goal: BigGoal;
}

export default function ProgressDashboard({ goal }: ProgressDashboardProps) {
  const [mounted, setMounted] = React.useState(false);
  const [dailyCheckIns, setDailyCheckIns] = React.useState<DailyCheckIn[]>([]);
  const [weeklyReviews, setWeeklyReviews] = React.useState<WeeklyReview[]>([]);
  const [monthlyReviews, setMonthlyReviews] = React.useState<MonthlyReview[]>([]);

  React.useEffect(() => {
    setMounted(true);
    setDailyCheckIns(getDailyCheckInsByGoal(goal.id));
    setWeeklyReviews(getWeeklyReviewsByGoal(goal.id));
    setMonthlyReviews(getMonthlyReviewsByGoal(goal.id));
    
    // Update periodiek
    const interval = setInterval(() => {
      setDailyCheckIns(getDailyCheckInsByGoal(goal.id));
      setWeeklyReviews(getWeeklyReviewsByGoal(goal.id));
      setMonthlyReviews(getMonthlyReviewsByGoal(goal.id));
    }, 1000);
    
    return () => clearInterval(interval);
  }, [goal.id]);

  if (!mounted) {
    return null;
  }

  // Bereken voortgang percentage
  const today = new Date(getTodayString());
  const startDate = new Date(goal.startDate);
  const endDate = new Date(goal.endDate);
  const totalDays = Math.ceil(
    (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
  );
  const daysPassed = Math.ceil(
    (today.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
  );
  const timeProgress = Math.min(
    100,
    Math.max(0, (daysPassed / totalDays) * 100)
  );

  // Gemiddelde dagelijkse score
  const avgDailyScore =
    dailyCheckIns.length > 0
      ? dailyCheckIns.reduce((sum, c) => sum + c.score, 0) / dailyCheckIns.length
      : 0;

  // Streak (dagen op rij)
  let streak = 0;
  if (dailyCheckIns.length > 0) {
    const sortedCheckIns = [...dailyCheckIns].sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );
    
    // Check voor streak vanaf vandaag of gisteren
    const today = new Date(getTodayString());
    const dates = sortedCheckIns.map(c => c.date);
    
    // Start vanaf vandaag of laatste check-in als die recenter is
    let currentDate = new Date(today);
    let consecutiveDays = 0;
    
    // Check of er vandaag een check-in is, anders start vanaf gisteren
    const todayStr = getTodayString();
    if (!dates.includes(todayStr)) {
      currentDate.setDate(currentDate.getDate() - 1);
    }
    
    // Loop achterwaarts door de dagen
    while (true) {
      const dateStr = currentDate.toISOString().split("T")[0];
      if (dates.includes(dateStr)) {
        consecutiveDays++;
        currentDate.setDate(currentDate.getDate() - 1);
      } else {
        break;
      }
    }
    
    streak = consecutiveDays;
  }

  // Laatste metriek update
  let currentMetricValue = goal.metric?.startValue || 0;
  if (weeklyReviews.length > 0) {
    const latestWeekly = weeklyReviews
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())[0];
    if (latestWeekly.metricUpdate) {
      currentMetricValue = latestWeekly.metricUpdate.currentValue;
    }
  }
  if (monthlyReviews.length > 0) {
    const latestMonthly = monthlyReviews
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())[0];
    if (latestMonthly.metricUpdate) {
      currentMetricValue = latestMonthly.metricUpdate.currentValue;
    }
  }

  const actualMetricProgress = goal.metric
    ? ((currentMetricValue - goal.metric.startValue) /
        (goal.metric.targetValue - goal.metric.startValue)) *
      100
    : null;

  // Mijlpaal voortgang
  const completedMilestones =
    monthlyReviews.length > 0
      ? monthlyReviews
          .flatMap((r) => r.milestoneProgress)
          .filter((m) => m.completed).length
      : 0;

  // Achievements/Badges
  const achievements = [];
  if (streak >= 7) achievements.push({ label: "🔥 7 Dagen Streak", color: "error" });
  if (streak >= 30) achievements.push({ label: "⭐ 30 Dagen Streak", color: "warning" });
  if (dailyCheckIns.length >= 10)
    achievements.push({ label: "📝 10 Check-ins", color: "primary" });
  if (dailyCheckIns.length >= 50)
    achievements.push({ label: "💪 50 Check-ins", color: "success" });
  if (weeklyReviews.length >= 4)
    achievements.push({ label: "📊 4 Wekelijkse Reviews", color: "info" });
  if (avgDailyScore >= 8)
    achievements.push({ label: "🎯 Gemiddeld 8+", color: "secondary" });

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
      {/* Algemene Voortgang */}
      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <TrendingUp color="primary" />
          Algemene Voortgang
        </Typography>
        <Box sx={{ mt: 2 }}>
          <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
            <Typography variant="body2" color="text.secondary">
              Tijd Verlopen
            </Typography>
            <Typography variant="body2" fontWeight="bold">
              {daysPassed} / {totalDays} dagen ({timeProgress.toFixed(0)}%)
            </Typography>
          </Box>
          <LinearProgress
            variant="determinate"
            value={timeProgress}
            sx={{ height: 10, borderRadius: 5 }}
            color="primary"
          />
        </Box>
      </Paper>

      <Divider sx={{ my: 2 }} />

      {/* Statistieken Grid */}
      <Grid container spacing={2}>
        <Grid item xs={6} sm={3}>
          <Card>
            <CardContent sx={{ textAlign: "center" }}>
              <CalendarToday color="primary" sx={{ fontSize: 40, mb: 1 }} />
              <Typography variant="h4" fontWeight="bold">
                {streak}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Dagen Streak
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={6} sm={3}>
          <Card>
            <CardContent sx={{ textAlign: "center" }}>
              <CheckCircle color="success" sx={{ fontSize: 40, mb: 1 }} />
              <Typography variant="h4" fontWeight="bold">
                {dailyCheckIns.length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Check-ins
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={6} sm={3}>
          <Card>
            <CardContent sx={{ textAlign: "center" }}>
              <EmojiEvents color="warning" sx={{ fontSize: 40, mb: 1 }} />
              <Typography variant="h4" fontWeight="bold">
                {avgDailyScore.toFixed(1)}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Gem. Score
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={6} sm={3}>
          <Card>
            <CardContent sx={{ textAlign: "center" }}>
              <CheckCircle color="info" sx={{ fontSize: 40, mb: 1 }} />
              <Typography variant="h4" fontWeight="bold">
                {completedMilestones}/{goal.milestones.length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Mijlpalen
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Divider sx={{ my: 2 }} />

      {/* Metriek Voortgang */}
      {goal.metric && (
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            {goal.metric.label} Voortgang
          </Typography>
          <Box sx={{ mt: 2 }}>
            <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
              <Typography variant="body2" color="text.secondary">
                {goal.metric.startValue} {goal.metric.unit} → {goal.metric.targetValue}{" "}
                {goal.metric.unit}
              </Typography>
              <Typography variant="body2" fontWeight="bold">
                {currentMetricValue.toFixed(1)} {goal.metric.unit} (
                {actualMetricProgress?.toFixed(0) || 0}%)
              </Typography>
            </Box>
            <LinearProgress
              variant="determinate"
              value={Math.max(0, Math.min(100, actualMetricProgress || 0))}
              sx={{ height: 10, borderRadius: 5 }}
              color="success"
            />
            <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: "block" }}>
              Nog {((goal.metric.targetValue - currentMetricValue) / ((goal.metric.targetValue - goal.metric.startValue) / totalDays)).toFixed(0)} dagen nodig bij huidig tempo
            </Typography>
          </Box>
        </Paper>
      )}

      {goal.metric && <Divider sx={{ my: 2 }} />}

      {/* Mijlpaal Voortgang */}
      {goal.milestones.length > 0 && (
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            Mijlpaal Voortgang
          </Typography>
          <Box sx={{ mt: 2, display: "flex", flexDirection: "column", gap: 2 }}>
            {goal.milestones.map((milestone, index) => {
              const isCompleted =
                monthlyReviews.length > 0 &&
                monthlyReviews.some((r) =>
                  r.milestoneProgress.some(
                    (p) => p.milestoneId === milestone.id && p.completed
                  )
                );
              return (
                <Box key={milestone.id}>
                  <Box
                    sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}
                  >
                    <Typography variant="body1" fontWeight={isCompleted ? "bold" : "normal"}>
                      {isCompleted ? "✓ " : ""}
                      {milestone.title}
                    </Typography>
                    <Chip
                      label={formatDate(milestone.targetDate)}
                      size="small"
                      color={isCompleted ? "success" : "default"}
                    />
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={isCompleted ? 100 : 0}
                    sx={{ height: 8, borderRadius: 4 }}
                    color={isCompleted ? "success" : "primary"}
                  />
                </Box>
              );
            })}
          </Box>
        </Paper>
      )}

      {goal.milestones.length > 0 && <Divider sx={{ my: 2 }} />}

      {/* Achievements */}
      {achievements.length > 0 && (
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            Achievements 🏆
          </Typography>
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mt: 2 }}>
            {achievements.map((achievement, index) => (
              <Chip
                key={index}
                label={achievement.label}
                color={achievement.color as any}
                variant="outlined"
                sx={{ fontSize: "0.875rem" }}
              />
            ))}
          </Box>
        </Paper>
      )}

      {achievements.length > 0 && <Divider sx={{ my: 2 }} />}

      {/* Recente Scores Grafiek */}
      {dailyCheckIns.length > 0 && (
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            Recente Scores (Laatste 7 dagen)
          </Typography>
          <Box sx={{ mt: 2, display: "flex", alignItems: "flex-end", gap: 1, height: 150 }}>
            {[...dailyCheckIns]
              .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
              .slice(-7)
              .map((checkIn, index) => {
                const height = (checkIn.score / 10) * 100;
                return (
                  <Box key={checkIn.id} sx={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center" }}>
                    <Box
                      sx={{
                        width: "100%",
                        height: `${height}%`,
                        bgcolor: "primary.main",
                        borderRadius: "4px 4px 0 0",
                        minHeight: 20,
                        display: "flex",
                        alignItems: "flex-start",
                        justifyContent: "center",
                        pt: 0.5,
                      }}
                    >
                      <Typography
                        variant="caption"
                        sx={{ color: "white", fontWeight: "bold" }}
                      >
                        {checkIn.score}
                      </Typography>
                    </Box>
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      sx={{ mt: 0.5, fontSize: "0.7rem" }}
                    >
                      {new Date(checkIn.date).getDate()}
                    </Typography>
                  </Box>
                );
              })}
          </Box>
        </Paper>
      )}
    </Box>
  );
}

