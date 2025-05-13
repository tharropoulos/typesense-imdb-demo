import type { AttributeLabel } from "@/components/instantsearch/current-refinements";
import type { MediumType } from "@/lib/types";
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
import { mediums } from "@/lib/types";
import { typesenseConfig } from "@/lib/typesense";
import { InstantSearch, Index as InstantSearchIndex } from "react-instantsearch-core";
import TypesenseInstantSearchAdapter from "typesense-instantsearch-adapter";

type FilterAttribute<T extends AttributeLabel[]> = T[number]["attribute"];

export interface IndexLayoutProps<T extends MediumType, A extends AttributeLabel[]> {
  medium: T;
  breadcrumbs: { url: string; label: string }[];
  props: PageProps;
  searchParams: {
    base: BaseSearchParameters;
    trending: BaseSearchParameters;
    recommendations: BaseSearchParameters;
  };
  attributeLabels: A;
  perPage: number;
  rangeFilters: FilterAttribute<A>[];
  refinements: { attribute: FilterAttribute<A>; hidden?: boolean }[];
}

export default function IndexLayout<const T extends MediumType, const A extends AttributeLabel[]>({
  medium,
  breadcrumbs,
  searchParams,
  attributeLabels,
  perPage,
  rangeFilters,
  refinements,
  props,
}: IndexLayoutProps<T, A>) {
  const adapter = useMemo(() => {
    return new TypesenseInstantSearchAdapter({
      server: typesenseConfig,
      additionalSearchParameters: searchParams.base,
    });
  }, [perPage]);

  const trendingAdapter = new TypesenseInstantSearchAdapter({
    server: typesenseConfig,
    additionalSearchParameters: searchParams.trending,
  });

  const recommendationsAdapter = useMemo(() => {
    return new TypesenseInstantSearchAdapter({
      server: typesenseConfig,
      additionalSearchParameters: searchParams.recommendations,
    });
  }, [props.auth?.user.id]);

  return (
    <div className="mt-12 flex flex-col gap-3">
      <div className="container mx-auto flex flex-col gap-3 px-4 pt-8">
        <BreadCrumbNav items={breadcrumbs} />
        <h2 className="scroll-m-20 pb-2 text-3xl font-semibold tracking-tight first:mt-0">{mediums[medium].title}</h2>
      </div>
      <InstantSearch indexName={mediums[medium].indexName} searchClient={recommendationsAdapter.searchClient}>
        <div className="w-full border-y bg-zinc-100 dark:bg-zinc-950">
          <div className="container mx-auto flex flex-col gap-3 px-4 py-8">
            <h4 className="scroll-m-20 text-xl font-semibold tracking-tight">For You</h4>
            <HitCarousel getHref={(item) => `/${medium}s/${item.id}`} />
          </div>
        </div>
      </InstantSearch>
      <InstantSearch indexName={mediums[medium].indexName} searchClient={trendingAdapter.searchClient}>
        <div className="w-full">
          <div className="container mx-auto flex flex-col gap-3 px-4 py-8">
            <h4 className="scroll-m-20 text-xl font-semibold tracking-tight">Trending</h4>
            <HitCarousel getHref={(item) => `/${mediums[medium].route}/${item.id}`} />
          </div>
        </div>
      </InstantSearch>

      <div id={`all-${mediums[medium].route}`}>
        <InstantSearch
          indexName={mediums[medium].indexName}
          searchClient={adapter.searchClient}
          future={{
            preserveSharedStateOnUnmount: true,
          }}
          routing={true}
        >
          <InstantSearchIndex indexName={mediums[medium].indexName} indexId={`all-${mediums[medium].route}`}>
            <div className="container mx-auto flex flex-col gap-3 px-4 py-8">
              <h4 className="scroll-m-20 text-xl font-semibold tracking-tight">All {mediums[medium].title}</h4>
              <CurrentRefinements attributeLabels={attributeLabels} />
              <Filter>
                <div className="flex justify-between gap-2">
                  <div className="flex w-2/3 flex-col gap-2">
                    {refinements.map((attribute) => {
                      const label = attributeLabels.find((label) => label.attribute === attribute.attribute)?.label;
                      return (
                        <RefinementList
                          key={`${attribute.attribute}-refinement`}
                          attribute={attribute.attribute}
                          label={label ?? attribute.attribute}
                          className={attribute.hidden ? "hidden" : ""}
                        />
                      );
                    })}
                  </div>
                  <div className="flex flex-col gap-2">
                    {rangeFilters.map((attribute) => {
                      const label = attributeLabels.find((label) => label.attribute === attribute)?.label;
                      return <RangeFilter key={attribute} attribute={attribute} label={label ?? attribute} />;
                    })}
                  </div>
                </div>
              </Filter>
              <InfiniteHits getHref={(item) => `/${mediums[medium].route}/${item.id}`} />
            </div>
          </InstantSearchIndex>
        </InstantSearch>
      </div>
    </div>
  );
}
