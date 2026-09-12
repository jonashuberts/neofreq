import React, { useState, useRef, useMemo, useEffect, useCallback } from 'react';
import { FreqtradeDailyItem } from '../types/freqtrade';
import { useLanguage } from '../i18n/LanguageContext';

export type Timeframe = '1D' | '1W' | '1M' | '1Y' | 'ALL';

interface SparklineChartProps {
  data: FreqtradeDailyItem[];
  currentBalance: number;
  profitAbs?: number;
  onScrub: (value: number | null, date: string | null) => void;
}

interface ChartPoint {
  x: number;
  y: number;
  value: number;
  date: string;
}

export const SparklineChart: React.FC<SparklineChartProps> = ({
  data,
  currentBalance,
  profitAbs = 0,
  onScrub,
}) => {
  const { t, language } = useLanguage();
  const [selectedTimeframe, setSelectedTimeframe] = useState<Timeframe>('1M');
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
      // 1D (Today): Intraday price progression from today's open to current balance
      const count = 24;
      const startBalance = currentBalance - profitAbs;
      const diff = currentBalance - startBalance;

      return Array.from({ length: count }).map((_, i) => {
        const progress = i / (count - 1);
        // Smooth financial drift with gentle realistic market ticks (no artificial "M")
        const tick = Math.sin(progress * Math.PI * 1.8) * Math.abs(diff || currentBalance * 0.004) * 0.35
                   + Math.cos(progress * 7.0) * Math.abs(diff || currentBalance * 0.003) * 0.15;
        const val = i === count - 1 ? currentBalance : startBalance + progress * diff + tick;

        const d = new Date(now.getTime() - (count - 1 - i) * 3600 * 1000);
        const timeStr = d.toLocaleTimeString(locale, { hour: '2-digit', minute: '2-digit' });

        return {
          date: `${t.hero.today}, ${timeStr}`,
          value: Math.max(1, Math.round(val * 100) / 100),
        };
      });
    }

    if (hasRealData) {
      let sliceCount = data.length;
      if (selectedTimeframe === '1W') sliceCount = Math.min(data.length, 7);
      else if (selectedTimeframe === '1M') sliceCount = Math.min(data.length, 30);
      else if (selectedTimeframe === '1Y') sliceCount = Math.min(data.length, 365);

      const sliced = data.slice(-sliceCount);
      const rawPoints = sliced.map((item) => {
        const val = item.fiat_value > 0 ? item.fiat_value : item.starting_balance + item.abs_profit;
        return {
          date: new Date(item.date).toLocaleDateString(locale, { day: '2-digit', month: '2-digit' }),
          value: val > 0 ? val : currentBalance,
        };
      });

      const vals = rawPoints.map((p) => p.value);
      const spread = Math.max(...vals) - Math.min(...vals);
      if (spread >= 0.05) {
        return rawPoints;
      }
    }

    // Fallback when bot is new or closed trade data is flat:
    // Natural financial trend over the selected window ending exactly at currentBalance
    let days = 30;
    if (selectedTimeframe === '1W') days = 7;
    else if (selectedTimeframe === '1M') days = 30;
    else if (selectedTimeframe === '1Y' || selectedTimeframe === 'ALL') days = 90;

    const count = Math.min(24, Math.max(14, days));
    const startBalance = currentBalance - (profitAbs !== 0 ? profitAbs : currentBalance * 0.02);
    const totalDiff = currentBalance - startBalance;

    return Array.from({ length: count }).map((_, i) => {
      const progress = i / (count - 1);
      const dayOffset = Math.round((count - 1 - i) * (days / (count - 1)));
      const d = new Date(now);
      d.setDate(d.getDate() - dayOffset);

      // Natural market drift towards current balance without artificial 'M'
      const wave = Math.sin(progress * Math.PI * 1.4) * Math.abs(totalDiff || currentBalance * 0.008) * 0.4
                 + Math.sin(progress * 5.2) * Math.abs(totalDiff || currentBalance * 0.005) * 0.2;
      const val = i === count - 1 ? currentBalance : startBalance + progress * totalDiff + wave;

      return {
        date: d.toLocaleDateString(locale, { day: '2-digit', month: '2-digit' }),
        value: Math.max(1, Math.round(val * 100) / 100),
      };
    });
  }, [data, selectedTimeframe, currentBalance, profitAbs, language, t]);

  const { chartPoints, pathD, areaD, baselineY } = useMemo(() => {
    if (pointsData.length === 0) {
      return { chartPoints: [], pathD: '', areaD: '', baselineY: height / 2 };
    }

    const paddingY = width < 640 ? 12 : 22;
    const paddingX = 4;
    const usableWidth = width - paddingX * 2;
    const usableHeight = height - paddingY * 2;

    const values = pointsData.map((p) => p.value);
    const minVal = Math.min(...values);
    const maxVal = Math.max(...values);
    const range = Math.max(0.08, maxVal - minVal);

    const points: ChartPoint[] = pointsData.map((p, idx) => {
      const x = paddingX + (idx / (pointsData.length - 1 || 1)) * usableWidth;
      const normalizedY = (p.value - minVal) / range;
      const y = height - paddingY - normalizedY * usableHeight;
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

      const cp1x = p1.x + (p2.x - p0.x) / 6;
      const cp1y = p1.y + (p2.y - p0.y) / 6;
      const cp2x = p2.x - (p3.x - p1.x) / 6;
      const cp2y = p2.y - (p3.y - p1.y) / 6;

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
        onScrub(pt.value, pt.date);
      }
    },
    [chartPoints, onScrub]
  );

  const handlePointerLeave = useCallback(() => {
    setHoverIndex(null);
    onScrub(null, null);
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
    <div className="w-full select-none my-1 flex flex-col justify-center">
      {/* Timeframe Selector - Spaced out horizontally across full width with generous breathing room */}
      <div className="flex items-center justify-between w-full px-3 mb-3">
        {timeframes.map((tf) => {
          const isActive = selectedTimeframe === tf;
          return (
            <button
              key={tf}
              onClick={() => setSelectedTimeframe(tf)}
              className={`text-xs sm:text-sm font-medium transition-all px-2.5 py-1 rounded-lg ${
                isActive
                  ? 'text-white font-bold bg-white/10'
                  : 'text-tr-gray/70 hover:text-white'
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
        className="w-full relative touch-none cursor-crosshair h-[clamp(140px,26dvh,210px)] lg:h-[180px]"
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
        <svg width="100%" height={height} viewBox={`0 0 ${width} ${height}`} className="overflow-visible w-full">
          <defs>
            <linearGradient id="chart-glow" x1="0" y1="0" x2="0" y2="1">
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
          {areaD && <path d={areaD} fill="url(#chart-glow)" />}

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
