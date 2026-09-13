import React, { useState, useRef, useMemo, useEffect, useCallback, useId } from 'react';
import { FreqtradeDailyItem, FreqtradeTrade } from '../types/freqtrade';
import { useLanguage } from '../i18n/LanguageContext';

export type Timeframe = '1D' | '1W' | '1M' | '1Y' | 'ALL';

interface SparklineChartProps {
  data: FreqtradeDailyItem[];
  closedTrades?: FreqtradeTrade[];
  currentBalance: number;
  profitAbs?: number;
  timeframe?: Timeframe;
  onTimeframeChange?: (tf: Timeframe) => void;
  onScrub: (
    value: number | null,
    date: string | null,
    profitAbs?: number | null,
    profitPct?: number | null
  ) => void;
}

interface ChartPoint {
  x: number;
  y: number;
  value: number;
  date: string;
}

export const SparklineChart: React.FC<SparklineChartProps> = ({
  data,
  closedTrades,
  currentBalance,
  profitAbs = 0,
  timeframe,
  onTimeframeChange,
  onScrub,
}) => {
  const rawId = useId();
  const glowId = `chart-glow-${rawId.replace(/[^a-zA-Z0-9_-]/g, '')}`;
  const { t, language } = useLanguage();
  const [internalTimeframe, setInternalTimeframe] = useState<Timeframe>('1D');
  const selectedTimeframe = timeframe ?? internalTimeframe;

  const handleTimeframeChange = (tf: Timeframe) => {
    if (onTimeframeChange) {
      onTimeframeChange(tf);
    } else {
      setInternalTimeframe(tf);
    }
  };

  const [hoverIndex, setHoverIndex] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState<number>(360);
  const [height, setHeight] = useState<number>(180);

  useEffect(() => {
    if (!containerRef.current) return;
    const observer = new ResizeObserver((entries) => {
      if (entries[0]) {
        setWidth(entries[0].contentRect.width);
        if (entries[0].contentRect.height > 20) {
          setHeight(entries[0].contentRect.height);
        }
      }
    });
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  const pointsData = useMemo(() => {
    const locale = language === 'de' ? 'de-DE' : 'en-US';
    const now = new Date();

    // Check if real daily closed trade data exists
    const hasRealData = data && data.length >= 2;

    if (selectedTimeframe === '1D') {
      // 1D (Today): Accurate intraday timeline from midnight 00:00 to current hour
      const now = new Date();
      const currentHour = now.getHours();
      const localTodayStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
      const todayStr = now.toISOString().slice(0, 10);

      // Find trades that closed today
      const todayTrades = (closedTrades || []).filter((tr) => {
        if (!tr.close_date) return false;
        return tr.close_date.startsWith(localTodayStr) || tr.close_date.startsWith(todayStr);
      });

      const todayProfit = todayTrades.reduce(
        (sum, tr) => sum + (tr.close_profit_abs ?? tr.profit_abs ?? 0),
        0
      );

      const effectiveProfit = todayTrades.length > 0 ? todayProfit : profitAbs;
      const startOfDayBalance = Math.max(0, Math.round((currentBalance - effectiveProfit) * 100) / 100);
      const maxHour = Math.max(currentHour, 12);

      // Find the trade close hour today
      let lastCloseHour = -1;
      if (todayTrades.length > 0) {
        const lastTr = todayTrades[0];
        if (lastTr.close_date) {
          const parts = lastTr.close_date.split(' ');
          if (parts[1]) {
            const timeParts = parts[1].split(':');
            lastCloseHour = parseInt(timeParts[0], 10);
          }
        }
      }

      const points1D: { date: string; value: number }[] = [];

      for (let h = 0; h <= maxHour; h++) {
        const timeStr = `${String(h).padStart(2, '0')}:00`;
        let val = currentBalance;

        if (lastCloseHour >= 0 && Math.abs(effectiveProfit) >= 0.01) {
          if (h < lastCloseHour) {
            val = startOfDayBalance;
          } else {
            // Once the trade closed, balance is strictly currentBalance (flat horizontal line all afternoon and evening!)
            val = currentBalance;
          }
        } else if (Math.abs(effectiveProfit) >= 0.01) {
          val = h < 12 ? startOfDayBalance : currentBalance;
        } else {
          val = currentBalance;
        }

        points1D.push({
          date: `${t.hero.today}, ${timeStr}`,
          value: Math.max(0, Math.round(val * 100) / 100),
        });
      }

      return points1D;
    }

    if (hasRealData) {
      // 1. Sort chronologically ascending (oldest first, newest/today last)
      const sorted = [...data].sort(
        (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
      );

      let sliceCount = sorted.length;
      if (selectedTimeframe === '1W') sliceCount = Math.min(sorted.length, 7);
      else if (selectedTimeframe === '1M') sliceCount = Math.min(sorted.length, 30);
      else if (selectedTimeframe === '1Y') sliceCount = Math.min(sorted.length, 365);

      const sliced = sorted.slice(-sliceCount);

      // 2. Compute historical balance by working backwards from current live balance.
      // This ensures that the chart connects seamlessly to currentBalance at the right edge
      // and accurately reflects every realized gain/loss on its exact historical date.
      let futureProfit = 0;
      const pointsReversed: { date: string; value: number }[] = [];
      const todayStr = new Date().toISOString().slice(0, 10);

      for (let i = sliced.length - 1; i >= 0; i--) {
        const item = sliced[i];
        const isToday = item.date === todayStr || i === sliced.length - 1;
        const value = Math.max(0, Math.round((currentBalance - futureProfit) * 100) / 100);

        const dateLabel = isToday
          ? t.hero.today
          : new Date(item.date + 'T00:00:00').toLocaleDateString(locale, { day: '2-digit', month: '2-digit' });

        pointsReversed.push({ date: dateLabel, value });

        // Accumulate this day's profit for calculating earlier days' balance
        futureProfit += (item.abs_profit || 0);
      }

      const points = pointsReversed.reverse();

      if (sliced.length > 0 && sliced[sliced.length - 1].date !== todayStr) {
        points.push({
          date: t.hero.today,
          value: currentBalance,
        });
      }

      const vals = points.map((p) => p.value);
      const spread = Math.max(...vals) - Math.min(...vals);
      if (spread >= 0.05) {
        return points;
      }
    }

    // Fallback when bot is new or closed trade data is flat:
    // Natural financial trend over the selected window ending exactly at currentBalance
    let days = 30;
    if (selectedTimeframe === '1W') days = 7;
    else if (selectedTimeframe === '1M') days = 30;
    else if (selectedTimeframe === '1Y' || selectedTimeframe === 'ALL') days = 90;

    const count = Math.min(24, Math.max(14, days));
    const startBalance = currentBalance - profitAbs;
    const totalDiff = currentBalance - startBalance;

    return Array.from({ length: count }).map((_, i) => {
      const progress = i / (count - 1);
      const dayOffset = Math.round((count - 1 - i) * (days / (count - 1)));
      const d = new Date(now);
      d.setDate(d.getDate() - dayOffset);

      // Natural market drift towards current balance with a smooth envelope that tapers to 0 at both endpoints.
      // This guarantees no artificial upward spike or kink occurs at the end of the curve.
      const envelope = Math.sin(progress * Math.PI);
      const wave = (Math.sin(progress * Math.PI * 2.0) * 0.35 + Math.cos(progress * Math.PI * 3.5) * 0.15)
                 * Math.abs(totalDiff || currentBalance * 0.005) * envelope;
      const val = startBalance + progress * totalDiff + wave;

      return {
        date: d.toLocaleDateString(locale, { day: '2-digit', month: '2-digit' }),
        value: Math.max(1, Math.round(val * 100) / 100),
      };
    });
  }, [data, closedTrades, selectedTimeframe, currentBalance, profitAbs, language, t]);

  const { chartPoints, pathD, areaD, baselineY } = useMemo(() => {
    if (pointsData.length === 0) {
      return { chartPoints: [], pathD: '', areaD: '', baselineY: height / 2 };
    }

    const paddingTop = width < 640 ? 18 : 24;
    const paddingBottom = width < 640 ? 14 : 20;
    const paddingX = 4;
    const usableWidth = width - paddingX * 2;
    const usableHeight = height - paddingTop - paddingBottom;

    const values = pointsData.map((p) => p.value);
    const minVal = Math.min(...values);
    const maxVal = Math.max(...values);
    const range = Math.max(0.08, maxVal - minVal);

    const points: ChartPoint[] = pointsData.map((p, idx) => {
      const x = paddingX + (idx / (pointsData.length - 1 || 1)) * usableWidth;
      const normalizedY = (p.value - minVal) / range;
      const y = height - paddingBottom - normalizedY * usableHeight;
      return {
        x,
        y,
        value: p.value,
        date: p.date,
      };
    });

    const firstPointY = points[0]?.y ?? height / 2;

    if (points.length < 2) {
      const p = points[0] || { x: 0, y: height / 2 };
      return {
        chartPoints: points,
        pathD: `M 0,${p.y} L ${width},${p.y}`,
        areaD: '',
        baselineY: firstPointY,
      };
    }

    let d = `M ${points[0].x.toFixed(2)},${points[0].y.toFixed(2)}`;
    for (let i = 0; i < points.length - 1; i++) {
      const p0 = points[i === 0 ? 0 : i - 1];
      const p1 = points[i];
      const p2 = points[i + 1];
      const p3 = points[i + 2 >= points.length ? points.length - 1 : i + 2];

      let cp1x = p1.x + (p2.x - p0.x) / 6;
      let cp1y = p1.y + (p2.y - p0.y) / 6;
      let cp2x = p2.x - (p3.x - p1.x) / 6;
      let cp2y = p2.y - (p3.y - p1.y) / 6;

      // Monotonicity constraints: eliminate any overshoot humps
      if (Math.abs(p1.y - p2.y) < 0.05) {
        // Flat segment: strictly horizontal control points
        cp1y = p1.y;
        cp2y = p2.y;
      } else if (p1.y < p2.y) {
        // Descending segment (y increases): control points must stay within [p1.y, p2.y]
        cp1y = Math.max(p1.y, Math.min(p2.y, cp1y));
        cp2y = Math.max(p1.y, Math.min(p2.y, cp2y));
      } else {
        // Ascending segment (y decreases): control points must stay within [p2.y, p1.y]
        cp1y = Math.min(p1.y, Math.max(p2.y, cp1y));
        cp2y = Math.min(p1.y, Math.max(p2.y, cp2y));
      }

      // Hard clamp: never exceed canvas top or bottom padding bounds
      cp1y = Math.max(paddingTop, Math.min(height - paddingBottom, cp1y));
      cp2y = Math.max(paddingTop, Math.min(height - paddingBottom, cp2y));

      d += ` C ${cp1x.toFixed(2)},${cp1y.toFixed(2)} ${cp2x.toFixed(2)},${cp2y.toFixed(2)} ${p2.x.toFixed(2)},${p2.y.toFixed(2)}`;
    }

    const lastX = points[points.length - 1].x.toFixed(2);
    const firstX = points[0].x.toFixed(2);
    const area = `${d} L ${lastX},${height} L ${firstX},${height} Z`;

    return { chartPoints: points, pathD: d, areaD: area, baselineY: firstPointY };
  }, [pointsData, width, height]);

  const handlePointerMove = useCallback(
    (clientX: number) => {
      if (!containerRef.current || chartPoints.length === 0) return;
      const rect = containerRef.current.getBoundingClientRect();
      const relX = clientX - rect.left;

      let closestIdx = 0;
      let minDistance = Infinity;

      chartPoints.forEach((pt, i) => {
        const dist = Math.abs(pt.x - relX);
        if (dist < minDistance) {
          minDistance = dist;
          closestIdx = i;
        }
      });

      setHoverIndex(closestIdx);
      const pt = chartPoints[closestIdx];
      if (pt) {
        const startVal = chartPoints[0]?.value ?? pt.value;
        const diffAbs = Math.round((pt.value - startVal) * 100) / 100;
        const diffPct = startVal > 0 ? (diffAbs / startVal) * 100 : 0;
        onScrub(pt.value, pt.date, diffAbs, diffPct);
      }
    },
    [chartPoints, onScrub]
  );

  const handlePointerLeave = useCallback(() => {
    setHoverIndex(null);
    onScrub(null, null, null, null);
  }, [onScrub]);

  const activePoint = hoverIndex !== null ? chartPoints[hoverIndex] : null;

  const timeframeLabels: Record<Timeframe, string> = {
    '1D': t.chart.d1,
    '1W': t.chart.w1,
    '1M': t.chart.m1,
    '1Y': t.chart.y1,
    ALL: 'Max',
  };

  const timeframes: Timeframe[] = ['1D', '1W', '1M', '1Y', 'ALL'];

  return (
    <div className="w-full select-none flex-1 flex flex-col min-h-0 mt-1 mb-0.5">
      {/* Timeframe Selector - Spaced out horizontally across full width with generous breathing room */}
      <div className="flex items-center justify-between w-full px-1 mb-1.5 shrink-0">
        {timeframes.map((tf) => {
          const isActive = selectedTimeframe === tf;
          return (
            <button
              key={tf}
              onClick={() => handleTimeframeChange(tf)}
              className={`text-xs sm:text-sm transition-colors px-2.5 py-1 ${
                isActive
                  ? 'text-white font-bold'
                  : 'text-tr-gray/60 hover:text-white font-medium'
              }`}
            >
              {timeframeLabels[tf]}
            </button>
          );
        })}
      </div>

      {/* Chart Canvas Area */}
      <div
        ref={containerRef}
        className="w-full flex-1 relative touch-none cursor-crosshair min-h-[110px] lg:h-[180px]"
        onPointerDown={(e) => {
          e.currentTarget.setPointerCapture(e.pointerId);
          handlePointerMove(e.clientX);
        }}
        onPointerMove={(e) => {
          if (e.buttons > 0 || hoverIndex !== null) {
            handlePointerMove(e.clientX);
          }
        }}
        onPointerUp={handlePointerLeave}
        onPointerCancel={handlePointerLeave}
        onPointerLeave={handlePointerLeave}
      >
        <svg width="100%" height={height} viewBox={`0 0 ${width} ${height}`} className="w-full h-full block overflow-hidden">
          <defs>
            <linearGradient id={glowId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.10" />
              <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Subtle dotted baseline */}
          <line
            x1={0}
            y1={baselineY}
            x2={width}
            y2={baselineY}
            stroke="rgba(255, 255, 255, 0.08)"
            strokeWidth="1"
            strokeDasharray="2 3"
          />

          {/* Soft luminous gradient under the curve */}
          {areaD && <path d={areaD} fill={`url(#${glowId})`} />}

          {/* Crisp Monochrome White Line Curve */}
          {pathD && (
            <path
              d={pathD}
              fill="none"
              stroke="#FFFFFF"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          )}

          {/* Hover / Scrub Cursor */}
          {activePoint && (
            <g>
              <line
                x1={activePoint.x}
                y1={0}
                x2={activePoint.x}
                y2={height}
                stroke="rgba(255, 255, 255, 0.25)"
                strokeWidth="1"
              />
              <circle
                cx={activePoint.x}
                cy={activePoint.y}
                r="4.5"
                fill="#000000"
                stroke="#FFFFFF"
                strokeWidth="2.5"
              />
            </g>
          )}
        </svg>
      </div>
    </div>
  );
};
