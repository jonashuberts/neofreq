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
    <div className="mt-2 mb-4">
      <div className="flex items-center justify-between px-1 mb-2">
        <div className="flex items-center space-x-1.5 text-xs sm:text-sm font-medium text-white">
          <History className="w-3.5 h-3.5 text-tr-gray" />
          <span>{t.history.title}</span>
        </div>
        <span className="text-[11px] text-tr-gray">
          {trades.length} {t.history.entries}
        </span>
      </div>

      {trades.length === 0 ? (
        <div className="tr-card p-4 text-center">
          <div className="w-7 h-7 rounded-full bg-white/[0.04] border border-white/10 flex items-center justify-center mx-auto mb-1.5 text-tr-gray">
            <Activity className="w-3.5 h-3.5 text-tr-gray" />
          </div>
          <div className="text-xs font-medium text-white">{t.history.emptyTitle}</div>
          <div className="text-[11px] text-tr-gray max-w-xs mx-auto mt-0.5">
            {t.history.emptyDesc}
          </div>
        </div>
      ) : (
        <div className="space-y-1.5">
          {trades.map((trade) => {
            const profit = trade.close_profit ?? trade.profit_abs ?? 0;
            const profitPct = trade.close_profit_pct ?? trade.profit_pct ?? 0;
            const isWin = profit >= 0;
            const sign = isWin ? '+' : '';

            const dateStr = trade.close_date ? formatDate(trade.close_date) : t.history.recently;
            const baseCurrency = trade.pair.split('/')[0];

            return (
              <div
                key={trade.trade_id}
                className="py-2.5 px-2 rounded-xl hover:bg-white/[0.02] flex items-center justify-between transition-colors"
              >
                <div className="flex items-center space-x-2.5 min-w-0 flex-1 pr-2">
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 ${
                      isWin ? 'bg-tr-green/10 text-tr-green' : 'bg-tr-red/10 text-tr-red'
                    }`}
                  >
                    {isWin ? (
                      <ArrowUpRight className="w-3 h-3 stroke-[2.5]" />
                    ) : (
                      <ArrowDownRight className="w-3 h-3 stroke-[2.5]" />
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center space-x-1.5 truncate">
                      <span className="text-xs font-medium text-white tracking-tight truncate">{baseCurrency} · €</span>
                      {trade.exit_reason && (
                        <span className="text-[9px] uppercase font-mono px-1 py-0.5 rounded bg-white/[0.05] text-tr-gray shrink-0">
                          {trade.exit_reason.replaceAll('_', ' ')}
                        </span>
                      )}
                    </div>
                    <div className="text-[10px] text-tr-gray font-mono truncate">{dateStr}</div>
                  </div>
                </div>

                <div className="text-right">
                  <div className={`text-xs font-medium font-mono ${isWin ? 'text-tr-green' : 'text-tr-red'}`}>
                    {sign}{formatCurrency(profit)}
                  </div>
                  <div className={`text-[10px] font-medium ${isWin ? 'text-tr-green/80' : 'text-tr-red/80'}`}>
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
