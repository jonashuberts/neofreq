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

  const baseCurrency = trade.base_currency || trade.pair.split('/')[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm transition-opacity animate-in fade-in duration-150">
      <div className="absolute inset-0" onClick={onClose} />

      <div className="relative w-full max-w-md bg-[#0D0E12] border border-white/10 rounded-2xl p-5 shadow-2xl z-10 max-h-[90vh] overflow-y-auto no-scrollbar">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
          <div>
            <span className="text-[11px] text-tr-gray uppercase font-medium tracking-wider">
              {t.positions.positionDetails} #{trade.trade_id}
            </span>
            <h3 className="text-lg font-semibold text-white flex items-center space-x-2">
              <span>{baseCurrency} · €</span>
              {trade.is_short && (
                <span className="text-[10px] bg-white/10 text-white/80 px-1.5 py-0.5 rounded font-mono">
                  {t.positions.short}
                </span>
              )}
            </h3>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full bg-white/[0.06] hover:bg-white/10 text-white/70 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* PnL summary */}
        <div className="py-4 flex items-baseline justify-between border-b border-white/[0.08]">
          <div>
            <div className="text-[11px] text-tr-gray">{t.positions.currentPrice}</div>
            <div className="text-xl font-semibold text-white mt-0.5">{positionValue}</div>
            <div className="text-[11px] text-tr-gray font-mono mt-0.5">
              {trade.amount} {baseCurrency}
            </div>
          </div>

          <div className="text-right">
            <div className="text-[11px] text-tr-gray">{t.positions.unrealizedPnL}</div>
            <div className={`text-xl font-semibold mt-0.5 ${isProfit ? 'text-tr-green' : 'text-tr-red'}`}>
              {fmtProfitAbs}
            </div>
            <div className={`text-xs font-medium ${isProfit ? 'text-tr-green/80' : 'text-tr-red/80'}`}>
              {fmtProfitPct}
            </div>
          </div>
        </div>

        {/* Parameters Grid */}
        <div className="grid grid-cols-2 gap-2.5 py-3.5 border-b border-white/[0.08] text-xs">
          <div className="p-2.5 rounded-xl bg-white/[0.02] border border-white/[0.04]">
            <span className="text-tr-gray block mb-0.5 text-[11px]">{t.positions.buyPrice}</span>
            <span className="text-white font-mono font-medium">{formatCurrency(trade.open_rate)}</span>
          </div>

          <div className="p-2.5 rounded-xl bg-white/[0.02] border border-white/[0.04]">
            <span className="text-tr-gray block mb-0.5 text-[11px]">{t.positions.currentPrice}</span>
            <span className="text-white font-mono font-medium">{formatCurrency(currentRate)}</span>
          </div>

          <div className="p-2.5 rounded-xl bg-white/[0.02] border border-white/[0.04]">
            <span className="text-tr-gray block mb-0.5 text-[11px]">{t.positions.invested}</span>
            <span className="text-white font-mono font-medium">{formatCurrency(trade.stake_amount)}</span>
          </div>

          <div className="p-2.5 rounded-xl bg-white/[0.02] border border-white/[0.04]">
            <span className="text-tr-gray block mb-0.5 text-[11px]">Stop-Loss</span>
            <span className="text-white font-mono font-medium">{formatCurrency(trade.stop_loss_abs)}</span>
          </div>
        </div>

        {/* Strategy Metadata */}
        <div className="py-3.5 space-y-2 text-xs text-tr-gray border-b border-white/[0.08]">
          <div className="flex items-center justify-between">
            <span className="flex items-center space-x-1.5">
              <Layers className="w-3.5 h-3.5" />
              <span>{t.positions.strategy}</span>
            </span>
            <span className="font-medium text-white font-mono">{trade.strategy || 'N/A'}</span>
          </div>

          <div className="flex items-center justify-between">
            <span className="flex items-center space-x-1.5">
              <ArrowDownUp className="w-3.5 h-3.5" />
              <span>{t.positions.exchange}</span>
            </span>
            <span className="font-medium text-white uppercase font-mono">{trade.exchange || 'OKX'}</span>
          </div>

          <div className="flex items-center justify-between">
            <span className="flex items-center space-x-1.5">
              <Clock className="w-3.5 h-3.5" />
              <span>{t.positions.openedAt}</span>
            </span>
            <span className="text-white font-mono">{formatDate(trade.open_date)}</span>
          </div>
        </div>

        {/* Orders */}
        {trade.orders && trade.orders.length > 0 && (
          <div className="pt-3">
            <span className="text-[11px] font-medium text-tr-gray uppercase tracking-wider block mb-2">
              {t.positions.executedOrders}
            </span>
            <div className="space-y-1.5">
              {trade.orders.map((order, idx) => (
                <div
                  key={order.order_id || idx}
                  className="flex items-center justify-between p-2 rounded-lg bg-white/[0.02] border border-white/[0.04] text-xs font-mono"
                >
                  <div className="flex items-center space-x-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-tr-green" />
                    <div>
                      <span className="uppercase text-white font-medium">{order.ft_order_side} {order.order_type}</span>
                      <div className="text-[10px] text-tr-gray">{order.amount} @ {formatCurrency(order.safe_price)}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-white">{formatCurrency(order.cost)}</span>
                    <div className="text-[9px] text-white/50 uppercase">{order.status}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
