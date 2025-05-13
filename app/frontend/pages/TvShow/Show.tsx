import type { Medium } from "@/lib/types";
import ShowLayout from "@/components/layouts/ShowLayout";

export interface TvShow extends Medium<"tv_show"> {
  start_year: number;
  end_year: number;
  total_episodes: number;
  total_seasons: number;
}

export interface TypesenseSimilarTvShows {
  id: string;
  title: string;
  average_rating: number;
  primary_image_url: string;
  start_year: number;
  genre_names: string[];
  total_seasons: number;
}

export default function Show({
  tv_show,
  breadcrumbs,
  suggestions,
}: {
  tv_show: TvShow;
  breadcrumbs: { url: string; label: string }[];
  suggestions: { similar_to: TypesenseSimilarTvShows[]; from_director: TypesenseSimilarTvShows[] };
}) {
  return <ShowLayout medium={tv_show} breadcrumbs={breadcrumbs} suggestions={suggestions} />;
}
