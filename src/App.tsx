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

  const [activeTab, setActiveTab] = useState<'portfolio' | 'cash'>('portfolio');
  const [scrubbedValue, setScrubbedValue] = useState<number | null>(null);
  const [scrubbedDate, setScrubbedDate] = useState<string | null>(null);
  const [selectedTrade, setSelectedTrade] = useState<FreqtradeTrade | null>(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Extract balances
  const currentTotalBalance = balance?.total ?? 0;
  const eurCurrency = balance?.currencies.find((c) => c.currency === 'EUR' || c.currency === balance?.stake);
  const freeCash = eurCurrency ? eurCurrency.free : 0;

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
      <div className="w-full max-w-6xl min-h-screen flex flex-col">
        {/* Header with Portfolio | Cash tabs and profile button */}
        <Header
          isConnected={isConnected}
          isPolling={isPolling}
          config={config}
          lastSync={lastSync}
          activeTab={activeTab}
          onTabChange={setActiveTab}
          onRefresh={refresh}
          onOpenSettings={() => setIsSettingsOpen(true)}
        />

        {/* Clean, Non-intrusive Disconnected / Demo Banner */}
        {!isConnected && !isLoading && !config.demoMode && (
          <div className="mx-4 sm:mx-6 lg:mx-8 mt-4 p-4 rounded-2xl bg-white/[0.03] border border-white/[0.08] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="text-sm font-semibold text-white">{t.common.offlineTitle}</div>
              <div className="text-xs text-tr-gray mt-0.5">{cleanErrorText}</div>
            </div>

            <div className="flex items-center space-x-2 shrink-0">
              <button
                onClick={() => toggleDemoMode(true)}
                className="px-4 py-2 rounded-xl bg-white text-black font-semibold text-xs hover:bg-white/90 transition-all flex items-center space-x-1.5 shadow-sm"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>{t.common.tryDemo}</span>
              </button>
              <button
                onClick={() => setIsSettingsOpen(true)}
                className="px-3.5 py-2 rounded-xl bg-white/[0.06] hover:bg-white/10 text-white font-medium text-xs transition-colors border border-white/10"
              >
                {t.common.settings}
              </button>
            </div>
          </div>
        )}

        {/* Content Area */}
        <main className="flex-1 px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
          {activeTab === 'portfolio' ? (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 items-start">
              {/* Left Column on Desktop (Hero Balance, Chart, Metrics) */}
              <div className="lg:col-span-7 flex flex-col space-y-4">
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

              {/* Right Column on Desktop (Investments / Open Positions & Trade History) */}
              <div className="lg:col-span-5 flex flex-col space-y-6">
                <div>
                  <div className="flex items-center justify-between px-1 mb-2">
                    <div className="text-lg font-bold text-white tracking-tight">
                      {t.positions.title}
                    </div>
                    {openTrades.length > 0 && (
                      <span className="text-xs text-tr-gray font-medium">
                        {openTrades.length} {t.positions.activeInMarket.toLowerCase()}
                      </span>
                    )}
                  </div>

                  {openTrades.length === 0 ? (
                    <div className="py-8 px-4 text-center border border-white/[0.06] rounded-2xl bg-white/[0.02]">
                      <div className="text-sm font-semibold text-white">{t.positions.emptyTitle}</div>
                      <div className="text-xs text-tr-gray mt-1 max-w-xs mx-auto">
                        {t.positions.emptyDesc}
                      </div>
                    </div>
                  ) : (
                    <div className="divide-y divide-white/[0.06] border-y border-white/[0.06]">
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

                <TradeHistory trades={closedTrades} />
              </div>
            </div>
          ) : (
            /* Cash Tab View */
            <div className="max-w-2xl mx-auto py-4 space-y-6">
              <div className="pt-2">
                <div className="text-xs font-medium text-tr-gray mb-1">
                  {t.allocation.immediatelyAvailable}
                </div>
                <div className="text-4xl sm:text-5xl font-bold text-white tracking-tight font-mono">
                  {freeCash.toFixed(2)} €
                </div>
              </div>

              <CashAllocation balance={balance} />
            </div>
          )}
        </main>

        <footer className="px-6 py-4 text-center text-xs text-tr-gray/40 font-mono border-t border-white/[0.04]">
          NeoFreq · Freqtrade
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
