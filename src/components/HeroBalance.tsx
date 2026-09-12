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
    <div className="flex flex-col items-start pt-1 pb-2 select-none">
      {/* Subtitle / Label */}
      <div className="text-xs font-medium text-tr-gray tracking-normal mb-1 flex items-center space-x-2">
        <span>{isScrubbing && scrubbedDate ? scrubbedDate : t.hero.today}</span>
      </div>

      {/* Hero Large Amount (Trade Republic style) */}
      <div className="font-sans tracking-tight">
        <span className="text-4xl sm:text-5xl lg:text-[56px] font-bold text-white leading-tight">
          {formattedBalance}
        </span>
      </div>

      {/* Performance line in Trade Republic style: ▲ 90,25 € (1,73%) */}
      <div className="mt-1.5 flex items-center space-x-2">
        <span
          className={`text-sm sm:text-base font-semibold tracking-tight ${
            isPositive ? 'text-tr-green' : 'text-tr-red'
          }`}
        >
          {arrow} {formattedProfitAbs} ({formattedProfitPct})
        </span>
      </div>
    </div>
  );
};
