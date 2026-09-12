import React, { useState, useRef, useMemo, useEffect, useCallback } from 'react';
import { FreqtradeDailyItem } from '../types/freqtrade';

export type Timeframe = '1D' | '1W' | '1M' | '1Y' | 'ALL';

interface SparklineChartProps {
  data: FreqtradeDailyItem[];
  currentBalance: number;
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
  onScrub,
}) => {
  const [selectedTimeframe, setSelectedTimeframe] = useState<Timeframe>('1M');
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState<number>(360);
  const height = 180;

  // Responsive resize observer
  useEffect(() => {
    if (!containerRef.current) return;
    const observer = new ResizeObserver((entries) => {
      if (entries[0]) {
        setWidth(entries[0].contentRect.width);
      }
    });
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  // Filter and process data according to timeframe
  const pointsData = useMemo(() => {
    // If daily data is sparse or empty, synthesize curve ending with current balance
    if (!data || data.length === 0) {
      const now = new Date();
      return Array.from({ length: 15 }).map((_, i) => {
        const d = new Date(now);
        d.setDate(d.getDate() - (14 - i));
        const variance = (Math.sin(i / 2) * 0.4) + (i * 0.05);
        return {
          date: d.toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit' }),
          value: Math.max(1, currentBalance - 0.8 + variance)
        };
      });
    }

    let sliceCount = data.length;
    if (selectedTimeframe === '1D') sliceCount = 2;
    else if (selectedTimeframe === '1W') sliceCount = 7;
    else if (selectedTimeframe === '1M') sliceCount = 30;
    else if (selectedTimeframe === '1Y') sliceCount = 365;

    const sliced = data.slice(-sliceCount);

    return sliced.map((item) => {
      // Calculate estimated portfolio value at that point
      const val = item.fiat_value > 0 ? item.fiat_value : (item.starting_balance + item.abs_profit);
      return {
        date: new Date(item.date).toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit' }),
        value: val > 0 ? val : currentBalance
      };
    });
  }, [data, selectedTimeframe, currentBalance]);

  // Determine if trend is positive or negative
  const firstVal = pointsData[0]?.value ?? currentBalance;
  const lastVal = pointsData[pointsData.length - 1]?.value ?? currentBalance;
  const isUp = lastVal >= firstVal;

  const strokeColor = isUp ? '#00C805' : '#FF3B30';
  const gradientId = isUp ? 'greenGradient' : 'redGradient';

  // Compute SVG coordinates
  const { chartPoints, pathD, areaD } = useMemo(() => {
    if (pointsData.length === 0) {
      return { chartPoints: [], pathD: '', areaD: '' };
    }

    const paddingY = 24;
    const paddingX = 4;
    const usableWidth = width - (paddingX * 2);
    const usableHeight = height - (paddingY * 2);

    const values = pointsData.map(p => p.value);
    const minVal = Math.min(...values);
    const maxVal = Math.max(...values);
    const range = (maxVal - minVal) === 0 ? 1 : (maxVal - minVal);

    const points: ChartPoint[] = pointsData.map((p, idx) => {
      const x = paddingX + (idx / (pointsData.length - 1 || 1)) * usableWidth;
      const normalizedY = (p.value - minVal) / range;
      // Invert Y because SVG 0 is at top
      const y = (height - paddingY) - (normalizedY * usableHeight);
      return {
        x,
        y,
        value: p.value,
        date: p.date
      };
    });

    // Build smooth Bezier path
    if (points.length < 2) {
      const p = points[0] || { x: 0, y: height / 2 };
      return {
        chartPoints: points,
        pathD: `M 0,${p.y} L ${width},${p.y}`,
        areaD: `M 0,${p.y} L ${width},${p.y} L ${width},${height} L 0,${height} Z`
      };
    }

    // Catmull-Rom to Cubic Bezier curve
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

    const lastPt = points[points.length - 1];
    const firstPt = points[0];
    const area = `${d} L ${lastPt.x.toFixed(2)},${height} L ${firstPt.x.toFixed(2)},${height} Z`;

    return { chartPoints: points, pathD: d, areaD: area };
  }, [pointsData, width, height]);

  // Touch & pointer scrubbing handler
  const handlePointerMove = useCallback((clientX: number) => {
    if (!containerRef.current || chartPoints.length === 0) return;
    const rect = containerRef.current.getBoundingClientRect();
    const relX = clientX - rect.left;

    // Find nearest point
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
  }, [chartPoints, onScrub]);

  const handlePointerLeave = useCallback(() => {
    setHoverIndex(null);
    onScrub(null, null);
  }, [onScrub]);

  const activePoint = hoverIndex !== null ? chartPoints[hoverIndex] : null;

  const timeframes: Timeframe[] = ['1D', '1W', '1M', '1Y', 'ALL'];

  return (
    <div className="w-full select-none mt-2 mb-4">
      {/* Chart Canvas Area */}
      <div
        ref={containerRef}
        className="w-full relative touch-none cursor-crosshair"
        style={{ height }}
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
        <svg
          width={width}
          height={height}
          className="overflow-visible w-full"
        >
          <defs>
            {/* Green Gradient */}
            <linearGradient id="greenGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#00C805" stopOpacity="0.22" />
              <stop offset="75%" stopColor="#00C805" stopOpacity="0.04" />
              <stop offset="100%" stopColor="#00C805" stopOpacity="0.0" />
            </linearGradient>

            {/* Red Gradient */}
            <linearGradient id="redGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#FF3B30" stopOpacity="0.22" />
              <stop offset="75%" stopColor="#FF3B30" stopOpacity="0.04" />
              <stop offset="100%" stopColor="#FF3B30" stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Area fill under curve */}
          {areaD && (
            <path
              d={areaD}
              fill={`url(#${gradientId})`}
              className="transition-opacity duration-300"
            />
          )}

          {/* Pure minimalist line curve */}
          {pathD && (
            <path
              d={pathD}
              fill="none"
              stroke={strokeColor}
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="transition-colors duration-300"
            />
          )}

          {/* Active scrubbing vertical cursor & glowing indicator */}
          {activePoint && (
            <g>
              {/* Vertical hairline */}
              <line
                x1={activePoint.x}
                y1={0}
                x2={activePoint.x}
                y2={height}
                stroke="rgba(255, 255, 255, 0.25)"
                strokeWidth="1"
                strokeDasharray="3 3"
              />
              {/* Outer glow ring */}
              <circle
                cx={activePoint.x}
                cy={activePoint.y}
                r="9"
                fill={strokeColor}
                fillOpacity="0.25"
              />
              {/* Inner crisp circle */}
              <circle
                cx={activePoint.x}
                cy={activePoint.y}
                r="4.5"
                fill="#FFFFFF"
                stroke={strokeColor}
                strokeWidth="2"
              />
            </g>
          )}
        </svg>
      </div>

      {/* Timeframe Selector Pills */}
      <div className="flex items-center justify-between px-6 mt-1">
        {timeframes.map((tf) => {
          const isActive = selectedTimeframe === tf;
          return (
            <button
              key={tf}
              onClick={() => setSelectedTimeframe(tf)}
              className={`text-xs font-semibold px-3 py-1 rounded-full transition-all duration-150 ${
                isActive
                  ? 'bg-white/10 text-white font-bold shadow-sm'
                  : 'text-tr-gray hover:text-white/80 active:scale-95'
              }`}
            >
              {tf}
            </button>
          );
        })}
      </div>
    </div>
  );
};
