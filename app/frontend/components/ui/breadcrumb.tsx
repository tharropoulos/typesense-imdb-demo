import React from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Link } from "@inertiajs/react";

export function BreadCrumbNav({
  items,
}: {
  items: {
    url: string;
    label: string;
  }[];
}) {
  if (!items || items.length === 0) return null;

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {items.map((item, index) => (
          <React.Fragment key={`${item.label}-${index}-fragment`}>
            <BreadcrumbItem key={`${item.label}-${index}-link`}>
              <BreadcrumbLink asChild>
                <Link href={item.url}>{item.label}</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            {/* Add separator after each item except the last one */}
            {index < items.length - 1 && <BreadcrumbSeparator />}
          </React.Fragment>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
