import type { UseRefinementListProps } from "react-instantsearch-core";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useRefinementList } from "react-instantsearch-core";

function RefinementList({
  className,
  ...props
}: UseRefinementListProps & React.ComponentProps<"div"> & { label?: string }) {
  const { items, refine, canRefine } = useRefinementList(props);

  return (
    <div className={cn("flex flex-col gap-2", className)}>
      {props.label && <h3 className="text-lg">{props.label}</h3>}
      <div className="grid grid-cols-4 gap-2">
        {items.map((item) => (
          <Button
            key={item.value}
            onClick={() => {
              refine(item.value);
            }}
            disabled={!canRefine}
            className="w-full rounded-full text-xs"
            variant={item.isRefined ? "primary" : "default"}
          >
            {item.label} ({item.count})
          </Button>
        ))}
      </div>
    </div>
  );
}

export { RefinementList };
