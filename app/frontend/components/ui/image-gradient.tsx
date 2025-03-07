import React, { useEffect, useState } from "react";

interface ImageColorGlowProps {
  /**
   * Reference to the image element that already exists on the page
   */
  imageRef: React.RefObject<HTMLImageElement>;

  /**
   * Intensity of the glow effect (0-100)
   */
  intensity?: number;

  /**
   * How far the glow extends (in pixels)
   */
  glowRadius?: number;

  /**
   * Additional CSS classes
   */
  className?: string;
}

/**
 * ImageColorGlow component creates a gradient effect that extends from an existing image
 * on the page without interfering with the image itself.
 */
const ImageColorGlow: React.FC<ImageColorGlowProps> = ({
  imageRef,
  intensity = 40,
  glowRadius = 100,
  className = "",
}) => {
  const [colors, setColors] = useState<{
    topLeft: string;
    topRight: string;
    bottomLeft: string;
    bottomRight: string;
  } | null>(null);

  const [dimensions, setDimensions] = useState<{
    x: number;
    y: number;
    width: number;
    height: number;
  } | null>(null);

  // Extract colors from the image once it's loaded
  useEffect(() => {
    if (!imageRef.current?.complete) {
      // If image not yet loaded, wait for it
      const img = imageRef.current;
      if (!img) return;

      const handleLoad = () => {
        extractColorsAndSetDimensions();
        img.removeEventListener("load", handleLoad);
      };

      img.addEventListener("load", handleLoad);
      return () => {
        img.removeEventListener("load", handleLoad);
      };
    } else {
      // Image already loaded
      extractColorsAndSetDimensions();
    }
  }, [imageRef.current]);

  // Function to extract colors and set dimensions
  const extractColorsAndSetDimensions = () => {
    const img = imageRef.current;
    if (!img) return;

    // Get image position and dimensions
    const rect = img.getBoundingClientRect();
    setDimensions({
      x: rect.left + window.scrollX,
      y: rect.top + window.scrollY,
      width: rect.width,
      height: rect.height,
    });

    // Create canvas for color extraction
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set small canvas size for sampling
    const sampleSize = 20;
    canvas.width = sampleSize;
    canvas.height = sampleSize;

    // Draw image to canvas
    ctx.drawImage(img, 0, 0, sampleSize, sampleSize);

    try {
      // Get image data
      const imageData = ctx.getImageData(0, 0, sampleSize, sampleSize).data;

      // Sample from corners
      const opacity = intensity / 100;
      const topLeft = getColorFromArea(imageData, 0, 0, 5, 5, sampleSize, opacity);
      const topRight = getColorFromArea(imageData, sampleSize - 5, 0, sampleSize, 5, sampleSize, opacity);
      const bottomLeft = getColorFromArea(imageData, 0, sampleSize - 5, 5, sampleSize, sampleSize, opacity);
      const bottomRight = getColorFromArea(
        imageData,
        sampleSize - 5,
        sampleSize - 5,
        sampleSize,
        sampleSize,
        sampleSize,
        opacity,
      );

      setColors({ topLeft, topRight, bottomLeft, bottomRight });
    } catch (error) {
      console.error("Error extracting colors:", error);
    }
  };

  // Get average color from specified area
  const getColorFromArea = (
    data: Uint8ClampedArray,
    startX: number,
    startY: number,
    endX: number,
    endY: number,
    width: number,
    opacity: number,
  ): string => {
    let r = 0,
      g = 0,
      b = 0;
    let count = 0;

    for (let y = startY; y < endY; y++) {
      for (let x = startX; x < endX; x++) {
        const index = (y * width + x) * 4;
        r += data[index];
        g += data[index + 1];
        b += data[index + 2];
        count++;
      }
    }

    // Calculate average
    r = Math.floor(r / count);
    g = Math.floor(g / count);
    b = Math.floor(b / count);

    return `rgba(${r}, ${g}, ${b}, ${opacity})`;
  };

  // Don't render anything if dimensions or colors aren't available
  if (!dimensions || !colors) return null;

  // Calculate glow positions
  const glowStyle = {
    position: "absolute",
    left: `${dimensions.x - glowRadius}px`,
    top: `${dimensions.y - glowRadius}px`,
    width: `${dimensions.width + glowRadius * 2}px`,
    height: `${dimensions.height + glowRadius * 2}px`,
    background: `
      radial-gradient(circle at ${glowRadius}px ${glowRadius}px, ${colors.topLeft}, transparent ${glowRadius * 1.5}px),
      radial-gradient(circle at ${dimensions.width + glowRadius}px ${glowRadius}px, ${colors.topRight}, transparent ${glowRadius * 1.5}px),
      radial-gradient(circle at ${glowRadius}px ${dimensions.height + glowRadius}px, ${colors.bottomLeft}, transparent ${glowRadius * 1.5}px),
      radial-gradient(circle at ${dimensions.width + glowRadius}px ${dimensions.height + glowRadius}px, ${colors.bottomRight}, transparent ${glowRadius * 1.5}px)
    `,
    pointerEvents: "none",
    zIndex: -1,
  } as React.CSSProperties;

  return <div className={`image-color-glow ${className}`} style={glowStyle} />;
};

export default ImageColorGlow;
