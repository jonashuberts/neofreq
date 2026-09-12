import React, { useState } from 'react';
import { Target, Award, BarChart3, AlertOctagon, TrendingUp, Coins, ChevronRight } from 'lucide-react';
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
    <div className="mt-1">
      {/* Section Header: White & Normal Case */}
      <div className="flex items-center justify-between px-1 mb-2">
        <div className="text-xs sm:text-sm font-medium text-white">
          {t.metrics.title}
        </div>

        {/* Mobile quick link to open all metrics */}
        <button
          onClick={() => setIsDetailOpen(true)}
          className="sm:hidden text-[11px] text-tr-gray hover:text-white flex items-center space-x-0.5 transition-colors"
        >
          <span>{t.metrics.viewAllMetrics}</span>
          <ChevronRight className="w-3 h-3" />
        </button>
      </div>

      {/* Mobile Compact View (Only most vital 2 metrics, fits viewport without scrolling) */}
      <div
        onClick={() => setIsDetailOpen(true)}
        className="sm:hidden grid grid-cols-2 gap-2 p-2.5 rounded-xl bg-white/[0.02] border border-white/[0.04] cursor-pointer active:bg-white/[0.04] transition-colors"
      >
        <div className="flex flex-col">
          <span className="text-[11px] text-tr-gray flex items-center space-x-1">
            <Target className="w-3 h-3" />
            <span>{t.metrics.winrate}</span>
          </span>
          <span className="text-sm font-medium text-white font-mono mt-0.5">{winratePct}</span>
          <span className="text-[10px] text-tr-gray/70">{profit.winning_trades} W / {profit.losing_trades} L</span>
        </div>

        <div className="flex flex-col">
          <span className="text-[11px] text-tr-gray flex items-center space-x-1">
            <Award className="w-3 h-3" />
            <span>{t.metrics.profitFactor}</span>
          </span>
          <span className="text-sm font-medium text-white font-mono mt-0.5">{profitFactor}</span>
          <span className="text-[10px] text-tr-gray/70">{t.metrics.winLossRatio}</span>
        </div>
      </div>

      {/* Desktop Grid View (Full 6 metrics on PC/MacBook) */}
      <div className="hidden sm:grid sm:grid-cols-3 gap-2">
        {/* Winrate */}
        <div className="tr-card p-3">
          <div className="flex items-center space-x-1.5 text-tr-gray text-[11px] mb-1">
            <Target className="w-3 h-3 text-tr-gray" />
            <span>{t.metrics.winrate}</span>
          </div>
          <div className="text-sm sm:text-[15px] font-medium text-white font-mono">{winratePct}</div>
          <div className="text-[10px] text-tr-gray mt-0.5">
            {profit.winning_trades} W / {profit.losing_trades} L
          </div>
        </div>

        {/* Profit Factor */}
        <div className="tr-card p-3">
          <div className="flex items-center space-x-1.5 text-tr-gray text-[11px] mb-1">
            <Award className="w-3 h-3 text-tr-gray" />
            <span>{t.metrics.profitFactor}</span>
          </div>
          <div className="text-sm sm:text-[15px] font-medium text-white font-mono">{profitFactor}</div>
          <div className="text-[10px] text-tr-gray mt-0.5">{t.metrics.winLossRatio}</div>
        </div>

        {/* Trading Volume */}
        <div className="tr-card p-3">
          <div className="flex items-center space-x-1.5 text-tr-gray text-[11px] mb-1">
            <Coins className="w-3 h-3 text-tr-gray" />
            <span>{t.metrics.tradingVolume}</span>
          </div>
          <div className="text-sm sm:text-[15px] font-medium text-white font-mono">{volumeStr}</div>
          <div className="text-[10px] text-tr-gray mt-0.5">{t.hero.allTime}</div>
        </div>

        {/* Total Trades */}
        <div className="tr-card p-3">
          <div className="flex items-center space-x-1.5 text-tr-gray text-[11px] mb-1">
            <BarChart3 className="w-3 h-3 text-tr-gray" />
            <span>{t.metrics.totalTrades}</span>
          </div>
          <div className="text-sm sm:text-[15px] font-medium text-white font-mono">{profit.trade_count}</div>
          <div className="text-[10px] text-tr-gray mt-0.5">
            {profit.closed_trade_count} {t.metrics.closed}
          </div>
        </div>

        {/* Best Pair */}
        <div className="tr-card p-3">
          <div className="flex items-center space-x-1.5 text-tr-gray text-[11px] mb-1">
            <TrendingUp className="w-3 h-3 text-tr-gray" />
            <span>{t.metrics.bestPair}</span>
          </div>
          <div className="text-sm sm:text-[15px] font-medium text-white font-mono">{bestPairStr}</div>
          <div className="text-[10px] text-tr-gray mt-0.5">{profit.best_pair || '—'}</div>
        </div>

        {/* Max Drawdown */}
        <div className="tr-card p-3">
          <div className="flex items-center space-x-1.5 text-tr-gray text-[11px] mb-1">
            <AlertOctagon className="w-3 h-3 text-tr-gray" />
            <span>{t.metrics.maxDrawdown}</span>
          </div>
          <div className="text-sm sm:text-[15px] font-medium text-white font-mono">{drawdownPct}</div>
          <div className="text-[10px] text-tr-gray mt-0.5">{t.metrics.maxDecline}</div>
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
