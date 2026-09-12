import React, { useState } from 'react';
import { ChevronRight } from 'lucide-react';
import { FreqtradeProfit } from '../types/freqtrade';
import { useLanguage } from '../i18n/LanguageContext';
import { MetricsDetailModal } from './MetricsDetailModal';

interface MetricsGridProps {
  profit: FreqtradeProfit | null;
}

export const MetricsGrid: React.FC<MetricsGridProps> = ({ profit }) => {
  const { t, formatPercent, formatCurrency } = useLanguage();
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  if (!profit) return null;

  const winratePct = formatPercent(profit.winrate * 100);
  const profitFactor = profit.profit_factor ? profit.profit_factor.toFixed(2) : '—';
  const drawdownPct = profit.max_drawdown ? formatPercent(profit.max_drawdown * 100) : '0.0%';
  const volumeStr = profit.trading_volume ? formatCurrency(profit.trading_volume) : '—';
  const bestPairStr = profit.best_pair ? profit.best_pair.replace('/EUR', '').replace('/USDT', '') : '—';

  return (
    <div>
      {/* Section Header: White & Normal Case */}
      <div className="flex items-center justify-between px-0.5 mb-2">
        <h3 className="text-xs sm:text-sm font-medium text-white">
          {t.metrics.title}
        </h3>

        <button
          onClick={() => setIsDetailOpen(true)}
          className="text-[11px] text-tr-gray hover:text-white flex items-center space-x-0.5 transition-colors"
        >
          <span>{t.metrics.viewAllMetrics}</span>
          <ChevronRight className="w-3 h-3" />
        </button>
      </div>

      {/* Mobile Compact View (Vital 2 metrics, opens detail sheet) */}
      <div
        onClick={() => setIsDetailOpen(true)}
        className="sm:hidden tr-card p-3.5 cursor-pointer active:bg-white/[0.04] hover:border-white/10 transition-all"
      >
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col">
            <span className="text-[11px] text-tr-gray font-normal">{t.metrics.winrate}</span>
            <span className="text-base font-medium text-white font-mono mt-0.5">{winratePct}</span>
            <span className="text-[10px] text-tr-gray/70 mt-0.5">
              {profit.winning_trades} W / {profit.losing_trades} L
            </span>
          </div>

          <div className="flex flex-col">
            <span className="text-[11px] text-tr-gray font-normal">{t.metrics.profitFactor}</span>
            <span className="text-base font-medium text-white font-mono mt-0.5">{profitFactor}</span>
            <span className="text-[10px] text-tr-gray/70 mt-0.5">{t.metrics.winLossRatio}</span>
          </div>
        </div>
      </div>

      {/* Desktop View (Full 6 metrics neatly inside one unified master card) */}
      <div className="hidden sm:block tr-card p-4">
        <div className="grid grid-cols-3 gap-x-6 gap-y-4">
          {/* Winrate */}
          <div className="flex flex-col">
            <span className="text-[11px] text-tr-gray font-normal">{t.metrics.winrate}</span>
            <span className="text-base font-medium text-white font-mono mt-0.5">{winratePct}</span>
            <span className="text-[10px] text-tr-gray/70 mt-0.5">
              {profit.winning_trades} W / {profit.losing_trades} L
            </span>
          </div>

          {/* Profit Factor */}
          <div className="flex flex-col">
            <span className="text-[11px] text-tr-gray font-normal">{t.metrics.profitFactor}</span>
            <span className="text-base font-medium text-white font-mono mt-0.5">{profitFactor}</span>
            <span className="text-[10px] text-tr-gray/70 mt-0.5">{t.metrics.winLossRatio}</span>
          </div>

          {/* Trading Volume */}
          <div className="flex flex-col">
            <span className="text-[11px] text-tr-gray font-normal">{t.metrics.tradingVolume}</span>
            <span className="text-base font-medium text-white font-mono mt-0.5">{volumeStr}</span>
            <span className="text-[10px] text-tr-gray/70 mt-0.5">{t.hero.allTime}</span>
          </div>

          {/* Total Trades */}
          <div className="flex flex-col border-t border-white/[0.04] pt-3">
            <span className="text-[11px] text-tr-gray font-normal">{t.metrics.totalTrades}</span>
            <span className="text-base font-medium text-white font-mono mt-0.5">{profit.trade_count}</span>
            <span className="text-[10px] text-tr-gray/70 mt-0.5">
              {profit.closed_trade_count} {t.metrics.closed}
            </span>
          </div>

          {/* Best Pair */}
          <div className="flex flex-col border-t border-white/[0.04] pt-3">
            <span className="text-[11px] text-tr-gray font-normal">{t.metrics.bestPair}</span>
            <span className="text-base font-medium text-white font-mono mt-0.5">{bestPairStr}</span>
            <span className="text-[10px] text-tr-gray/70 mt-0.5">{profit.best_pair || '—'}</span>
          </div>

          {/* Max Drawdown */}
          <div className="flex flex-col border-t border-white/[0.04] pt-3">
            <span className="text-[11px] text-tr-gray font-normal">{t.metrics.maxDrawdown}</span>
            <span className="text-base font-medium text-white font-mono mt-0.5">{drawdownPct}</span>
            <span className="text-[10px] text-tr-gray/70 mt-0.5">{t.metrics.maxDecline}</span>
          </div>
        </div>
      </div>

      {/* Detail Modal */}
      <MetricsDetailModal
        isOpen={isDetailOpen}
        profit={profit}
        onClose={() => setIsDetailOpen(false)}
      />
    </div>
  );
};
