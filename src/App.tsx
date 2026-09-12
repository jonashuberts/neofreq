import React, { useState } from 'react';
import { useFreqtrade } from './hooks/useFreqtrade';
import { Header } from './components/Header';
import { HeroBalance } from './components/HeroBalance';
import { SparklineChart } from './components/SparklineChart';
import { PositionCard } from './components/PositionCard';
import { CashAllocation } from './components/CashAllocation';
import { MetricsGrid } from './components/MetricsGrid';
import { TradeHistory } from './components/TradeHistory';
import { PositionDetailModal } from './components/PositionDetailModal';
import { SettingsModal } from './components/SettingsModal';
import { FreqtradeTrade } from './types/freqtrade';
import { Play } from 'lucide-react';
import { LanguageProvider, useLanguage } from './i18n/LanguageContext';

const MainDashboard: React.FC = () => {
  const { t } = useLanguage();
  const {
    config,
    updateConfig,
    toggleDemoMode,
    openTrades,
    balance,
    profit,
    daily,
    closedTrades,
    isConnected,
    isPolling,
    isLoading,
    lastSync,
    error,
    refresh,
  } = useFreqtrade();

  const [scrubbedValue, setScrubbedValue] = useState<number | null>(null);
  const [scrubbedDate, setScrubbedDate] = useState<string | null>(null);
  const [selectedTrade, setSelectedTrade] = useState<FreqtradeTrade | null>(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const currentTotalBalance = balance?.total ?? 0;

  const profitAbs =
    profit?.profit_all_fiat ?? openTrades.reduce((acc, t) => acc + (t.profit_abs || 0), 0);
  const profitPct =
    profit?.profit_all_percent ?? (openTrades.length > 0 ? openTrades[0].profit_pct : 0);

  // Clean error message so raw HTML dumps never appear
  const cleanErrorText = error
    ? error.includes('<!DOCTYPE') || error.length > 80
      ? t.common.offlineDesc
      : error
    : t.common.offlineDesc;

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center selection:bg-white selection:text-black">
      <div className="w-full max-w-5xl min-h-screen flex flex-col">
        {/* Clean Header */}
        <Header
          isConnected={isConnected}
          isPolling={isPolling}
          config={config}
          lastSync={lastSync}
          onRefresh={refresh}
          onOpenSettings={() => setIsSettingsOpen(true)}
        />

        {/* Clean, Non-intrusive Disconnected / Demo Banner */}
        {!isConnected && !isLoading && !config.demoMode && (
          <div className="mx-4 sm:mx-6 lg:mx-8 mt-4 p-3.5 rounded-xl bg-white/[0.03] border border-white/[0.08] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="text-xs font-medium text-white">{t.common.offlineTitle}</div>
              <div className="text-[11px] text-tr-gray mt-0.5">{cleanErrorText}</div>
            </div>

            <div className="flex items-center space-x-2 shrink-0">
              <button
                onClick={() => toggleDemoMode(true)}
                className="px-3.5 py-1.5 rounded-lg bg-white text-black font-medium text-xs hover:bg-white/90 transition-all flex items-center space-x-1.5"
              >
                <Play className="w-3 h-3 fill-current" />
                <span>{t.common.tryDemo}</span>
              </button>
              <button
                onClick={() => setIsSettingsOpen(true)}
                className="px-3 py-1.5 rounded-lg bg-white/[0.06] hover:bg-white/10 text-white font-normal text-xs transition-colors border border-white/10"
              >
                {t.common.settings}
              </button>
            </div>
          </div>
        )}

        {/* Unified Dashboard Layout (MacBook & Mobile) */}
        <main className="flex-1 px-3.5 sm:px-6 lg:px-8 py-2 sm:py-6 w-full max-w-full overflow-x-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-8 items-start w-full min-w-0">
            {/* Left Column (Hero Balance, Sparkline Chart, Metrics) */}
            <div className="lg:col-span-7 flex flex-col space-y-3 sm:space-y-4 w-full min-w-0">
              <HeroBalance
                currentBalance={currentTotalBalance}
                currencySymbol={balance?.symbol || '€'}
                profitAbs={profitAbs}
                profitPct={profitPct}
                scrubbedValue={scrubbedValue}
                scrubbedDate={scrubbedDate}
              />

              <SparklineChart
                data={daily}
                currentBalance={currentTotalBalance}
                onScrub={(val, date) => {
                  setScrubbedValue(val);
                  setScrubbedDate(date);
                }}
              />

              <MetricsGrid profit={profit} />
            </div>

            {/* Right Column (Open Positions, Cash Allocation, Trade History) */}
            <div className="lg:col-span-5 flex flex-col space-y-3.5 sm:space-y-5 w-full min-w-0">
              {/* Active Positions */}
              <div>
                <div className="flex items-center justify-between px-0.5 mb-2">
                  <h3 className="text-xs sm:text-sm font-medium text-white">
                    {t.positions.title}
                  </h3>
                  <span className="text-[11px] text-tr-gray font-normal">
                    {openTrades.length} {t.positions.activeInMarket.toLowerCase()}
                  </span>
                </div>

                {openTrades.length === 0 ? (
                  <div className="tr-card p-5 sm:p-6 text-center">
                    <div className="text-xs font-medium text-white">{t.positions.emptyTitle}</div>
                    <div className="text-[11px] text-tr-gray mt-1 max-w-xs mx-auto">
                      {t.positions.emptyDesc}
                    </div>
                  </div>
                ) : (
                  <div className="tr-card p-1.5 sm:p-2 divide-y divide-white/[0.04]">
                    {openTrades.map((trade) => (
                      <PositionCard
                        key={trade.trade_id}
                        trade={trade}
                        onSelect={(t) => setSelectedTrade(t)}
                      />
                    ))}
                  </div>
                )}
              </div>

              {/* Cash vs Crypto Allocation */}
              <CashAllocation balance={balance} />

              {/* Closed Trades History */}
              <TradeHistory trades={closedTrades} />
            </div>
          </div>
        </main>

        <footer className="px-6 py-4 text-center text-[11px] text-tr-gray/40 font-mono border-t border-white/[0.04]">
          NeoFreq
        </footer>

        {/* Modals */}
        <PositionDetailModal trade={selectedTrade} onClose={() => setSelectedTrade(null)} />

        <SettingsModal
          isOpen={isSettingsOpen}
          currentConfig={config}
          onClose={() => setIsSettingsOpen(false)}
          onSave={updateConfig}
        />
      </div>
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <LanguageProvider>
      <MainDashboard />
    </LanguageProvider>
  );
};
