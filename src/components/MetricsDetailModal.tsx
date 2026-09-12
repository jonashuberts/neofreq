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

        {/* Hero Performance Summary */}
        <div className="py-4 flex items-baseline justify-between border-b border-white/[0.08]">
          <div>
            <div className="text-[11px] text-tr-gray font-normal">{t.metrics.realizedProfit}</div>
            <div className={`text-2xl font-medium font-mono mt-0.5 ${isNetProfit ? 'text-tr-green' : 'text-tr-red'}`}>
              {netSign}{formatCurrency(profit.profit_closed_fiat)}
            </div>
            <div className="text-[11px] text-tr-gray font-mono mt-0.5">
              {profit.closed_trade_count} {t.metrics.closed}
            </div>
          </div>

          <div className="text-right">
            <div className="text-[11px] text-tr-gray font-normal">{t.metrics.winrate}</div>
            <div className="text-xl font-medium font-mono text-white mt-0.5">{winratePct}</div>
            <div className="text-xs font-medium font-mono text-tr-gray mt-0.5">
              {profit.winning_trades} W / {profit.losing_trades} L
            </div>
          </div>
        </div>

        {/* Parameters: Clean Trade Republic Key-Value List */}
        <div className="py-2 divide-y divide-white/[0.04] text-xs">
          <div className="flex items-center justify-between py-2.5">
            <span className="text-tr-gray font-normal">{t.metrics.profitFactor}</span>
            <div className="text-right font-mono">
              <span className="font-medium text-white">{profitFactor}</span>
              <span className="text-[10px] text-tr-gray ml-1.5">({t.metrics.winLossRatio})</span>
            </div>
          </div>

          <div className="flex items-center justify-between py-2.5">
            <span className="text-tr-gray font-normal">{t.metrics.tradingVolume}</span>
            <span className="font-mono font-medium text-white">{volumeStr}</span>
          </div>

          <div className="flex items-center justify-between py-2.5">
            <span className="text-tr-gray font-normal">{t.metrics.totalTrades}</span>
            <span className="font-mono font-medium text-white">{profit.trade_count}</span>
          </div>

          <div className="flex items-center justify-between py-2.5">
            <span className="text-tr-gray font-normal">{t.metrics.bestPair}</span>
            <span className="font-mono font-medium text-white">{bestPairStr}</span>
          </div>

          <div className="flex items-center justify-between py-2.5">
            <span className="text-tr-gray font-normal">{t.metrics.maxDrawdown}</span>
            <span className="font-mono font-medium text-white">{drawdownPct}</span>
          </div>

          {profit.bot_start_date && (
            <div className="flex items-center justify-between py-2.5">
              <span className="text-tr-gray font-normal">{t.metrics.activeSince}</span>
              <span className="font-mono text-white/80">{formatDate(profit.bot_start_date)}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
