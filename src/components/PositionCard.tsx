import React from 'react';
import { ShieldCheck, ChevronRight, TrendingUp, TrendingDown } from 'lucide-react';
import { FreqtradeTrade } from '../types/freqtrade';

interface PositionCardProps {
  trade: FreqtradeTrade;
  onSelect: (trade: FreqtradeTrade) => void;
}

export const PositionCard: React.FC<PositionCardProps> = ({ trade, onSelect }) => {
  // Determine coin icon / symbol
  const pairParts = trade.pair.split('/');
  const baseCurrency = trade.base_currency || pairParts[0] || 'CRYPTO';

  const currentRate = trade.current_rate ?? trade.open_rate;
  // Calculate position value in EUR
  const positionValue = trade.amount * currentRate;
  const isProfit = trade.profit_abs >= 0;
  const sign = isProfit ? '+' : '';

  // Format numbers
  const fmtValue = new Intl.NumberFormat('de-DE', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(positionValue);

  const fmtOpenRate = new Intl.NumberFormat('de-DE', {
    minimumFractionDigits: 2,
    maximumFractionDigits: trade.open_rate < 1 ? 4 : 2,
  }).format(trade.open_rate);

  const fmtCurrentRate = new Intl.NumberFormat('de-DE', {
    minimumFractionDigits: 2,
    maximumFractionDigits: currentRate < 1 ? 4 : 2,
  }).format(currentRate);

  const fmtProfitAbs = `${sign}${new Intl.NumberFormat('de-DE', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(trade.profit_abs)} €`;

  const fmtProfitPct = `${sign}${new Intl.NumberFormat('de-DE', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(trade.profit_pct)} %`;

  const fmtStopLoss = new Intl.NumberFormat('de-DE', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(trade.stop_loss_abs);

  // Coin color accent
  const coinColors: Record<string, { bg: string, text: string }> = {
    ETH: { bg: 'bg-blue-500/20 text-blue-400 border-blue-500/30', text: 'ETH' },
    BTC: { bg: 'bg-orange-500/20 text-orange-400 border-orange-500/30', text: 'BTC' },
    SOL: { bg: 'bg-purple-500/20 text-purple-400 border-purple-500/30', text: 'SOL' },
    ADA: { bg: 'bg-indigo-500/20 text-indigo-400 border-indigo-500/30', text: 'ADA' },
    XRP: { bg: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30', text: 'XRP' },
  };

  const badgeStyle = coinColors[baseCurrency] || {
    bg: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
    text: baseCurrency
  };

  return (
    <div
      onClick={() => onSelect(trade)}
      className="tr-card p-4 sm:p-5 cursor-pointer relative group overflow-hidden"
    >
      {/* Top row: Coin Icon, Pair & Total Position Value */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-3">
          {/* Coin Badge */}
          <div className={`w-10 h-10 rounded-2xl flex items-center justify-center font-bold text-sm border ${badgeStyle.bg}`}>
            {badgeStyle.text.slice(0, 3)}
          </div>

          <div>
            <div className="flex items-center space-x-1.5">
              <span className="text-base font-bold text-white tracking-tight">{trade.pair}</span>
              {trade.strategy && (
                <span className="text-[10px] text-tr-gray bg-white/[0.06] px-1.5 py-0.5 rounded font-mono truncate max-w-[120px]">
                  {trade.strategy}
                </span>
              )}
            </div>
            <div className="text-xs text-tr-gray font-mono mt-0.5">
              {trade.amount.toFixed(trade.amount < 1 ? 5 : 2)} {baseCurrency}
            </div>
          </div>
        </div>

        {/* Value and PnL Pill */}
        <div className="text-right">
          <div className="text-base font-bold text-white tracking-tight">
            {fmtValue} €
          </div>
          <div className={`inline-flex items-center space-x-1 text-xs font-semibold px-2 py-0.5 rounded-md mt-0.5 ${
            isProfit
              ? 'text-tr-green bg-tr-green/10'
              : 'text-tr-red bg-tr-red/10'
          }`}>
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

      {/* Middle row: Rates Comparison */}
      <div className="grid grid-cols-2 gap-2 py-2.5 px-3 rounded-xl bg-white/[0.02] border border-white/[0.04] text-xs mb-3">
        <div>
          <span className="text-tr-gray text-[11px] block">Kaufkurs</span>
          <span className="text-white/90 font-medium font-mono">{fmtOpenRate} €</span>
        </div>
        <div className="text-right">
          <span className="text-tr-gray text-[11px] block">Aktueller Kurs</span>
          <span className="text-white font-semibold font-mono">{fmtCurrentRate} €</span>
        </div>
      </div>

      {/* Bottom row: Stop-Loss Shield Badge & chevron */}
      <div className="flex items-center justify-between pt-1 text-xs">
        <div className="inline-flex items-center space-x-1.5 text-[11px] text-emerald-400/90 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-full">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>Stop-Loss geschützt bei <strong className="font-semibold">{fmtStopLoss} €</strong></span>
        </div>

        <ChevronRight className="w-4 h-4 text-tr-gray group-hover:text-white transition-colors" />
      </div>
    </div>
  );
};
