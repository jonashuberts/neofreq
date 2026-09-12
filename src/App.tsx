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
import { AlertTriangle, Sparkles } from 'lucide-react';

export const App: React.FC = () => {
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
    refresh
  } = useFreqtrade();

  const [scrubbedValue, setScrubbedValue] = useState<number | null>(null);
  const [scrubbedDate, setScrubbedDate] = useState<string | null>(null);
  const [selectedTrade, setSelectedTrade] = useState<FreqtradeTrade | null>(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Compute total balance
  const currentTotalBalance = balance?.total ?? 0;

  // Compute daily / overall profit for hero pill
  const profitAbs = profit?.profit_all_fiat ?? (openTrades.reduce((acc, t) => acc + (t.profit_abs || 0), 0));
  const profitPct = profit?.profit_all_percent ?? (openTrades.length > 0 ? openTrades[0].profit_pct : 0);

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center">
      {/* Container constrained to mobile phone max-width for authentic Trade Republic app feel, but centered & clean on desktop */}
      <div className="w-full max-w-md min-h-screen flex flex-col bg-black pb-12">
        {/* Top App Header */}
        <Header
          isConnected={isConnected}
          isPolling={isPolling}
          config={config}
          lastSync={lastSync}
          onRefresh={refresh}
          onOpenSettings={() => setIsSettingsOpen(true)}
        />

        {/* Connection Warning Banner if offline */}
        {!isConnected && !isLoading && (
          <div className="mx-4 mt-4 p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-200/90 flex items-start space-x-2.5">
            <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <div className="flex-1">
              <span className="font-semibold block text-amber-300">Keine Live-Verbindung</span>
              <span className="text-[11px] block text-amber-200/80 mt-0.5">
                {error || 'Prüfe Freqtrade-Server URL, Tailscale-Verbindung oder Zugangsdaten.'}
              </span>
              <div className="mt-2 flex space-x-2">
                <button
                  onClick={() => setIsSettingsOpen(true)}
                  className="px-2.5 py-1 rounded-lg bg-amber-400/20 text-amber-200 font-semibold text-[11px] hover:bg-amber-400/30"
                >
                  Einstellungen öffnen
                </button>
                <button
                  onClick={() => toggleDemoMode(true)}
                  className="px-2.5 py-1 rounded-lg bg-purple-500/20 text-purple-200 font-semibold text-[11px] hover:bg-purple-500/30 flex items-center space-x-1"
                >
                  <Sparkles className="w-3 h-3" />
                  <span>Demo Modus</span>
                </button>
              </div>
            </div>
          </div>
        )}

        <main className="flex-1">
          {/* Hero Section: Balance & Performance Pill */}
          <HeroBalance
            currentBalance={currentTotalBalance}
            currencySymbol={balance?.symbol || '€'}
            profitAbs={profitAbs}
            profitPct={profitPct}
            scrubbedValue={scrubbedValue}
            scrubbedDate={scrubbedDate}
          />

          {/* Sparkline Curve with interactive touch scrub */}
          <SparklineChart
            data={daily}
            currentBalance={currentTotalBalance}
            onScrub={(val, date) => {
              setScrubbedValue(val);
              setScrubbedDate(date);
            }}
          />

          <div className="px-4 sm:px-6 space-y-5">
            {/* Active Crypto Positions Section */}
            <div>
              <div className="flex items-center justify-between px-1 mb-2.5">
                <div className="text-xs uppercase font-bold tracking-wider text-tr-gray">
                  Offene Positionen ({openTrades.length})
                </div>
                {openTrades.length > 0 && (
                  <span className="text-[11px] text-emerald-400 font-medium">
                    Aktiv im Markt
                  </span>
                )}
              </div>

              {openTrades.length === 0 ? (
                <div className="tr-card p-6 text-center">
                  <div className="text-sm font-semibold text-white">Keine aktiven Positionen</div>
                  <div className="text-xs text-tr-gray mt-1 max-w-xs mx-auto">
                    Der Freqtrade Bot analysiert aktuell die Marktindikatoren für neue Einstiegschancen.
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
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

            {/* Performance KPIs Grid */}
            <MetricsGrid profit={profit} />

            {/* Closed Trades History */}
            <TradeHistory trades={closedTrades} />
          </div>
        </main>

        {/* Minimal Footer */}
        <footer className="px-6 pt-4 text-center text-xs text-tr-gray/60 font-mono">
          NeoFreq · Freqtrade Neobroker UI
        </footer>

        {/* Modals */}
        <PositionDetailModal
          trade={selectedTrade}
          onClose={() => setSelectedTrade(null)}
        />

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
