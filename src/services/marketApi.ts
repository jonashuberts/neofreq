export interface CandlePoint {
  ts: number;
  close: number;
}

const candleCache = new Map<string, { data: CandlePoint[]; timestamp: number }>();
const inFlightRequests = new Map<string, Promise<CandlePoint[]>>();

export function getCachedCandles(pair: string, bar: '15m' | '1H' | '4H' | '1D' = '15m'): CandlePoint[] | null {
  const instId = pair.replace('/', '-').toUpperCase();
  const cached = candleCache.get(`${instId}_${bar}`);
  if (cached && cached.data.length > 0) {
    return cached.data;
  }
  // Fallback: any resolution for this pair
  for (const [k, v] of candleCache.entries()) {
    if (k.startsWith(instId) && v.data.length > 0) {
      return v.data;
    }
  }
  return null;
}

/**
 * Fetch public candlestick data from OKX market API.
 * Free, requires no auth token, and supports CORS from any origin.
 */
export async function fetchMarketCandles(
  pair: string,
  bar: '15m' | '1H' | '4H' | '1D' = '15m',
  limit = 300
): Promise<CandlePoint[]> {
  const instId = pair.replace('/', '-').toUpperCase();
  const cacheKey = `${instId}_${bar}`;

  const cached = candleCache.get(cacheKey);
  const now = Date.now();
  // 5-minute cache
  if (cached && now - cached.timestamp < 300_000) {
    return cached.data;
  }

  // Deduplicate concurrent requests for the same pair and bar
  const existing = inFlightRequests.get(cacheKey);
  if (existing) {
    return existing;
  }

  const promise = (async () => {
    try {
      const url = `https://www.okx.com/api/v5/market/candles?instId=${instId}&bar=${bar}&limit=${limit}`;
      const res = await fetch(url);
      if (!res.ok) return cached?.data || [];
      const json = await res.json();
      if (json.code === '0' && Array.isArray(json.data)) {
        const parsed: CandlePoint[] = json.data
          .map((row: string[]) => ({
            ts: Number(row[0]),
            close: Number(row[4]),
          }))
          .filter((c: CandlePoint) => !isNaN(c.ts) && !isNaN(c.close))
          .sort((a: CandlePoint, b: CandlePoint) => a.ts - b.ts);

        candleCache.set(cacheKey, { data: parsed, timestamp: Date.now() });
        return parsed;
      }
    } catch (err) {
      console.warn('Failed to fetch market candles for', pair, err);
    } finally {
      inFlightRequests.delete(cacheKey);
    }
    return cached?.data || [];
  })();

  inFlightRequests.set(cacheKey, promise);
  return promise;
}

export async function prefetchMarketCandles(pairs: string[]): Promise<void> {
  if (!pairs || pairs.length === 0) return;
  const bars: ('15m' | '1H' | '4H' | '1D')[] = ['15m', '1H', '4H', '1D'];
  await Promise.all(
    pairs.flatMap((p) => bars.map((b) => fetchMarketCandles(p, b, 300)))
  );
}
