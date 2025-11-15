"use client";

import React from "react";
import {
  List,
  ListItem,
  ListItemText,
  Paper,
  Typography,
  Box,
  Chip,
} from "@mui/material";
import { formatDate } from "@/utils/dateHelpers";
import { DailyCheckIn, WeeklyReview, MonthlyReview } from "@/types";

type ReviewItem = DailyCheckIn | WeeklyReview | MonthlyReview;

interface ReviewListProps {
  reviews: ReviewItem[];
  type: "daily" | "weekly" | "monthly";
}

export default function ReviewList({ reviews, type }: ReviewListProps) {
  if (reviews.length === 0) {
    return (
      <Typography variant="body2" color="text.secondary">
        Nog geen {type === "daily" ? "dagelijkse" : type === "weekly" ? "wekelijkse" : "maandelijkse"} reviews
      </Typography>
    );
  }

  const getDateString = (review: ReviewItem): string => {
    if ("date" in review) {
      return (review as DailyCheckIn).date;
    }
    if ("weekStartDate" in review) {
      return (review as WeeklyReview).weekStartDate;
    }
    return (review as MonthlyReview).createdAt;
  };

  const getDisplayDate = (review: ReviewItem): string => {
    if (type === "daily" && "date" in review) {
      return formatDate((review as DailyCheckIn).date);
    }
    if (type === "weekly" && "weekStartDate" in review) {
      const weekly = review as WeeklyReview;
      return `${formatDate(weekly.weekStartDate)} - ${formatDate(weekly.weekEndDate)}`;
    }
    if (type === "monthly" && "month" in review) {
      return (review as MonthlyReview).month;
    }
    // Fallback - alle types hebben createdAt
    return formatDate((review as DailyCheckIn | WeeklyReview | MonthlyReview).createdAt);
  };

  const getSecondaryContent = (review: ReviewItem): React.ReactNode | undefined => {
    if (type === "daily" && "mindset" in review) {
      const daily = review as DailyCheckIn;
      const content = daily.mindset?.oneThingToday;
      if (content) {
        return (
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            📌 {content}
          </Typography>
        );
      }
    }
    if (type === "weekly" && "wins" in review) {
      const weekly = review as WeeklyReview;
      const content = weekly.wins;
      if (content && content.trim()) {
        return (
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            ✅ {content.substring(0, 100)}...
          </Typography>
        );
      }
    }
    if (type === "monthly" && "proudOf" in review) {
      const monthly = review as MonthlyReview;
      const content = monthly.proudOf;
      if (content && content.trim()) {
        return (
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            ✨ {content.substring(0, 100)}...
          </Typography>
        );
      }
    }
    return undefined;
  };

  const sortedReviews = [...reviews].sort((a, b) => {
    const dateA = getDateString(a);
    const dateB = getDateString(b);
    return new Date(dateB).getTime() - new Date(dateA).getTime();
  });

  return (
    <List>
      {sortedReviews.map((review) => {
        const secondaryContent = getSecondaryContent(review);
        return (
          <Paper key={review.id} variant="outlined" sx={{ mb: 1 }}>
            <ListItem>
              <ListItemText
                primary={
                  <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <Typography variant="body1">
                      {getDisplayDate(review)}
                    </Typography>
                    {"score" in review && review.score !== undefined && (
                      <Chip
                        label={`Score: ${review.score}/10`}
                        size="small"
                        color="primary"
                        variant="outlined"
                      />
                    )}
                    {"progressScore" in review && review.progressScore !== undefined && (
                      <Chip
                        label={`Voortgang: ${review.progressScore}/10`}
                        size="small"
                        color="primary"
                        variant="outlined"
                      />
                    )}
                  </Box>
                }
                secondary={secondaryContent}
              />
            </ListItem>
          </Paper>
        );
      })}
    </List>
  );
}

