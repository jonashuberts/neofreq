import React from 'react';
import { History, ArrowUpRight, ArrowDownRight, Activity } from 'lucide-react';
import { FreqtradeTrade } from '../types/freqtrade';
import { useLanguage } from '../i18n/LanguageContext';

interface TradeHistoryProps {
  trades: FreqtradeTrade[];
}

export const TradeHistory: React.FC<TradeHistoryProps> = ({ trades }) => {
  const { t, formatCurrency, formatPercent, formatDate } = useLanguage();

  return (
    <div className="mt-2 mb-6">
      <div className="flex items-center justify-between px-1 mb-2.5">
        <div className="flex items-center space-x-1.5 text-xs uppercase font-bold tracking-wider text-tr-gray">
          <History className="w-3.5 h-3.5" />
          <span>{t.history.title}</span>
        </div>
        <span className="text-xs text-tr-gray">
          {trades.length} {t.history.entries}
        </span>
      </div>

      {trades.length === 0 ? (
        <div className="tr-card p-5 text-center">
          <div className="w-8 h-8 rounded-full bg-white/[0.04] border border-white/10 flex items-center justify-center mx-auto mb-2 text-tr-gray">
            <Activity className="w-4 h-4 text-tr-gray" />
          </div>
          <div className="text-sm font-semibold text-white">{t.history.emptyTitle}</div>
          <div className="text-xs text-tr-gray max-w-xs mx-auto mt-0.5">
            {t.history.emptyDesc}
          </div>
        </div>
      ) : (
        <div className="space-y-2">
          {trades.map((trade) => {
            const profit = trade.close_profit ?? trade.profit_abs ?? 0;
            const profitPct = trade.close_profit_pct ?? trade.profit_pct ?? 0;
            const isWin = profit >= 0;
            const sign = isWin ? '+' : '';

            const dateStr = trade.close_date ? formatDate(trade.close_date) : t.history.recently;

            return (
              <div
                key={trade.trade_id}
                className="tr-card p-3.5 flex items-center justify-between"
              >
                <div className="flex items-center space-x-3">
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center ${
                      isWin ? 'bg-tr-green/10 text-tr-green' : 'bg-tr-red/10 text-tr-red'
                    }`}
                  >
                    {isWin ? (
                      <ArrowUpRight className="w-3.5 h-3.5 stroke-[2.5]" />
                    ) : (
                      <ArrowDownRight className="w-3.5 h-3.5 stroke-[2.5]" />
                    )}
                  </div>

                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-bold text-white tracking-tight">{trade.pair}</span>
                      {trade.exit_reason && (
                        <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-white/[0.05] text-tr-gray">
                          {trade.exit_reason.replace('_', ' ')}
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-tr-gray font-mono mt-0.5">{dateStr}</div>
                  </div>
                </div>

                <div className="text-right">
                  <div className={`text-sm font-bold font-mono ${isWin ? 'text-tr-green' : 'text-tr-red'}`}>
                    {sign}{formatCurrency(profit)}
                  </div>
                  <div className={`text-xs font-semibold ${isWin ? 'text-tr-green/80' : 'text-tr-red/80'}`}>
                    {sign}{formatPercent(profitPct)}
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
