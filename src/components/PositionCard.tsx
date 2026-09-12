import React from 'react';
import { ShieldCheck, ChevronRight, TrendingUp, TrendingDown } from 'lucide-react';
import { FreqtradeTrade } from '../types/freqtrade';
import { useLanguage } from '../i18n/LanguageContext';

interface PositionCardProps {
  trade: FreqtradeTrade;
  onSelect: (trade: FreqtradeTrade) => void;
}

export const PositionCard: React.FC<PositionCardProps> = ({ trade, onSelect }) => {
  const { t, formatCurrency, formatPercent } = useLanguage();

  const pairParts = trade.pair.split('/');
  const baseCurrency = trade.base_currency || pairParts[0] || 'CRYPTO';

  const currentRate = trade.current_rate ?? trade.open_rate;
  const positionValue = trade.amount * currentRate;
  const isProfit = trade.profit_abs >= 0;
  const sign = isProfit ? '+' : '';

  const fmtValue = formatCurrency(positionValue);
  const fmtOpenRate = formatCurrency(trade.open_rate);
  const fmtCurrentRate = formatCurrency(currentRate);
  const fmtProfitAbs = `${sign}${formatCurrency(trade.profit_abs)}`;
  const fmtProfitPct = `${sign}${formatPercent(trade.profit_pct)}`;
  const fmtStopLoss = formatCurrency(trade.stop_loss_abs);

  return (
    <div
      onClick={() => onSelect(trade)}
      className="tr-card p-4 cursor-pointer relative group hover:border-white/15 transition-all"
    >
      {/* Main row: Coin icon, pair, amount, value, and PnL */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          {/* Monochrome Minimalist Coin Badge */}
          <div className="w-10 h-10 rounded-full bg-white/[0.06] border border-white/10 flex items-center justify-center font-bold text-xs text-white">
            {baseCurrency.slice(0, 4)}
          </div>

          <div>
            <div className="flex items-center space-x-2">
              <span className="text-base font-bold text-white tracking-tight">{trade.pair}</span>
              {trade.strategy && (
                <span className="text-[10px] text-tr-gray bg-white/[0.04] px-1.5 py-0.5 rounded font-mono truncate max-w-[130px]">
                  {trade.strategy}
                </span>
              )}
            </div>
            <div className="text-xs text-tr-gray font-mono mt-0.5">
              {trade.amount.toFixed(trade.amount < 1 ? 5 : 2)} {baseCurrency}
            </div>
          </div>
        </div>

        {/* Value and PnL */}
        <div className="text-right">
          <div className="text-base font-bold text-white tracking-tight">{fmtValue}</div>
          <div
            className={`inline-flex items-center space-x-1 text-xs font-semibold mt-0.5 ${
              isProfit ? 'text-tr-green' : 'text-tr-red'
            }`}
          >
            {isProfit ? (
              <TrendingUp className="w-3 h-3 stroke-[2.5]" />
            ) : (
              <TrendingDown className="w-3 h-3 stroke-[2.5]" />
            )}
            <span>{fmtProfitAbs}</span>
            <span className="opacity-80">({fmtProfitPct})</span>
          </div>
        </div>
      </div>

      {/* Subtle Divider */}
      <div className="my-3 border-t border-white/[0.05]" />

      {/* Sub-row: Rates & Stop Loss */}
      <div className="flex items-center justify-between text-xs text-tr-gray">
        <div className="flex items-center space-x-2">
          <span>{t.positions.buyPrice}: <span className="text-white/80 font-mono">{fmtOpenRate}</span></span>
          <span className="text-white/20">|</span>
          <span>{t.positions.currentPrice}: <span className="text-white font-mono">{fmtCurrentRate}</span></span>
        </div>

        <div className="flex items-center space-x-2">
          <div className="flex items-center space-x-1 text-[11px] text-white/70 bg-white/[0.04] px-2 py-0.5 rounded-full border border-white/[0.06]">
            <ShieldCheck className="w-3 h-3 text-emerald-400" />
            <span>SL: <strong className="font-semibold text-white/90">{fmtStopLoss}</strong></span>
          </div>
          <ChevronRight className="w-4 h-4 text-tr-gray group-hover:text-white transition-colors" />
        </div>
      </div>
    </div>
  );
};
