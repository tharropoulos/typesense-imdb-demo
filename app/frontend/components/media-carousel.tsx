import type { MediaCardItem } from "@/components/media-card";
import type { CarouselApi } from "@/components/ui/carousel";
import { useCallback, useEffect, useState } from "react";
import { MediaCard } from "@/components/media-card";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import { motion } from "motion/react";

interface MediaCarouselProps<T extends MediaCardItem> {
  media: T[];
  getHref: (item: T) => string;
}

function MediaCarousel<T extends MediaCardItem>(props: MediaCarouselProps<T>) {
  const [carouselAPI, setCarouselAPI] = useState<CarouselApi | null>(null);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [scrollSnaps, setScrollSnaps] = useState<number[]>([]);

  const onSelect = useCallback(() => {
    if (!carouselAPI) return;

    setSelectedIndex(carouselAPI.selectedScrollSnap());
  }, [carouselAPI]);

  const scrollTo = (index: number) => {
    if (!carouselAPI) return;

    carouselAPI.scrollTo(index);
  };

  useEffect(() => {
    if (!carouselAPI) return;

    onSelect();

    setScrollSnaps(carouselAPI.scrollSnapList());

    carouselAPI.on("select", onSelect);
  }, [carouselAPI, onSelect]);

  return (
    <>
      <Carousel
        plugins={[Autoplay({ delay: 2500, stopOnMouseEnter: true, stopOnInteraction: true, stopOnFocusIn: true })]}
        opts={{ loop: false, align: "center" }}
        setApi={setCarouselAPI}
      >
        <CarouselPrevious />
        <CarouselNext />
        <CarouselContent>
          {props.media.map((medium) => (
            <CarouselItem key={medium.id} className="basis-1/3 md:basis-1/4 lg:basis-1/5 xl:basis-1/7">
              <div className="flex items-center justify-center">
                <MediaCard getHref={props.getHref} item={medium} />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>

      <div className="mt-4 flex justify-center space-x-2">
        {scrollSnaps.map((_, index) => (
          <motion.button
            key={index}
            onClick={() => scrollTo(index)}
            className="bg-muted-foreground/40 h-2 rounded-full"
            initial={false}
            animate={{
              width: selectedIndex === index ? "1rem" : "0.5rem",
            }}
            transition={{
              type: "spring",
              stiffness: 500,
              damping: 30,
            }}
          />
        ))}
      </div>
    </>
  );
}

export { MediaCarousel };
