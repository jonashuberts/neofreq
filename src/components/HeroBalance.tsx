import React from 'react';
import { TrendingUp, TrendingDown, Clock } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';

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
  const { t, formatCurrency, formatPercent } = useLanguage();

  const isScrubbing = scrubbedValue !== null;
  const displayValue = isScrubbing ? scrubbedValue : currentBalance;

  const formattedBalance = formatCurrency(displayValue, currencySymbol);

  const isPositive = profitAbs >= 0;
  const sign = isPositive ? '+' : '';
  const formattedProfitAbs = `${sign}${formatCurrency(profitAbs, currencySymbol)}`;
  const formattedProfitPct = `${sign}${formatPercent(profitPct)}`;

  return (
    <div className="flex flex-col items-start pt-2 pb-2 select-none">
      {/* Label */}
      <div className="flex items-center space-x-2 text-[11px] font-semibold text-tr-gray uppercase tracking-wider mb-1">
        <span>{t.hero.totalValue}</span>
        {isScrubbing && scrubbedDate && (
          <span className="inline-flex items-center space-x-1 text-[11px] text-white/80 bg-white/10 px-2 py-0.5 rounded-full">
            <Clock className="w-3 h-3 text-white/60" />
            <span>{scrubbedDate}</span>
          </span>
        )}
      </div>

      {/* Hero Large Amount */}
      <div className="font-sans tracking-tight">
        <span className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white">
          {formattedBalance}
        </span>
      </div>

      {/* Performance Pill Badge */}
      <div className="mt-3">
        <div
          className={`inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-semibold tracking-wide transition-colors ${
            isPositive
              ? 'bg-tr-green/15 text-tr-green border border-tr-green/30'
              : 'bg-tr-red/15 text-tr-red border border-tr-red/30'
          }`}
        >
          {isPositive ? (
            <TrendingUp className="w-3.5 h-3.5 stroke-[2.5]" />
          ) : (
            <TrendingDown className="w-3.5 h-3.5 stroke-[2.5]" />
          )}
          <span>{formattedProfitAbs}</span>
          <span className="opacity-80">({formattedProfitPct})</span>
          <span className="text-[10px] uppercase font-bold opacity-75 ml-0.5">{t.hero.today}</span>
        </div>
      </div>
    </div>
  );
};
