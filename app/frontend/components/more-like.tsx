import type { MediaCardItem } from "@/components/media-card";
import type { Medium, MediumType } from "@/lib/types";
import { MediaCarousel } from "@/components/media-carousel";

interface MoreLikeProps<T extends MediaCardItem, M extends Medium<MediumType>> {
  suggestions: { similar_to: T[]; from_director: T[] };
  getHref: (item: T) => string;
  medium: M;
}

function MoreLike<T extends MediaCardItem, M extends Medium<MediumType>>(props: MoreLikeProps<T, M>) {
  const { getHref, medium, suggestions } = props;
  return (
    <>
      <h1 className="mt-6 mb-3 line-clamp-1 w-1/2 text-xl font-semibold">More like {medium.title}</h1>
      <div className="flex flex-col gap-4">
        <MediaCarousel media={suggestions.similar_to} getHref={getHref} />
      </div>
      {suggestions.from_director.length > 0 && (
        <>
          <h1 className="mt-6 mb-3 line-clamp-1 w-1/2 text-xl font-semibold">
            More from {medium.directors[0].person.full_name}
          </h1>
          <div className="flex flex-col gap-4">
            <MediaCarousel media={suggestions.from_director} getHref={getHref} />
          </div>
        </>
      )}
    </>
  );
}

export { MoreLike };
