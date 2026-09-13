import React from 'react';
import { ArrowUpRight, ArrowDownRight, X } from 'lucide-react';
import { FreqtradeTrade } from '../types/freqtrade';
import { useLanguage } from '../i18n/LanguageContext';

interface TradeHistoryModalProps {
  isOpen: boolean;
  trades: FreqtradeTrade[];
  onClose: () => void;
}

export const TradeHistoryModal: React.FC<TradeHistoryModalProps> = ({
  isOpen,
  trades,
  onClose,
}) => {
  const { t, formatCurrency, formatPercent, formatDate } = useLanguage();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4 pt-[max(calc(env(safe-area-inset-top,0px)+10px),16px)] pb-[max(calc(env(safe-area-inset-bottom,0px)+10px),16px)] bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="absolute inset-0" onClick={onClose} />
      <div className="relative w-full max-w-md bg-[#121316] border border-white/15 rounded-2xl p-4 sm:p-5 shadow-2xl shadow-black/80 z-10 max-h-full flex flex-col my-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-white/10 shrink-0">
          <div>
            <span className="text-[11px] text-tr-gray font-normal block mb-0.5">
              {trades.length} {t.history.entries}
            </span>
            <h3 className="text-base sm:text-lg font-medium text-white">{t.history.title}</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full bg-white/[0.06] hover:bg-white/10 text-white/70 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content list */}
        {trades.length === 0 ? (
          <div className="py-8 text-center">
            <div className="text-xs font-medium text-white">{t.history.emptyTitle}</div>
            <div className="text-[11px] text-tr-gray max-w-xs mx-auto mt-1">
              {t.history.emptyDesc}
            </div>
          </div>
        ) : (
          <div className="overflow-y-auto no-scrollbar py-2 divide-y divide-white/[0.04] flex-1">
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
                      <div className="text-[11px] text-tr-gray font-mono truncate mt-0.5">
                        {dateStr}
                      </div>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <div
                      className={`text-xs sm:text-sm font-mono font-medium ${
                        isWin ? 'text-tr-green' : 'text-tr-red'
                      }`}
                    >
                      {sign}
                      {formatCurrency(profit)}
                    </div>
                    <div className="text-[11px] text-tr-gray font-mono">
                      {sign}
                      {formatPercent(profitPct * 100)}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
