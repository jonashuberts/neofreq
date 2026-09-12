import React, { useState } from 'react';
import { ArrowUpRight, ArrowDownRight, ChevronRight, X, History } from 'lucide-react';
import { FreqtradeTrade } from '../types/freqtrade';
import { useLanguage } from '../i18n/LanguageContext';

interface TradeHistoryProps {
  trades: FreqtradeTrade[];
}

export const TradeHistory: React.FC<TradeHistoryProps> = ({ trades }) => {
  const { t, formatCurrency, formatPercent, formatDate } = useLanguage();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const renderTradeRow = (trade: FreqtradeTrade) => {
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
  };

  return (
    <div>
      {/* Header: Outside, unified with all dashboard sections */}
      <div className="flex items-center justify-between px-0.5 mb-2">
        <h3 className="text-xs sm:text-sm font-medium text-white">{t.history.title}</h3>
        <div className="flex items-center space-x-2">
          <span className="text-[11px] text-tr-gray font-normal">
            {trades.length} {t.history.entries}
          </span>
          {trades.length > 1 && (
            <button
              onClick={() => setIsModalOpen(true)}
              className="text-[11px] text-tr-gray hover:text-white transition-colors lg:hidden"
            >
              {t.positions.viewAll}
            </button>
          )}
        </div>
      </div>

      {trades.length === 0 ? (
        <div className="tr-card p-5 sm:p-6 text-center">
          <div className="text-xs font-medium text-white">{t.history.emptyTitle}</div>
          <div className="text-[11px] text-tr-gray max-w-xs mx-auto mt-1">
            {t.history.emptyDesc}
          </div>
        </div>
      ) : (
        <>
          {/* Mobile compact summary card (no long scrolling!) */}
          <div
            onClick={() => setIsModalOpen(true)}
            className="lg:hidden tr-card p-3 flex items-center justify-between cursor-pointer hover:bg-white/[0.04] active:bg-white/[0.06] transition-all"
          >
            <div className="flex items-center space-x-2.5 min-w-0">
              <div className="w-7 h-7 rounded-lg bg-white/[0.04] border border-white/10 flex items-center justify-center text-tr-gray shrink-0">
                <History className="w-3.5 h-3.5 text-white/80" />
              </div>
              <div className="min-w-0">
                <div className="text-xs font-medium text-white">
                  {trades.length} {t.history.title}
                </div>
                <div className="text-[10px] text-tr-gray truncate mt-0.5 font-mono">
                  {trades.slice(0, 3).map((t) => t.pair.split('/')[0]).join(', ')}
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-1.5 shrink-0 pl-2">
              <span className="text-[10px] text-tr-gray font-mono">{t.positions.viewAll}</span>
              <ChevronRight className="w-4 h-4 text-tr-gray shrink-0" />
            </div>
          </div>

          {/* Desktop full list */}
          <div className="hidden lg:block tr-card p-1.5 sm:p-2 divide-y divide-white/[0.04]">
            {trades.map(renderTradeRow)}
          </div>

          {/* Mobile Modal Sheet for Trade History */}
          {isModalOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm transition-opacity animate-in fade-in duration-150">
              <div className="absolute inset-0" onClick={() => setIsModalOpen(false)} />
              <div className="relative w-full max-w-md bg-[#0D0E12] border border-white/10 rounded-2xl p-5 shadow-2xl z-10 max-h-[85vh] flex flex-col">
                <div className="flex items-center justify-between pb-3 border-b border-white/[0.08] shrink-0">
                  <div>
                    <span className="text-[11px] text-tr-gray font-normal block mb-0.5">
                      {trades.length} {t.history.entries}
                    </span>
                    <h3 className="text-base sm:text-lg font-medium text-white">{t.history.title}</h3>
                  </div>
                  <button
                    onClick={() => setIsModalOpen(false)}
                    className="p-1.5 rounded-full bg-white/[0.06] hover:bg-white/10 text-white/70 hover:text-white transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="overflow-y-auto no-scrollbar py-2 divide-y divide-white/[0.04] flex-1">
                  {trades.map(renderTradeRow)}
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};
