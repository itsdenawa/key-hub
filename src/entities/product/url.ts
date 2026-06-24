import type { CatalogQuery } from "@/entities/product/model";

export function buildCatalogHref(
  query: CatalogQuery,
  overrides: CatalogQuery = {},
) {
  const nextQuery = {
    ...query,
    ...overrides,
  };
  const params = new URLSearchParams();

  setParam(params, "search", nextQuery.search);
  setParam(params, "category", nextQuery.category);
  setParam(params, "fileType", nextQuery.fileType);
  setParam(params, "license", nextQuery.license);
  setParam(
    params,
    "price",
    nextQuery.price && nextQuery.price !== "all" ? nextQuery.price : undefined,
  );
  setParam(
    params,
    "sort",
    nextQuery.sort && nextQuery.sort !== "featured"
      ? nextQuery.sort
      : undefined,
  );

  if (nextQuery.page && nextQuery.page > 1) {
    params.set("page", String(nextQuery.page));
  }

  const queryString = params.toString();
  return queryString ? `/products?${queryString}` : "/products";
}

function setParam(params: URLSearchParams, key: string, value?: string) {
  if (value) {
    params.set(key, value);
  }
}
