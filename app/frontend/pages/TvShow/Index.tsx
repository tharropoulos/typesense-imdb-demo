import type { PageProps } from "@/pages/Home";
import IndexLayout from "@/components/layouts/IndexLayout";
import { useMediaQueries } from "@/hooks/use-media-queries";
import { usePage } from "@inertiajs/react";

export default function Index({ breadcrumbs }: { breadcrumbs: { url: string; label: string }[] }) {
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

  return (
    <IndexLayout
      props={props}
      perPage={perPage}
      medium="tv_show"
      breadcrumbs={breadcrumbs}
      searchParams={{
        base: {
          query_by: "title, description",
          query_by_weights: "10,1",
          per_page: perPage,
          exclude_fields: "user_embedding, item_embedding, embedding",
        },
        trending: {
          query_by: "title, description",
          sort_by:
            "_eval([(num_votes:>3000):5, (average_rating:>7.0):2, (average_rating:>6.0):3, (average_rating:<5.0):1]):desc, start_year:desc, num_votes:desc",
          perPage: 15,
          exclude_fields: "user_embedding, item_embedding, embedding",
        },
        recommendations: {
          preset: "tv_show_recommendations",
          personalization_user_id: props.auth?.user.id.toString(),
          exclude_fields: "user_embedding, item_embedding, embedding",
        },
      }}
      attributeLabels={[
        { attribute: "genres", label: "Genre" },
        { attribute: "start_year", label: "First Aired" },
        { attribute: "end_year", label: "Last Aired" },
        { attribute: "average_rating", label: "Rating" },
        { attribute: "directors", label: "Director" },
        { attribute: "countries", label: "Country" },
      ]}
      rangeFilters={["start_year", "average_rating"]}
      refinements={[{ attribute: "genres", hidden: true }, { attribute: "directors" }, { attribute: "countries" }]}
    />
  );
}
