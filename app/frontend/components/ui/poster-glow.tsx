import React, { useEffect, useMemo, useRef, useState } from "react";

interface PosterGlowProps {
  imageUrl?: string;
  fallbackColors?: string[];
}

export const PosterGlow: React.FC<PosterGlowProps> = ({
  imageUrl,
  fallbackColors = ["#3b82f6", "#8b5cf6", "#4f46e5"],
}) => {
  const [colors, setColors] = useState<string[]>(fallbackColors);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const didExtractRef = useRef(false);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Memoize fallback colors to prevent unnecessary re-renders
  const memoizedFallbacks = useMemo(
    () => fallbackColors,
    [
      // stringify fallbackColors to ensure deep comparison
      JSON.stringify(fallbackColors),
    ],
  );

  useEffect(() => {
    // Skip if we've already extracted colors for this image
    if (didExtractRef.current && isLoaded) {
      return;
    }

    // If no image URL is provided, use fallback colors and exit early
    if (!imageUrl) {
      setColors(memoizedFallbacks);
      setIsLoaded(true);
      didExtractRef.current = true;
      return;
    }

    // Flag to track if the component is still mounted
    let isMounted = true;

    // Create a new image object
    const img = new Image();

    img.onload = () => {
      try {
        // Return early if component unmounted during image load
        if (!isMounted) return;

        // Skip if we already extracted colors for this image
        if (didExtractRef.current) return;

        // Make sure canvas exists and get context
        if (!canvasRef.current) {
          canvasRef.current = document.createElement("canvas");
        }

        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d", { willReadFrequently: true });

        if (!ctx) {
          console.warn("Canvas context not available");
          setColors(memoizedFallbacks);
          setIsLoaded(true);
          didExtractRef.current = true;
          return;
        }

        // Set canvas size to a small sample size for performance
        const sampleSize = 100;
        canvas.width = sampleSize;
        canvas.height = sampleSize;

        // Draw the image on the canvas, scaled down
        ctx.drawImage(img, 0, 0, sampleSize, sampleSize);

        // Extract colors (simplified approach)
        const extractedColors: string[] = [];

        // Sample a few key points
        const samplePoints = [
          { x: Math.floor(sampleSize * 0.2), y: Math.floor(sampleSize * 0.2) },
          { x: Math.floor(sampleSize * 0.8), y: Math.floor(sampleSize * 0.2) },
          { x: Math.floor(sampleSize / 2), y: Math.floor(sampleSize / 2) },
          { x: Math.floor(sampleSize * 0.2), y: Math.floor(sampleSize * 0.8) },
          { x: Math.floor(sampleSize * 0.8), y: Math.floor(sampleSize * 0.8) },
        ];

        for (const point of samplePoints) {
          try {
            const pixel = ctx.getImageData(point.x, point.y, 1, 1).data;
            const color = `rgba(${pixel[0]}, ${pixel[1]}, ${pixel[2]}, 0.7)`;
            extractedColors.push(color);
          } catch (error) {
            console.warn("Error sampling image color:", error);
          }
        }

        // Filter and deduplicate colors
        const uniqueColors = Array.from(new Set(extractedColors));

        // Use extracted colors or fallback
        if (uniqueColors.length >= 2) {
          setColors(uniqueColors);
        } else {
          setColors(memoizedFallbacks);
        }

        didExtractRef.current = true;
        setIsLoaded(true);
      } catch (error) {
        console.error("Error in image processing:", error);
        setColors(memoizedFallbacks);
        setIsLoaded(true);
        didExtractRef.current = true;
      }
    };

    img.onerror = () => {
      if (isMounted) {
        console.warn("Error loading image for color extraction");
        setColors(memoizedFallbacks);
        setIsLoaded(true);
        didExtractRef.current = true;
      }
    };

    img.crossOrigin = "anonymous";
    img.src = imageUrl;

    return () => {
      isMounted = false;
      img.onload = null;
      img.onerror = null;
    };
  }, [imageUrl, memoizedFallbacks]);

  // Add a fade-in effect when loaded
  useEffect(() => {
    if (isLoaded) {
      // Small delay to ensure DOM is ready
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 100);

      return () => clearTimeout(timer);
    }
  }, [isLoaded]);

  const backgroundStyle = useMemo(() => {
    return {
      background: `radial-gradient(circle at center,
                 ${colors[0]} 0%,
                 ${colors
                   .reverse()
                   .map((color, index) => `${color} ${index * (50 / (colors.length - 1))}%`)
                   .join(", ")},
                 rgba(255,255,255,0) 100%),
                 radial-gradient(circle at center, 
                 rgba(255,255,255,0.15) 0%, 
                 rgba(255,255,255,0.05) 60%,
                 rgba(0,0,0,0) 100%)`,
      backgroundBlendMode: "normal, screen",
      opacity: isVisible ? 0.5 : 0,
      transition: "opacity 800ms ease-in-out",
    };
  }, [colors, isVisible]);

  if (!isLoaded) {
    return null;
  }

  return (
    <div className="pointer-events-none absolute top-0 right-0 bottom-0 left-0 z-1" aria-hidden="true">
      <div
        className="absolute top-1/2 left-1/2 h-[110%] w-[110%] -translate-x-1/2 -translate-y-1/2 transform rounded-lg blur-3xl"
        style={backgroundStyle}
      />
    </div>
  );
};
