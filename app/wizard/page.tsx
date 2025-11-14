"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Container,
  Typography,
  Box,
  Button,
  TextField,
  MenuItem,
  FormHelperText,
  Paper,
} from "@mui/material";
import { ArrowBack, ArrowForward } from "@mui/icons-material";
import CustomStepper from "@/components/Stepper";
import {
  BigGoal,
  LifeArea,
  Habit,
  Milestone,
  GoalMetric,
  HabitFrequency,
} from "@/types";
import { saveGoal } from "@/utils/storage";
import { getTodayString } from "@/utils/dateHelpers";

const lifeAreaOptions: { value: LifeArea; label: string }[] = [
  { value: "health", label: "Gezondheid" },
  { value: "business", label: "Zakelijk" },
  { value: "finances", label: "Financiën" },
  { value: "relationships", label: "Relaties" },
  { value: "family", label: "Familie" },
  { value: "personal_growth", label: "Persoonlijke Groei" },
  { value: "experience_fun", label: "Ervaring & Plezier" },
  { value: "spirituality", label: "Spiritualiteit" },
  { value: "other", label: "Anders" },
];

const steps = [
  { label: "Levensgebied & Doel", description: "Selecteer levensgebied en naam je doel" },
  { label: "Tijdgebonden & Meetbaar", description: "Stel deadlines en meetbare criteria in" },
  { label: "Waarom", description: "Vind je waarom en motivatie" },
  { label: "Mijlpalen", description: "Creëer 1-3 mijlpalen" },
  { label: "Gewoontes", description: "Vertaal naar dagelijkse/wekelijkse gewoontes" },
];

