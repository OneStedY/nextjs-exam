"use client";

import StarRatings from "react-star-ratings";

export function RatingStars({ rating10, name }: { rating10: number; name: string }) {
  const rating5 = Math.max(0, Math.min(10, rating10)) / 2;
  return (
    <StarRatings
      rating={rating5}
      starRatedColor="#111827"
      starEmptyColor="#e5e7eb"
      numberOfStars={5}
      name={name}
      starDimension="18px"
      starSpacing="1px"
    />
  );
}
