"use client";

import { useState } from "react";

export interface MediaCardProps {
  id: string;
  title: string;
  average_rating: number;
  primary_image_url: string;
  release_year: number;
  genre_names: string[];
}

export function MediaCard({ movie }: { movie: MediaCardProps }) {
  const { title, average_rating, primary_image_url, release_year, genre_names } = movie;
  const [imageError, setImageError] = useState(false);
  const handleImageError = () => {
    setImageError(true);
  };
  return (
    <div className="group relative aspect-2/3 h-96 w-auto cursor-pointer overflow-hidden rounded-lg">
      <div
        className="absolute inset-0 h-full w-full transform bg-cover bg-center transition-transform duration-500 ease-in-out group-hover:-translate-y-2 group-hover:scale-105"
        style={{
          backgroundImage: !imageError ? `url(${primary_image_url || "/placeholder.svg"})` : "none",
          backgroundSize: "cover",
          backgroundPosition: "center top",
        }}
      >
        {/* Hidden image to detect load errors */}
        <img
          src={primary_image_url || "/placeholder.svg"}
          alt=""
          className="hidden"
          onError={handleImageError}
          loading="lazy"
        />
        {imageError && (
          <div className="bg-muted flex h-full w-full items-center justify-center">
            <span className="text-muted-foreground">Image not available</span>
          </div>
        )}
      </div>
      {/* Hover Overlay */}
      <div className="absolute inset-0 z-0 bg-gradient-to-b from-transparent via-black/30 to-black/90 opacity-0 transition-opacity duration-500 ease-in-out group-hover:opacity-100"></div>
      <div className="absolute inset-0 z-10">
        <div className="flex h-full flex-col justify-end p-4">
          <h3 className="line-clamp-2 translate-y-4 transform text-base font-bold text-white opacity-0 transition-all duration-300 ease-out group-hover:translate-y-0 group-hover:opacity-100">
            {title}
          </h3>
          <p className="translate-y-4 transform text-xs text-white/80 opacity-0 transition-all delay-75 duration-300 ease-out group-hover:translate-y-0 group-hover:opacity-100">
            {release_year}
          </p>
          {genre_names && genre_names.length > 0 && (
            <div className="mt-2 flex translate-y-4 transform flex-wrap gap-1 opacity-0 transition-all delay-150 duration-300 ease-out group-hover:translate-y-0 group-hover:opacity-100">
              {genre_names.slice(0, 1).map((genre) => (
                <span key={genre} className="bg-primary/80 text-primary-foreground rounded-full px-2 py-0.5 text-xs">
                  {genre}
                </span>
              ))}
              {genre_names.length > 1 && (
                <span className="bg-primary/80 text-primary-foreground rounded-full px-2 py-0.5 text-xs">
                  +{genre_names.length - 1}
                </span>
              )}
            </div>
          )}
        </div>
      </div>
      {/* Rating Badge */}
      <div className="absolute right-2 bottom-2 z-10 flex items-center rounded bg-black/80 px-1.5 py-0.5 text-white">
        <svg
          className="mr-0.5 h-3 w-3 fill-yellow-400 stroke-yellow-400"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
        <span className="text-xs font-medium">{average_rating.toFixed(1)}</span>
      </div>
    </div>
  );
}
