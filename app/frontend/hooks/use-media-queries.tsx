import * as React from "react";

/**
 * A hook that matches a tuple of media queries and returns a tuple of booleans
 * with the same length as the input tuple.
 *
 * @param queries Tuple of media query strings
 * @returns Tuple of booleans matching the length of the input
 */
export function useMediaQueries<const T extends string[]>(queries: [...T]): { [K in keyof T]: boolean } {
  const isInitialized = React.useRef(false);

  const [values, setValues] = React.useState<{ [K in keyof T]: boolean }>(() => {
    if (typeof window === "undefined") {
      return Array(queries.length).fill(false) as { [K in keyof T]: boolean };
    }

    isInitialized.current = true;
    return queries.map((query) => window.matchMedia(query).matches) as { [K in keyof T]: boolean };
  });

  React.useEffect(() => {
    if (typeof window === "undefined") return;

    const mediaQueryLists = queries.map((query) => window.matchMedia(query));

    if (!isInitialized.current) {
      const matches = mediaQueryLists.map((mql) => mql.matches);
      setValues(matches as { [K in keyof T]: boolean });
      isInitialized.current = true;
    }

    const handleChange = (index: number) => (event: MediaQueryListEvent) => {
      setValues((prev) => {
        const next = [...prev] as { [K in keyof T]: boolean };
        next[index] = event.matches;
        return next;
      });
    };

    const handlers = mediaQueryLists.map((mql, index) => {
      const handler = handleChange(index);
      mql.addEventListener("change", handler);
      return handler;
    });

    return () => {
      mediaQueryLists.forEach((mql, index) => {
        mql.removeEventListener("change", handlers[index]);
      });
    };
  }, [queries]);

  return values;
}
