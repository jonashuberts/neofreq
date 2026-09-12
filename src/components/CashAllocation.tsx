import React from 'react';
import { Wallet } from 'lucide-react';
import { FreqtradeBalance } from '../types/freqtrade';
import { useLanguage } from '../i18n/LanguageContext';

interface CashAllocationProps {
  balance: FreqtradeBalance | null;
}

export const CashAllocation: React.FC<CashAllocationProps> = ({ balance }) => {
  const { t, formatCurrency, formatPercent } = useLanguage();

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
    <div className="tr-card p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-2.5">
        <div className="flex items-center space-x-2">
          <Wallet className="w-3.5 h-3.5 text-tr-gray" />
          <span className="text-[11px] uppercase font-medium tracking-wider text-tr-gray">
            {t.allocation.title}
          </span>
        </div>
        <span className="text-xs font-mono font-medium text-white/90">
          {formatCurrency(total)}
        </span>
      </div>

      {/* Minimalist Monochrome Segmented Bar */}
      <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden flex mb-3">
        <div
          style={{ width: `${Math.max(1, Math.min(99, cryptoPct))}%` }}
          className="h-full bg-white transition-all duration-500"
        />
        <div
          style={{ width: `${Math.max(1, Math.min(99, cashPct))}%` }}
          className="h-full bg-white/25 transition-all duration-500 ml-0.5"
        />
      </div>

      {/* Two Columns (Clean, Monochrome, Refined Typography) */}
      <div className="grid grid-cols-2 gap-3 text-xs">
        <div className="p-2.5 rounded-xl bg-white/[0.02]">
          <div className="flex items-center justify-between text-tr-gray text-[11px] mb-1">
            <span>{t.allocation.freeCash}</span>
            <span className="font-mono text-[10px] text-tr-gray/80">{formatPercent(cashPct)}</span>
          </div>
          <div className="text-sm font-medium text-white font-mono">
            {formatCurrency(freeCash)}
          </div>
        </div>

        <div className="p-2.5 rounded-xl bg-white/[0.02]">
          <div className="flex items-center justify-between text-tr-gray text-[11px] mb-1">
            <span>{t.allocation.inCrypto}</span>
            <span className="font-mono text-[10px] text-tr-gray/80">{formatPercent(cryptoPct)}</span>
          </div>
          <div className="text-sm font-medium text-white font-mono">
            {formatCurrency(cryptoTotal)}
          </div>
        </div>
      </div>
    </div>
  );
};
