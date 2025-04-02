import type { Cast, Writer } from "@/lib/types";
import { useState } from "react";
import { Arrow } from "@/components/ui/arrow";
import { Button } from "@/components/ui/button";
import { useMediaQueries } from "@/hooks/use-media-queries";
import { cn } from "@/lib/utils";
import { Link } from "@inertiajs/react";

function CastList<T extends { casts: Cast[]; writers: Writer[] }>({ media: media }: { media: T }) {
  const { writers, casts } = media;
  const [isExpanded, setIsExpanded] = useState(false);
  const [isDesktop] = useMediaQueries(["(min-width: 64rem)"]);
  const totalItems = (casts?.length ?? 0) + (writers?.length ?? 0);
  const hasMultipleRows = isDesktop ? totalItems > 6 : totalItems > 3;

  return (
    <div className="space-y-4">
      <h1 className="mb-3 text-xl font-semibold">Cast and Writers</h1>
      {casts.length > 0 && (
        <div className="relative">
          <div
            className={cn(
              "grid grid-cols-3 gap-4 lg:grid-cols-4 xl:grid-cols-6",
              !isExpanded && hasMultipleRows && "max-h-36 overflow-hidden",
            )}
          >
            {casts.map((cast) => (
              <div key={cast.id} className="flex flex-col gap-1">
                <h2 className="text-muted-foreground">{cast.character_name}</h2>
                <div className="hover:underline">
                  {cast.person.full_name}
                </div>
              </div>
            ))}
            {writers &&
              writers.length > 0 &&
              writers.map((writer) => (
                <div key={writer.id} className="flex flex-col gap-1">
                  <h2 className="text-muted-foreground">Writer</h2>
                  <Link href={`/people/${writer.id}`} className="hover:underline">
                    {writer.person.full_name}
                  </Link>
                </div>
              ))}
          </div>

          {/* Gradient mask starting at the second row */}
          {!isExpanded && hasMultipleRows && (
            <div className="absolute right-0 bottom-0 left-0 z-0 flex h-20 flex-col justify-end transition-opacity duration-500 ease-in-out">
              <div className="from-background via-background/60 pointer-events-none absolute inset-0 bg-gradient-to-t from-40% via-70% to-transparent to-100%"></div>
              {/* Button positioned within the gradient but above it in z-index */}
              <Button
                variant="ghost"
                onClick={() => setIsExpanded(!isExpanded)}
                className="hover:text-foreground text-muted-foreground group relative z-10 mb-2 flex w-full items-center justify-center bg-transparent px-4 py-2 text-sm font-medium hover:bg-transparent"
              >
                Show All
                <Arrow orientation={"bottom"} />
              </Button>
            </div>
          )}

          {/* Toggle button when expanded */}
          {isExpanded && hasMultipleRows && (
            <Button
              variant="ghost"
              onClick={() => setIsExpanded(!isExpanded)}
              className="hover:text-foreground text-muted-foreground group not-pose mt-4 flex w-full items-center justify-center bg-transparent text-sm font-medium hover:bg-transparent"
            >
              Show Less
              <Arrow orientation={"top"} />
            </Button>
          )}
        </div>
      )}
    </div>
  );
}

export { CastList };
