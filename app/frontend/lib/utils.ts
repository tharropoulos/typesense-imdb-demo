import type { ClassValue } from "clsx";
import type { SearchParams } from "typesense/lib/Typesense/Documents";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export type SearchParamsStringMap = {
  [K in keyof SearchParams]: string;
};

export function urlBuilder(
  url: string,
  searchParams: SearchParamsStringMap & { index_name: string; sectionId?: string },
) {
  const urlSearchParams = new URLSearchParams();

  const indexName = searchParams.index_name;

  Object.entries(searchParams).forEach(([key, value]) => {
    if (key !== "index_name" && key !== "sectionId" && value) {
      const fieldName = value.split(":")[0];

      let actualValue = value.split(":")[1];
      if (actualValue) {
        actualValue = actualValue.replace(/^\[(.*)\]$/, "$1");
        actualValue = actualValue.replace(/^`(.*)`$/, "$1");

        urlSearchParams.append(`${indexName}[refinementList][${fieldName}][0]`, actualValue);
      }
    }
  });

  const baseUrl = `/${url}?${urlSearchParams.toString()}`;

  if (searchParams.sectionId) {
    return `${baseUrl}#${searchParams.sectionId}`;
  }

  return baseUrl;
}

export const ratingToAge: Record<string, number> = {
  G: 0, // General Audiences - suitable for all ages
  PG: 7, // Parental Guidance Suggested - some material may not be suitable for young children
  "PG-13": 13, // Parents Strongly Cautioned - some material may be inappropriate for children under 13
  R: 17, // Restricted - under 17 requires accompanying parent or adult guardian
  "NC-17": 18, // Adults Only - no one 17 and under admitted
};
