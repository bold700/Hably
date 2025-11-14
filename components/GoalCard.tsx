"use client";

import React from "react";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardActions,
  Typography,
  Button,
  Chip,
  Box,
} from "@mui/material";
import { BigGoal } from "@/types";
import { formatDate } from "@/utils/dateHelpers";

interface GoalCardProps {
  goal: BigGoal;
}

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

export default function GoalCard({ goal }: GoalCardProps) {
  const router = useRouter();

  return (
    <Card
      elevation={0}
      variant="outlined"
      sx={{
        mb: 2,
        cursor: "pointer",
        transition: "background-color 0.2s",
        backgroundColor: "#FAF3E5", // surfaceContainerLow
        border: "1px solid transparent",
        "&:hover": {
          backgroundColor: "#F4EDDF", // surfaceContainer
        },
      }}
      onClick={() => router.push(`/goal/${goal.id}`)}
    >
      <CardContent>
        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
          <Chip
            label={lifeAreaLabels[goal.lifeArea] || goal.lifeArea}
            size="small"
            color="primary"
            variant="outlined"
          />
          <Typography variant="caption" color="text.secondary">
            {formatDate(goal.createdAt)}
          </Typography>
        </Box>
        <Typography variant="h6" gutterBottom>
          {goal.title}
        </Typography>
        <Typography variant="body2" color="text.secondary" paragraph>
          {goal.description}
        </Typography>
        <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", mt: 2 }}>
          <Typography variant="caption" color="text.secondary">
            📅 Tot: {formatDate(goal.endDate)}
          </Typography>
          {goal.metric && (
            <Typography variant="caption" color="text.secondary">
              📊 {goal.metric.label}: {goal.metric.startValue} → {goal.metric.targetValue} {goal.metric.unit}
            </Typography>
          )}
          <Typography variant="caption" color="text.secondary">
            🎯 {goal.milestones.length} mijlpaal{goal.milestones.length !== 1 ? "en" : ""}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            🔄 {goal.habits.length} gewoonte{goal.habits.length !== 1 ? "n" : ""}
          </Typography>
        </Box>
      </CardContent>
      <CardActions>
        <Button size="small" onClick={(e) => {
          e.stopPropagation();
          router.push(`/goal/${goal.id}`);
        }}>
          Details
        </Button>
      </CardActions>
    </Card>
  );
}

