import type { UseSortByProps } from "react-instantsearch";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ArrowDownWideNarrow } from "lucide-react";
import { useSortBy } from "react-instantsearch";

function SortBy(props: UseSortByProps) {
  const { currentRefinement, options, refine } = useSortBy(props);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="flex gap-2 px-4 py-2 font-medium">
          <span className="hidden lg:block">Sort By</span>
          <ArrowDownWideNarrow className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuRadioGroup value={currentRefinement} onValueChange={(value: string) => refine(value)}>
          {options.map((option) => (
            <DropdownMenuRadioItem key={option.value} value={option.value}>
              {option.label}
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function HiddenSortBy(props: { sort_by: string }) {
  const { sort_by } = props;
  const { refine } = useSortBy({
    items: [
      {
        label: "Year Descending",
        value: sort_by,
      },
    ],
  });

  useEffect(() => {
    refine(sort_by);
  }, [refine, sort_by]);

  return <></>;
}

export { SortBy, HiddenSortBy };
