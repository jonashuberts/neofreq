import React from 'react';
import { Target, Award, BarChart3, AlertOctagon } from 'lucide-react';
import { FreqtradeProfit } from '../types/freqtrade';
import { useLanguage } from '../i18n/LanguageContext';

interface MetricsGridProps {
  profit: FreqtradeProfit | null;
}

export const MetricsGrid: React.FC<MetricsGridProps> = ({ profit }) => {
  const { t, formatPercent } = useLanguage();

  if (!profit) return null;

  const winratePct = formatPercent(profit.winrate * 100);
  const profitFactor = profit.profit_factor ? profit.profit_factor.toFixed(2) : '—';
  const drawdownPct = profit.max_drawdown ? formatPercent(profit.max_drawdown * 100) : '0.0%';

  return (
    <div className="mt-1">
      <div className="text-[11px] uppercase font-medium tracking-wider text-tr-gray px-1 mb-2">
        {t.metrics.title}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {/* Winrate */}
        <div className="tr-card p-3">
          <div className="flex items-center space-x-1.5 text-tr-gray text-[11px] mb-1">
            <Target className="w-3 h-3 text-tr-gray" />
            <span>{t.metrics.winrate}</span>
          </div>
          <div className="text-sm sm:text-base font-semibold text-white font-mono">{winratePct}</div>
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
          <div className="text-sm sm:text-base font-semibold text-white font-mono">{profitFactor}</div>
          <div className="text-[10px] text-tr-gray mt-0.5">{t.metrics.winLossRatio}</div>
        </div>

        {/* Total Trades */}
        <div className="tr-card p-3">
          <div className="flex items-center space-x-1.5 text-tr-gray text-[11px] mb-1">
            <BarChart3 className="w-3 h-3 text-tr-gray" />
            <span>{t.metrics.totalTrades}</span>
          </div>
          <div className="text-sm sm:text-base font-semibold text-white font-mono">{profit.trade_count}</div>
          <div className="text-[10px] text-tr-gray mt-0.5">
            {profit.closed_trade_count} {t.metrics.closed}
          </div>
        </div>

        {/* Max Drawdown */}
        <div className="tr-card p-3">
          <div className="flex items-center space-x-1.5 text-tr-gray text-[11px] mb-1">
            <AlertOctagon className="w-3 h-3 text-tr-gray" />
            <span>{t.metrics.maxDrawdown}</span>
          </div>
          <div className="text-sm sm:text-base font-semibold text-white font-mono">{drawdownPct}</div>
          <div className="text-[10px] text-tr-gray mt-0.5">{t.metrics.maxDecline}</div>
        </div>
      </div>
    </div>
  );
};
