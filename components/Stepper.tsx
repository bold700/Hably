"use client";

import React from "react";
import {
  Stepper as MuiStepper,
  Step,
  StepLabel,
  Box,
  Paper,
} from "@mui/material";
import { CheckCircle } from "@mui/icons-material";

interface Step {
  label: string;
  description?: string;
}

interface CustomStepperProps {
  steps: Step[];
  activeStep: number;
  completed: boolean[];
  children: React.ReactNode;
}

export default function CustomStepper({
  steps,
  activeStep,
  completed,
  children,
}: CustomStepperProps) {
  return (
    <Box>
      <MuiStepper activeStep={activeStep} orientation="horizontal" sx={{ mb: 4 }}>
        {steps.map((step, index) => (
          <Step key={step.label} completed={completed[index]}>
            <StepLabel
              optional={
                step.description ? (
                  <Box component="span" sx={{ fontSize: "0.75rem", display: { xs: "none", sm: "block" } }}>
                    {step.description}
                  </Box>
                ) : null
              }
              StepIconComponent={({ active, completed }) => {
                if (completed) {
                  return <CheckCircle color="primary" />;
                }
                return (
                  <Box
                    sx={{
                      width: 32,
                      height: 32,
                      borderRadius: "50%",
                      border: 2,
                      borderColor: active ? "primary.main" : "divider",
                      bgcolor: active ? "primary.main" : "transparent",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: active ? "primary.contrastText" : "text.secondary",
                      fontSize: "0.875rem",
                      fontWeight: 500,
                    }}
                  >
                    {index + 1}
                  </Box>
                );
              }}
            >
              <Box sx={{ fontSize: { xs: "0.75rem", sm: "0.875rem" } }}>
                {step.label}
              </Box>
            </StepLabel>
          </Step>
        ))}
      </MuiStepper>
      <Paper sx={{ p: 3, mt: 3 }}>
        {children}
      </Paper>
    </Box>
  );
}

