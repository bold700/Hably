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

  const sortedReviews = [...reviews].sort((a, b) => {
    const dateA = "date" in a ? a.date : "weekStartDate" in a ? a.weekStartDate : "month" in a ? a.createdAt : a.createdAt;
    const dateB = "date" in b ? b.date : "weekStartDate" in b ? b.weekStartDate : "month" in b ? b.createdAt : b.createdAt;
    return new Date(dateB).getTime() - new Date(dateA).getTime();
  });

  return (
    <List>
      {sortedReviews.map((review) => (
        <Paper key={review.id} variant="outlined" sx={{ mb: 1 }}>
          <ListItem>
            <ListItemText
              primary={
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <Typography variant="body1">
                    {type === "daily" && "date" in review
                      ? formatDate(review.date)
                      : type === "weekly" && "weekStartDate" in review
                      ? `${formatDate(review.weekStartDate)} - ${formatDate(review.weekEndDate)}`
                      : type === "monthly" && "month" in review
                      ? review.month
                      : formatDate(review.createdAt)}
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
              secondary={
                "title" in review && review.title || (
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                    {type === "daily" && "mindset" in review && review.mindset?.oneThingToday && (
                      <>📌 {review.mindset.oneThingToday}</>
                    )}
                    {type === "weekly" && "wins" in review && review.wins && (
                      <>✅ {review.wins.substring(0, 100)}...</>
                    )}
                    {type === "monthly" && "proudOf" in review && review.proudOf && (
                      <>✨ {review.proudOf.substring(0, 100)}...</>
                    )}
                  </Typography>
                )
              }
            />
          </ListItem>
        </Paper>
      ))}
    </List>
  );
}

