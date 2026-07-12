const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 10;
const MAX_LIMIT = 100;

export function buildPagination(query) {
  const page = Math.max(Number.parseInt(query.page, 10) || DEFAULT_PAGE, 1);
  const limit = Math.min(Math.max(Number.parseInt(query.limit ?? query.size, 10) || DEFAULT_LIMIT, 1), MAX_LIMIT);
  const skip = (page - 1) * limit;

  return { page, limit, skip };
}

export function buildSort(query, allowedFields, fallback = "createdAt") {
  const rawSort = query.sort ?? `-${fallback}`;

  if (typeof rawSort !== "string") {
    return { [fallback]: -1 };
  }

  const [fieldPart, directionPart] = rawSort.split(",");
  const field = fieldPart?.replace("-", "").trim();

  if (!allowedFields.includes(field)) {
    return { [fallback]: -1 };
  }

  const direction = fieldPart.startsWith("-") || directionPart === "desc" ? -1 : 1;
  return { [field]: direction };
}

export function escapeRegex(value) {
  return String(value).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export function pageResponse({ items, total, page, limit }) {
  return {
    items,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit) || 1,
      hasNextPage: page * limit < total,
      hasPreviousPage: page > 1
    }
  };
}

