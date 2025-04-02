import { useState } from "react";
import * as collapsible from "@/components/ui/collapsible";
import { FilterIcon } from "lucide-react";

import { Button } from "./ui/button";

export const Filter = ({ children }: { children: React.ReactNode }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="w-full pb-2">
      <collapsible.Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <collapsible.CollapsibleTrigger asChild>
          <Button variant="outline" size="sm" className="group cursor-pointer">
            <FilterIcon className="mr-2 h-4 w-4" />
            <span>Filters</span>
          </Button>
        </collapsible.CollapsibleTrigger>

        <collapsible.CollapsibleContent className="mt-4 space-y-4">{children}</collapsible.CollapsibleContent>
      </collapsible.Collapsible>

      {/* 
        Hidden div that ensures filters are always mounted and initialized
        We use aria-hidden to ensure it's not visible to screen readers
      */}
      <div className="hidden" aria-hidden="true">
        {children}
      </div>
    </div>
  );
};
