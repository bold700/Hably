"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Container,
  Typography,
  Box,
  Button,
  TextField,
  Paper,
  Slider,
  Chip,
  Alert,
  Tabs,
  Tab,
  Checkbox,
  FormControlLabel,
  Card,
  CardContent,
} from "@mui/material";
import { Save as SaveIcon } from "@mui/icons-material";
import {
  getGoal,
  saveDailyCheckIn,
  saveWeeklyReview,
  saveMonthlyReview,
  getDailyCheckInsByGoal,
  getWeeklyReviewsByGoal,
  getMonthlyReviewsByGoal,
  getDailyCheckInByDate,
} from "@/utils/storage";
import {
  determineReviewType,
  ReviewType,
} from "@/utils/reviewHelpers";
import {
  BigGoal,
  DailyCheckIn,
  WeeklyReview,
  MonthlyReview,
  DailyMindset,
} from "@/types";
import {
  getTodayString,
  formatDate,
  getWeekStartEnd,
  getMonthString,
} from "@/utils/dateHelpers";
import ReviewList from "@/components/ReviewList";

export default function CheckInPage() {
  const params = useParams();
  const router = useRouter();
  const [goal, setGoal] = useState<BigGoal | null>(null);
  const [reviewStatus, setReviewStatus] = useState<{
    type: ReviewType;
    needsReview: boolean;
    message?: string;
  } | null>(null);
  const [activeTab, setActiveTab] = useState(0);

  // Daily state
  const [date, setDate] = useState(getTodayString());
  const [mindset, setMindset] = useState<DailyMindset>({
    oneThingToday: "",
    possibleObstacle: "",
    bestSelfResponse: "",
    whyItMattersToday: "",
    gratitudeOrWin: "",
  });
  const [score, setScore] = useState(5);

  // Weekly state
  const [weekDate, setWeekDate] = useState(getTodayString());
  const [wins, setWins] = useState("");
  const [challenges, setChallenges] = useState("");
  const [lessons, setLessons] = useState("");
  const [topThreeFocusItems, setTopThreeFocusItems] = useState(["", "", ""]);
  const [progressScore, setProgressScore] = useState(5);
  const [hasMetricUpdate, setHasMetricUpdate] = useState(false);
  const [metricUpdate, setMetricUpdate] = useState({ label: "", currentValue: 0 });

  // Monthly state
  const [month, setMonth] = useState(getMonthString(getTodayString()));
  const [milestoneProgress, setMilestoneProgress] = useState<
    Array<{ milestoneId: string; completed: boolean; notes?: string }>
  >([]);
  const [proudOf, setProudOf] = useState("");
  const [needToChange, setNeedToChange] = useState("");
  const [newHabitsOrAdjustments, setNewHabitsOrAdjustments] = useState("");
  const [hasMetricUpdateMonthly, setHasMetricUpdateMonthly] = useState(false);
  const [metricUpdateMonthly, setMetricUpdateMonthly] = useState({ label: "", currentValue: 0 });

  useEffect(() => {
    if (params.goalId) {
      const foundGoal = getGoal(params.goalId as string);
      setGoal(foundGoal);
      if (foundGoal) {
        const status = determineReviewType(foundGoal);
        setReviewStatus(status);
        setActiveTab(status.type === "daily" ? 0 : status.type === "weekly" ? 1 : 2);
        
        // Initialize monthly milestone progress
        setMilestoneProgress(
          foundGoal.milestones.map((m) => ({
            milestoneId: m.id,
            completed: false,
            notes: "",
          }))
        );
        if (foundGoal.metric) {
          setMetricUpdate({
            label: foundGoal.metric.label,
            currentValue: foundGoal.metric.startValue,
          });
          setMetricUpdateMonthly({
            label: foundGoal.metric.label,
            currentValue: foundGoal.metric.startValue,
          });
        }
      }
    }
  }, [params.goalId]);

  useEffect(() => {
    if (goal && date) {
      const existing = getDailyCheckInByDate(goal.id, date);
      if (existing) {
        setMindset(existing.mindset);
        setScore(existing.score);
      } else {
        setMindset({
          oneThingToday: "",
          possibleObstacle: "",
          bestSelfResponse: "",
          whyItMattersToday: "",
          gratitudeOrWin: "",
        });
        setScore(5);
      }
    }
  }, [goal, date]);

  if (!goal || !reviewStatus) {
    return (
      <Container maxWidth="md" sx={{ py: 3, pb: 10 }}>
        <Typography variant="h6">Doel niet gevonden</Typography>
        <Button onClick={() => router.push("/dashboard")}>Terug naar Dashboard</Button>
      </Container>
    );
  }

  const handleSaveDaily = () => {
    const checkIn: DailyCheckIn = {
      id: `daily_${goal.id}_${date}_${Date.now()}`,
      goalId: goal.id,
      date,
      mindset,
      score,
      createdAt: new Date().toISOString(),
    };
    saveDailyCheckIn(checkIn);
    alert("Dagelijkse check-in opgeslagen!");
    
    // Re-evaluate review status
    const newStatus = determineReviewType(goal);
    setReviewStatus(newStatus);
  };

  const handleSaveWeekly = () => {
    const weekDates = getWeekStartEnd(weekDate);
    const review: WeeklyReview = {
      id: `weekly_${goal.id}_${weekDates.start}_${Date.now()}`,
      goalId: goal.id,
      weekStartDate: weekDates.start,
      weekEndDate: weekDates.end,
      wins,
      challenges,
      lessons,
      topThreeFocusItems: topThreeFocusItems.filter((item) => item.trim() !== ""),
      progressScore,
      metricUpdate: hasMetricUpdate ? metricUpdate : undefined,
      createdAt: new Date().toISOString(),
    };
    saveWeeklyReview(review);
    alert("Weekelijkse review opgeslagen!");
    
    // Reset form
    setWins("");
    setChallenges("");
    setLessons("");
    setTopThreeFocusItems(["", "", ""]);
    setProgressScore(5);
    setHasMetricUpdate(false);
    
    // Re-evaluate review status
    const newStatus = determineReviewType(goal);
    setReviewStatus(newStatus);
  };

  const handleSaveMonthly = () => {
    const review: MonthlyReview = {
      id: `monthly_${goal.id}_${month}_${Date.now()}`,
      goalId: goal.id,
      month,
      milestoneProgress,
      metricUpdate: hasMetricUpdateMonthly ? metricUpdateMonthly : undefined,
      proudOf,
      needToChange,
      newHabitsOrAdjustments,
      createdAt: new Date().toISOString(),
    };
    saveMonthlyReview(review);
    alert("Maandelijkse review opgeslagen!");
    
    // Reset form
    setMilestoneProgress(
      goal.milestones.map((m) => ({
        milestoneId: m.id,
        completed: false,
        notes: "",
      }))
    );
    setProudOf("");
    setNeedToChange("");
    setNewHabitsOrAdjustments("");
    setHasMetricUpdateMonthly(false);
    
    // Re-evaluate review status
    const newStatus = determineReviewType(goal);
    setReviewStatus(newStatus);
  };

  const handleMilestoneChange = (
    index: number,
    field: "completed" | "notes",
    value: boolean | string
  ) => {
    const updated = [...milestoneProgress];
    updated[index] = { ...updated[index], [field]: value };
    setMilestoneProgress(updated);
  };

  const weekDates = getWeekStartEnd(weekDate);
  const previousDaily = getDailyCheckInsByGoal(goal.id);
  const previousWeekly = getWeeklyReviewsByGoal(goal.id);
  const previousMonthly = getMonthlyReviewsByGoal(goal.id);

  return (
    <Container maxWidth="md" sx={{ py: 3, pb: 10 }}>
      <Typography variant="h4" gutterBottom>
        Check In
      </Typography>
      <Typography variant="subtitle1" color="text.secondary" gutterBottom>
        {goal.title}
      </Typography>

      {reviewStatus.message && (
        <Alert severity="info" sx={{ mb: 3 }}>
          {reviewStatus.message}
        </Alert>
      )}

      <Paper sx={{ mb: 3 }}>
        <Tabs
          value={activeTab}
          onChange={(_, newValue) => setActiveTab(newValue)}
          variant="fullWidth"
        >
          <Tab label="Dagelijks" />
          <Tab label="Wekelijks" />
          <Tab label="Maandelijks" />
        </Tabs>
      </Paper>

      {/* Daily Tab */}
      {activeTab === 0 && (
        <Paper sx={{ p: 3, mb: 3 }}>
          <TextField
            type="date"
            label="Datum"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            fullWidth
            sx={{ mb: 3 }}
            InputLabelProps={{ shrink: true }}
          />

          <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
            <TextField
              label="Één ding dat je vandaag gaat doen"
              value={mindset.oneThingToday}
              onChange={(e) =>
                setMindset({ ...mindset, oneThingToday: e.target.value })
              }
              fullWidth
              multiline
              rows={3}
              helperText="Wat is het belangrijkste dat je vandaag wilt bereiken voor dit doel?"
            />

            <TextField
              label="Mogelijk obstakel"
              value={mindset.possibleObstacle}
              onChange={(e) =>
                setMindset({ ...mindset, possibleObstacle: e.target.value })
              }
              fullWidth
              multiline
              rows={2}
            />

            <TextField
              label="Hoe reageert je beste zelf hierop?"
              value={mindset.bestSelfResponse}
              onChange={(e) =>
                setMindset({ ...mindset, bestSelfResponse: e.target.value })
              }
              fullWidth
              multiline
              rows={3}
            />

            <TextField
              label="Waarom doet dit ertoe vandaag?"
              value={mindset.whyItMattersToday}
              onChange={(e) =>
                setMindset({ ...mindset, whyItMattersToday: e.target.value })
              }
              fullWidth
              multiline
              rows={2}
            />

            <TextField
              label="Gratitude of win"
              value={mindset.gratitudeOrWin}
              onChange={(e) =>
                setMindset({ ...mindset, gratitudeOrWin: e.target.value })
              }
              fullWidth
              multiline
              rows={2}
            />

            <Box>
              <Typography gutterBottom>Score (1-10): {score}</Typography>
              <Slider
                value={score}
                onChange={(_, newValue) => setScore(newValue as number)}
                min={1}
                max={10}
                marks
                step={1}
                valueLabelDisplay="auto"
              />
            </Box>
          </Box>

          <Button
            variant="contained"
            fullWidth
            startIcon={<SaveIcon />}
            onClick={handleSaveDaily}
            sx={{ mt: 3 }}
          >
            Opslaan
          </Button>
        </Paper>
      )}

      {/* Weekly Tab */}
      {activeTab === 1 && (
        <Paper sx={{ p: 3, mb: 3 }}>
          <TextField
            type="date"
            label="Selecteer datum in de week"
            value={weekDate}
            onChange={(e) => setWeekDate(e.target.value)}
            fullWidth
            sx={{ mb: 3 }}
            InputLabelProps={{ shrink: true }}
          />
          <Typography variant="body2" color="text.secondary" gutterBottom sx={{ mb: 3 }}>
            Week: {formatDate(weekDates.start)} - {formatDate(weekDates.end)}
          </Typography>

          <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
            <TextField
              label="Wins"
              value={wins}
              onChange={(e) => setWins(e.target.value)}
              fullWidth
              multiline
              rows={4}
            />

            <TextField
              label="Uitdagingen"
              value={challenges}
              onChange={(e) => setChallenges(e.target.value)}
              fullWidth
              multiline
              rows={4}
            />

            <TextField
              label="Lessen"
              value={lessons}
              onChange={(e) => setLessons(e.target.value)}
              fullWidth
              multiline
              rows={4}
            />

            <Typography variant="h6">Top 3 Focus Items voor Volgende Week</Typography>
            {topThreeFocusItems.map((item, index) => (
              <TextField
                key={index}
                label={`Focus item ${index + 1}`}
                value={item}
                onChange={(e) => {
                  const updated = [...topThreeFocusItems];
                  updated[index] = e.target.value;
                  setTopThreeFocusItems(updated);
                }}
                fullWidth
              />
            ))}

            <Box>
              <Typography gutterBottom>Voortgang Score (1-10): {progressScore}</Typography>
              <Slider
                value={progressScore}
                onChange={(_, newValue) => setProgressScore(newValue as number)}
                min={1}
                max={10}
                marks
                step={1}
                valueLabelDisplay="auto"
              />
            </Box>

            {goal.metric && (
              <Box>
                <Button
                  variant={hasMetricUpdate ? "contained" : "outlined"}
                  onClick={() => setHasMetricUpdate(!hasMetricUpdate)}
                  sx={{ mb: 2 }}
                >
                  {hasMetricUpdate ? "✓ Metriek bijwerken" : "+ Metriek bijwerken"}
                </Button>
                {hasMetricUpdate && (
                  <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 2 }}>
                    <TextField
                      label="Metriek Label"
                      value={metricUpdate.label}
                      onChange={(e) =>
                        setMetricUpdate({ ...metricUpdate, label: e.target.value })
                      }
                      fullWidth
                      disabled
                    />
                    <TextField
                      type="number"
                      label="Huidige Waarde"
                      value={metricUpdate.currentValue}
                      onChange={(e) =>
                        setMetricUpdate({
                          ...metricUpdate,
                          currentValue: parseFloat(e.target.value) || 0,
                        })
                      }
                      fullWidth
                      inputProps={{ step: "any" }}
                    />
                  </Box>
                )}
              </Box>
            )}
          </Box>

          <Button
            variant="contained"
            fullWidth
            startIcon={<SaveIcon />}
            onClick={handleSaveWeekly}
            sx={{ mt: 3 }}
          >
            Opslaan
          </Button>
        </Paper>
      )}

      {/* Monthly Tab */}
      {activeTab === 2 && (
        <Paper sx={{ p: 3, mb: 3 }}>
          <TextField
            type="month"
            label="Maand"
            value={month}
            onChange={(e) => setMonth(e.target.value)}
            fullWidth
            sx={{ mb: 3 }}
            InputLabelProps={{ shrink: true }}
          />

          <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
            {goal.milestones.length > 0 && (
              <Box>
                <Typography variant="h6" gutterBottom>
                  Mijlpaal Voortgang
                </Typography>
                {goal.milestones.map((milestone, index) => {
                  const progress = milestoneProgress.find(
                    (p) => p.milestoneId === milestone.id
                  );
                  return (
                    <Card key={milestone.id} variant="outlined" sx={{ mb: 2 }}>
                      <CardContent>
                        <FormControlLabel
                          control={
                            <Checkbox
                              checked={progress?.completed || false}
                              onChange={(e) =>
                                handleMilestoneChange(index, "completed", e.target.checked)
                              }
                            />
                          }
                          label={<Typography variant="h6">{milestone.title}</Typography>}
                          sx={{ mb: 2 }}
                        />
                        <TextField
                          label="Notities"
                          value={progress?.notes || ""}
                          onChange={(e) =>
                            handleMilestoneChange(index, "notes", e.target.value)
                          }
                          fullWidth
                          multiline
                          rows={2}
                        />
                      </CardContent>
                    </Card>
                  );
                })}
              </Box>
            )}

            {goal.metric && (
              <Box>
                <Button
                  variant={hasMetricUpdateMonthly ? "contained" : "outlined"}
                  onClick={() => setHasMetricUpdateMonthly(!hasMetricUpdateMonthly)}
                  sx={{ mb: 2 }}
                >
                  {hasMetricUpdateMonthly ? "✓ Metriek bijwerken" : "+ Metriek bijwerken"}
                </Button>
                {hasMetricUpdateMonthly && (
                  <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 2 }}>
                    <TextField
                      label="Metriek Label"
                      value={metricUpdateMonthly.label}
                      onChange={(e) =>
                        setMetricUpdateMonthly({ ...metricUpdateMonthly, label: e.target.value })
                      }
                      fullWidth
                      disabled
                    />
                    <TextField
                      type="number"
                      label="Huidige Waarde"
                      value={metricUpdateMonthly.currentValue}
                      onChange={(e) =>
                        setMetricUpdateMonthly({
                          ...metricUpdateMonthly,
                          currentValue: parseFloat(e.target.value) || 0,
                        })
                      }
                      fullWidth
                      inputProps={{ step: "any" }}
                    />
                  </Box>
                )}
              </Box>
            )}

            <TextField
              label="Waar ben je trots op?"
              value={proudOf}
              onChange={(e) => setProudOf(e.target.value)}
              fullWidth
              multiline
              rows={4}
            />

            <TextField
              label="Wat moet er veranderen?"
              value={needToChange}
              onChange={(e) => setNeedToChange(e.target.value)}
              fullWidth
              multiline
              rows={4}
            />

            <TextField
              label="Nieuwe gewoontes of aanpassingen"
              value={newHabitsOrAdjustments}
              onChange={(e) => setNewHabitsOrAdjustments(e.target.value)}
              fullWidth
              multiline
              rows={4}
            />
          </Box>

          <Button
            variant="contained"
            fullWidth
            startIcon={<SaveIcon />}
            onClick={handleSaveMonthly}
            sx={{ mt: 3 }}
          >
            Opslaan
          </Button>
        </Paper>
      )}

      {/* Previous Reviews */}
      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          Vorige Reviews
        </Typography>
        <Tabs value={activeTab} onChange={(_, newValue) => setActiveTab(newValue)} sx={{ mb: 2 }}>
          <Tab label={`Dagelijks (${previousDaily.length})`} />
          <Tab label={`Wekelijks (${previousWeekly.length})`} />
          <Tab label={`Maandelijks (${previousMonthly.length})`} />
        </Tabs>
        
        {activeTab === 0 && <ReviewList reviews={previousDaily} type="daily" />}
        {activeTab === 1 && <ReviewList reviews={previousWeekly} type="weekly" />}
        {activeTab === 2 && <ReviewList reviews={previousMonthly} type="monthly" />}
      </Paper>
    </Container>
  );
}

