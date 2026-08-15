// Real-Time In-Memory Search Engine with Session Storage Caching
// Pre-indexes site content for sub-millisecond local queries.

const CACHE_KEY = 'molokele_search_index_v1';
const CACHE_TTL_MS = 10 * 60 * 1000; // 10 minutes cache TTL

let memoryCache = null;
let prefetchPromise = null;

function stripHtml(html) {
  if (!html) return '';
  const doc = new DOMParser().parseFromString(html, 'text/html');
  return (doc.body.textContent || '').trim();
}

function formatDate(dateString) {
  if (!dateString) return '';
  try {
    return new Date(dateString).toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  } catch {
    return '';
  }
}

/**
 * Fetch and build the full site search index from WordPress REST API.
 */
export async function prefetchSearchIndex(forceRefresh = false) {
  if (memoryCache && !forceRefresh) return memoryCache;

  // Check sessionStorage cache
  if (!forceRefresh) {
    try {
      const cachedStr = sessionStorage.getItem(CACHE_KEY);
      if (cachedStr) {
        const { timestamp, data } = JSON.parse(cachedStr);
        if (Date.now() - timestamp < CACHE_TTL_MS) {
          memoryCache = data;
          return memoryCache;
        }
      }
    } catch {
      // Ignore cache read failures
    }
  }

  // Prevent duplicate concurrent fetches
  if (prefetchPromise && !forceRefresh) return prefetchPromise;

  prefetchPromise = (async () => {
    try {
      const res = await fetch('/wp-json/molokele/v1/search-index');
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data)) {
          memoryCache = data;
          try {
            sessionStorage.setItem(CACHE_KEY, JSON.stringify({ timestamp: Date.now(), data: memoryCache }));
          } catch {
            // Ignore cache write errors
          }
          return memoryCache;
        }
      }
      return memoryCache || [];
    } catch {
      return memoryCache || [];
    } finally {
      prefetchPromise = null;
    }
  })();

  return prefetchPromise;
}

/**
 * Instant local memory search query with relevance ranking.
 */
export function queryLiveSearch(rawQuery, maxResults = 8) {
  const query = (rawQuery || '').trim().toLowerCase();
  if (!query || !memoryCache) return { total: 0, groups: {} };

  const tokens = query.split(/\s+/).filter(Boolean);

  const scoredResults = [];

  memoryCache.forEach((item) => {
    let score = 0;
    const itemTitle = item.title.toLowerCase();
    const itemField = item.searchField;

    // Exact title match gets highest priority
    if (itemTitle === query) score += 100;
    else if (itemTitle.startsWith(query)) score += 60;
    else if (itemTitle.includes(query)) score += 40;

    // Token matching
    tokens.forEach((token) => {
      if (itemTitle.includes(token)) score += 20;
      if (itemField.includes(token)) score += 10;
    });

    if (score > 0) {
      scoredResults.push({ item, score });
    }
  });

  // Sort descending by score
  scoredResults.sort((a, b) => b.score - a.score);

  const topItems = scoredResults.slice(0, maxResults).map((r) => r.item);

  // Group by category
  const groups = {
    speeches: topItems.filter((i) => i.type === 'speech'),
    news: topItems.filter((i) => i.type === 'press' || i.type === 'news'),
    pages: topItems.filter((i) => i.type === 'page'),
  };

  return {
    total: scoredResults.length,
    items: topItems,
    groups,
  };
}
