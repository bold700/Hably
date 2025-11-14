"use client";

import React from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Container,
  Typography,
  Box,
  Button,
  Paper,
  Chip,
  Divider,
  Card,
  CardContent,
} from "@mui/material";
import {
  Today as TodayIcon,
} from "@mui/icons-material";
import { getGoal } from "@/utils/storage";
import { BigGoal } from "@/types";
import { formatDate } from "@/utils/dateHelpers";
import HabitList from "@/components/HabitList";
import ProgressDashboard from "@/components/ProgressDashboard";

const lifeAreaLabels: Record<string, string> = {
  health: "Gezondheid",
  business: "Zakelijk",
  finances: "Financiën",
  relationships: "Relaties",
  family: "Familie",
  personal_growth: "Persoonlijke Groei",
  experience_fun: "Ervaring & Plezier",
  spirituality: "Spiritualiteit",
  other: "Anders",
};

export default function GoalDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [goal, setGoal] = React.useState<BigGoal | null>(null);

  React.useEffect(() => {
    if (params.id) {
      const foundGoal = getGoal(params.id as string);
      setGoal(foundGoal);
    }
  }, [params.id]);

  if (!goal) {
    return (
      <Container maxWidth="md" sx={{ py: 3, pb: 10 }}>
        <Typography variant="h6">Doel niet gevonden</Typography>
        <Button onClick={() => router.push("/dashboard")}>Terug naar Dashboard</Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 3, pb: 10 }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
        <Typography variant="h4">{goal.title}</Typography>
        <Chip
          label={lifeAreaLabels[goal.lifeArea] || goal.lifeArea}
          color="primary"
          variant="outlined"
        />
      </Box>

      {/* Voortgang Dashboard */}
      <ProgressDashboard goal={goal} />

      <Divider sx={{ my: 4 }} />

      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Beschrijving
        </Typography>
        <Typography variant="body1" color="text.secondary" paragraph>
          {goal.description}
        </Typography>
      </Paper>

      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Tijdlijn
        </Typography>
        <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
          <Typography variant="body2">
            <strong>Start:</strong> {formatDate(goal.startDate)}
          </Typography>
          <Typography variant="body2">
            <strong>Eind:</strong> {formatDate(goal.endDate)}
          </Typography>
        </Box>
      </Paper>

      {goal.metric && (
        <Paper sx={{ p: 3, mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            Metriek
          </Typography>
          <Typography variant="body1">
            {goal.metric.label}: {goal.metric.startValue} → {goal.metric.targetValue} {goal.metric.unit}
          </Typography>
        </Paper>
      )}

      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Succesdefinitie
        </Typography>
        <Typography variant="body1" color="text.secondary">
          {goal.achievementDefinition}
        </Typography>
      </Paper>

      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Waarom moet dit slagen?
        </Typography>
        <Typography variant="body1" color="text.secondary" paragraph>
          {goal.whyMustSucceed}
        </Typography>
        <Divider sx={{ my: 2 }} />
        <Typography variant="h6" gutterBottom>
          Wat gebeurt er als er niets verandert?
        </Typography>
        <Typography variant="body1" color="text.secondary">
          {goal.whatIfNothingChanges}
        </Typography>
      </Paper>

      {goal.milestones.length > 0 && (
        <Paper sx={{ p: 3, mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            Mijlpalen
          </Typography>
          {goal.milestones.map((milestone, index) => (
            <Card key={milestone.id} variant="outlined" sx={{ mb: 2 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Mijlpaal {index + 1}: {milestone.title}
                </Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Doeldatum: {formatDate(milestone.targetDate)}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {milestone.successDefinition}
                </Typography>
              </CardContent>
            </Card>
          ))}
        </Paper>
      )}

      {goal.habits.length > 0 && (
        <Paper sx={{ p: 3, mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            Gewoontes
          </Typography>
          <HabitList habits={goal.habits} />
        </Paper>
      )}

      <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap", mb: 3 }}>
        <Button
          variant="contained"
          startIcon={<TodayIcon />}
          onClick={() => router.push(`/checkin/${goal.id}`)}
          fullWidth
        >
          Check In
        </Button>
      </Box>
    </Container>
  );
}

