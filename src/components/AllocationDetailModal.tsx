import React from 'react';
import { X, PieChart } from 'lucide-react';
import { FreqtradeBalance } from '../types/freqtrade';
import { useLanguage } from '../i18n/LanguageContext';

interface AllocationDetailModalProps {
  isOpen: boolean;
  balance: FreqtradeBalance | null;
  onClose: () => void;
}

export const AllocationDetailModal: React.FC<AllocationDetailModalProps> = ({
  isOpen,
  balance,
  onClose,
}) => {
  const { t, formatCurrency } = useLanguage();

  if (!isOpen || !balance) return null;

  const total = balance.total || 0;
  const eurCurrency = balance.currencies.find(
    (c) => c.currency === 'EUR' || c.currency === balance.stake
  );
  const freeCash = eurCurrency ? eurCurrency.free : 0;

  const cryptoCurrencies = balance.currencies.filter(
    (c) => c.currency !== 'EUR' && c.currency !== balance.stake && (c.balance > 0 || (c.est_stake && c.est_stake > 0))
  );
  const cryptoTotal = cryptoCurrencies.reduce((sum, c) => sum + (c.est_stake || 0), 0);

  const cashPct = total > 0 ? (freeCash / total) * 100 : 0;
  const cryptoPct = total > 0 ? (cryptoTotal / total) * 100 : 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4 pt-[max(calc(env(safe-area-inset-top,0px)+16px),24px)] pb-[max(calc(env(safe-area-inset-bottom,0px)+16px),24px)] bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="absolute inset-0" onClick={onClose} />
      <div className="relative w-full max-w-md bg-black border border-white/[0.08] rounded-2xl p-4 sm:p-5 z-10 max-h-[calc(100dvh-env(safe-area-inset-top,0px)-env(safe-area-inset-bottom,0px)-40px)] flex flex-col my-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-white/[0.08] shrink-0">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-xl bg-white/[0.06] border border-white/10 flex items-center justify-center">
              <PieChart className="w-4 h-4 text-white" />
            </div>
            <div>
              <span className="text-[11px] text-tr-gray font-normal block">
                {t.hero.totalValue}: {formatCurrency(total)}
              </span>
              <h3 className="text-base font-medium text-white">{t.allocation.title}</h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full bg-white/[0.06] hover:bg-white/10 text-white/70 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Visual Allocation Bar */}
        <div className="py-4 border-b border-white/[0.04]">
          <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden flex mb-2.5">
            <div
              style={{ width: `${Math.max(1, Math.min(99, cryptoPct))}%` }}
              className="h-full bg-white transition-all duration-500"
            />
            <div
              style={{ width: `${Math.max(1, Math.min(99, cashPct))}%` }}
              className="h-full bg-white/25 transition-all duration-500 ml-0.5"
            />
          </div>

          <div className="grid grid-cols-2 gap-2.5 text-xs pt-1">
            <div className="tr-card p-3.5 rounded-2xl">
              <span className="text-xs text-tr-gray font-normal block">{t.allocation.freeCash}</span>
              <span className="text-base font-bold font-mono text-white tracking-tight mt-1 block">
                {formatCurrency(freeCash)}
              </span>
              <span className="text-[11px] text-tr-gray/70 font-mono">({cashPct.toFixed(1)}%)</span>
            </div>

            <div className="tr-card p-3.5 rounded-2xl">
              <span className="text-xs text-tr-gray font-normal block">{t.allocation.inCrypto}</span>
              <span className="text-base font-bold font-mono text-white tracking-tight mt-1 block">
                {formatCurrency(cryptoTotal)}
              </span>
              <span className="text-[11px] text-tr-gray/70 font-mono">({cryptoPct.toFixed(1)}%)</span>
            </div>
          </div>
        </div>

        {/* Breakdown by Assets */}
        <div className="overflow-y-auto no-scrollbar py-2 flex-1 divide-y divide-white/[0.04]">
          <div className="text-[11px] font-medium text-tr-gray px-1 py-1.5 uppercase tracking-wider font-mono">
            Assets
          </div>
          {eurCurrency && (
            <div className="py-2 px-1 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-6 h-6 rounded-md bg-white/[0.06] flex items-center justify-center text-[10px] font-bold text-white">
                  EUR
                </div>
                <div>
                  <div className="text-xs font-medium text-white">Euro (Cash)</div>
                  <div className="text-[10px] text-tr-gray font-mono">Verfügbar: {formatCurrency(eurCurrency.free)}</div>
                </div>
              </div>
              <div className="text-right font-mono">
                <div className="text-xs font-medium text-white">{formatCurrency(eurCurrency.balance)}</div>
                <div className="text-[10px] text-tr-gray">{cashPct.toFixed(1)}%</div>
              </div>
            </div>
          )}

          {cryptoCurrencies.map((coin) => {
            const coinVal = coin.est_stake || 0;
            const coinPct = total > 0 ? (coinVal / total) * 100 : 0;
            return (
              <div key={coin.currency} className="py-2 px-1 flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-6 h-6 rounded-md bg-white/10 flex items-center justify-center text-[10px] font-bold text-white">
                    {coin.currency.slice(0, 3)}
                  </div>
                  <div>
                    <div className="text-xs font-medium text-white">{coin.currency}</div>
                    <div className="text-[10px] text-tr-gray font-mono">
                      {coin.balance.toFixed(4)} {coin.currency}
                    </div>
                  </div>
                </div>
                <div className="text-right font-mono">
                  <div className="text-xs font-medium text-white">{formatCurrency(coinVal)}</div>
                  <div className="text-[10px] text-tr-gray">{coinPct.toFixed(1)}%</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
