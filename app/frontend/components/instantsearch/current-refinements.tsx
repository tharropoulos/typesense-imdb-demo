import type { UseCurrentRefinementsProps } from "react-instantsearch";
import { X } from "lucide-react";
import { useCurrentRefinements } from "react-instantsearch";

import { Button } from "../ui/button";

export interface AttributeLabel {
  attribute: string;
  label: string;
}

export function CurrentRefinements(props: UseCurrentRefinementsProps & { attributeLabels?: AttributeLabel[] }) {
  const { items, refine } = useCurrentRefinements(props);
  const { attributeLabels = [] } = props;

  return (
    <div className="flex flex-wrap gap-3 w-full mt-4">
      {items
        .sort((a, b) => a.label.localeCompare(b.label))
        .map((item) =>
          item.refinements.map((refinement) => {
            const customLabel = attributeLabels.find((mapping) => mapping.attribute === item.label)?.label;

            const displayLabel =
              customLabel ??
              item.label
                .split(" ")
                .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                .join(" ");

            return (
              <Button
                onClick={() => {
                  refine(refinement);
                }}
                variant={"outline"}
                className="cursor-pointer rounded-full"
                key={[item.indexName, item.label, refinement.label].join("/")}
                size={"sm"}
              >
                <span>{`${displayLabel}: ${refinement.label}`}</span>
                <X className="h-5" />
              </Button>
            );
          }),
        )}
    </div>
  );
}
