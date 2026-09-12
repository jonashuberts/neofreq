import React from 'react';
import { X } from 'lucide-react';
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
  const isNetProfit = (profit.profit_closed_fiat || 0) >= 0;
  const netSign = isNetProfit ? '+' : '';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm transition-opacity animate-in fade-in duration-150">
      <div className="absolute inset-0" onClick={onClose} />

      <div className="relative w-full max-w-md bg-[#0D0E12] border border-white/10 rounded-2xl p-5 shadow-2xl z-10 max-h-[90vh] overflow-y-auto no-scrollbar">
        {/* Header: Unified Clean Layout */}
        <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
          <div>
            <span className="text-[11px] text-tr-gray font-normal block mb-0.5">Freqtrade Bot</span>
            <h3 className="text-base sm:text-lg font-medium text-white">{t.metrics.metricsDetails}</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full bg-white/[0.06] hover:bg-white/10 text-white/70 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Hero Performance Summary Card */}
        <div className="mt-3.5 p-4 rounded-2xl bg-gradient-to-b from-white/[0.06] to-white/[0.02] border border-white/10 flex items-center justify-between">
          <div>
            <div className="text-xs text-tr-gray font-normal">{t.metrics.realizedProfit}</div>
            <div className={`text-2xl font-bold font-mono mt-0.5 tracking-tight ${isNetProfit ? 'text-tr-green' : 'text-tr-red'}`}>
              {netSign}{formatCurrency(profit.profit_closed_fiat)}
            </div>
            <div className="text-xs text-tr-gray font-mono mt-0.5">
              {profit.closed_trade_count} {t.metrics.closed}
            </div>
          </div>

          <div className="text-right">
            <div className="text-xs text-tr-gray font-normal">{t.metrics.winrate}</div>
            <div className="text-xl font-bold font-mono text-white mt-0.5 tracking-tight">{winratePct}</div>
            <div className="mt-1">
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-mono font-medium bg-white/[0.06] text-white/80 border border-white/10">
                {profit.winning_trades} W / {profit.losing_trades} L
              </span>
            </div>
          </div>
        </div>

        {/* 2x2 Core Metrics Grid */}
        <div className="grid grid-cols-2 gap-2.5 my-3">
          {/* Profit Factor */}
          <div className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.06]">
            <span className="text-[11px] text-tr-gray font-medium block">{t.metrics.profitFactor}</span>
            <div className="flex items-baseline space-x-1 mt-1">
              <span className="text-sm font-semibold font-mono text-white">{profitFactor}</span>
              <span className="text-[10px] text-tr-gray/70 font-mono">({t.metrics.winLossRatio})</span>
            </div>
          </div>

          {/* Max Drawdown */}
          <div className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.06]">
            <span className="text-[11px] text-tr-gray font-medium block">{t.metrics.maxDrawdown}</span>
            <span className="text-sm font-semibold font-mono text-white mt-1 block">
              {drawdownPct}
            </span>
          </div>

          {/* Trading Volume */}
          <div className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.06]">
            <span className="text-[11px] text-tr-gray font-medium block">{t.metrics.tradingVolume}</span>
            <span className="text-sm font-semibold font-mono text-white mt-1 block">
              {volumeStr}
            </span>
          </div>

          {/* Total Trades */}
          <div className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.06]">
            <span className="text-[11px] text-tr-gray font-medium block">{t.metrics.totalTrades}</span>
            <span className="text-sm font-semibold font-mono text-white mt-1 block">
              {profit.trade_count}
            </span>
          </div>

          {/* Best Pair */}
          <div className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.06]">
            <span className="text-[11px] text-tr-gray font-medium block">{t.metrics.bestPair}</span>
            <span className="text-sm font-semibold font-mono text-white mt-1 block">
              {bestPairStr}
            </span>
          </div>

          {/* Active Since */}
          {profit.bot_start_date ? (
            <div className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.06]">
              <span className="text-[11px] text-tr-gray font-medium block">{t.metrics.activeSince}</span>
              <span className="text-xs font-medium font-mono text-white/90 mt-1.5 block truncate">
                {formatDate(profit.bot_start_date)}
              </span>
            </div>
          ) : (
            <div className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.06] flex items-center justify-center text-[11px] text-tr-gray">
              Freqtrade v2024+
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
