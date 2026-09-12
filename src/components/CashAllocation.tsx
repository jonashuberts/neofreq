import { Wallet } from 'lucide-react';
import { FreqtradeBalance } from '../types/freqtrade';

interface CashAllocationProps {
  balance: FreqtradeBalance | null;
}

export const CashAllocation: React.FC<CashAllocationProps> = ({ balance }) => {
  if (!balance) return null;

  const total = balance.total || 0;

  // Extract EUR Cash
  const eurCurrency = balance.currencies.find(c => c.currency === 'EUR' || c.currency === balance.stake);
  const freeCash = eurCurrency ? eurCurrency.free : 0;

  // Calculate Crypto total
  const cryptoCurrencies = balance.currencies.filter(c => c.currency !== 'EUR' && c.currency !== balance.stake);
  const cryptoTotal = cryptoCurrencies.reduce((sum, c) => sum + (c.est_stake || 0), 0);

  const cashPct = total > 0 ? (freeCash / total) * 100 : 0;
  const cryptoPct = total > 0 ? (cryptoTotal / total) * 100 : 0;

  const fmtCash = freeCash.toFixed(2);
  const fmtCrypto = cryptoTotal.toFixed(2);
  const fmtTotal = total.toFixed(2);

  return (
    <div className="tr-card p-4 sm:p-5 mt-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          <Wallet className="w-4 h-4 text-tr-gray" />
          <span className="text-xs uppercase font-bold tracking-wider text-tr-gray">
            Portfolio Aufteilung
          </span>
        </div>
        <span className="text-xs font-mono font-semibold text-white/90">
          Gesamt: {fmtTotal} €
        </span>
      </div>

      {/* Proportional Split Bar */}
      <div className="w-full h-3 bg-white/[0.06] rounded-full overflow-hidden flex p-0.5 mb-4">
        {/* Crypto segment */}
        <div
          style={{ width: `${Math.max(4, Math.min(96, cryptoPct))}%` }}
          className="h-full bg-gradient-to-r from-tr-green to-emerald-400 rounded-l-full transition-all duration-500"
          title={`Krypto: ${cryptoPct.toFixed(1)}%`}
        />
        {/* Cash segment */}
        <div
          style={{ width: `${Math.max(4, Math.min(96, cashPct))}%` }}
          className="h-full bg-gradient-to-r from-blue-500 to-indigo-400 rounded-r-full ml-0.5 transition-all duration-500"
          title={`Cash: ${cashPct.toFixed(1)}%`}
        />
      </div>

      {/* Detailed 2-column stats */}
      <div className="grid grid-cols-2 gap-3">
        {/* Cash card */}
        <div className="p-3 rounded-2xl bg-white/[0.02] border border-white/[0.04]">
          <div className="flex items-center justify-between text-xs text-tr-gray mb-1">
            <span className="flex items-center space-x-1">
              <span className="w-2 h-2 rounded-full bg-blue-400 inline-block" />
              <span>Freies EUR-Cash</span>
            </span>
            <span className="font-mono text-[11px]">{cashPct.toFixed(1)}%</span>
          </div>
          <div className="text-lg font-bold text-white font-mono">{fmtCash} €</div>
          <div className="text-[11px] text-tr-gray mt-0.5">Sofort verfügbar</div>
        </div>

        {/* Crypto card */}
        <div className="p-3 rounded-2xl bg-white/[0.02] border border-white/[0.04]">
          <div className="flex items-center justify-between text-xs text-tr-gray mb-1">
            <span className="flex items-center space-x-1">
              <span className="w-2 h-2 rounded-full bg-tr-green inline-block" />
              <span>In Krypto gebunden</span>
            </span>
            <span className="font-mono text-[11px]">{cryptoPct.toFixed(1)}%</span>
          </div>
          <div className="text-lg font-bold text-white font-mono">{fmtCrypto} €</div>
          <div className="text-[11px] text-tr-gray mt-0.5">
            {cryptoCurrencies.length} {cryptoCurrencies.length === 1 ? 'Position' : 'Positionen'} aktiv
          </div>
        </div>
      </div>
    </div>
  );
};
