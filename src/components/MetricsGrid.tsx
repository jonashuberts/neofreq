import React from 'react';
import { Target, Award, BarChart3, AlertOctagon } from 'lucide-react';
import { FreqtradeProfit } from '../types/freqtrade';

interface MetricsGridProps {
  profit: FreqtradeProfit | null;
}

export const MetricsGrid: React.FC<MetricsGridProps> = ({ profit }) => {
  if (!profit) return null;

  const winratePct = (profit.winrate * 100).toFixed(1);
  const profitFactor = profit.profit_factor ? profit.profit_factor.toFixed(2) : '—';
  const drawdownPct = profit.max_drawdown ? (profit.max_drawdown * 100).toFixed(1) : '0.0';

  return (
    <div className="mt-4">
      <div className="text-xs uppercase font-bold tracking-wider text-tr-gray px-1 mb-2.5">
        Bot-Performance Metriken
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        {/* Winrate */}
        <div className="tr-card p-3.5">
          <div className="flex items-center space-x-1.5 text-tr-gray text-xs mb-1">
            <Target className="w-3.5 h-3.5 text-tr-green" />
            <span>Winrate</span>
          </div>
          <div className="text-lg font-bold text-white font-mono">{winratePct} %</div>
          <div className="text-[11px] text-tr-gray mt-0.5">
            {profit.winning_trades} W / {profit.losing_trades} L
          </div>
        </div>

        {/* Profit Factor */}
        <div className="tr-card p-3.5">
          <div className="flex items-center space-x-1.5 text-tr-gray text-xs mb-1">
            <Award className="w-3.5 h-3.5 text-purple-400" />
            <span>Profit-Faktor</span>
          </div>
          <div className="text-lg font-bold text-white font-mono">{profitFactor}</div>
          <div className="text-[11px] text-tr-gray mt-0.5">Verhältnis Win/Loss</div>
        </div>

        {/* Total Trades */}
        <div className="tr-card p-3.5">
          <div className="flex items-center space-x-1.5 text-tr-gray text-xs mb-1">
            <BarChart3 className="w-3.5 h-3.5 text-blue-400" />
            <span>Trades gesamt</span>
          </div>
          <div className="text-lg font-bold text-white font-mono">{profit.trade_count}</div>
          <div className="text-[11px] text-tr-gray mt-0.5">
            {profit.closed_trade_count} abgeschlossen
          </div>
        </div>

        {/* Max Drawdown */}
        <div className="tr-card p-3.5">
          <div className="flex items-center space-x-1.5 text-tr-gray text-xs mb-1">
            <AlertOctagon className="w-3.5 h-3.5 text-amber-400" />
            <span>Max Drawdown</span>
          </div>
          <div className="text-lg font-bold text-amber-400 font-mono">{drawdownPct} %</div>
          <div className="text-[11px] text-tr-gray mt-0.5">Maximaler Rückgang</div>
        </div>
      </div>
    </div>
  );
};
