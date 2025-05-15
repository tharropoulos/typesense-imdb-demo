import type { PageProps } from "@/pages/Home";
import type { Movie } from "@/pages/Movie/Show";
import type { TvShow } from "@/pages/TvShow/Show";
import type { Client } from "typesense";
import type { SearchResponseHit } from "typesense/lib/Typesense/Documents";
import React from "react";
import { OptimizedImage } from "@/components/optimized-image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Link, router, usePage } from "@inertiajs/react";

interface PopularQuery {
  q: string;
  count: number;
}

type SearchResult = SearchResponseHit<Movie> | SearchResponseHit<TvShow>;

const Skeleton = ({ className }: { className?: string }) => (
  <div className={cn("bg-muted animate-pulse rounded", className)} />
);

export function Autocomplete({ client }: { client: Client }) {
  const { props } = usePage<PageProps>();

  const [focused, setFocused] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [query, setQuery] = React.useState("");
  const [movieResults, setMovieResults] = React.useState<SearchResponseHit<Movie>[]>([]);
  const [popularQueryResults, setPopularQueryResults] = React.useState<SearchResponseHit<PopularQuery>[]>([]);
  const [tvShowResults, setTvShowResults] = React.useState<SearchResponseHit<TvShow>[]>([]);
  const [hasSearchedOnce, setHasSearchedOnce] = React.useState(false);
  const [selectedIndex, setSelectedIndex] = React.useState(-1);
  const inputRef = React.useRef<HTMLInputElement>(null);
  const resultsContainerRef = React.useRef<HTMLDivElement>(null);
  const resultItemsRef = React.useRef<(HTMLAnchorElement | null)[]>([]);
  const [isKeyboardSelection, setIsKeyboardSelection] = React.useState(false);
  const [isInteractingWithResults, setIsInteractingWithResults] = React.useState(false);

  const combinedResults = React.useMemo(() => [...movieResults, ...tvShowResults], [movieResults, tvShowResults]);

  React.useEffect(() => {
    if (combinedResults.length > 0) {
      setSelectedIndex(0);
    } else {
      setSelectedIndex(-1);
    }
  }, [combinedResults]);

  const performSearch = async (searchQuery: string) => {
    setLoading(true);
    try {
      const q = searchQuery.trim() || "*";

      const multiSearchResponse = await client.multiSearch.perform<[Movie, TvShow, PopularQuery]>(
        {
          searches: [
            {
              collection: "Movie",
              include_fields: "id,title,primary_image_url,release_year,average_rating,collection_type",
              query_by: "title,description",
              sort_by: "_text_match:desc,average_rating:desc",
            },
            {
              collection: "TvShow",
              include_fields:
                "id,title,primary_image_url,start_year,end_year,average_rating,genre_names,collection_type",
              query_by: "title,description",
              sort_by: "_text_match:desc,average_rating:desc",
            },
            {
              collection: "product_queries",
              query_by: "q",
              sort_by: "count:desc",
            },
          ],
        },
        {
          q,
          per_page: 5,
        },
      );

      const movieHits = multiSearchResponse.results[0]?.hits ?? [];
      const tvShowHits = multiSearchResponse.results[1]?.hits ?? [];
      const popularQueryHits = multiSearchResponse.results[2]?.hits ?? [];
      const filteredPopularQueryHits = popularQueryHits.filter(
        (hit) => hit.document.q !== "*" && hit.document.q.trim() !== "",
      );

      setPopularQueryResults(filteredPopularQueryHits);
      setMovieResults(movieHits);
      setTvShowResults(tvShowHits);
    } catch (error) {
      console.error("Error performing search:", error);
      setMovieResults([]);
      setTvShowResults([]);
      setPopularQueryResults([]);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    if (focused && !hasSearchedOnce) {
      void performSearch("*");
      setHasSearchedOnce(true);
    }
  }, [focused, hasSearchedOnce]);

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        if (inputRef.current) {
          inputRef.current.focus();
        }
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const handleSelect = async (item: SearchResult) => {
    if (props.auth?.user) {
      try {
        await client.analytics.events().create({
          type: "click",
          name: `${item.document.collection_type}_click`,
          data: {
            user_id: props.auth?.user.id.toString(),
            doc_id: item.document.id,
          },
        });
      } catch (error) {
        console.error("Error tracking event:", error);
      }
    }
    setQuery(item.document.title);
    void performSearch(query);
    setFocused(false);
    inputRef.current?.blur();
  };

  React.useEffect(() => {
    if (isKeyboardSelection && selectedIndex >= 0 && resultItemsRef.current[selectedIndex]) {
      resultItemsRef.current[selectedIndex]?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });

      setIsKeyboardSelection(false);
    }
  }, [selectedIndex, isKeyboardSelection]);

  const handleKeyNavigation = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!focused || loading) return;

    if (combinedResults.length > 0) {
      switch (e.key) {
        case "ArrowDown":
          e.preventDefault();
          setIsKeyboardSelection(true);
          setSelectedIndex((prevIndex) => {
            if (prevIndex === combinedResults.length - 1 || prevIndex === -1) {
              return 0;
            }
            return prevIndex + 1;
          });
          break;
        case "ArrowUp":
          e.preventDefault();
          setIsKeyboardSelection(true);
          setSelectedIndex((prevIndex) => {
            if (prevIndex <= 0) {
              return combinedResults.length - 1;
            }
            return prevIndex - 1;
          });
          break;
        case "Enter":
          if (selectedIndex >= 0 && selectedIndex < combinedResults.length) {
            e.preventDefault();
            const selectedItem = combinedResults[selectedIndex];
            void handleSelect(selectedItem);
            console.log(selectedItem);
            if (selectedItem.document.collection_type === "movie") {
              router.visit(`/movies/${selectedItem.document.id}`);
            } else {
              router.visit(`/tv_shows/${selectedItem.document.id}`);
            }
          }
          break;
      }
    }

    if (e.key === "Escape") {
      e.preventDefault();
      setFocused(false);
      inputRef.current?.blur();
    }
  };

  return (
    <div className="relative z-100 w-full max-w-md">
      <div className={cn("relative", focused && "z-10 rounded-t-md shadow-lg")}>
        <Input
          ref={inputRef}
          type="text"
          placeholder="Search movies & TV shows..."
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            void performSearch(e.target.value);
          }}
          onFocus={() => {
            setFocused(true);
          }}
          onBlur={() => {
            if (!isInteractingWithResults) {
              setTimeout(() => {
                setFocused(false);
              }, 100);
            }
          }}
          onKeyDown={handleKeyNavigation}
          className={cn(
            "h-10 w-full text-sm",
            "focus-visible:border-input focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:outline-none",
            focused ? "bg-card rounded-b-none border-b-0" : "bg-muted/50",
          )}
        />
        <kbd className="bg-muted pointer-events-none absolute top-[0.5rem] right-[0.5rem] flex h-5 items-center gap-1 rounded border px-1.5 font-mono text-[10px] font-medium opacity-100 select-none sm:flex">
          <span className="text-xs">⌘</span>K
        </kbd>
      </div>

      {focused && (
        <div
          ref={resultsContainerRef}
          className="bg-card absolute z-10 max-h-[70vh] w-full overflow-hidden overflow-y-auto rounded-b-md border border-t-0 shadow-lg"
          onMouseEnter={() => setIsInteractingWithResults(true)}
          onMouseLeave={() => setIsInteractingWithResults(false)}
        >
          {loading ?
            <div className="p-2">
              <div className="text-muted-foreground pb-2 text-xs font-medium">Results</div>
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="flex h-20 items-center gap-3 px-2 py-1">
                  <Skeleton className="h-16 w-16 rounded-sm" />
                  <div className="flex h-full w-full flex-col items-start justify-start gap-1 pt-1">
                    <Skeleton className="h-3 w-full" />
                    <Skeleton className="h-3 w-1/2" />
                    <Skeleton className="mt-3 h-3 w-1/3" />
                  </div>
                </div>
              ))}
            </div>
          : combinedResults.length === 0 ?
            <div className="text-muted-foreground p-2 text-sm">No results found</div>
          : <div>
              {popularQueryResults.length > 0 && (
                <>
                  <div className="text-muted-foreground p-2 text-xs font-medium">People also search for</div>
                  <ul>
                    {popularQueryResults.map((hit) => (
                      <Button
                        variant={"link"}
                        key={`popular-query-${hit.document.q}`}
                        className="line-clamp-1 h-auto w-full px-2 py-0 text-start text-sm"
                        onClick={async (e) => {
                          e.preventDefault();
                          setQuery(hit.document.q);
                          setIsInteractingWithResults(true);
                          await performSearch(hit.document.q);
                          if (inputRef.current) {
                            inputRef.current.focus();
                          }
                        }}
                      >
                        {hit.document.q}
                      </Button>
                    ))}
                  </ul>
                </>
              )}

              {movieResults.length > 0 && (
                <>
                  <div className="text-muted-foreground p-2 text-xs font-medium">Movies</div>
                  <ul>
                    {movieResults.map((hit, index) => (
                      <Link
                        ref={(el) => {
                          resultItemsRef.current[index] = el as HTMLAnchorElement;
                        }}
                        href={`/movies/${hit.document.id}`}
                        onMouseEnter={() => {
                          setSelectedIndex(index);
                        }}
                        onClick={async () => {
                          await handleSelect(hit);
                        }}
                        key={`movie-${hit.document.id}`}
                        className={cn(
                          "flex cursor-pointer items-center gap-2 p-2",
                          selectedIndex === index ? "bg-muted" : "",
                        )}
                      >
                        {hit.document.primary_image_url && (
                          <OptimizedImage
                            src={hit.document.primary_image_url}
                            alt=""
                            className="aspect-square h-14 rounded-sm object-cover"
                          />
                        )}
                        <div className="flex h-full flex-col items-start justify-start gap-0.5">
                          <span className="line-clamp-1">{hit.document.title}</span>
                          {hit.document.release_year && (
                            <span className="text-muted-foreground text-xs">{hit.document.release_year}</span>
                          )}
                          {hit.document.average_rating && (
                            <span className="text-muted-foreground text-xs">
                              ★ {hit.document.average_rating.toFixed(1)}
                            </span>
                          )}
                        </div>
                      </Link>
                    ))}
                  </ul>
                </>
              )}

              {/* TV Show Results */}
              {tvShowResults.length > 0 && (
                <>
                  <div className="text-muted-foreground border-t p-2 text-xs font-medium">TV Shows</div>
                  <ul>
                    {tvShowResults.map((hit, index) => (
                      <Link
                        ref={(el) => {
                          resultItemsRef.current[movieResults.length + index] = el as HTMLAnchorElement;
                        }}
                        href={`/tv_shows/${hit.document.id}`}
                        onClick={async () => {
                          await handleSelect(hit);
                        }}
                        onMouseEnter={() => {
                          setSelectedIndex(movieResults.length + index);
                        }}
                        key={`tvshow-${hit.document.id}`}
                        className={cn(
                          "flex cursor-pointer items-center gap-2 p-2",
                          selectedIndex === movieResults.length + index ? "bg-accent" : "",
                        )}
                      >
                        {hit.document.primary_image_url && (
                          <OptimizedImage
                            src={hit.document.primary_image_url}
                            alt=""
                            className="aspect-square h-14 rounded-sm object-cover"
                          />
                        )}
                        <div className="flex h-full flex-col items-start justify-start gap-0.5">
                          <span className="line-clamp-1">{hit.document.title}</span>
                          {hit.document.start_year && (
                            <span className="text-muted-foreground text-xs">
                              {hit.document.start_year}
                              {hit.document.end_year && ` - ${hit.document.end_year}`}
                              {hit.document.total_seasons && ` (${hit.document.total_seasons} seasons)`}
                            </span>
                          )}
                          {hit.document.average_rating && (
                            <span className="text-muted-foreground text-xs">
                              ★ {hit.document.average_rating.toFixed(1)}
                            </span>
                          )}
                        </div>
                      </Link>
                    ))}
                  </ul>
                </>
              )}

              <div className="border-t"></div>
            </div>
          }

          {/* Keyboard shortcuts footer */}
          <div className="bg-card text-muted-foreground sticky right-0 bottom-0 left-0 flex items-center justify-between border-t px-3 py-2 text-xs backdrop-blur-sm">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1">
                <kbd className="bg-muted inline-flex h-5 items-center gap-1 rounded border px-1.5 font-mono text-[10px] font-medium">
                  ↑
                </kbd>
                <kbd className="bg-muted inline-flex h-5 items-center gap-1 rounded border px-1.5 font-mono text-[10px] font-medium">
                  ↓
                </kbd>
                <span className="ml-1">to navigate</span>
              </div>

              <div className="flex items-center gap-1">
                <kbd className="bg-muted inline-flex h-5 items-center gap-1 rounded border px-1.5 font-mono text-[10px] font-medium">
                  ↵
                </kbd>
                <span className="ml-1">to select</span>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <kbd className="bg-muted inline-flex h-5 items-center gap-1 rounded border px-1.5 font-mono text-[10px] font-medium">
                Esc
              </kbd>
              <span className="ml-1">to close</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
