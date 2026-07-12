import { useCallback, useEffect, useMemo, useState } from "react";
import { DEFAULT_PAGE_SIZE } from "./constants.js";

export function useFleetResource(fetcher, initialFilters = {}) {
  const [items, setItems] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [filters, setFilters] = useState({ page: 1, limit: DEFAULT_PAGE_SIZE, ...initialFilters });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const params = useMemo(() => filters, [filters]);

  const load = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const response = await fetcher(params);
      setItems(response.data.items ?? []);
      setPagination(response.data.pagination ?? null);
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setLoading(false);
    }
  }, [fetcher, params]);

  useEffect(() => {
    load();
  }, [load]);

  function updateFilter(key, value) {
    setFilters((current) => ({ ...current, [key]: value, page: 1 }));
  }

  function setPage(page) {
    setFilters((current) => ({ ...current, page }));
  }

  function setSort(sort) {
    setFilters((current) => ({ ...current, sort, page: 1 }));
  }

  return {
    items,
    pagination,
    filters,
    loading,
    error,
    load,
    setPage,
    setSort,
    updateFilter
  };
}

