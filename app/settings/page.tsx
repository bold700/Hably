"use client";

import React from "react";
import {
  Container,
  Typography,
  Box,
  Paper,
  Button,
  Divider,
} from "@mui/material";
import { Delete as DeleteIcon } from "@mui/icons-material";
import { useRouter } from "next/navigation";
import { getGoals, deleteGoal } from "@/utils/storage";
import GoalCard from "@/components/GoalCard";

export default function SettingsPage() {
  const router = useRouter();
  const [goals, setGoals] = React.useState(getGoals());

  React.useEffect(() => {
    const interval = setInterval(() => {
      setGoals(getGoals());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleDeleteGoal = (goalId: string) => {
    if (confirm("Weet je zeker dat je dit doel wilt verwijderen? Deze actie kan niet ongedaan worden gemaakt.")) {
      deleteGoal(goalId);
      setGoals(getGoals());
      router.push("/dashboard");
    }
  };

  return (
    <Container maxWidth="md" sx={{ py: 3, pb: 10 }}>
      <Typography variant="h4" gutterBottom>
        Instellingen
      </Typography>

      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Over HABLY
        </Typography>
        <Typography variant="body2" color="text.secondary" paragraph>
          HABLY - High Performance Goal Planner
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Een digitale tool om je grote doelen te stellen, te plannen en te bereiken.
        </Typography>
      </Paper>

      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          Je Doelen Beheren
        </Typography>
        <Typography variant="body2" color="text.secondary" paragraph>
          Alle opgeslagen doelen:
        </Typography>
        
        {goals.length === 0 ? (
          <Typography variant="body2" color="text.secondary">
            Je hebt nog geen doelen.
          </Typography>
        ) : (
          <Box>
            {goals.map((goal) => (
              <Box key={goal.id} sx={{ mb: 2 }}>
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="h6">{goal.title}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      Aangemaakt: {new Date(goal.createdAt).toLocaleDateString("nl-NL")}
                    </Typography>
                  </Box>
                  <Button
                    color="error"
                    startIcon={<DeleteIcon />}
                    onClick={() => handleDeleteGoal(goal.id)}
                    variant="outlined"
                  >
                    Verwijderen
                  </Button>
                </Box>
                <Divider sx={{ mt: 1 }} />
              </Box>
            ))}
          </Box>
        )}
      </Paper>

      <Paper sx={{ p: 3, mt: 3 }}>
        <Typography variant="h6" gutterBottom>
          Data
        </Typography>
        <Typography variant="body2" color="text.secondary" paragraph>
          Alle data wordt lokaal opgeslagen in je browser. Je gegevens blijven privé en worden niet gedeeld.
        </Typography>
        <Button
          variant="outlined"
          color="error"
          onClick={() => {
            if (confirm("Weet je zeker dat je alle data wilt wissen? Deze actie kan niet ongedaan worden gemaakt.")) {
              localStorage.clear();
              alert("Alle data is gewist.");
              router.push("/dashboard");
            }
          }}
        >
          Alle Data Wissen
        </Button>
      </Paper>
    </Container>
  );
}

