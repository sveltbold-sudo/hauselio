import { algoliasearch } from "algoliasearch";

const ALGOLIA_APP_ID = process.env.ALGOLIA_APP_ID;
const ALGOLIA_SEARCH_KEY = process.env.ALGOLIA_SEARCH_API_KEY;
const ALGOLIA_ADMIN_KEY = process.env.ALGOLIA_ADMIN_API_KEY;

if (!ALGOLIA_APP_ID || !ALGOLIA_SEARCH_KEY || !ALGOLIA_ADMIN_KEY) {
  console.warn("Algolia env vars missing — search will not work");
}

export const algoliaClient = algoliasearch(
  ALGOLIA_APP_ID ?? "",
  ALGOLIA_SEARCH_KEY ?? ""
);

export const algoliaAdminClient = algoliasearch(
  ALGOLIA_APP_ID ?? "",
  ALGOLIA_ADMIN_KEY ?? ""
);

export const PRODUCTS_INDEX = "hauselio_products";
