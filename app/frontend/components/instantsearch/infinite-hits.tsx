import type { MediaCardItem } from "@/components/media-card";
import type { UseInfiniteHitsProps } from "react-instantsearch";
import { MediaCard } from "@/components/media-card";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useInfiniteHits, useInstantSearch } from "react-instantsearch";

function InfiniteHits<T extends MediaCardItem>(props: UseInfiniteHitsProps<T> & { getHref: (item: T) => string }) {
  const { getHref, ...rest } = props;
  const { items, showMore, isLastPage } = useInfiniteHits<T>(rest);
  const { status, results } = useInstantSearch<T>();

  if (items.length === 0 && !results.__isArtificial) {
    return (
      <div className="flex h-96 items-center justify-center">
        <p className="text-muted-foreground text-lg">No results found</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="grid w-full grid-cols-2 gap-x-2 gap-y-4 md:grid-cols-3 lg:grid-cols-5 lg:gap-3 xl:grid-cols-6 xl:gap-4">
        {items.map((item) => (
          <MediaCard getHref={getHref} item={item} key={item.id} />
        ))}
      </div>
      <Button
        variant="ghost"
        onClick={showMore}
        disabled={isLastPage || status === "loading"}
        className="mt-3 font-semibold"
      >
        {status === "loading" ?
          <>
            <Loader2 className="h-4 w-4 animate-spin" /> Show More
          </>
        : "Show More"}
      </Button>
    </div>
  );
}

export { InfiniteHits };
