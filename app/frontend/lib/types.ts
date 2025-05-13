import type { Review } from "@/components/reviews";

export interface Person {
  id: number;
  full_name: string;
}
export interface Director {
  id: number;
  person: Person;
}

export interface Writer {
  id: number;
  person: Person;
}

export interface Cast {
  id: number;
  person: Person;
  character_name: string;
  role?: string;
}

export const mediums = {
  movie: {
    title: "Movies",
    indexName: "Movie",
    route: "movies",
  },
  tv_show: {
    title: "TV Shows",
    indexName: "TvShow",
    route: "tv_shows",
  },
} as const;

export type MediumType = keyof typeof mediums;

export interface Medium<T extends MediumType> {
  id: string;
  title: string;
  primary_image_url: string;
  average_rating: number;
  content_rating: string;
  description: string;
  genres: { name: string; id: number }[];
  countries: {
    name: string;
    id: number;
  }[];
  reviews: Review[];
  casts: Cast[];
  directors: Director[];
  writers: Writer[];
  collection_type: T;
}

export interface Movie extends Medium<"movie"> {
  release_year: number;
  runtime_minutes: number;
}

export interface TvShow extends Medium<"tv_show"> {
  start_year: number;
  end_year: number;
  total_episodes: number;
  total_seasons: number;
}

export function isMovie(medium: Medium<MediumType>): medium is Movie {
  return medium.collection_type === "movie";
}
