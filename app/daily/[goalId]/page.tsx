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
import { getGoal, saveDailyCheckIn, getDailyCheckInsByGoal, getDailyCheckInByDate } from "@/utils/storage";
import { BigGoal, DailyCheckIn, DailyMindset } from "@/types";
import { getTodayString, formatDate } from "@/utils/dateHelpers";
import ReviewList from "@/components/ReviewList";

export default function DailyCheckInPage() {
  const params = useParams();
  const router = useRouter();
  const [goal, setGoal] = React.useState<BigGoal | null>(null);
  const [date, setDate] = useState(getTodayString());
  const [mindset, setMindset] = useState<DailyMindset>({
    oneThingToday: "",
    possibleObstacle: "",
    bestSelfResponse: "",
    whyItMattersToday: "",
    gratitudeOrWin: "",
  });
  const [score, setScore] = useState(5);

  React.useEffect(() => {
    if (params.goalId) {
      const foundGoal = getGoal(params.goalId as string);
      setGoal(foundGoal);
    }
  }, [params.goalId]);

  React.useEffect(() => {
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

  if (!goal) {
    return (
      <Container maxWidth="md" sx={{ py: 3, pb: 10 }}>
        <Typography variant="h6">Doel niet gevonden</Typography>
        <Button onClick={() => router.push("/dashboard")}>Terug naar Dashboard</Button>
      </Container>
    );
  }

  const handleSave = () => {
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
  };

  const previousCheckIns = getDailyCheckInsByGoal(goal.id);

  return (
    <Container maxWidth="md" sx={{ py: 3, pb: 10 }}>
      <Typography variant="h4" gutterBottom>
        Dagelijkse Check In
      </Typography>
      <Typography variant="subtitle1" color="text.secondary" gutterBottom>
        {goal.title}
      </Typography>

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
            helperText="Wat zou je kunnen tegenhouden?"
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
            helperText="Hoe zou de beste versie van jou hiermee omgaan?"
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
            helperText="Wat maakt dit doel vandaag belangrijk?"
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
            helperText="Waar ben je dankbaar voor of wat heb je al gewonnen?"
          />

          <Box>
            <Typography gutterBottom>
              Score (1-10): {score}
            </Typography>
            <Slider
              value={score}
              onChange={(_, newValue) => setScore(newValue as number)}
              min={1}
              max={10}
              marks
              step={1}
              valueLabelDisplay="auto"
            />
            <Typography variant="caption" color="text.secondary">
              Hoe voel je je vandaag over je voortgang?
            </Typography>
          </Box>
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

      {previousCheckIns.length > 0 && (
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            Vorige Check-ins
          </Typography>
          <ReviewList reviews={previousCheckIns} type="daily" />
        </Paper>
      )}
    </Container>
  );
}

