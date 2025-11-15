"use client";

import React from "react";
import {
  Stepper as MuiStepper,
  Step,
  StepLabel,
  StepContent,
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
      <MuiStepper 
        activeStep={activeStep} 
        orientation="vertical"
        sx={{
          "& .MuiStepConnector-root": {
            left: "12px", // half of icon width (24dp)
            "&.Mui-active .MuiStepConnector-line": {
              borderColor: "#2B6A46", // primary color
            },
            "&.Mui-completed .MuiStepConnector-line": {
              borderColor: "#2B6A46", // primary color
            },
          },
          "& .MuiStepConnector-line": {
            borderLeftWidth: 2,
            borderColor: "#BFC8CA", // outlineVariant
            minHeight: "48px", // vertical space between steps
          },
          "& .MuiStepContent-root": {
            borderLeft: "2px solid",
            borderColor: "#BFC8CA", // outlineVariant
            marginLeft: "12px", // half of icon width (24dp)
            paddingLeft: "20px", // 24dp - 4dp
            marginTop: "8px",
            marginBottom: "8px",
            "&.Mui-active": {
              borderColor: "#2B6A46", // primary color when active
            },
          },
        }}
      >
        {steps.map((step, index) => (
          <Step key={step.label} completed={completed[index]}>
            <StepLabel
              optional={
                step.description ? (
                  <Box 
                    component="span" 
                    sx={{ 
                      fontSize: "0.75rem",
                      color: "text.secondary",
                      display: "block",
                      mt: 0.5,
                    }}
                  >
                    {step.description}
                  </Box>
                ) : null
              }
              StepIconComponent={({ active, completed }) => {
                if (completed) {
                  return (
                    <Box
                      sx={{
                        width: 24,
                        height: 24,
                        borderRadius: "50%",
                        bgcolor: "#2B6A46", // primary color
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "#FFFFFF", // onPrimary
                        flexShrink: 0,
                      }}
                    >
                      <CheckCircle sx={{ fontSize: 20, color: "#FFFFFF", display: "block" }} />
                    </Box>
                  );
                }
                return (
                  <Box
                    sx={{
                      width: 24,
                      height: 24,
                      borderRadius: "50%",
                      border: active ? 0 : 2,
                      borderColor: active ? "transparent" : "#BFC8CA", // outlineVariant
                      bgcolor: active ? "#2B6A46" : "transparent", // primary when active
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: active ? "#FFFFFF" : "#3F484A", // onPrimary when active, onSurfaceVariant when inactive
                      fontSize: "0.75rem", // 12sp
                      fontWeight: 400, // Regular
                      fontFamily: "Roboto, sans-serif",
                      lineHeight: 1,
                      textAlign: "center",
                    }}
                  >
                    {index + 1}
                  </Box>
                );
              }}
              sx={{
                "& .MuiStepLabel-root": {
                  alignItems: "flex-start",
                  pt: 3, // 24dp top padding
                  pb: 2, // 16dp bottom padding
                },
                "& .MuiStepLabel-iconContainer": {
                  paddingRight: 1,
                  alignItems: "center",
                  justifyContent: "center",
                },
                "& .MuiStepLabel-label": {
                  fontSize: "0.875rem", // 14sp
                  fontWeight: activeStep === index ? 500 : 400, // Medium when active, Regular when inactive
                  color: activeStep === index ? "#1E1B13" : "#3F484A", // onSurface when active, onSurfaceVariant when inactive
                  mt: 0,
                  alignItems: "center",
                  display: "flex",
                  alignSelf: "center",
                },
                "& .MuiStepLabel-label.Mui-active": {
                  color: "#1E1B13", // onSurface
                },
                "& .MuiStepLabel-label.Mui-completed": {
                  color: "#1E1B13", // onSurface
                },
                alignItems: "flex-start",
              }}
            >
              {step.label}
            </StepLabel>
            <StepContent>
              {activeStep === index && (
                <Paper 
                  elevation={0}
                  variant="outlined"
                  sx={{ 
                    p: 3,
                    mt: 2,
                    mb: 2,
                    backgroundColor: "#FAF3E5", // surfaceContainerLow
                    border: "1px solid transparent",
                  }}
                >
                  {children}
                </Paper>
              )}
            </StepContent>
          </Step>
        ))}
      </MuiStepper>
    </Box>
  );
}

