import React from 'react';
import { X, Clock, ArrowDownUp, Layers, CheckCircle2 } from 'lucide-react';
import { FreqtradeTrade } from '../types/freqtrade';
import { useLanguage } from '../i18n/LanguageContext';

interface PositionDetailModalProps {
  trade: FreqtradeTrade | null;
  onClose: () => void;
}

export const PositionDetailModal: React.FC<PositionDetailModalProps> = ({ trade, onClose }) => {
  const { t, formatCurrency, formatPercent, formatDate } = useLanguage();

  if (!trade) return null;

  const isProfit = trade.profit_abs >= 0;
  const sign = isProfit ? '+' : '';
  const currentRate = trade.current_rate ?? trade.open_rate;

  const fmtProfitAbs = `${sign}${formatCurrency(trade.profit_abs)}`;
  const fmtProfitPct = `${sign}${formatPercent(trade.profit_pct)}`;
  const positionValue = formatCurrency(trade.amount * currentRate);

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/75 backdrop-blur-md transition-opacity animate-in fade-in duration-200">
      <div className="absolute inset-0" onClick={onClose} />

      <div className="relative w-full max-w-lg bg-[#0E0F14] border border-white/10 rounded-t-[28px] sm:rounded-3xl p-6 shadow-2xl z-10 max-h-[90vh] overflow-y-auto no-scrollbar">
        {/* Mobile handle indicator */}
        <div className="w-12 h-1 bg-white/20 rounded-full mx-auto mb-4 sm:hidden" />

        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10">
          <div>
            <span className="text-xs text-tr-gray uppercase font-semibold tracking-wider">
              {t.positions.positionDetails} #{trade.trade_id}
            </span>
            <h3 className="text-2xl font-bold text-white flex items-center space-x-2">
              <span>{trade.pair}</span>
              {trade.is_short && (
                <span className="text-xs bg-white/10 text-white/80 border border-white/15 px-2 py-0.5 rounded font-mono">
                  {t.positions.short}
                </span>
              )}
            </h3>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full bg-white/10 text-white/70 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Big PnL summary */}
        <div className="py-5 flex items-baseline justify-between border-b border-white/10">
          <div>
            <div className="text-xs text-tr-gray">{t.positions.currentPrice}</div>
            <div className="text-2xl font-extrabold text-white mt-0.5">{positionValue}</div>
            <div className="text-xs text-tr-gray font-mono mt-0.5">
              {trade.amount} {trade.base_currency || trade.pair.split('/')[0]}
            </div>
          </div>

          <div className="text-right">
            <div className="text-xs text-tr-gray">{t.positions.unrealizedPnL}</div>
            <div className={`text-2xl font-bold mt-0.5 ${isProfit ? 'text-tr-green' : 'text-tr-red'}`}>
              {fmtProfitAbs}
            </div>
            <div className={`text-sm font-semibold ${isProfit ? 'text-tr-green/90' : 'text-tr-red/90'}`}>
              {fmtProfitPct}
            </div>
          </div>
        </div>

        {/* Trading Parameters Grid */}
        <div className="grid grid-cols-2 gap-3 py-4 border-b border-white/10 text-xs">
          <div className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.05]">
            <span className="text-tr-gray block mb-1">{t.positions.buyPrice}</span>
            <span className="text-white font-mono font-semibold text-sm">{formatCurrency(trade.open_rate)}</span>
          </div>

          <div className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.05]">
            <span className="text-tr-gray block mb-1">{t.positions.currentPrice}</span>
            <span className="text-white font-mono font-semibold text-sm">{formatCurrency(currentRate)}</span>
          </div>

          <div className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.05]">
            <span className="text-tr-gray block mb-1">{t.positions.invested}</span>
            <span className="text-white font-mono font-semibold text-sm">{formatCurrency(trade.stake_amount)}</span>
          </div>

          <div className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.05]">
            <span className="text-tr-gray block mb-1">Stop-Loss</span>
            <span className="text-white font-mono font-semibold text-sm">{formatCurrency(trade.stop_loss_abs)}</span>
          </div>
        </div>

        {/* Bot & Strategy Metadata */}
        <div className="py-4 space-y-2.5 text-xs text-tr-gray border-b border-white/10">
          <div className="flex items-center justify-between">
            <span className="flex items-center space-x-1.5">
              <Layers className="w-3.5 h-3.5" />
              <span>{t.positions.strategy}</span>
            </span>
            <span className="font-semibold text-white font-mono">{trade.strategy || 'N/A'}</span>
          </div>

          <div className="flex items-center justify-between">
            <span className="flex items-center space-x-1.5">
              <ArrowDownUp className="w-3.5 h-3.5" />
              <span>{t.positions.exchange}</span>
            </span>
            <span className="font-semibold text-white uppercase font-mono">{trade.exchange || 'OKX'}</span>
          </div>

          <div className="flex items-center justify-between">
            <span className="flex items-center space-x-1.5">
              <Clock className="w-3.5 h-3.5" />
              <span>{t.positions.openedAt}</span>
            </span>
            <span className="text-white font-mono">{formatDate(trade.open_date)}</span>
          </div>
        </div>

        {/* Orders list if available */}
        {trade.orders && trade.orders.length > 0 && (
          <div className="pt-4">
            <span className="text-xs font-semibold text-tr-gray uppercase tracking-wider block mb-2">
              {t.positions.executedOrders}
            </span>
            <div className="space-y-2">
              {trade.orders.map((order, idx) => (
                <div
                  key={order.order_id || idx}
                  className="flex items-center justify-between p-2.5 rounded-xl bg-white/[0.02] border border-white/[0.04] text-xs font-mono"
                >
                  <div className="flex items-center space-x-2">
                    <CheckCircle2 className="w-4 h-4 text-tr-green" />
                    <div>
                      <span className="uppercase font-bold text-white">{order.ft_order_side} {order.order_type}</span>
                      <div className="text-[11px] text-tr-gray">{order.amount} @ {formatCurrency(order.safe_price)}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-white font-semibold">{formatCurrency(order.cost)}</span>
                    <div className="text-[10px] text-white/60 uppercase">{order.status}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Bottom Done Button */}
        <div className="mt-6">
          <button
            onClick={onClose}
            className="w-full py-3 rounded-2xl bg-white/10 hover:bg-white/15 text-white font-semibold text-sm transition-all"
          >
            {t.common.done}
          </button>
        </div>
      </div>
    </div>
  );
};
