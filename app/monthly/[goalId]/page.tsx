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
  Checkbox,
  FormControlLabel,
  Card,
  CardContent,
} from "@mui/material";
import { Save as SaveIcon } from "@mui/icons-material";
import {
  getGoal,
  saveMonthlyReview,
  getMonthlyReviewsByGoal,
} from "@/utils/storage";
import { BigGoal, MonthlyReview } from "@/types";
import { getTodayString, getMonthString } from "@/utils/dateHelpers";
import ReviewList from "@/components/ReviewList";

export default function MonthlyReviewPage() {
  const params = useParams();
  const router = useRouter();
  const [goal, setGoal] = React.useState<BigGoal | null>(null);
  const [month, setMonth] = useState(getMonthString(getTodayString()));
  const [milestoneProgress, setMilestoneProgress] = useState<
    Array<{ milestoneId: string; completed: boolean; notes?: string }>
  >([]);
  const [hasMetricUpdate, setHasMetricUpdate] = useState(false);
  const [metricUpdate, setMetricUpdate] = useState({ label: "", currentValue: 0 });
  const [proudOf, setProudOf] = useState("");
  const [needToChange, setNeedToChange] = useState("");
  const [newHabitsOrAdjustments, setNewHabitsOrAdjustments] = useState("");

  React.useEffect(() => {
    if (params.goalId) {
      const foundGoal = getGoal(params.goalId as string);
      setGoal(foundGoal);
      if (foundGoal) {
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
        }
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

  const handleMilestoneChange = (
    index: number,
    field: "completed" | "notes",
    value: boolean | string
  ) => {
    const updated = [...milestoneProgress];
    updated[index] = { ...updated[index], [field]: value };
    setMilestoneProgress(updated);
  };

  const handleSave = () => {
    const review: MonthlyReview = {
      id: `monthly_${goal.id}_${month}_${Date.now()}`,
      goalId: goal.id,
      month,
      milestoneProgress,
      metricUpdate: hasMetricUpdate ? metricUpdate : undefined,
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
    setHasMetricUpdate(false);
  };

  const previousReviews = getMonthlyReviewsByGoal(goal.id);

  return (
    <Container maxWidth="md" sx={{ py: 3, pb: 10 }}>
      <Typography variant="h4" gutterBottom>
        Maandelijkse Review
      </Typography>
      <Typography variant="subtitle1" color="text.secondary" gutterBottom>
        {goal.title}
      </Typography>

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
                              handleMilestoneChange(
                                index,
                                "completed",
                                e.target.checked
                              )
                            }
                          />
                        }
                        label={milestone.title}
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
                        sx={{ mt: 2 }}
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

          <TextField
            label="Waar ben je trots op?"
            value={proudOf}
            onChange={(e) => setProudOf(e.target.value)}
            fullWidth
            multiline
            rows={4}
            helperText="Wat heb je deze maand bereikt waar je trots op bent?"
          />

          <TextField
            label="Wat moet er veranderen?"
            value={needToChange}
            onChange={(e) => setNeedToChange(e.target.value)}
            fullWidth
            multiline
            rows={4}
            helperText="Wat moet er anders om je doel te bereiken?"
          />

          <TextField
            label="Nieuwe gewoontes of aanpassingen"
            value={newHabitsOrAdjustments}
            onChange={(e) => setNewHabitsOrAdjustments(e.target.value)}
            fullWidth
            multiline
            rows={4}
            helperText="Zijn er nieuwe gewoontes nodig of aanpassingen aan bestaande?"
          />
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
          <ReviewList reviews={previousReviews} type="monthly" />
        </Paper>
      )}
    </Container>
  );
}

