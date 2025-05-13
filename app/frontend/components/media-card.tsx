"use client";

import type { PageProps } from "@/pages/Home";
import type { BaseHit } from "instantsearch.js";
import { useRef } from "react";
import { OptimizedImage } from "@/components/optimized-image";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { client } from "@/lib/typesense";
import { Link, usePage } from "@inertiajs/react";
import { StarIcon } from "lucide-react";

export interface MediaCardItem extends BaseHit {
  id: string;
  title: string;
  average_rating: number;
  primary_image_url: string;
  release_year: number;
  genre_names: string[];
  total_seasons?: number;
  start_year?: number;
  collection_type: "tv_show" | "movie";
}

export interface MediaCardProps<T extends MediaCardItem> {
  item: T;
  getHref: (item: T) => string;
}

export function MediaCard<T extends MediaCardItem>(medium: MediaCardProps<T>) {
  const { title, average_rating, primary_image_url, release_year, genre_names, total_seasons, start_year } =
    medium.item;
  const cardRef = useRef<HTMLDivElement>(null);
  const { props } = usePage<PageProps>();

  return (
    <TooltipProvider>
      <Tooltip delayDuration={250}>
        <TooltipTrigger asChild>
          <Link
            onClick={async () => {
              if (props.auth) {
                await client.analytics.events().create({
                  type: "click",
                  name: `${medium.item.collection_type}_click`,
                  data: {
                    user_id: props.auth?.user.id.toString(),
                    doc_id: medium.item.id,
                  },
                });
              }
            }}
            href={medium.getHref(medium.item)}
            className="group relative aspect-2/3 h-52 cursor-pointer overflow-hidden rounded-lg shadow-sm md:h-72"
            ref={cardRef}
          >
            <OptimizedImage
              src={primary_image_url || "/placeholder.svg"}
              alt={title}
              placeHolder={`${title}`}
              className="absolute inset-0 h-full w-full transform transition-transform duration-500 ease-in-out group-hover:-translate-y-2 group-hover:scale-110"
              objectPosition="center top"
            />

            {/* Hover Overlay */}
            <div className="absolute inset-0 z-0 bg-gradient-to-b from-transparent via-black/30 to-black/90 opacity-0 transition-opacity duration-500 ease-in-out group-hover:opacity-100"></div>
            <div className="absolute inset-0 z-10">
              <div className="flex h-full flex-col justify-end p-4">
                <h3 className="line-clamp-2 translate-y-4 transform text-base font-bold text-white opacity-0 transition-all duration-300 ease-out group-hover:translate-y-0 group-hover:opacity-100">
                  {title}
                </h3>
                {total_seasons ?
                  <p className="translate-y-4 transform text-xs text-white/80 opacity-0 transition-all delay-75 duration-300 ease-out group-hover:translate-y-0 group-hover:opacity-100">
                    {start_year} • {total_seasons} {total_seasons === 1 ? "Season" : "Seasons"}
                  </p>
                : <p className="translate-y-4 transform text-xs text-white/80 opacity-0 transition-all delay-75 duration-300 ease-out group-hover:translate-y-0 group-hover:opacity-100">
                    {release_year}
                  </p>
                }
                {genre_names && genre_names.length > 0 && (
                  <div className="mt-2 flex translate-y-4 transform flex-wrap gap-1 opacity-0 transition-all delay-150 duration-300 ease-out group-hover:translate-y-0 group-hover:opacity-100">
                    {genre_names.slice(0, 1).map((genre) => (
                      <span key={genre} className="bg-muted rounded-full px-2 py-0.5 text-xs">
                        {genre}
                      </span>
                    ))}
                    {genre_names.length > 1 && (
                      <span className="bg-muted rounded-full px-2 py-0.5 text-xs">+{genre_names.length - 1}</span>
                    )}
                  </div>
                )}
              </div>
            </div>
            <div className="absolute right-2 bottom-4 z-2 flex items-center rounded bg-zinc-900 px-1.5 py-0.5 text-white">
              <StarIcon className="mr-0.5 h-3 w-3 fill-yellow-400 stroke-yellow-400" />
              <span className="text-xs font-medium">{average_rating.toFixed(1)}</span>
            </div>
          </Link>
        </TooltipTrigger>
        <TooltipContent>{title}</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
