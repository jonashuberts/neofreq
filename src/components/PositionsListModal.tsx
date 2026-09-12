import React from 'react';
import { X } from 'lucide-react';
import { FreqtradeTrade } from '../types/freqtrade';
import { PositionCard } from './PositionCard';
import { useLanguage } from '../i18n/LanguageContext';

interface PositionsListModalProps {
  isOpen: boolean;
  trades: FreqtradeTrade[];
  onClose: () => void;
  onSelectTrade: (trade: FreqtradeTrade) => void;
}

export const PositionsListModal: React.FC<PositionsListModalProps> = ({
  isOpen,
  trades,
  onClose,
  onSelectTrade,
}) => {
  const { t } = useLanguage();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm transition-opacity animate-in fade-in duration-150">
      <div className="absolute inset-0" onClick={onClose} />

      <div className="relative w-full max-w-md bg-black border border-white/[0.08] rounded-2xl p-4 sm:p-5 z-10 max-h-[85vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-white/[0.08] shrink-0">
          <div>
            <span className="text-[11px] text-tr-gray font-normal block mb-0.5">
              {trades.length} {t.positions.activeInMarket.toLowerCase()}
            </span>
            <h3 className="text-base sm:text-lg font-medium text-white">{t.positions.allPositions}</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full bg-white/[0.06] hover:bg-white/10 text-white/70 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable list */}
        <div className="overflow-y-auto no-scrollbar py-2 divide-y divide-white/[0.04] flex-1">
          {trades.map((trade) => (
            <PositionCard
              key={trade.trade_id}
              trade={trade}
              onSelect={(t) => {
                onSelectTrade(t);
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
