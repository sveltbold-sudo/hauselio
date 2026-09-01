import { algoliasearch, type Algoliasearch } from "algoliasearch";
import { logger } from "@/lib/logger";

const ALGOLIA_APP_ID = process.env.ALGOLIA_APP_ID;
const ALGOLIA_SEARCH_KEY = process.env.ALGOLIA_SEARCH_API_KEY;
const ALGOLIA_ADMIN_KEY = process.env.ALGOLIA_ADMIN_API_KEY;

const isAlgoliaConfigured = Boolean(ALGOLIA_APP_ID && ALGOLIA_SEARCH_KEY && ALGOLIA_ADMIN_KEY);

if (!isAlgoliaConfigured) {
  logger.warn("algolia", "Algolia env vars missing — search will not work");
}

let _searchClient: Algoliasearch | null = null;
let _adminClient: Algoliasearch | null = null;

function getSearchClient(): Algoliasearch {
  if (!_searchClient && ALGOLIA_APP_ID && ALGOLIA_SEARCH_KEY) {
    _searchClient = algoliasearch(ALGOLIA_APP_ID, ALGOLIA_SEARCH_KEY);
  }
  if (!_searchClient) {
    throw new Error("Algolia search client not configured. Set ALGOLIA_APP_ID and ALGOLIA_SEARCH_API_KEY.");
  }
  return _searchClient;
}

function getAdminClient(): Algoliasearch {
  if (!_adminClient && ALGOLIA_APP_ID && ALGOLIA_ADMIN_KEY) {
    _adminClient = algoliasearch(ALGOLIA_APP_ID, ALGOLIA_ADMIN_KEY);
  }
  if (!_adminClient) {
    throw new Error("Algolia admin client not configured. Set ALGOLIA_APP_ID and ALGOLIA_ADMIN_API_KEY.");
  }
  return _adminClient;
}

export const PRODUCTS_INDEX = "HAUSAURA_products";

export function getAlgoliaSearchClient() {
  return getSearchClient();
}

export function getAlgoliaAdminClient() {
  return getAdminClient();
}

export { isAlgoliaConfigured };
