import React from 'react';
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
  const arrow = isPositive ? '▲' : '▼';
  const sign = isPositive ? '+' : '';
  const formattedProfitAbs = `${sign}${formatCurrency(profitAbs, currencySymbol)}`;
  const formattedProfitPct = formatPercent(Math.abs(profitPct));

  return (
    <div className="flex flex-col items-start pt-1 pb-1 select-none">
      {/* Subtitle / Label */}
      <div className="text-[11px] font-normal text-tr-gray tracking-normal mb-0.5">
        {isScrubbing && scrubbedDate ? scrubbedDate : t.hero.today}
      </div>

      {/* Hero Amount - Refined and sized cleanly */}
      <div className="font-sans tracking-tight">
        <span className="text-3xl sm:text-4xl font-semibold text-white">
          {formattedBalance}
        </span>
      </div>

      {/* Clean Performance line: ▲ +0,42 € (0,68%) */}
      <div className="mt-1 flex items-center space-x-1.5 text-xs sm:text-sm font-medium">
        <span className={isPositive ? 'text-tr-green' : 'text-tr-red'}>
          {arrow} {formattedProfitAbs} ({formattedProfitPct})
        </span>
      </div>
    </div>
  );
};
