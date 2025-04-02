import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
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
