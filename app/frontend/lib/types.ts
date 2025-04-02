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

export type MediumType = "movie" | "tv_show";

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
