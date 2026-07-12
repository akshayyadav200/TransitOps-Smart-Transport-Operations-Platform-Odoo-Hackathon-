import { createContext, useContext, useMemo, useState } from "react";
import { DEFAULT_FILTERS } from "./constants.js";

const FiltersContext = createContext(null);

export function FiltersProvider({ children }) {
  const [filters, setFilters] = useState(DEFAULT_FILTERS);

  const value = useMemo(
    () => ({
      filters,
      updateFilter(key, value) {
        setFilters((current) => ({ ...current, [key]: value }));
      },
      resetFilters() {
        setFilters(DEFAULT_FILTERS);
      }
    }),
    [filters]
  );

  return <FiltersContext.Provider value={value}>{children}</FiltersContext.Provider>;
}

export function useGlobalFilters() {
  const context = useContext(FiltersContext);

  if (!context) {
    throw new Error("useGlobalFilters must be used inside FiltersProvider");
  }

  return context;
}
