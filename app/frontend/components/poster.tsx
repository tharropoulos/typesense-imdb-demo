import { PosterGlow } from "@/components/poster-glow";

function Poster<T extends { primary_image_url?: string; title: string }>({ media }: { media: T }) {
  const { primary_image_url, title } = media;

  return primary_image_url ?
      <div className="relative mb-4">
        <PosterGlow imageUrl={primary_image_url} />
        <img src={primary_image_url} alt={`${title} poster`} className="relative z-10 w-full rounded shadow-lg" />
      </div>
    : <div className="flex aspect-[2/3] w-full items-center justify-center rounded bg-gray-200 shadow-lg">
        <span className="text-muted-foreground">No image available</span>
      </div>;
}

export { Poster };
