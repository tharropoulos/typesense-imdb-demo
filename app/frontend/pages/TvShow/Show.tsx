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
  return (
    <>
      <Head title={`${tv_show.title} | Typesense IMDb`} />
      <div className="container mx-auto flex flex-col gap-3 px-4 py-8">
        <div className="mb-4">
          <BreadCrumbNav items={breadcrumbs} />
        </div>
        <div className="flex flex-col gap-16 md:flex-row">
          <div className="relative flex w-full flex-col md:w-1/3 lg:w-3/10">
            <Poster media={tv_show} />
            <div className="mt-1 flex flex-col gap-2">
              <div className="flex items-center gap-1 text-sm">
                <h2 className="text-muted-foreground">Available in</h2>
                <OneOrMore
                  items={tv_show.countries}
                  getHref={(country) =>
                    urlBuilder("tv_shows", {
                      filter_by: `countries:[${country.name}]`,
                      index_name: "all-tvshows",
                      sectionId: "all-tvshows",
                    })
                  }
                  dialogTitle="Countries"
                />
              </div>
              <div className="flex gap-2">
                {tv_show.genres.map((genre) => (
                  <Link
                    key={genre.id}
                    className="bg-muted text-primary rounded-full px-3 py-1 text-xs font-medium"
                    href={urlBuilder("tv_shows", {
                      filter_by: `genres:[${genre.name}]`,
                      index_name: "all-tvshows",
                      sectionId: "all-tvshows",
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
                <h1 className="mr-3 text-3xl font-bold">{tv_show.title}</h1>
                <h1 className="text-muted-foreground text-3xl">
                  {tv_show.start_year} - {tv_show.end_year}
                </h1>
              </div>
              <StarRating rating={tv_show.average_rating} maxRating={10} />
            </div>

            <div className="mb-6 flex w-full items-center gap-2">
              <h2 className="text-muted-foreground">Directed by</h2>
              <OneOrMore
                items={tv_show.directors.map((director) => ({
                  id: director.id,
                  name: director.person.full_name,
                }))}
                getHref={(person) =>
                  urlBuilder("tv_shows", {
                    index_name: "all-tvshows",
                    filter_by: `directors:[${person.name}]`,
                    sectionId: "all-tvshows",
                  })
                }
                dialogTitle="Directors"
              />
            </div>
            <div className="text-muted-foreground mb-4 text-sm">
              <span>
                {tv_show.total_seasons} Seasons • {tv_show.total_episodes} Episodes
              </span>{" "}
              {tv_show.content_rating}{" "}
              {ratingToAge[tv_show.content_rating] !== undefined && `(${ratingToAge[tv_show.content_rating]}+)`}
            </div>
            <div className="mb-6">
              <p className="text-muted-foreground">{tv_show.description}</p>
            </div>

            <CastList media={{ ...tv_show, casts: tv_show.casts, writers: tv_show.casts }} />
            <h1 className="mt-6 mb-3 space-y-4 text-xl font-semibold">Reviews</h1>
            <Reviews medium={tv_show} />
          </div>
        </div>
        <MoreLike
          medium={tv_show}
          suggestions={{
            from_director: suggestions.from_director.map((tv_show) => ({
              ...tv_show,
              release_year: tv_show.start_year,
              collection_type: "tv_show",
            })),
            similar_to: suggestions.similar_to.map((tv_show) => ({
              ...tv_show,
              release_year: tv_show.start_year,
              collection_type: "tv_show",
            })),
          }}
          getHref={(tv_show) => `${tv_show.id}`}
        />
      </div>
    </>
  );
}
