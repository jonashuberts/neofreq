import React from 'react';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { FreqtradeTrade } from '../types/freqtrade';
import { useLanguage } from '../i18n/LanguageContext';

interface TradeHistoryProps {
  trades: FreqtradeTrade[];
}

export const TradeHistory: React.FC<TradeHistoryProps> = ({ trades }) => {
  const { t, formatCurrency, formatPercent, formatDate } = useLanguage();

  return (
    <div>
      {/* Header: Outside, unified with all dashboard sections */}
      <div className="flex items-center justify-between px-0.5 mb-2">
        <h3 className="text-xs sm:text-sm font-medium text-white">{t.history.title}</h3>
        <span className="text-[11px] text-tr-gray font-normal">
          {trades.length} {t.history.entries}
        </span>
      </div>

      {trades.length === 0 ? (
        <div className="tr-card p-5 sm:p-6 text-center">
          <div className="text-xs font-medium text-white">{t.history.emptyTitle}</div>
          <div className="text-[11px] text-tr-gray max-w-xs mx-auto mt-1">
            {t.history.emptyDesc}
          </div>
        </div>
      ) : (
        <div className="tr-card p-1.5 sm:p-2 divide-y divide-white/[0.04]">
          {trades.map((trade) => {
            const profit = trade.close_profit ?? trade.profit_abs ?? 0;
            const profitPct = trade.close_profit_pct ?? trade.profit_pct ?? 0;
            const isWin = profit >= 0;
            const sign = isWin ? '+' : '';
            const arrow = isWin ? '▲' : '▼';

            const dateStr = trade.close_date ? formatDate(trade.close_date) : t.history.recently;
            const baseCurrency = trade.pair.split('/')[0];

            return (
              <div
                key={trade.trade_id}
                className="p-2.5 rounded-xl hover:bg-white/[0.03] flex items-center justify-between transition-colors"
              >
                <div className="flex items-center space-x-3 min-w-0 flex-1 pr-2">
                  <div
                    className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 border ${
                      isWin
                        ? 'bg-tr-green/10 border-tr-green/20 text-tr-green'
                        : 'bg-tr-red/10 border-tr-red/20 text-tr-red'
                    }`}
                  >
                    {isWin ? (
                      <ArrowUpRight className="w-4 h-4 stroke-[2]" />
                    ) : (
                      <ArrowDownRight className="w-4 h-4 stroke-[2]" />
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center space-x-1.5 truncate">
                      <span className="text-xs sm:text-sm font-medium text-white tracking-tight truncate">
                        {baseCurrency}
                      </span>
                      {trade.exit_reason && (
                        <span className="text-[9px] uppercase font-mono px-1.5 py-0.5 rounded bg-white/[0.06] text-tr-gray shrink-0">
                          {trade.exit_reason.replaceAll('_', ' ')}
                        </span>
                      )}
                    </div>
                    <div className="text-[11px] text-tr-gray font-mono truncate mt-0.5">{dateStr}</div>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <div
                    className={`text-xs sm:text-sm font-medium font-mono tracking-tight ${
                      isWin ? 'text-tr-green' : 'text-tr-red'
                    }`}
                  >
                    {sign}{formatCurrency(profit)}
                  </div>
                  <div
                    className={`text-[11px] sm:text-xs font-medium font-mono mt-0.5 ${
                      isWin ? 'text-tr-green' : 'text-tr-red'
                    }`}
                  >
                    {arrow} {sign}{formatPercent(Math.abs(profitPct))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
