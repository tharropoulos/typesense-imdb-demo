import React, { useMemo } from "react";
import { cn } from "@/lib/utils";
import { Star, StarHalfIcon } from "lucide-react";

// Define rating categories
type RatingCategory = "low" | "medium" | "high";

// Color classes for different rating levels
const STAR_COLOR_CLASSES: Record<RatingCategory, string> = {
  low: "fill-red-500 dark:fill-red-400",
  medium: "fill-yellow-500 dark:fill-yellow-400",
  high: "fill-green-500 dark:fill-green-300",
};

const TEXT_COLOR_CLASSES: Record<RatingCategory, string> = {
  low: "text-red-500 dark:text-red-400",
  medium: "text-yellow-500 dark:text-yellow-400",
  high: "text-green-500 dark:text-green-300",
};

// Define thresholds for rating categories
const RATING_THRESHOLDS = {
  low: 0,
  medium: 5,
  high: 7,
};

// Utility functions for rating calculations
export const calculateRatingCategory = (rating: number, maxRating: number): RatingCategory => {
  const normalized = (rating / maxRating) * 10;

  if (normalized < RATING_THRESHOLDS.medium) return "low";
  if (normalized < RATING_THRESHOLDS.high) return "medium";
  return "high";
};

export const normalizeRating = (rating: number, fromScale: number, toScale = 5): number => {
  return (rating / fromScale) * toScale;
};

export const roundToHalf = (value: number): number => {
  return Math.round(value * 2) / 2;
};

export interface StarRatingProps {
  /** The raw rating value */
  rating?: number;
  /** The maximum possible rating value (defaults to 10) */
  maxRating?: number;
  /** The number of stars to display (defaults to 5) */
  starCount?: number;
  /** Whether to show the numeric rating value (defaults to true) */
  showValue?: boolean;
  /** Decimal places to show in the rating value */
  precision?: number;
  /** CSS class for custom styling */
  className?: string;
}

/**
 * StarRating component for displaying ratings visually with stars
 * Uses color coding based on rating level (red, yellow, green)
 *
 * @example
 * <StarRating rating={7.5} maxRating={10} />
 */
export const StarRating: React.FC<StarRatingProps> = ({
  rating,
  maxRating = 10,
  starCount = 5,
  showValue = true,
  precision = 1,
  className,
}) => {
  if (rating === undefined) return null;

  const { scaledRating, fullStars, hasHalfStar, starColorClass, textColorClass } = useMemo(() => {
    const roundedRating = roundToHalf(rating);

    const scaledRating = normalizeRating(roundedRating, maxRating, starCount);

    const fullStars = Math.floor(scaledRating);
    const hasHalfStar = scaledRating % 1 !== 0;

    const category = calculateRatingCategory(rating, maxRating);

    const starColorClass = STAR_COLOR_CLASSES[category];
    const textColorClass = TEXT_COLOR_CLASSES[category];

    return {
      scaledRating,
      fullStars,
      hasHalfStar,
      category,
      starColorClass,
      textColorClass,
    };
  }, [rating, maxRating, starCount]);

  return (
    <div className={cn("flex flex-col items-center", className)}>
      {showValue && (
        <span className={cn("text-xl font-semibold", textColorClass)}>{scaledRating.toFixed(precision)}</span>
      )}

      <div className="flex items-center">
        {Array.from({ length: fullStars }).map((_, i) => (
          <Star key={`full-${i}`} className={starColorClass} size={20} strokeWidth={0} />
        ))}
        {hasHalfStar && <StarHalfIcon className={starColorClass} size={20} strokeWidth={0} />}
      </div>
    </div>
  );
};
