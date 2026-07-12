import { useCallback, useEffect, useMemo, useState } from "react";
import { DEFAULT_PAGE_SIZE } from "./constants.js";

export function usePagedResource(fetcher, filters = {}, initial = {}) {
  const [items, setItems] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [localFilters, setLocalFilters] = useState({ page: 1, limit: DEFAULT_PAGE_SIZE, ...initial });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const params = useMemo(() => ({ ...filters, ...localFilters }), [filters, localFilters]);

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
    setLocalFilters((current) => ({ ...current, [key]: value, page: 1 }));
  }

  function setPage(page) {
    setLocalFilters((current) => ({ ...current, page }));
  }

  function setSort(sort) {
    setLocalFilters((current) => ({ ...current, sort, page: 1 }));
  }

  return {
    items,
    pagination,
    filters: localFilters,
    loading,
    error,
    load,
    updateFilter,
    setPage,
    setSort
  };
}
