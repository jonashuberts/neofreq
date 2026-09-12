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

      {/* Segmented Bar */}
      <div className="w-full h-1.5 bg-white/[0.08] rounded-full overflow-hidden flex mb-3">
        <div
          style={{ width: `${Math.max(2, Math.min(98, cryptoPct))}%` }}
          className="h-full bg-tr-green transition-all duration-500"
        />
        <div
          style={{ width: `${Math.max(2, Math.min(98, cashPct))}%` }}
          className="h-full bg-white/40 transition-all duration-500 ml-0.5"
        />
      </div>

      {/* Two Columns */}
      <div className="grid grid-cols-2 gap-2 text-xs">
        <div className="p-2.5 rounded-xl bg-white/[0.02] border border-white/[0.04]">
          <div className="flex items-center justify-between text-tr-gray mb-0.5">
            <span className="flex items-center space-x-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-white/40 inline-block" />
              <span>{t.allocation.freeCash}</span>
            </span>
            <span className="font-mono text-[10px]">{formatPercent(cashPct)}</span>
          </div>
          <div className="text-sm font-semibold text-white font-mono">
            {formatCurrency(freeCash)}
          </div>
        </div>

        <div className="p-2.5 rounded-xl bg-white/[0.02] border border-white/[0.04]">
          <div className="flex items-center justify-between text-tr-gray mb-0.5">
            <span className="flex items-center space-x-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-tr-green inline-block" />
              <span>{t.allocation.inCrypto}</span>
            </span>
            <span className="font-mono text-[10px]">{formatPercent(cryptoPct)}</span>
          </div>
          <div className="text-sm font-semibold text-white font-mono">
            {formatCurrency(cryptoTotal)}
          </div>
        </div>
      </div>
    </div>
  );
};
