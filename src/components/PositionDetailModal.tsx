import { X, Clock, ArrowDownUp, Layers, CheckCircle2 } from 'lucide-react';
import { FreqtradeTrade } from '../types/freqtrade';

interface PositionDetailModalProps {
  trade: FreqtradeTrade | null;
  onClose: () => void;
}

export const PositionDetailModal: React.FC<PositionDetailModalProps> = ({ trade, onClose }) => {
  if (!trade) return null;

  const isProfit = trade.profit_abs >= 0;
  const sign = isProfit ? '+' : '';
  const currentRate = trade.current_rate ?? trade.open_rate;

  const fmtProfitAbs = `${sign}${trade.profit_abs.toFixed(2)} €`;
  const fmtProfitPct = `${sign}${trade.profit_pct.toFixed(2)} %`;
  const positionValue = (trade.amount * currentRate).toFixed(2);

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/70 backdrop-blur-md transition-opacity animate-in fade-in duration-200">
      {/* Backdrop tap to close */}
      <div className="absolute inset-0" onClick={onClose} />

      {/* Modal / Bottom Sheet Box */}
      <div className="relative w-full max-w-lg bg-[#0E0F14] border border-white/10 rounded-t-[28px] sm:rounded-3xl p-6 shadow-2xl z-10 max-h-[90vh] overflow-y-auto no-scrollbar">
        {/* Mobile handle indicator */}
        <div className="w-12 h-1 bg-white/20 rounded-full mx-auto mb-4 sm:hidden" />

        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10">
          <div>
            <span className="text-xs text-tr-gray uppercase font-semibold tracking-wider">Position #{trade.trade_id}</span>
            <h3 className="text-2xl font-bold text-white flex items-center space-x-2">
              <span>{trade.pair}</span>
              {trade.is_short && (
                <span className="text-xs bg-red-500/20 text-red-400 border border-red-500/30 px-2 py-0.5 rounded">
                  SHORT
                </span>
              )}
            </h3>
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 flex items-center justify-center rounded-full bg-white/10 text-white/70 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Big PnL summary */}
        <div className="py-5 flex items-baseline justify-between border-b border-white/10">
          <div>
            <div className="text-xs text-tr-gray">Aktueller Wert</div>
            <div className="text-2xl font-extrabold text-white mt-0.5">{positionValue} €</div>
            <div className="text-xs text-tr-gray font-mono mt-0.5">
              Menge: {trade.amount} {trade.base_currency || trade.pair.split('/')[0]}
            </div>
          </div>

          <div className="text-right">
            <div className="text-xs text-tr-gray">Unrealisierter PnL</div>
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
            <span className="text-tr-gray block mb-1">Kaufpreis</span>
            <span className="text-white font-mono font-semibold text-sm">{trade.open_rate.toFixed(2)} €</span>
          </div>

          <div className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.05]">
            <span className="text-tr-gray block mb-1">Aktueller Kurs</span>
            <span className="text-white font-mono font-semibold text-sm">{currentRate.toFixed(2)} €</span>
          </div>

          <div className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.05]">
            <span className="text-tr-gray block mb-1">Investiert (Stake)</span>
            <span className="text-white font-mono font-semibold text-sm">{trade.stake_amount.toFixed(2)} €</span>
          </div>

          <div className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.05]">
            <span className="text-tr-gray block mb-1">Stop-Loss Schwelle</span>
            <span className="text-amber-400 font-mono font-semibold text-sm">{trade.stop_loss_abs.toFixed(2)} €</span>
          </div>
        </div>

        {/* Bot & Strategy Metadata */}
        <div className="py-4 space-y-2.5 text-xs text-tr-gray border-b border-white/10">
          <div className="flex items-center justify-between">
            <span className="flex items-center space-x-1.5">
              <Layers className="w-3.5 h-3.5" />
              <span>Strategie</span>
            </span>
            <span className="font-semibold text-white font-mono">{trade.strategy || 'N/A'}</span>
          </div>

          <div className="flex items-center justify-between">
            <span className="flex items-center space-x-1.5">
              <ArrowDownUp className="w-3.5 h-3.5" />
              <span>Börse</span>
            </span>
            <span className="font-semibold text-white uppercase font-mono">{trade.exchange || 'OKX'}</span>
          </div>

          <div className="flex items-center justify-between">
            <span className="flex items-center space-x-1.5">
              <Clock className="w-3.5 h-3.5" />
              <span>Eröffnet am</span>
            </span>
            <span className="text-white font-mono">{trade.open_date}</span>
          </div>

          {trade.min_rate && trade.max_rate && (
            <div className="flex items-center justify-between">
              <span>Min / Max Range</span>
              <span className="font-mono text-white/90">
                {trade.min_rate.toFixed(2)} € - {trade.max_rate.toFixed(2)} €
              </span>
            </div>
          )}
        </div>

        {/* Orders list if available */}
        {trade.orders && trade.orders.length > 0 && (
          <div className="pt-4">
            <span className="text-xs font-semibold text-tr-gray uppercase tracking-wider block mb-2">
              Ausgeführte Orders
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
                      <div className="text-[11px] text-tr-gray">{order.amount} @ {order.safe_price} €</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-white font-semibold">{order.cost.toFixed(2)} €</span>
                    <div className="text-[10px] text-emerald-400/80 uppercase">{order.status}</div>
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
            Fertig
          </button>
        </div>
      </div>
    </div>
  );
};