export default function WizardPage() {
  const router = useRouter();
  const [activeStep, setActiveStep] = useState(0);
  const [completed, setCompleted] = useState([false, false, false, false, false]);

  // Step 1: Life area & goal
  const [lifeArea, setLifeArea] = useState<LifeArea>("health");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  // Step 2: Time bound & measurable
  const [startDate, setStartDate] = useState(getTodayString());
  const [endDate, setEndDate] = useState("");
  const [achievementDefinition, setAchievementDefinition] = useState("");
  const [hasMetric, setHasMetric] = useState(false);
  const [metric, setMetric] = useState<GoalMetric>({
    label: "",
    unit: "",
    startValue: 0,
    targetValue: 0,
  });

  // Step 3: Why
  const [whyMustSucceed, setWhyMustSucceed] = useState("");
  const [whatIfNothingChanges, setWhatIfNothingChanges] = useState("");

  // Step 4: Milestones
  const [milestones, setMilestones] = useState<Milestone[]>([]);

  // Step 5: Habits
  const [habits, setHabits] = useState<Habit[]>([]);

  const handleNext = () => {
    if (validateStep()) {
      const newCompleted = [...completed];
      newCompleted[activeStep] = true;
      setCompleted(newCompleted);
      if (activeStep < steps.length - 1) {
        setActiveStep(activeStep + 1);
      } else {
        handleFinish();
      }
    }
  };

  const handleBack = () => {
    setActiveStep(activeStep - 1);
  };

  const validateStep = (): boolean => {
    switch (activeStep) {
      case 0:
        return title.trim() !== "" && description.trim() !== "";
      case 1:
        if (endDate === "") return false;
        if (achievementDefinition.trim() === "") return false;
        if (hasMetric) {
          return (
            metric.label.trim() !== "" &&
            metric.unit.trim() !== "" &&
            metric.targetValue > metric.startValue
          );
        }
        return true;
      case 2:
        return (
          whyMustSucceed.trim() !== "" &&
          whatIfNothingChanges.trim() !== ""
        );
      case 3:
        if (milestones.length < 1 || milestones.length > 3) return false;
        return milestones.every(
          (m) => m.title.trim() !== "" && m.targetDate !== "" && m.successDefinition.trim() !== ""
        );
      case 4:
        if (habits.length < 1) return false;
        return habits.every((h) => h.description.trim() !== "");
      default:
        return true;
    }
  };

  const handleFinish = () => {
    const goal: BigGoal = {
      id: `goal_${Date.now()}`,
      lifeArea,
      title,
      description,
      startDate,
      endDate,
      achievementDefinition,
      metric: hasMetric ? metric : undefined,
      whyMustSucceed,
      whatIfNothingChanges,
      milestones,
      habits,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    saveGoal(goal);
    router.push("/dashboard");
  };

  const addMilestone = () => {
    if (milestones.length < 3) {
      setMilestones([
        ...milestones,
        {
          id: `milestone_${Date.now()}`,
          title: "",
          targetDate: "",
          successDefinition: "",
        },
      ]);
    }
  };

  const updateMilestone = (index: number, field: keyof Milestone, value: string) => {
    const updated = [...milestones];
    updated[index] = { ...updated[index], [field]: value };
    setMilestones(updated);
  };

  const removeMilestone = (index: number) => {
    setMilestones(milestones.filter((_, i) => i !== index));
  };

  const addHabit = () => {
    setHabits([
      ...habits,
      {
        id: `habit_${Date.now()}`,
        description: "",
        frequency: "daily",
        targetPerPeriod: 1,
      },
    ]);
  };

  const updateHabit = (
    index: number,
    field: keyof Habit,
    value: string | number | HabitFrequency
  ) => {
    const updated = [...habits];
    updated[index] = { ...updated[index], [field]: value };
    setHabits(updated);
  };

  const removeHabit = (index: number) => {
    setHabits(habits.filter((_, i) => i !== index));
  };

  const renderStepContent = () => {
    switch (activeStep) {
      case 0:
        return (
          <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
            <TextField
              select
              label="Levensgebied"
              value={lifeArea}
              onChange={(e) => setLifeArea(e.target.value as LifeArea)}
              fullWidth
              required
            >
              {lifeAreaOptions.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              label="Doel Titel"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              fullWidth
              required
              helperText="Geef je doel een duidelijke naam"
            />
            <TextField
              label="Beschrijving"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              fullWidth
              multiline
              rows={4}
              required
              helperText="Beschrijf je doel in detail"
            />
          </Box>
        );

      case 1:
        return (
          <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
            <TextField
              type="date"
              label="Startdatum"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              fullWidth
              required
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              type="date"
              label="Einddatum (deadline)"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              fullWidth
              required
              InputLabelProps={{ shrink: true }}
              helperText="Wanneer moet dit doel behaald zijn?"
            />
            <TextField
              label="Hoe weet je dat dit doel behaald is?"
              value={achievementDefinition}
              onChange={(e) => setAchievementDefinition(e.target.value)}
              fullWidth
              multiline
              rows={4}
              required
              helperText="Beschrijf specifiek hoe succes eruit ziet"
            />
            <Box>
              <Button
                variant={hasMetric ? "contained" : "outlined"}
                onClick={() => setHasMetric(!hasMetric)}
                sx={{ mb: 2 }}
              >
                {hasMetric ? "✓ Metrische gegevens toevoegen" : "+ Metrische gegevens toevoegen"}
              </Button>
              {hasMetric && (
                <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 2 }}>
                  <TextField
                    label="Metriek Label"
                    value={metric.label}
                    onChange={(e) =>
                      setMetric({ ...metric, label: e.target.value })
                    }
                    fullWidth
                    helperText="Bijv. Gewicht, Inkomsten, Aantal klanten"
                  />
                  <TextField
                    label="Eenheid"
                    value={metric.unit}
                    onChange={(e) =>
                      setMetric({ ...metric, unit: e.target.value })
                    }
                    fullWidth
                    helperText="Bijv. kg, €, aantal"
                  />
                  <TextField
                    type="number"
                    label="Startwaarde"
                    value={metric.startValue}
                    onChange={(e) =>
                      setMetric({ ...metric, startValue: parseFloat(e.target.value) || 0 })
                    }
                    fullWidth
                    inputProps={{ step: "any" }}
                  />
                  <TextField
                    type="number"
                    label="Doelwaarde"
                    value={metric.targetValue}
                    onChange={(e) =>
                      setMetric({ ...metric, targetValue: parseFloat(e.target.value) || 0 })
                    }
                    fullWidth
                    inputProps={{ step: "any" }}
                  />
                </Box>
              )}
            </Box>
          </Box>
        );

      case 2:
        return (
          <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
            <TextField
              label="Waarom moet dit doel slagen?"
              value={whyMustSucceed}
              onChange={(e) => setWhyMustSucceed(e.target.value)}
              fullWidth
              multiline
              rows={5}
              required
              helperText="Wat betekent dit doel voor jou? Wat is de diepere motivatie?"
            />
            <TextField
              label="Wat gebeurt er als er niets verandert?"
              value={whatIfNothingChanges}
              onChange={(e) => setWhatIfNothingChanges(e.target.value)}
              fullWidth
              multiline
              rows={5}
              required
              helperText="Wat zijn de gevolgen als je dit doel niet haalt?"
            />
          </Box>
        );

      case 3:
        return (
          <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
            <Button
              variant="outlined"
              onClick={addMilestone}
              disabled={milestones.length >= 3}
              sx={{ mb: 2 }}
            >
              + Mijlpaal Toevoegen ({milestones.length}/3)
            </Button>
            {milestones.map((milestone, index) => (
              <Paper key={milestone.id} variant="outlined" sx={{ p: 2 }}>
                <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
                  <Typography variant="h6">Mijlpaal {index + 1}</Typography>
                  <Button
                    size="small"
                    color="error"
                    onClick={() => removeMilestone(index)}
                  >
                    Verwijderen
                  </Button>
                </Box>
                <TextField
                  label="Titel"
                  value={milestone.title}
                  onChange={(e) => updateMilestone(index, "title", e.target.value)}
                  fullWidth
                  sx={{ mb: 2 }}
                  required
                />
                <TextField
                  type="date"
                  label="Doeldatum"
                  value={milestone.targetDate}
                  onChange={(e) => updateMilestone(index, "targetDate", e.target.value)}
                  fullWidth
                  sx={{ mb: 2 }}
                  InputLabelProps={{ shrink: true }}
                  required
                />
                <TextField
                  label="Definitie van Succes"
                  value={milestone.successDefinition}
                  onChange={(e) => updateMilestone(index, "successDefinition", e.target.value)}
                  fullWidth
                  multiline
                  rows={3}
                  required
                />
              </Paper>
            ))}
          </Box>
        );

      case 4:
        return (
          <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
            <Button
              variant="outlined"
              onClick={addHabit}
              sx={{ mb: 2 }}
            >
              + Gewoonte Toevoegen
            </Button>
            {habits.map((habit, index) => (
              <Paper key={habit.id} variant="outlined" sx={{ p: 2 }}>
                <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
                  <Typography variant="h6">Gewoonte {index + 1}</Typography>
                  <Button
                    size="small"
                    color="error"
                    onClick={() => removeHabit(index)}
                  >
                    Verwijderen
                  </Button>
                </Box>
                <TextField
                  label="Beschrijving"
                  value={habit.description}
                  onChange={(e) => updateHabit(index, "description", e.target.value)}
                  fullWidth
                  sx={{ mb: 2 }}
                  required
                  helperText="Wat ga je dagelijks/wekelijks doen?"
                />
                <TextField
                  select
                  label="Frequentie"
                  value={habit.frequency}
                  onChange={(e) => updateHabit(index, "frequency", e.target.value as HabitFrequency)}
                  fullWidth
                  sx={{ mb: 2 }}
                  required
                >
                  <MenuItem value="daily">Dagelijks</MenuItem>
                  <MenuItem value="weekly">Wekelijks</MenuItem>
                </TextField>
                <TextField
                  type="number"
                  label={`Doel per ${habit.frequency === "daily" ? "dag" : "week"}`}
                  value={habit.targetPerPeriod}
                  onChange={(e) => updateHabit(index, "targetPerPeriod", parseInt(e.target.value) || 1)}
                  fullWidth
                  inputProps={{ min: 1 }}
                  required
                />
              </Paper>
            ))}
          </Box>
        );

      default:
        return null;
    }
  };

  return (
    <Container maxWidth="md" sx={{ py: 3, pb: 10 }}>
      <Typography variant="h4" gutterBottom>
        Nieuw Doel Aanmaken
      </Typography>
      <CustomStepper
        steps={steps}
        activeStep={activeStep}
        completed={completed}
      >
        {renderStepContent()}
        <Box sx={{ display: "flex", justifyContent: "space-between", mt: 3 }}>
          <Button
            disabled={activeStep === 0}
            onClick={handleBack}
            startIcon={<ArrowBack />}
          >
            Terug
          </Button>
          <Button
            variant="contained"
            onClick={handleNext}
            endIcon={activeStep === steps.length - 1 ? undefined : <ArrowForward />}
          >
            {activeStep === steps.length - 1 ? "Voltooien" : "Volgende"}
          </Button>
        </Box>
      </CustomStepper>
    </Container>
  );
}

