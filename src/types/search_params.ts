export type SearchParams = Record<string, string | string[] | undefined>;

export type SearchParamsProps = {
  searchParams: Promise<SearchParams>;
};
