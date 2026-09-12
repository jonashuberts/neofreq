import React from 'react';
import { ChevronRight } from 'lucide-react';
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
  const fmtStopLoss = formatCurrency(trade.stop_loss_abs);

  return (
    <div
      onClick={() => onSelect(trade)}
      className="py-3.5 px-3 rounded-2xl hover:bg-white/[0.03] active:bg-white/[0.06] cursor-pointer transition-colors border border-transparent hover:border-white/[0.06]"
    >
      <div className="flex items-center justify-between">
        {/* Left: Icon + Pair + Amount */}
        <div className="flex items-center space-x-3 min-w-0 flex-1 pr-2">
          {/* Trade Republic style square rounded icon */}
          <div className="w-10 h-10 rounded-xl bg-white/[0.06] border border-white/10 flex items-center justify-center font-bold text-xs text-white shrink-0">
            {baseCurrency.slice(0, 4)}
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex items-center space-x-1.5 truncate">
              <span className="text-base font-semibold text-white tracking-tight truncate">
                {trade.pair}
              </span>
            </div>
            <div className="text-xs text-tr-gray font-mono truncate">
              {trade.amount.toFixed(trade.amount < 1 ? 5 : 2)} {baseCurrency}
              {trade.strategy && <span className="opacity-60"> · {trade.strategy}</span>}
            </div>
          </div>
        </div>

        {/* Right: Valuation + Percentage Change in Trade Republic Style */}
        <div className="text-right shrink-0">
          <div className="text-base font-semibold text-white tracking-tight">{fmtValue}</div>
          <div
            className={`text-xs font-semibold tracking-tight ${
              isProfit ? 'text-tr-green' : 'text-tr-red'
            }`}
          >
            {fmtProfitPct}
          </div>
        </div>

        <ChevronRight className="w-4 h-4 text-white/20 ml-2 shrink-0 hidden sm:block" />
      </div>

      {/* Stop Loss & Entry line (subtle, clean, never wraps awkwardly) */}
      <div className="flex items-center justify-between text-[11px] text-tr-gray/70 pt-1 pl-[52px]">
        <span>SL: {fmtStopLoss}</span>
        <span>@ {formatCurrency(trade.open_rate)}</span>
      </div>
    </div>
  );
};
