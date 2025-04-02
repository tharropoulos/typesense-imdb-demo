import type { MediaCardItem } from "@/components/media-card";
import type { UseHitsProps } from "react-instantsearch";
import { MediaCarousel } from "@/components/media-carousel";
import { Loader2 } from "lucide-react";
import { useHits, useInstantSearch } from "react-instantsearch";

function HitCarousel<T extends MediaCardItem>(props: UseHitsProps<T> & { getHref: (item: T) => string }) {
  const { getHref, ...rest } = props;
  const { items } = useHits<T>(rest);
  const { status, results } = useInstantSearch<T>();

  if (status === "loading") {
    return (
      <div className="w-fulitems-center flex h-96 justify-center">
        <Loader2 className="h-10 w-full animate-spin" />
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="flex h-72 items-center justify-center">
        <p className="text-muted-foreground text-lg">Try clicking on a few movies to get started!</p>
      </div>
    );
  }

  if (items.length === 0 && status === "idle" && !results.__isArtificial) {
    return (
      <div className="flex h-96 items-center justify-center">
        <p className="text-muted-foreground text-lg">No results found</p>
      </div>
    );
  }

  return (
    <div className="flex w-full flex-col gap-4">
      <MediaCarousel media={items} getHref={getHref} />
    </div>
  );
}

export { HitCarousel };
