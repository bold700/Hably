"use client";

import { createTheme } from "@mui/material/styles";

// Material Design 3 Custom Theme - From Material Theme Builder
// Seed: #479F6D

export const theme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#2B6A46",
      light: "#93D5A9",
      dark: "#0B5130",
      contrastText: "#FFFFFF",
    },
    secondary: {
      main: "#4E6354",
      light: "#B5CCBA",
      dark: "#374B3D",
      contrastText: "#FFFFFF",
    },
    error: {
      main: "#BA1A1A",
      light: "#FFB4AB",
      dark: "#93000A",
      contrastText: "#FFFFFF",
    },
    warning: {
      main: "#7C2D12",
      light: "#9D5333",
      dark: "#5E1A07",
      contrastText: "#FFFFFF",
    },
    info: {
      main: "#3B6470",
      light: "#A3CDDB",
      dark: "#214C58",
      contrastText: "#FFFFFF",
    },
    success: {
      main: "#2B6A46",
      light: "#93D5A9",
      dark: "#0B5130",
      contrastText: "#FFFFFF",
    },
    background: {
      default: "#FFF9EE", // surface color
      paper: "#FAF3E5", // surfaceContainerLow
    },
    text: {
      primary: "#1E1B13",
      secondary: "#3F484A",
      disabled: "#BFC8CA",
    },
    divider: "#BFC8CA",
  },
  shape: {
    borderRadius: 12,
  },
  spacing: 8,
  typography: {
    fontFamily: [
      "Roboto",
      '"Helvetica Neue"',
      "Arial",
      "sans-serif",
    ].join(","),
    h1: {
      fontSize: "2rem",
      fontWeight: 400,
      lineHeight: 1.2,
      letterSpacing: "0em",
    },
    h2: {
      fontSize: "1.75rem",
      fontWeight: 400,
      lineHeight: 1.25,
      letterSpacing: "0em",
    },
    h3: {
      fontSize: "1.5rem",
      fontWeight: 400,
      lineHeight: 1.33,
      letterSpacing: "0em",
    },
    h4: {
      fontSize: "1.25rem",
      fontWeight: 400,
      lineHeight: 1.4,
      letterSpacing: "0.0094em",
    },
    h5: {
      fontSize: "1.125rem",
      fontWeight: 500,
      lineHeight: 1.5,
      letterSpacing: "0.0094em",
    },
    h6: {
      fontSize: "1rem",
      fontWeight: 500,
      lineHeight: 1.5,
      letterSpacing: "0.0094em",
    },
    body1: {
      fontSize: "1rem",
      fontWeight: 400,
      lineHeight: 1.5,
      letterSpacing: "0.0313em",
    },
    body2: {
      fontSize: "0.875rem",
      fontWeight: 400,
      lineHeight: 1.43,
      letterSpacing: "0.0156em",
    },
    button: {
      fontSize: "0.875rem",
      fontWeight: 500,
      lineHeight: 1.75,
      letterSpacing: "0.0286em",
      textTransform: "none",
    },
  },
  shadows: [
    "none",
    "0px 1px 2px 0px rgba(0, 0, 0, 0.3), 0px 1px 3px 1px rgba(0, 0, 0, 0.15)",
    "0px 1px 2px 0px rgba(0, 0, 0, 0.3), 0px 2px 6px 2px rgba(0, 0, 0, 0.15)",
    "0px 1px 3px 0px rgba(0, 0, 0, 0.3), 0px 4px 8px 3px rgba(0, 0, 0, 0.15)",
    "0px 2px 3px 0px rgba(0, 0, 0, 0.3), 0px 6px 10px 4px rgba(0, 0, 0, 0.15)",
    "0px 4px 4px 0px rgba(0, 0, 0, 0.3), 0px 8px 12px 6px rgba(0, 0, 0, 0.15)",
    "0px 6px 4px 0px rgba(0, 0, 0, 0.3), 0px 12px 16px 8px rgba(0, 0, 0, 0.15)",
    "0px 8px 4px 0px rgba(0, 0, 0, 0.3), 0px 16px 24px 12px rgba(0, 0, 0, 0.15)",
    "0px 12px 4px 0px rgba(0, 0, 0, 0.3), 0px 20px 32px 16px rgba(0, 0, 0, 0.15)",
    "0px 16px 4px 0px rgba(0, 0, 0, 0.3), 0px 24px 40px 20px rgba(0, 0, 0, 0.15)",
    "0px 20px 4px 0px rgba(0, 0, 0, 0.3), 0px 28px 48px 24px rgba(0, 0, 0, 0.15)",
    "0px 24px 4px 0px rgba(0, 0, 0, 0.3), 0px 32px 56px 28px rgba(0, 0, 0, 0.15)",
    "0px 28px 4px 0px rgba(0, 0, 0, 0.3), 0px 36px 64px 32px rgba(0, 0, 0, 0.15)",
    "0px 32px 4px 0px rgba(0, 0, 0, 0.3), 0px 40px 72px 36px rgba(0, 0, 0, 0.15)",
    "0px 36px 4px 0px rgba(0, 0, 0, 0.3), 0px 44px 80px 40px rgba(0, 0, 0, 0.15)",
    "0px 40px 4px 0px rgba(0, 0, 0, 0.3), 0px 48px 88px 44px rgba(0, 0, 0, 0.15)",
    "0px 44px 4px 0px rgba(0, 0, 0, 0.3), 0px 52px 96px 48px rgba(0, 0, 0, 0.15)",
    "0px 48px 4px 0px rgba(0, 0, 0, 0.3), 0px 56px 104px 52px rgba(0, 0, 0, 0.15)",
    "0px 52px 4px 0px rgba(0, 0, 0, 0.3), 0px 60px 112px 56px rgba(0, 0, 0, 0.15)",
    "0px 56px 4px 0px rgba(0, 0, 0, 0.3), 0px 64px 120px 60px rgba(0, 0, 0, 0.15)",
    "0px 60px 4px 0px rgba(0, 0, 0, 0.3), 0px 68px 128px 64px rgba(0, 0, 0, 0.15)",
    "0px 64px 4px 0px rgba(0, 0, 0, 0.3), 0px 72px 136px 68px rgba(0, 0, 0, 0.15)",
    "0px 68px 4px 0px rgba(0, 0, 0, 0.3), 0px 76px 144px 72px rgba(0, 0, 0, 0.15)",
    "0px 72px 4px 0px rgba(0, 0, 0, 0.3), 0px 80px 152px 76px rgba(0, 0, 0, 0.15)",
  ],
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 20,
          padding: "10px 24px",
          textTransform: "none",
          "&.MuiButton-containedPrimary": {
            backgroundColor: "#2B6A46", // primary
            "&:hover": {
              backgroundColor: "#0B5130", // primary dark
            },
          },
          "&.MuiButton-tonal": {
            backgroundColor: "#AFF2C4", // primaryContainer
            color: "#0B5130", // onPrimaryContainer
            "&:hover": {
              backgroundColor: "#93D5A9", // primary light
            },
          },
        },
        contained: {
          boxShadow: "0px 1px 3px 0px rgba(0, 0, 0, 0.3), 0px 4px 8px 3px rgba(0, 0, 0, 0.15)",
          "&:hover": {
            boxShadow: "0px 2px 3px 0px rgba(0, 0, 0, 0.3), 0px 6px 10px 4px rgba(0, 0, 0, 0.15)",
          },
        },
      },
    },
    MuiTextField: {
      defaultProps: {
        variant: "outlined",
      },
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-root": {
            backgroundColor: "transparent",
            "& fieldset": {
              borderColor: "#BFC8CA", // outlineVariant
            },
            "&:hover fieldset": {
              borderColor: "#2B6A46", // primary
            },
            "&.Mui-focused fieldset": {
              borderColor: "#2B6A46", // primary
            },
            "&.Mui-disabled fieldset": {
              borderColor: "#BFC8CA", // outlineVariant
            },
          },
        },
      },
    },
    MuiCard: {
      defaultProps: {
        elevation: 0,
        variant: "outlined",
      },
      styleOverrides: {
        root: {
          borderRadius: 12,
          backgroundColor: "#FAF3E5", // surfaceContainerLow - filled card
          border: "1px solid transparent",
          boxShadow: "none",
          "&:hover": {
            backgroundColor: "#F4EDDF", // surfaceContainer
          },
        },
      },
    },
    MuiPaper: {
      defaultProps: {
        elevation: 0,
        variant: "outlined",
      },
      styleOverrides: {
        root: {
          backgroundColor: "#FAF3E5", // surfaceContainerLow - filled by default
          border: "1px solid transparent",
          boxShadow: "none",
          "&.MuiPaper-elevation0": {
            backgroundColor: "#FAF3E5", // surfaceContainerLow
          },
          "&.MuiPaper-elevation1": {
            backgroundColor: "#F4EDDF", // surfaceContainer
          },
          "&.MuiPaper-elevation2": {
            backgroundColor: "#EEE7DA", // surfaceContainerHigh
          },
          "&.MuiPaper-elevation3": {
            backgroundColor: "#E9E2D4", // surfaceContainerHighest
          },
        },
      },
    },
  },
});

