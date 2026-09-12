import React from 'react';
import { X, CheckCircle2 } from 'lucide-react';
import { FreqtradeTrade } from '../types/freqtrade';
import { useLanguage } from '../i18n/LanguageContext';

interface PositionDetailModalProps {
  trade: FreqtradeTrade | null;
  onClose: () => void;
}

export const PositionDetailModal: React.FC<PositionDetailModalProps> = ({ trade, onClose }) => {
  const { t, formatCurrency, formatPercent, formatDate, language } = useLanguage();

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

      <div className="relative w-full max-w-md bg-black border border-white/[0.08] rounded-2xl p-4 sm:p-5 z-10 max-h-[90vh] overflow-y-auto no-scrollbar">
        {/* Header: Unified Clean Layout */}
        <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
          <div>
            <span className="text-[11px] text-tr-gray font-normal block mb-0.5">
              {t.positions.positionDetails} #{trade.trade_id}
            </span>
            <h3 className="text-base sm:text-lg font-medium text-white flex items-center space-x-2">
              <span>{baseCurrency} / {trade.pair.split('/')[1] || 'EUR'}</span>
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

        {/* Hero PnL Highlight Card - Flat Neobroker Style */}
        <div className="mt-3.5 p-4 rounded-2xl tr-card flex items-center justify-between">
          <div>
            <div className="text-xs text-tr-gray font-normal">{t.hero.totalValue}</div>
            <div className="text-2xl font-bold font-mono text-white mt-0.5 tracking-tight">{positionValue}</div>
            <div className="text-xs text-tr-gray font-mono mt-0.5">
              {trade.amount} {baseCurrency}
            </div>
          </div>

          <div className="text-right">
            <div className="text-xs text-tr-gray font-normal">{t.positions.unrealizedPnL}</div>
            <div className={`text-xl font-bold font-mono mt-0.5 tracking-tight ${isProfit ? 'text-tr-green' : 'text-tr-red'}`}>
              {fmtProfitAbs}
            </div>
            <div className="mt-1">
              <span
                className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-mono font-semibold ${
                  isProfit
                    ? 'bg-tr-green/15 text-tr-green border border-tr-green/30'
                    : 'bg-tr-red/15 text-tr-red border border-tr-red/30'
                }`}
              >
                {fmtProfitPct}
              </span>
            </div>
          </div>
        </div>

        {/* 2x2 Core Metrics Grid (Replaces flat receipt list) */}
        <div className="grid grid-cols-2 gap-2.5 my-3">
          {/* Buy Price */}
          <div className="tr-card p-3.5 rounded-2xl">
            <span className="text-xs text-tr-gray font-normal block">{t.positions.buyPrice}</span>
            <span className="text-base font-bold font-mono text-white tracking-tight mt-1 block">
              {formatCurrency(trade.open_rate)}
            </span>
          </div>

          {/* Current Price */}
          <div className="tr-card p-3.5 rounded-2xl">
            <span className="text-xs text-tr-gray font-normal block">{t.positions.currentPrice}</span>
            <span className="text-base font-bold font-mono text-white tracking-tight mt-1 block">
              {formatCurrency(currentRate)}
            </span>
          </div>

          {/* Invested Stake */}
          <div className="tr-card p-3.5 rounded-2xl flex flex-col justify-between">
            <span className="text-xs text-tr-gray font-normal block">{t.positions.invested}</span>
            <div className="mt-1">
              <span className="text-base font-bold font-mono text-white tracking-tight whitespace-nowrap block">
                {formatCurrency(trade.stake_amount)}
              </span>
              {trade.amount ? (
                <span className="text-[11px] text-tr-gray/70 font-mono font-normal block mt-0.5 whitespace-nowrap">
                  {trade.amount} {baseCurrency}
                </span>
              ) : null}
            </div>
          </div>

          {/* Stop-Loss */}
          <div className="tr-card p-3.5 rounded-2xl flex flex-col justify-between">
            <span className="text-xs text-tr-gray font-normal block">Stop-Loss</span>
            {trade.stop_loss_abs ? (
              <div className="mt-1">
                <span className="text-base font-bold font-mono text-white tracking-tight whitespace-nowrap block">
                  {formatCurrency(trade.stop_loss_abs)}
                </span>
                {currentRate > 0 && (
                  <span className="text-[11px] text-tr-red font-mono font-medium block mt-0.5 whitespace-nowrap">
                    -{formatPercent(((currentRate - trade.stop_loss_abs) / currentRate) * 100)}
                  </span>
                )}
              </div>
            ) : (
              <span className="text-base font-mono text-tr-gray mt-1 block">—</span>
            )}
          </div>
        </div>

        {/* Strategy & Bot Execution Group Card */}
        <div className="tr-card p-4 rounded-2xl space-y-2.5 my-3 text-xs">
          <div className="text-[11px] font-semibold text-white/70 uppercase tracking-wider mb-1">
            {language === 'de' ? 'Bot- & Handelsdaten' : 'Bot & Execution Details'}
          </div>

          <div className="flex items-center justify-between py-1 border-b border-white/[0.04]">
            <span className="text-tr-gray font-normal shrink-0 pr-3">{t.positions.strategy}</span>
            <div className="flex items-center space-x-1.5 min-w-0">
              <span className="font-mono text-white font-medium truncate">{trade.strategy || 'N/A'}</span>
              {trade.enter_tag && (
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-white/10 text-white/80 font-mono shrink-0">
                  {trade.enter_tag}
                </span>
              )}
            </div>
          </div>

          <div className="flex items-center justify-between py-1 border-b border-white/[0.04]">
            <span className="text-tr-gray font-normal">{t.positions.leverage}</span>
            <span className="font-mono text-white">
              {trade.leverage ? `${trade.leverage}x (${trade.is_short ? 'Short' : 'Long'})` : '1x (Spot)'}
            </span>
          </div>

          <div className="flex items-center justify-between py-1 border-b border-white/[0.04]">
            <span className="text-tr-gray font-normal">{t.positions.exchange}</span>
            <span className="font-mono text-white font-medium uppercase px-1.5 py-0.5 rounded bg-white/[0.06]">
              {trade.exchange || 'OKX'}
            </span>
          </div>

          {trade.min_rate && trade.max_rate && (
            <div className="flex items-center justify-between py-1 border-b border-white/[0.04]">
              <span className="text-tr-gray font-normal">{t.positions.minMax}</span>
              <span className="font-mono text-white/80">
                {formatCurrency(trade.min_rate)} – {formatCurrency(trade.max_rate)}
              </span>
            </div>
          )}

          <div className="flex items-center justify-between py-1">
            <span className="text-tr-gray font-normal">{t.positions.openedAt}</span>
            <span className="font-mono text-white/80">{formatDate(trade.open_date)}</span>
          </div>
        </div>

        {/* Executed Orders */}
        {trade.orders && trade.orders.length > 0 && (
          <div className="pt-3 border-t border-white/[0.08]">
            <span className="text-[11px] text-tr-gray font-normal block mb-2">
              {t.positions.executedOrders}
            </span>
            <div className="space-y-1.5">
              {trade.orders.map((order, idx) => (
                <div
                  key={order.order_id || idx}
                  className="flex items-center justify-between p-2.5 rounded-xl bg-white/[0.02] border border-white/[0.04] text-xs font-mono"
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
