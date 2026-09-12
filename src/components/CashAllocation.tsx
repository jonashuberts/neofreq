import React from 'react';
import { FreqtradeBalance } from '../types/freqtrade';
import { useLanguage } from '../i18n/LanguageContext';

interface CashAllocationProps {
  balance: FreqtradeBalance | null;
}

export const CashAllocation: React.FC<CashAllocationProps> = ({ balance }) => {
  const { t, formatCurrency } = useLanguage();

  if (!balance) return null;

  const total = balance.total || 0;

  const eurCurrency = balance.currencies.find((c) => c.currency === 'EUR' || c.currency === balance.stake);
  const freeCash = eurCurrency ? eurCurrency.free : 0;

  const cryptoCurrencies = balance.currencies.filter(
    (c) => c.currency !== 'EUR' && c.currency !== balance.stake
  );
  const cryptoTotal = cryptoCurrencies.reduce((sum, c) => sum + (c.est_stake || 0), 0);

  const cashPct = total > 0 ? (freeCash / total) * 100 : 0;
  const cryptoPct = total > 0 ? (cryptoTotal / total) * 100 : 0;

  return (
    <div>
      {/* Header: Outside, unified with all dashboard sections */}
      <div className="flex items-center justify-between px-0.5 mb-2">
        <h3 className="text-xs sm:text-sm font-medium text-white">
          {t.allocation.title}
        </h3>
        <span className="text-xs font-mono font-medium text-white/90">
          {formatCurrency(total)}
        </span>
      </div>

      {/* Card Container */}
      <div className="tr-card p-3.5 sm:p-4">
        {/* Minimalist Monochrome Segmented Bar */}
        <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden flex mb-2.5">
          <div
            style={{ width: `${Math.max(1, Math.min(99, cryptoPct))}%` }}
            className="h-full bg-white transition-all duration-500"
          />
          <div
            style={{ width: `${Math.max(1, Math.min(99, cashPct))}%` }}
            className="h-full bg-white/25 transition-all duration-500 ml-0.5"
          />
        </div>

        {/* Compact Breakdown Line */}
        <div className="flex items-center justify-between text-xs pt-0.5 font-mono">
          <div className="flex items-baseline space-x-1.5">
            <span className="text-tr-gray text-[11px] font-sans">{t.allocation.freeCash}</span>
            <span className="text-white font-medium text-xs">{formatCurrency(freeCash)}</span>
            <span className="text-[10px] text-tr-gray/60 font-sans">({cashPct.toFixed(0)}%)</span>
          </div>

          <div className="flex items-baseline space-x-1.5">
            <span className="text-tr-gray text-[11px] font-sans">{t.allocation.inCrypto}</span>
            <span className="text-white font-medium text-xs">{formatCurrency(cryptoTotal)}</span>
            <span className="text-[10px] text-tr-gray/60 font-sans">({cryptoPct.toFixed(0)}%)</span>
          </div>
        </div>
      </div>
    </div>
  );
};
