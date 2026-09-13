import React from 'react';
import { useLanguage } from '../i18n/LanguageContext';

interface HeroBalanceProps {
  currentBalance: number;
  currencySymbol?: string;
  profitAbs: number;
  profitPct: number;
  scrubbedValue: number | null;
  scrubbedDate: string | null;
  timeframeLabel?: string;
  scrubbedProfitAbs?: number | null;
  scrubbedProfitPct?: number | null;
}

export const HeroBalance: React.FC<HeroBalanceProps> = ({
  currentBalance,
  currencySymbol = '€',
  profitAbs,
  profitPct,
  scrubbedValue,
  scrubbedDate,
  timeframeLabel,
  scrubbedProfitAbs,
  scrubbedProfitPct,
}) => {
  const { t, formatCurrency, formatPercent } = useLanguage();

  const isScrubbing = scrubbedValue !== null;
  const displayValue = isScrubbing ? scrubbedValue : currentBalance;

  const displayProfitAbs =
    isScrubbing && scrubbedProfitAbs !== null && scrubbedProfitAbs !== undefined
      ? scrubbedProfitAbs
      : profitAbs;

  const displayProfitPct =
    isScrubbing && scrubbedProfitPct !== null && scrubbedProfitPct !== undefined
      ? scrubbedProfitPct
      : profitPct;

  const displaySubtitle =
    isScrubbing && scrubbedDate
      ? scrubbedDate
      : (timeframeLabel || t.hero.today);

  const formattedBalance = formatCurrency(displayValue, currencySymbol);

  const isPositive = displayProfitAbs >= 0;
  const arrow = isPositive ? '▲' : '▼';
  const sign = isPositive ? '+' : '';
  const formattedProfitAbs = `${sign}${formatCurrency(displayProfitAbs, currencySymbol)}`;
  const formattedProfitPct = formatPercent(Math.abs(displayProfitPct));

  return (
    <div className="flex flex-col items-start pt-1 pb-1 select-none shrink-0">
      {/* Subtitle / Label */}
      <div className="text-xs font-normal text-tr-gray tracking-normal mb-0.5">
        {displaySubtitle}
      </div>

      {/* Hero Amount + Performance on the same line */}
      <div className="flex items-baseline space-x-2.5 sm:space-x-3 flex-wrap">
        <span className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
          {formattedBalance}
        </span>
        <span className={`text-xs sm:text-sm font-semibold font-mono ${isPositive ? 'text-tr-green' : 'text-tr-red'}`}>
          {arrow} {formattedProfitAbs} ({formattedProfitPct})
        </span>
      </div>
    </div>
  );
};
