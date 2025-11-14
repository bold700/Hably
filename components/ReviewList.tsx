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

interface ReviewItem {
  id: string;
  date: string;
  title?: string;
  score?: number;
  [key: string]: any;
}

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
    return new Date(b.date || b.createdAt).getTime() - new Date(a.date || a.createdAt).getTime();
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
                    {type === "daily" && review.date
                      ? formatDate(review.date)
                      : type === "weekly" && review.weekStartDate
                      ? `${formatDate(review.weekStartDate)} - ${formatDate(review.weekEndDate)}`
                      : type === "monthly" && review.month
                      ? review.month
                      : formatDate(review.createdAt)}
                  </Typography>
                  {review.score !== undefined && (
                    <Chip
                      label={`Score: ${review.score}/10`}
                      size="small"
                      color="primary"
                      variant="tonal"
                    />
                  )}
                  {review.progressScore !== undefined && (
                    <Chip
                      label={`Voortgang: ${review.progressScore}/10`}
                      size="small"
                      color="primary"
                      variant="tonal"
                    />
                  )}
                </Box>
              }
              secondary={
                review.title || (
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                    {type === "daily" && review.mindset?.oneThingToday && (
                      <>📌 {review.mindset.oneThingToday}</>
                    )}
                    {type === "weekly" && review.wins && (
                      <>✅ {review.wins.substring(0, 100)}...</>
                    )}
                    {type === "monthly" && review.proudOf && (
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

