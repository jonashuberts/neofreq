import React from 'react';
import { TrendingUp, TrendingDown, Clock } from 'lucide-react';

interface HeroBalanceProps {
  currentBalance: number;
  currencySymbol?: string;
  profitAbs: number;
  profitPct: number;
  scrubbedValue: number | null;
  scrubbedDate: string | null;
}

export const HeroBalance: React.FC<HeroBalanceProps> = ({
  currentBalance,
  currencySymbol = '€',
  profitAbs,
  profitPct,
  scrubbedValue,
  scrubbedDate,
}) => {
  const isScrubbing = scrubbedValue !== null;
  const displayValue = isScrubbing ? scrubbedValue : currentBalance;

  // Format balance e.g. "61,34 €"
  const formattedBalance = new Intl.NumberFormat('de-DE', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(displayValue);

  // Format profit e.g. "+0,42 €" or "-0,26 €"
  const isPositive = profitAbs >= 0;
  const sign = isPositive ? '+' : '';
  const formattedProfitAbs = `${sign}${new Intl.NumberFormat('de-DE', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(profitAbs)} ${currencySymbol}`;

  const formattedProfitPct = `${sign}${new Intl.NumberFormat('de-DE', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(profitPct)} %`;

  return (
    <div className="flex flex-col items-start px-4 sm:px-6 pt-6 pb-2 select-none">
      {/* Label */}
      <div className="flex items-center space-x-2 text-xs font-medium text-tr-gray tracking-wide mb-1">
        <span>GESAMTWERT</span>
        {isScrubbing && scrubbedDate && (
          <span className="inline-flex items-center space-x-1 text-[11px] text-white/70 bg-white/10 px-2 py-0.5 rounded-full backdrop-blur-sm">
            <Clock className="w-3 h-3 text-white/60" />
            <span>{scrubbedDate}</span>
          </span>
        )}
      </div>

      {/* Hero Large Amount */}
      <div className="flex items-baseline space-x-1.5 font-sans tracking-tight">
        <span className="text-4xl sm:text-5xl font-extrabold text-white">
          {formattedBalance}
        </span>
        <span className="text-2xl sm:text-3xl font-semibold text-white/80">
          {currencySymbol}
        </span>
      </div>

      {/* Performance Pill Badge */}
      <div className="mt-3">
        <div
          className={`inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-semibold tracking-wide backdrop-blur-md transition-colors ${
            isPositive
              ? 'bg-tr-green/15 text-tr-green border border-tr-green/30 shadow-[0_0_15px_-3px_rgba(0,200,5,0.25)]'
              : 'bg-tr-red/15 text-tr-red border border-tr-red/30 shadow-[0_0_15px_-3px_rgba(255,59,48,0.25)]'
          }`}
        >
          {isPositive ? (
            <TrendingUp className="w-3.5 h-3.5 stroke-[2.5]" />
          ) : (
            <TrendingDown className="w-3.5 h-3.5 stroke-[2.5]" />
          )}
          <span>{formattedProfitAbs}</span>
          <span className="opacity-80">({formattedProfitPct})</span>
          <span className="text-[10px] uppercase font-bold opacity-75 ml-0.5">Heute</span>
        </div>
      </div>
    </div>
  );
};
