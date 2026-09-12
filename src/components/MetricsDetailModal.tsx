import React from 'react';
import { X, Target, Award, BarChart3, AlertOctagon, TrendingUp, Coins, Clock } from 'lucide-react';
import { FreqtradeProfit } from '../types/freqtrade';
import { useLanguage } from '../i18n/LanguageContext';

interface MetricsDetailModalProps {
  isOpen: boolean;
  profit: FreqtradeProfit | null;
  onClose: () => void;
}

export const MetricsDetailModal: React.FC<MetricsDetailModalProps> = ({
  isOpen,
  profit,
  onClose,
}) => {
  const { t, formatPercent, formatCurrency, formatDate } = useLanguage();

  if (!isOpen || !profit) return null;

  const winratePct = formatPercent(profit.winrate * 100);
  const profitFactor = profit.profit_factor ? profit.profit_factor.toFixed(2) : '—';
  const drawdownPct = profit.max_drawdown ? formatPercent(profit.max_drawdown * 100) : '0.0%';
  const volumeStr = profit.trading_volume ? formatCurrency(profit.trading_volume) : '—';
  const bestPairStr = profit.best_pair ? profit.best_pair.replace('/EUR', '').replace('/USDT', '') : '—';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm transition-opacity animate-in fade-in duration-150">
      <div className="absolute inset-0" onClick={onClose} />

      <div className="relative w-full max-w-md bg-[#0D0E12] border border-white/10 rounded-2xl p-5 shadow-2xl z-10 max-h-[90vh] overflow-y-auto no-scrollbar">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
          <div>
            <span className="text-[11px] text-tr-gray font-medium">Freqtrade Bot</span>
            <h3 className="text-base sm:text-lg font-medium text-white">{t.metrics.metricsDetails}</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full bg-white/[0.06] hover:bg-white/10 text-white/70 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* 6 Grid Metrics */}
        <div className="grid grid-cols-2 gap-2.5 py-4 border-b border-white/[0.08]">
          {/* Winrate */}
          <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.04]">
            <div className="flex items-center space-x-1.5 text-tr-gray text-[11px] mb-1">
              <Target className="w-3 h-3 text-tr-gray" />
              <span>{t.metrics.winrate}</span>
            </div>
            <div className="text-base font-medium text-white font-mono">{winratePct}</div>
            <div className="text-[10px] text-tr-gray mt-0.5">
              {profit.winning_trades} W / {profit.losing_trades} L
            </div>
          </div>

          {/* Profit Factor */}
          <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.04]">
            <div className="flex items-center space-x-1.5 text-tr-gray text-[11px] mb-1">
              <Award className="w-3 h-3 text-tr-gray" />
              <span>{t.metrics.profitFactor}</span>
            </div>
            <div className="text-base font-medium text-white font-mono">{profitFactor}</div>
            <div className="text-[10px] text-tr-gray mt-0.5">{t.metrics.winLossRatio}</div>
          </div>

          {/* Trading Volume */}
          <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.04]">
            <div className="flex items-center space-x-1.5 text-tr-gray text-[11px] mb-1">
              <Coins className="w-3 h-3 text-tr-gray" />
              <span>{t.metrics.tradingVolume}</span>
            </div>
            <div className="text-base font-medium text-white font-mono">{volumeStr}</div>
            <div className="text-[10px] text-tr-gray mt-0.5">{t.hero.allTime}</div>
          </div>

          {/* Total Trades */}
          <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.04]">
            <div className="flex items-center space-x-1.5 text-tr-gray text-[11px] mb-1">
              <BarChart3 className="w-3 h-3 text-tr-gray" />
              <span>{t.metrics.totalTrades}</span>
            </div>
            <div className="text-base font-medium text-white font-mono">{profit.trade_count}</div>
            <div className="text-[10px] text-tr-gray mt-0.5">
              {profit.closed_trade_count} {t.metrics.closed}
            </div>
          </div>

          {/* Best Pair */}
          <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.04]">
            <div className="flex items-center space-x-1.5 text-tr-gray text-[11px] mb-1">
              <TrendingUp className="w-3 h-3 text-tr-gray" />
              <span>{t.metrics.bestPair}</span>
            </div>
            <div className="text-base font-medium text-white font-mono">{bestPairStr}</div>
            <div className="text-[10px] text-tr-gray mt-0.5">{profit.best_pair || '—'}</div>
          </div>

          {/* Max Drawdown */}
          <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.04]">
            <div className="flex items-center space-x-1.5 text-tr-gray text-[11px] mb-1">
              <AlertOctagon className="w-3 h-3 text-tr-gray" />
              <span>{t.metrics.maxDrawdown}</span>
            </div>
            <div className="text-base font-medium text-white font-mono">{drawdownPct}</div>
            <div className="text-[10px] text-tr-gray mt-0.5">{t.metrics.maxDecline}</div>
          </div>
        </div>

        {/* Additional Bot Metadata */}
        <div className="pt-3.5 space-y-2 text-xs text-tr-gray">
          {profit.bot_start_date && (
            <div className="flex items-center justify-between">
              <span className="flex items-center space-x-1.5">
                <Clock className="w-3.5 h-3.5" />
                <span>Active Since</span>
              </span>
              <span className="text-white font-mono">{formatDate(profit.bot_start_date)}</span>
            </div>
          )}

          <div className="flex items-center justify-between">
            <span>Net Realized Profit</span>
            <span className="text-white font-mono font-medium">
              {formatCurrency(profit.profit_closed_fiat)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
