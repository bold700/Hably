"use client";

import React from "react";
import { Box, Typography, Chip, Paper } from "@mui/material";
import { Habit } from "@/types";

interface HabitListProps {
  habits: Habit[];
}

export default function HabitList({ habits }: HabitListProps) {
  if (habits.length === 0) {
    return (
      <Typography variant="body2" color="text.secondary">
        Geen gewoontes gedefinieerd
      </Typography>
    );
  }

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
      {habits.map((habit) => (
        <Paper
          key={habit.id}
          variant="outlined"
          sx={{ p: 2, borderRadius: 2 }}
        >
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "start" }}>
            <Typography variant="body1">{habit.description}</Typography>
            <Chip
              label={habit.frequency === "daily" ? "Dagelijks" : "Wekelijks"}
              size="small"
              color="primary"
              variant="tonal"
            />
          </Box>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Doel: {habit.targetPerPeriod}x per {habit.frequency === "daily" ? "dag" : "week"}
          </Typography>
        </Paper>
      ))}
    </Box>
  );
}

