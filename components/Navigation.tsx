"use client";

import React from "react";
import { usePathname, useRouter } from "next/navigation";
import {
  BottomNavigation,
  BottomNavigationAction,
  Paper,
} from "@mui/material";
import {
  Dashboard as DashboardIcon,
  CheckCircle as CheckCircleIcon,
  Settings as SettingsIcon,
} from "@mui/icons-material";

export default function Navigation() {
  const pathname = usePathname();
  const router = useRouter();

  const getValue = () => {
    if (pathname?.startsWith("/dashboard")) return 0;
    if (pathname?.startsWith("/checkin")) return 1;
    if (pathname?.startsWith("/settings")) return 2;
    return -1;
  };

  const handleChange = (_event: React.SyntheticEvent, newValue: number) => {
    switch (newValue) {
      case 0:
        router.push("/dashboard");
        break;
      case 1:
        const goals = typeof window !== "undefined"
          ? JSON.parse(localStorage.getItem("hably_goals") || "[]")
          : [];
        if (goals.length > 0) {
          router.push(`/checkin/${goals[0].id}`);
        } else {
          router.push("/dashboard");
        }
        break;
      case 2:
        router.push("/settings");
        break;
    }
  };

  return (
    <Paper
      elevation={0}
      variant="outlined"
      sx={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        backgroundColor: "#FAF3E5", // surfaceContainerLow
        borderTop: "1px solid #EEE7DA", // subtle border
        borderLeft: "none",
        borderRight: "none",
        borderBottom: "none",
      }}
    >
      <BottomNavigation value={getValue()} onChange={handleChange} showLabels>
        <BottomNavigationAction label="Dashboard" icon={<DashboardIcon />} />
        <BottomNavigationAction label="Check In" icon={<CheckCircleIcon />} />
        <BottomNavigationAction label="Instellingen" icon={<SettingsIcon />} />
      </BottomNavigation>
    </Paper>
  );
}

