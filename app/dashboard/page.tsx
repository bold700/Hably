"use client";

import React from "react";
import { useRouter } from "next/navigation";
import {
  Container,
  Typography,
  Box,
  Button,
  Paper,
} from "@mui/material";
import { Add as AddIcon } from "@mui/icons-material";
import { getGoals } from "@/utils/storage";
import GoalCard from "@/components/GoalCard";
import { BigGoal } from "@/types";

export default function DashboardPage() {
  const router = useRouter();
  const [goals, setGoals] = React.useState<BigGoal[]>([]);
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
    setGoals(getGoals());
    const interval = setInterval(() => {
      setGoals(getGoals());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  if (!mounted) {
    return (
      <Container maxWidth="md" sx={{ py: 3, pb: 10 }}>
        <Typography variant="h4">Mijn Doelen</Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 3, pb: 10 }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
        <Typography variant="h4">Mijn Doelen</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => router.push("/wizard")}
        >
          Nieuw Doel
        </Button>
      </Box>

      {goals.length === 0 ? (
        <Paper
          sx={{
            p: 4,
            textAlign: "center",
            borderRadius: 3,
          }}
        >
          <Typography variant="h6" gutterBottom>
            Welkom bij HABLY! 🎯
          </Typography>
          <Typography variant="body1" color="text.secondary" paragraph>
            Begin je reis naar high performance door je eerste grote doel te stellen.
          </Typography>
          <Button
            variant="contained"
            size="large"
            startIcon={<AddIcon />}
            onClick={() => router.push("/wizard")}
            sx={{ mt: 2 }}
          >
            Creëer je Eerste Doel
          </Button>
        </Paper>
      ) : (
        <Box>
          {goals.map((goal) => (
            <GoalCard key={goal.id} goal={goal} />
          ))}
        </Box>
      )}
    </Container>
  );
}

