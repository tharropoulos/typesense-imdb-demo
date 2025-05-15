import type { ImgHTMLAttributes } from "react";
import { useEffect, useRef, useState } from "react";

interface OptimizedImageProps extends ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  placeholderSrc?: string;
  placeHolder?: string;
  className?: string;
  objectFit?: "cover" | "contain" | "fill" | "none" | "scale-down";
  objectPosition?: string;
  priority?: boolean;
  onLoad?: () => void;
  onError?: () => void;
}

export function OptimizedImage({
  src,
  alt,
  placeholderSrc = "../assets/images/placeholder.svg",
  placeHolder,
  className,
  objectFit = "cover",
  objectPosition = "center",
  priority = false,
  onLoad,
  onError,
}: OptimizedImageProps) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [isVisible, setIsVisible] = useState(priority);
  const imageRef = useRef<HTMLImageElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleImageLoad = () => {
    setImageLoaded(true);
    onLoad?.();
  };

  const handleImageError = () => {
    setImageError(true);
    onError?.();
  };

  useEffect(() => {
    if (priority ?? !containerRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            observer.unobserve(entry.target);
          }
        });
      },
      {
        root: null,
        rootMargin: "200px",
        threshold: 0.01,
      },
    );

    observer.observe(containerRef.current);

    return () => {
      if (containerRef.current) {
        observer.unobserve(containerRef.current);
      }
    };
  }, [priority]);

  return (
    <div ref={containerRef} className={`relative overflow-hidden ${className}`}>
      <div
        className={`absolute inset-0 h-full w-full bg-cover bg-center transition-opacity duration-500 ${
          imageLoaded ? "opacity-0" : "opacity-100"
        }`}
        style={{
          backgroundImage: !imageError ? `${placeholderSrc}` : "none",
          backgroundSize: objectFit,
          backgroundPosition: objectPosition,
          filter: "blur(8px)",
        }}
      />

      {isVisible && !imageError && (
        <img
          ref={imageRef}
          src={src}
          alt={alt}
          className={`absolute inset-0 h-full w-full transition-opacity duration-500 ${
            imageLoaded ? "opacity-100" : "opacity-0"
          }`}
          style={{
            objectFit,
            objectPosition,
          }}
          onError={handleImageError}
          onLoad={handleImageLoad}
          loading={priority ? "eager" : "lazy"}
          decoding="async"
          fetchPriority={priority ? "high" : "auto"}
        />
      )}

      {imageError && (
        <div className="bg-muted flex h-full w-full items-center justify-center">
          <span className="text-muted-foreground text-sm">{placeHolder ?? "Image not available"}</span>
        </div>
      )}
    </div>
  );
}
