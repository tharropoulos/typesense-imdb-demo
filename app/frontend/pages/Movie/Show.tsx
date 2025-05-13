import type { MediaCardItem } from "@/components/media-card";
import type { Medium } from "@/lib/types";
import ShowLayout from "@/components/layouts/ShowLayout";

export interface Movie extends Medium<"movie"> {
  release_year: number;
  runtime_minutes: number;
}

export default function Show({
  movie,
  breadcrumbs,
  suggestions,
}: {
  movie: Movie;
  breadcrumbs: { url: string; label: string }[];
  suggestions: { similar_to: MediaCardItem[]; from_director: MediaCardItem[] };
}) {
  console.log(movie);

  return <ShowLayout medium={movie} breadcrumbs={breadcrumbs} suggestions={suggestions} />;
}
