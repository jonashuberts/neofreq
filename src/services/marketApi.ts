export interface CandlePoint {
  ts: number;
  close: number;
}

const candleCache = new Map<string, { data: CandlePoint[]; timestamp: number }>();

/**
 * Fetch public candlestick data from OKX market API.
 * Free, requires no auth token, and supports CORS from any origin.
 */
export async function fetchMarketCandles(
  pair: string,
  bar: '15m' | '1H' | '1D' = '15m',
  limit = 100
): Promise<CandlePoint[]> {
  const instId = pair.replace('/', '-').toUpperCase();
  const cacheKey = `${instId}_${bar}_${limit}`;

  const cached = candleCache.get(cacheKey);
  const now = Date.now();
  // 1-minute cache
  if (cached && now - cached.timestamp < 60_000) {
    return cached.data;
  }

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

      candleCache.set(cacheKey, { data: parsed, timestamp: now });
      return parsed;
    }
  } catch (err) {
    console.warn('Failed to fetch market candles for', pair, err);
  }

  return cached?.data || [];
}
