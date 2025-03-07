import type { VariantProps } from "class-variance-authority";
import * as React from "react";
import { cn } from "@/lib/utils";
import { cva } from "class-variance-authority";

const arrowVariants = cva(
  "group fill-none stroke-current stroke-[3px] opacity-50 transition-opacity ease-in-out group-hover:opacity-100",
  {
    variants: {
      orientation: {
        right: "rotate-0",
        top: "-rotate-90",
        bottom: "rotate-90",
        left: "rotate-180",
      },
      size: {
        default: "size-5",
        sm: "size-4",
        lg: "size-6",
      },
    },
    defaultVariants: {
      orientation: "right",
      size: "default",
    },
  },
);

function Arrow({
  className,
  orientation,
  size,
  ...props
}: React.ComponentProps<"svg"> & VariantProps<typeof arrowVariants>) {
  return (
    <svg viewBox="0 0 24 24" className={cn(arrowVariants({ orientation, size, className }))} {...props}>
      <line
        x1="5"
        y1="12"
        x2="19"
        y2="12"
        className="translate-x-[15px] scale-x-0 transition-transform duration-300 ease-in-out group-hover:translate-x-0 group-hover:scale-x-100"
      />
      <polyline
        points="12 5 19 12 12 19"
        className="-translate-x-1 transition-transform ease-in-out group-hover:translate-x-0"
      />
    </svg>
  );
}

export { Arrow, arrowVariants };
