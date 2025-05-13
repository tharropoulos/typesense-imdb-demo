import type { MediaCardItem } from "@/components/media-card";
import type { Movie, TvShow } from "@/lib/types";
import type { TypesenseSimilarTvShows } from "@/pages/TvShow/Show";
import { BreadCrumbNav } from "@/components/breadcrumbs";
import { CastList } from "@/components/cast-list";
import { MoreLike } from "@/components/more-like";
import { OneOrMore } from "@/components/one-or-more";
import { Poster } from "@/components/poster";
import { Reviews } from "@/components/reviews";
import { StarRating } from "@/components/star-rating";
import { Button } from "@/components/ui/button";
import { isMovie, mediums } from "@/lib/types";
import { ratingToAge, urlBuilder } from "@/lib/utils";
import { Head, Link } from "@inertiajs/react";
import { NotebookPen } from "lucide-react";

export interface ShowLayoutProps<T extends Movie | TvShow> {
  medium: T;
  breadcrumbs: { url: string; label: string }[];
  suggestions: T extends Movie ? { similar_to: MediaCardItem[]; from_director: MediaCardItem[] }
  : { similar_to: TypesenseSimilarTvShows[]; from_director: TypesenseSimilarTvShows[] };
}

export default function ShowLayout<T extends Movie | TvShow>({ medium, breadcrumbs, suggestions }: ShowLayoutProps<T>) {
  return (
    <>
      <Head title={`${medium.title} | Typesense IMDb`} />
      <div className="container mx-auto flex flex-col gap-3 px-4 py-8">
        <div className="mb-4">
          <BreadCrumbNav items={breadcrumbs} />
        </div>
        <div className="flex flex-col gap-16 md:flex-row">
          <div className="relative flex w-full flex-col md:w-1/3 lg:w-3/10">
            <Poster media={medium} />
            <div className="mt-1 flex flex-col gap-2">
              <div className="flex items-center gap-1 text-sm">
                <h2 className="text-muted-foreground">Available in</h2>
                <OneOrMore
                  items={medium.countries}
                  getHref={(country) =>
                    urlBuilder(mediums[medium.collection_type].route, {
                      filter_by: `countries:[${country.name}]`,
                      index_name: `all-${mediums[medium.collection_type].route}`,
                      sectionId: `all-${mediums[medium.collection_type].route}`,
                    })
                  }
                  dialogTitle="Countries"
                />
              </div>
              <div className="flex gap-2">
                {medium.genres.map((genre) => (
                  <Link
                    key={genre.id}
                    className="bg-muted text-primary rounded-full px-3 py-1 text-xs font-medium"
                    href={urlBuilder(mediums[medium.collection_type].route, {
                      filter_by: `genres:[${genre.name}]`,
                      index_name: `all-${mediums[medium.collection_type].route}`,
                      sectionId: `all-${mediums[medium.collection_type].route}`,
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
                <h1 className="mr-3 text-3xl font-bold">{medium.title}</h1>
                <h1 className="text-muted-foreground text-3xl">
                  {isMovie(medium) ? medium.release_year : medium.start_year}
                </h1>
              </div>
              <StarRating rating={medium.average_rating} maxRating={10} />
            </div>

            <div className="mb-6 flex w-full items-center gap-2">
              <h2 className="text-muted-foreground">Directed by</h2>
              <OneOrMore
                items={medium.directors.map((director) => ({
                  id: director.id,
                  name: director.person.full_name,
                }))}
                getHref={(person) =>
                  urlBuilder(mediums[medium.collection_type].route, {
                    index_name: `all-${mediums[medium.collection_type].route}`,
                    filter_by: `directors:[${person.name}]`,
                    sectionId: `all-${mediums[medium.collection_type].route}`,
                  })
                }
                dialogTitle="Directors"
              />
            </div>
            <div className="text-muted-foreground mb-4 text-sm">
              {isMovie(medium) ?
                <span>
                  {Math.floor(medium.runtime_minutes / 60)}h {medium.runtime_minutes % 60}m •{" "}
                </span>
              : <span>
                  {medium.total_seasons} Seasons • {medium.total_episodes} Episodes{" "}
                </span>
              }
              {medium.content_rating}{" "}
              {ratingToAge[medium.content_rating] !== undefined && `(${ratingToAge[medium.content_rating]}+)`}
            </div>
            <div className="mb-6">
              <p className="text-muted-foreground">{medium.description}</p>
            </div>

            <CastList media={{ ...medium, casts: medium.casts, writers: medium.casts }} />
            <h1 className="mt-6 mb-3 space-y-4 text-xl font-semibold">Reviews</h1>
            <Reviews medium={medium} />
          </div>
        </div>
        {isMovie(medium) ?
          <MoreLike
            medium={medium}
            suggestions={{
              from_director: suggestions.from_director.map((item) => ({
                ...item,
                release_year: (item as MediaCardItem).release_year,
                collection_type: "movie",
              })),
              similar_to: suggestions.similar_to.map((item) => ({
                ...item,
                release_year: (item as MediaCardItem).release_year,
                collection_type: "movie",
              })),
            }}
            getHref={(item) => `${item.id}`}
          />
        : <MoreLike
            medium={medium}
            suggestions={{
              from_director: suggestions.from_director.map((item) => ({
                ...item,
                release_year: (item as TypesenseSimilarTvShows).start_year,
                collection_type: "tv_show",
              })),
              similar_to: suggestions.similar_to.map((item) => ({
                ...item,
                release_year: (item as TypesenseSimilarTvShows).start_year,
                collection_type: "tv_show",
              })),
            }}
            getHref={(item) => `${item.id}`}
          />
        }
      </div>
    </>
  );
}
