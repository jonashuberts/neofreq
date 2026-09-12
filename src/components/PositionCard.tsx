import React from 'react';
import { FreqtradeTrade } from '../types/freqtrade';
import { useLanguage } from '../i18n/LanguageContext';

interface PositionCardProps {
  trade: FreqtradeTrade;
  onSelect: (trade: FreqtradeTrade) => void;
}

export const PositionCard: React.FC<PositionCardProps> = ({ trade, onSelect }) => {
  const { formatCurrency, formatPercent } = useLanguage();

  const pairParts = trade.pair.split('/');
  const baseCurrency = trade.base_currency || pairParts[0] || 'CRYPTO';

  const currentRate = trade.current_rate ?? trade.open_rate;
  const positionValue = trade.amount * currentRate;
  const isProfit = trade.profit_abs >= 0;
  const arrow = isProfit ? '▲' : '▼';
  const sign = isProfit ? '+' : '';

  const fmtValue = formatCurrency(positionValue);
  const fmtProfitPct = `${arrow} ${sign}${formatPercent(Math.abs(trade.profit_pct))}`;

  return (
    <div
      onClick={() => onSelect(trade)}
      className="p-2.5 rounded-xl hover:bg-white/[0.03] active:bg-white/[0.06] cursor-pointer transition-colors"
    >
      <div className="flex items-center justify-between">
        {/* Left: Icon Badge + Coin Name + Quantity */}
        <div className="flex items-center space-x-3 min-w-0 flex-1 pr-2">
          <div className="w-8 h-8 rounded-xl bg-white/[0.04] border border-white/[0.08] flex items-center justify-center font-medium text-xs text-white shrink-0 tracking-tight">
            {baseCurrency.slice(0, 4)}
          </div>

          <div className="min-w-0 flex-1">
            <div className="text-xs sm:text-sm font-medium text-white tracking-tight truncate">
              {baseCurrency}
            </div>
            <div className="text-[11px] text-tr-gray font-mono truncate mt-0.5">
              {trade.amount.toFixed(trade.amount < 1 ? 5 : 2)} {baseCurrency}
            </div>
          </div>
        </div>

        {/* Right: Valuation + Percentage */}
        <div className="text-right shrink-0">
          <div className="text-xs sm:text-sm font-medium font-mono text-white tracking-tight">
            {fmtValue}
          </div>
          <div
            className={`text-[11px] sm:text-xs font-medium font-mono mt-0.5 ${
              isProfit ? 'text-tr-green' : 'text-tr-red'
            }`}
          >
            {fmtProfitPct}
          </div>
        </div>
      </div>
    </div>
  );
};
