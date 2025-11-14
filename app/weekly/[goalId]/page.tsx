"use client";

import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Container,
  Typography,
  Box,
  Button,
  TextField,
  Paper,
  Slider,
  Card,
  CardContent,
} from "@mui/material";
import { Save as SaveIcon } from "@mui/icons-material";
import {
  getGoal,
  saveWeeklyReview,
  getWeeklyReviewsByGoal,
} from "@/utils/storage";
import { BigGoal, WeeklyReview } from "@/types";
import { getTodayString, getWeekStartEnd, formatDate } from "@/utils/dateHelpers";
import ReviewList from "@/components/ReviewList";

export default function WeeklyReviewPage() {
  const params = useParams();
  const router = useRouter();
  const [goal, setGoal] = React.useState<BigGoal | null>(null);
  const [date, setDate] = useState(getTodayString());
  const [wins, setWins] = useState("");
  const [challenges, setChallenges] = useState("");
  const [lessons, setLessons] = useState("");
  const [topThreeFocusItems, setTopThreeFocusItems] = useState(["", "", ""]);
  const [progressScore, setProgressScore] = useState(5);
  const [hasMetricUpdate, setHasMetricUpdate] = useState(false);
  const [metricUpdate, setMetricUpdate] = useState({ label: "", currentValue: 0 });

  React.useEffect(() => {
    if (params.goalId) {
      const foundGoal = getGoal(params.goalId as string);
      setGoal(foundGoal);
      if (foundGoal?.metric) {
        setMetricUpdate({
          label: foundGoal.metric.label,
          currentValue: foundGoal.metric.startValue,
        });
      }
    }
  }, [params.goalId]);

  if (!goal) {
    return (
      <Container maxWidth="md" sx={{ py: 3, pb: 10 }}>
        <Typography variant="h6">Doel niet gevonden</Typography>
        <Button onClick={() => router.push("/dashboard")}>Terug naar Dashboard</Button>
      </Container>
    );
  }

  const weekDates = getWeekStartEnd(date);

  const handleSave = () => {
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
  };

  const previousReviews = getWeeklyReviewsByGoal(goal.id);

  return (
    <Container maxWidth="md" sx={{ py: 3, pb: 10 }}>
      <Typography variant="h4" gutterBottom>
        Weekelijkse Review
      </Typography>
      <Typography variant="subtitle1" color="text.secondary" gutterBottom>
        {goal.title}
      </Typography>
      <Typography variant="body2" color="text.secondary" gutterBottom>
        Week: {formatDate(weekDates.start)} - {formatDate(weekDates.end)}
      </Typography>

      <Paper sx={{ p: 3, mb: 3 }}>
        <TextField
          type="date"
          label="Selecteer datum in de week"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          fullWidth
          sx={{ mb: 3 }}
          InputLabelProps={{ shrink: true }}
        />

        <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
          <TextField
            label="Wins"
            value={wins}
            onChange={(e) => setWins(e.target.value)}
            fullWidth
            multiline
            rows={4}
            helperText="Wat heb je deze week bereikt? Wat ging goed?"
          />

          <TextField
            label="Uitdagingen"
            value={challenges}
            onChange={(e) => setChallenges(e.target.value)}
            fullWidth
            multiline
            rows={4}
            helperText="Wat waren je uitdagingen deze week?"
          />

          <TextField
            label="Lessen"
            value={lessons}
            onChange={(e) => setLessons(e.target.value)}
            fullWidth
            multiline
            rows={4}
            helperText="Wat heb je deze week geleerd?"
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
              helperText={`Het ${index + 1}e belangrijkste dat je volgende week wilt bereiken`}
            />
          ))}

          <Box>
            <Typography gutterBottom>
              Voortgang Score (1-10): {progressScore}
            </Typography>
            <Slider
              value={progressScore}
              onChange={(_, newValue) => setProgressScore(newValue as number)}
              min={1}
              max={10}
              marks
              step={1}
              valueLabelDisplay="auto"
            />
            <Typography variant="caption" color="text.secondary">
              Hoe beoordeel je je voortgang deze week?
            </Typography>
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
                    helperText={goal.metric?.label}
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
                    helperText={`Start: ${goal.metric?.startValue} → Doel: ${goal.metric?.targetValue} ${goal.metric?.unit}`}
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
          onClick={handleSave}
          sx={{ mt: 3 }}
        >
          Opslaan
        </Button>
      </Paper>

      {previousReviews.length > 0 && (
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            Vorige Reviews
          </Typography>
          <ReviewList reviews={previousReviews} type="weekly" />
        </Paper>
      )}
    </Container>
  );
}

