import React from 'react';
import { History, ArrowUpRight, ArrowDownRight, Activity } from 'lucide-react';
import { FreqtradeTrade } from '../types/freqtrade';

interface TradeHistoryProps {
  trades: FreqtradeTrade[];
}

export const TradeHistory: React.FC<TradeHistoryProps> = ({ trades }) => {
  return (
    <div className="mt-5 mb-8">
      <div className="flex items-center justify-between px-1 mb-2.5">
        <div className="flex items-center space-x-1.5 text-xs uppercase font-bold tracking-wider text-tr-gray">
          <History className="w-3.5 h-3.5" />
          <span>Geschlossene Trades</span>
        </div>
        <span className="text-xs text-tr-gray">{trades.length} Einträge</span>
      </div>

      {trades.length === 0 ? (
        <div className="tr-card p-6 text-center">
          <div className="w-10 h-10 rounded-full bg-white/[0.04] border border-white/10 flex items-center justify-center mx-auto mb-3 text-tr-gray">
            <Activity className="w-5 h-5 text-tr-green animate-pulse" />
          </div>
          <div className="text-sm font-semibold text-white">Keine geschlossenen Trades</div>
          <div className="text-xs text-tr-gray max-w-xs mx-auto mt-1">
            Sobald der Trading-Bot eine Position schließt, erscheint sie hier mit genauem Gewinn und Begründung.
          </div>
        </div>
      ) : (
        <div className="space-y-2">
          {trades.map((trade) => {
            const profit = trade.close_profit ?? trade.profit_abs ?? 0;
            const profitPct = trade.close_profit_pct ?? trade.profit_pct ?? 0;
            const isWin = profit >= 0;
            const sign = isWin ? '+' : '';

            // Clean formatted date
            const dateStr = trade.close_date
              ? new Date(trade.close_date).toLocaleDateString('de-DE', {
                  day: '2-digit',
                  month: '2-digit',
                  hour: '2-digit',
                  minute: '2-digit',
                })
              : 'Vor kurzem';

            return (
              <div
                key={trade.trade_id}
                className="tr-card p-3.5 flex items-center justify-between"
              >
                <div className="flex items-center space-x-3">
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${
                    isWin ? 'bg-tr-green/15 text-tr-green' : 'bg-tr-red/15 text-tr-red'
                  }`}>
                    {isWin ? (
                      <ArrowUpRight className="w-4 h-4 stroke-[2.5]" />
                    ) : (
                      <ArrowDownRight className="w-4 h-4 stroke-[2.5]" />
                    )}
                  </div>

                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-bold text-white tracking-tight">{trade.pair}</span>
                      {trade.exit_reason && (
                        <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-white/[0.06] text-tr-gray">
                          {trade.exit_reason.replace('_', ' ')}
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-tr-gray font-mono mt-0.5">{dateStr}</div>
                  </div>
                </div>

                <div className="text-right">
                  <div className={`text-sm font-bold font-mono ${isWin ? 'text-tr-green' : 'text-tr-red'}`}>
                    {sign}{profit.toFixed(2)} €
                  </div>
                  <div className={`text-xs font-semibold ${isWin ? 'text-tr-green/80' : 'text-tr-red/80'}`}>
                    {sign}{profitPct.toFixed(2)} %
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
