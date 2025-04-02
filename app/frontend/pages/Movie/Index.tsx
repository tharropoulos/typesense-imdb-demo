import type { PageProps } from "@/pages/Home";
import type { BaseSearchParameters } from "typesense-instantsearch-adapter";
import { useMemo } from "react";
import { BreadCrumbNav } from "@/components/breadcrumbs";
import { Filter } from "@/components/filter";
import { CurrentRefinements } from "@/components/instantsearch/current-refinements";
import { HitCarousel } from "@/components/instantsearch/hit";
import { InfiniteHits } from "@/components/instantsearch/infinite-hits";
import { RangeFilter } from "@/components/instantsearch/range-filter";
import { RefinementList } from "@/components/instantsearch/refinement-list";
import { useMediaQueries } from "@/hooks/use-media-queries";
import { typesenseConfig } from "@/lib/typesense";
import { usePage } from "@inertiajs/react";
import { InstantSearch, Index as InstantSearchIndex } from "react-instantsearch-core";
import TypesenseInstantSearchAdapter from "typesense-instantsearch-adapter";

export default function Index({
  breadcrumbs,
}: {
  breadcrumbs: { url: string; label: string }[];
  additionalSearchParameters: BaseSearchParameters;
}) {
  const { props } = usePage<PageProps>();
  const [isMobile, isTablet, isDesktop, isLargeDesktop] = useMediaQueries([
    "(min-width: 40rem)",
    "(min-width: 48rem)",
    "(min-width: 64rem)",
    "(min-width: 80rem)",
  ]);

  const perPage =
    isLargeDesktop ? 18
    : isDesktop ? 12
    : isTablet ? 9
    : isMobile ? 6
    : 4;

  const adapter = useMemo(() => {
    return new TypesenseInstantSearchAdapter({
      server: typesenseConfig,
      additionalSearchParameters: {
        query_by: "title, description",
        query_by_weights: "10,1",
        per_page: perPage,
        exclude_fields: "user_embedding, item_embedding, embedding",
      },
    });
  }, [perPage]);

  const trendingAdapter = new TypesenseInstantSearchAdapter({
    server: typesenseConfig,
    additionalSearchParameters: {
      query_by: "title, description",
      sort_by:
        "_eval([(num_votes:>3000):5, (average_rating:>7.0):2, (average_rating:>6.0):3, (average_rating:<5.0):1]):desc, release_year:desc, num_votes:desc",
      perPage: 15,
      exclude_fields: "user_embedding, item_embedding, embedding",
    },
  });

  const recommendationsAdapter = useMemo(() => {
    return new TypesenseInstantSearchAdapter({
      server: typesenseConfig,
      additionalSearchParameters: {
        preset: "movie_recommendations",
        personalization_user_id: props.auth?.user.id.toString(),
        exclude_fields: "user_embedding, item_embedding, embedding",
      },
    });
  }, [props.auth?.user.id]);

  return (
    <div className="mt-12 flex flex-col gap-3">
      <div className="container mx-auto flex flex-col gap-3 px-4 pt-8">
        <BreadCrumbNav items={breadcrumbs} />
        <h2 className="scroll-m-20 pb-2 text-3xl font-semibold tracking-tight first:mt-0">Movies</h2>
      </div>
      <InstantSearch indexName="Movie" searchClient={recommendationsAdapter.searchClient}>
        <div className="w-full border-y bg-zinc-100 dark:bg-zinc-950">
          <div className="container mx-auto flex flex-col gap-3 px-4 py-8">
            <h4 className="scroll-m-20 text-xl font-semibold tracking-tight">For You</h4>
            <HitCarousel getHref={(movie) => `/movies/${movie.id}`} />
          </div>
        </div>
      </InstantSearch>
      <InstantSearch indexName="Movie" searchClient={trendingAdapter.searchClient}>
        <div className="w-full">
          <div className="container mx-auto flex flex-col gap-3 px-4 py-8">
            <h4 className="scroll-m-20 text-xl font-semibold tracking-tight">Trending</h4>
            <HitCarousel getHref={(movie) => `/movies/${movie.id}`} />
          </div>
        </div>
      </InstantSearch>

      <div id="all-movies">
        <InstantSearch
          indexName="Movie"
          searchClient={adapter.searchClient}
          future={{
            preserveSharedStateOnUnmount: true,
          }}
          routing={true}
        >
          <InstantSearchIndex indexName="Movie" indexId="all-movies">
            <div className="container mx-auto flex flex-col gap-3 px-4 py-8">
              <h4 className="scroll-m-20 text-xl font-semibold tracking-tight">All Movies</h4>
              <CurrentRefinements
                attributeLabels={[
                  { attribute: "genres", label: "Genre" },
                  { attribute: "release_year", label: "Release Year" },
                  { attribute: "average_rating", label: "Rating" },
                  { attribute: "directors", label: "Director" },
                  { attribute: "countries", label: "Country" },
                ]}
              />
              <Filter>
                <div className="flex justify-between gap-2">
                  <div className="flex w-2/3 flex-col gap-2">
                    <RefinementList attribute="genres" label="Genres" />
                    <RefinementList attribute="directors" label="Directors" className="hidden" />
                    <RefinementList attribute="countries" label="Country" className="" />
                  </div>
                  <div className="flex flex-col gap-2">
                    <RangeFilter attribute="release_year" label="Release Year" />
                    <RangeFilter attribute="average_rating" label="Rating" />
                  </div>
                </div>
              </Filter>
              <InfiniteHits getHref={(movie) => `/movies/${movie.id}`} />
            </div>
          </InstantSearchIndex>
        </InstantSearch>
      </div>
    </div>
  );
}
