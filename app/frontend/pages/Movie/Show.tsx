import type { MediaCardItem } from "@/components/media-card";
import type { Medium } from "@/lib/types";
import { BreadCrumbNav } from "@/components/breadcrumbs";
import { CastList } from "@/components/cast-list";
import { MoreLike } from "@/components/more-like";
import { OneOrMore } from "@/components/one-or-more";
import { Poster } from "@/components/poster";
import { Reviews } from "@/components/reviews";
import { StarRating } from "@/components/star-rating";
import { Button } from "@/components/ui/button";
import { ratingToAge, urlBuilder } from "@/lib/utils";
import { Head, Link } from "@inertiajs/react";
import { NotebookPen } from "lucide-react";

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
  return (
    <>
      <Head title={`${movie.title} | Typesense IMDb`} />
      <div className="container mx-auto flex flex-col gap-3 px-4 py-8">
        <BreadCrumbNav items={breadcrumbs} />
        <div className="flex flex-col gap-16 md:flex-row">
          <div className="relative flex w-full flex-col md:w-1/3 lg:w-3/10">
            <Poster media={movie} />
            <div className="mt-1 flex flex-col gap-2">
              <div className="flex items-center gap-1 text-sm">
                <h2 className="text-muted-foreground">Available in</h2>
                <OneOrMore
                  items={movie.countries}
                  getHref={(country) =>
                    urlBuilder("movies", {
                      index_name: "all-movies",
                      filter_by: `countries:[${country.name}]`,
                      sectionId: "all-movies",
                    })
                  }
                  dialogTitle="Countries"
                />
              </div>
              <div className="flex gap-2">
                {movie.genres.map((genre) => (
                  <Link
                    key={genre.id}
                    className="bg-muted text-primary rounded-full px-3 py-1 text-xs font-medium"
                    href={urlBuilder("movies", {
                      index_name: "all-movies",
                      filter_by: `genres:[${genre.name}]`,
                      sectionId: "all-movies",
                    })}
                  >
                    {genre.name}
                  </Link>
                ))}
              </div>
              <div className="mt-4 flex gap-2">
                <Button className="w-full rounded-full font-semibold" size={"lg"}>
                  <NotebookPen />
                  Rate
                </Button>
              </div>
            </div>
          </div>

          <div className="mb-3 w-full md:w-2/3 lg:w-3/4">
            <div className="mb-3 flex w-full justify-between 2xl:mb-0">
              <div className="flex w-7/8 items-baseline gap-2">
                <h1 className="mr-3 text-3xl font-bold">{movie.title}</h1>
                <h1 className="text-muted-foreground text-3xl">{movie.release_year}</h1>
              </div>
              <StarRating rating={movie.average_rating} maxRating={10} />
            </div>

            <div className="mb-6 flex w-full items-center gap-2">
              <h2 className="text-muted-foreground">Directed by</h2>
              <OneOrMore
                items={movie.directors.map((director) => ({ id: director.id, name: director.person.full_name }))}
                getHref={(person) =>
                  urlBuilder("movies", {
                    index_name: "all-movies",
                    filter_by: `directors:[${person.name}]`,
                    sectionId: "all-movies",
                  })
                }
                dialogTitle="Directors"
              />
            </div>
            <div className="text-muted-foreground mb-4 text-sm">
              <span>
                {Math.floor(movie.runtime_minutes / 60)}h {movie.runtime_minutes % 60}m •{" "}
              </span>
              {movie.content_rating}{" "}
              {ratingToAge[movie.content_rating] !== undefined && `(${ratingToAge[movie.content_rating]}+)`}
            </div>
            <div className="mb-6">
              <p className="text-muted-foreground">{movie.description}</p>
            </div>

            <CastList media={{ ...movie, casts: movie.casts, writers: movie.casts }} />
            <h1 className="mt-6 mb-3 space-y-4 text-xl font-semibold">Reviews</h1>
            <Reviews medium={movie} />
          </div>
        </div>
        <MoreLike
          medium={movie}
          suggestions={{
            from_director: suggestions.from_director.map((movie) => ({
              ...movie,
              release_year: movie.release_year,
            })),
            similar_to: suggestions.similar_to.map((movie) => ({
              ...movie,
              release_year: movie.release_year,
            })),
          }}
          getHref={(movie) => `${movie.id}`}
        />
      </div>
    </>
  );
}
