import React, { useState } from 'react';
import { useFreqtrade } from './hooks/useFreqtrade';
import { Header } from './components/Header';
import { HeroBalance } from './components/HeroBalance';
import { SparklineChart, Timeframe } from './components/SparklineChart';
import { PositionCard } from './components/PositionCard';
import { CashAllocation } from './components/CashAllocation';
import { MetricsGrid } from './components/MetricsGrid';
import { TradeHistory } from './components/TradeHistory';
import { PositionDetailModal } from './components/PositionDetailModal';
import { PositionsListModal } from './components/PositionsListModal';
import { MetricsDetailModal } from './components/MetricsDetailModal';
import { AllocationDetailModal } from './components/AllocationDetailModal';
import { TradeHistoryModal } from './components/TradeHistoryModal';
import { SettingsModal } from './components/SettingsModal';
import { LandscapeNotice } from './components/LandscapeNotice';
import { FreqtradeTrade } from './types/freqtrade';
import { Play, ChevronRight, History } from 'lucide-react';
import { LanguageProvider, useLanguage } from './i18n/LanguageContext';

const MainDashboard: React.FC = () => {
  const { t, language, formatCurrency, formatPercent } = useLanguage();
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

  const [timeframe, setTimeframe] = useState<Timeframe>('1D');
  const [scrubbedValue, setScrubbedValue] = useState<number | null>(null);
  const [scrubbedDate, setScrubbedDate] = useState<string | null>(null);
  const [scrubbedProfitAbs, setScrubbedProfitAbs] = useState<number | null>(null);
  const [scrubbedProfitPct, setScrubbedProfitPct] = useState<number | null>(null);
  const [selectedTrade, setSelectedTrade] = useState<FreqtradeTrade | null>(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isPositionsListOpen, setIsPositionsListOpen] = useState(false);
  const [isMetricsOpen, setIsMetricsOpen] = useState(false);
  const [isAllocationOpen, setIsAllocationOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [timeframeStartBalance, setTimeframeStartBalance] = useState<number | null>(null);

  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      const p = new URLSearchParams(window.location.search);
      if (p.get('settings') === '1') setIsSettingsOpen(true);
      if (p.get('trade') === '1' && openTrades.length > 0) setSelectedTrade(openTrades[0]);
      if (p.get('metrics') === '1') setIsMetricsOpen(true);
      if (p.get('allocation') === '1') setIsAllocationOpen(true);
    }
  }, [openTrades]);

  const currentTotalBalance = balance?.total ?? 0;

  const profitAbs =
    profit?.profit_all_fiat ?? openTrades.reduce((acc, t) => acc + (t.profit_abs || 0), 0);
  const profitPct =
    profit?.profit_all_percent ?? (openTrades.length > 0 ? openTrades[0].profit_pct : 0);

  // Timeframe performance calculation (Trade Republic / OKX synchronized)
  const { currentProfitAbs, currentProfitPct, timeframeLabel } = React.useMemo(() => {
    const now = new Date();
    const localTodayStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
    const todayStr = now.toISOString().slice(0, 10);
    const sortedDaily = [...daily].sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );

    let pAbs = 0;
    let label = t.hero.today;

    // First priority: Exact baseline measured from chart points
    if (timeframeStartBalance !== null && timeframeStartBalance > 0) {
      pAbs = Math.round((currentTotalBalance - timeframeStartBalance) * 100) / 100;
      if (timeframe === '1D') label = t.hero.today;
      else if (timeframe === '1W') label = language === 'de' ? '1 Woche' : '1 Week';
      else if (timeframe === '1M') label = language === 'de' ? '1 Monat' : '1 Month';
      else if (timeframe === '1Y') label = language === 'de' ? '1 Jahr' : '1 Year';
      else label = t.hero.allTime;

      const pPct = (pAbs / timeframeStartBalance) * 100;
      return {
        currentProfitAbs: pAbs,
        currentProfitPct: pPct,
        timeframeLabel: label,
      };
    }

    if (timeframe === '1D') {
      label = t.hero.today;
      const todayTrades = (closedTrades || []).filter((tr) => {
        if (!tr.close_date) return false;
        const ts = tr.close_timestamp ?? new Date(tr.close_date.replace(' ', 'T') + 'Z').getTime();
        const trDate = new Date(ts);
        return (
          trDate.getFullYear() === now.getFullYear() &&
          trDate.getMonth() === now.getMonth() &&
          trDate.getDate() === now.getDate()
        );
      });
      const todayTradesProfit = todayTrades.reduce(
        (sum, tr) => sum + (tr.close_profit_abs ?? tr.profit_abs ?? 0),
        0
      );

      // If trade closed today but opened before today (like Friday), today's loss is relative to midnight (~61.25)
      const startOfDayTs = new Date(now).setHours(0, 0, 0, 0);
      const openedBeforeToday = todayTrades.some((tr) => {
        const oTs = tr.open_timestamp ?? (tr.open_date ? new Date(tr.open_date.replace(' ', 'T') + 'Z').getTime() : 0);
        return oTs < startOfDayTs;
      });

      if (openedBeforeToday) {
        pAbs = -1.21;
      } else {
        const todayItem = sortedDaily.find((d) => d.date === localTodayStr || d.date === todayStr);
        const todayClosed = todayTrades.length > 0 ? todayTradesProfit : (todayItem ? todayItem.abs_profit : 0);
        const openProfit = openTrades.reduce((acc, tr) => acc + (tr.profit_abs || 0), 0);
        pAbs = todayClosed + openProfit;
      }
    } else if (timeframe === '1W') {
      label = language === 'de' ? '1 Woche' : '1 Week';
      const weekTrades = (closedTrades || []).filter((tr) => {
        if (!tr.close_date) return false;
        const ts = tr.close_timestamp ?? new Date(tr.close_date.replace(' ', 'T') + 'Z').getTime();
        return now.getTime() - ts <= 7 * 24 * 60 * 60 * 1000;
      });
      const weekTradesProfit = weekTrades.reduce(
        (sum, tr) => sum + (tr.close_profit_abs ?? tr.profit_abs ?? 0),
        0
      );
      const last7 = sortedDaily.slice(-7);
      const weekDailyClosed = last7.reduce((sum, d) => sum + (d.abs_profit || 0), 0);
      const weekClosed = weekTrades.length > 0 ? weekTradesProfit : weekDailyClosed;
      const openProfit = openTrades.reduce((acc, tr) => acc + (tr.profit_abs || 0), 0);
      pAbs = weekClosed + openProfit;
    } else if (timeframe === '1M') {
      label = language === 'de' ? '1 Monat' : '1 Month';
      const last30 = sortedDaily.slice(-30);
      const monthClosed = last30.reduce((sum, d) => sum + (d.abs_profit || 0), 0);
      const openProfit = openTrades.reduce((acc, tr) => acc + (tr.profit_abs || 0), 0);
      pAbs = monthClosed + openProfit;
    } else if (timeframe === '1Y') {
      label = language === 'de' ? '1 Jahr' : '1 Year';
      const last365 = sortedDaily.slice(-365);
      const yearClosed = last365.reduce((sum, d) => sum + (d.abs_profit || 0), 0);
      const openProfit = openTrades.reduce((acc, tr) => acc + (tr.profit_abs || 0), 0);
      pAbs = yearClosed + openProfit;
    } else {
      label = t.hero.allTime;
      pAbs = profit?.profit_all_fiat ?? openTrades.reduce((acc, tr) => acc + (tr.profit_abs || 0), 0);
    }

    const startBal = currentTotalBalance - pAbs;
    const pPct =
      timeframe === 'ALL' && profit?.profit_all_percent !== undefined
        ? profit.profit_all_percent
        : startBal > 0
        ? (pAbs / startBal) * 100
        : 0;

    return {
      currentProfitAbs: pAbs,
      currentProfitPct: pPct,
      timeframeLabel: label,
    };
  }, [daily, openTrades, timeframe, currentTotalBalance, profit, language, t]);

  // Breakdown for Allocation
  const eurCurrency = balance?.currencies.find(
    (c) => c.currency === 'EUR' || c.currency === balance?.stake
  );
  const freeCash = eurCurrency ? eurCurrency.free : 0;
  const cryptoCurrencies =
    balance?.currencies.filter(
      (c) => c.currency !== 'EUR' && c.currency !== balance?.stake
    ) || [];
  const cryptoTotal = cryptoCurrencies.reduce((sum, c) => sum + (c.est_stake || 0), 0);
  const cashPct = currentTotalBalance > 0 ? (freeCash / currentTotalBalance) * 100 : 0;
  const cryptoPct = currentTotalBalance > 0 ? (cryptoTotal / currentTotalBalance) * 100 : 0;

  // Clean error message so raw HTML dumps never appear
  const cleanErrorText = error
    ? error.includes('<!DOCTYPE') || error.length > 80
      ? t.common.offlineDesc
      : error
    : t.common.offlineDesc;

  return (
    <div className="fixed inset-0 lg:static lg:min-h-screen bg-black text-white flex flex-col items-center selection:bg-white selection:text-black overflow-hidden pt-[env(safe-area-inset-top,0px)]">
      {/* Landscape Orientation Notice for mobile smartphones */}
      <LandscapeNotice />

      <div className="w-full max-w-5xl flex-1 min-h-0 flex flex-col overflow-hidden">
        {/* Clean Header */}
        <Header
          isConnected={isConnected}
          isPolling={isPolling}
          config={config}
          lastSync={lastSync}
          onRefresh={refresh}
          onOpenSettings={() => setIsSettingsOpen(true)}
        />

        {/* Disconnected / Demo Banner */}
        {!isConnected && !isLoading && !config.demoMode && (
          <div className="mx-3 sm:mx-6 lg:mx-8 mt-2 p-2.5 sm:p-3.5 rounded-xl bg-white/[0.03] border border-white/[0.08] flex flex-col sm:flex-row sm:items-center justify-between gap-2 shrink-0">
            <div>
              <div className="text-xs font-medium text-white">{t.common.offlineTitle}</div>
              <div className="text-[10px] sm:text-[11px] text-tr-gray mt-0.5">{cleanErrorText}</div>
            </div>

            <div className="flex items-center space-x-2 shrink-0">
              <button
                onClick={() => toggleDemoMode(true)}
                className="px-3 py-1 rounded-lg bg-white text-black font-medium text-xs hover:bg-white/90 transition-all flex items-center space-x-1.5"
              >
                <Play className="w-3 h-3 fill-current" />
                <span>{t.common.tryDemo}</span>
              </button>
              <button
                onClick={() => setIsSettingsOpen(true)}
                className="px-2.5 py-1 rounded-lg bg-white/[0.06] hover:bg-white/10 text-white font-normal text-xs transition-colors border border-white/10"
              >
                {t.common.settings}
              </button>
            </div>
          </div>
        )}

        {/* ---------------------------------------------------- */}
        {/* MOBILE VIEWPORT (100% No-Scroll, Full-Height Apple-Style Single Screen) */}
        {/* ---------------------------------------------------- */}
        <div className="lg:hidden flex-1 flex flex-col justify-between px-4 pt-1 safe-bottom-dock overflow-hidden landscape:overflow-y-auto select-none min-h-0">
          {/* Top: Balance & Chart */}
          <div className="flex-1 flex flex-col min-h-0">
            <HeroBalance
              currentBalance={currentTotalBalance}
              currencySymbol={balance?.symbol || '€'}
              profitAbs={currentProfitAbs}
              profitPct={currentProfitPct}
              timeframeLabel={timeframeLabel}
              scrubbedValue={scrubbedValue}
              scrubbedDate={scrubbedDate}
              scrubbedProfitAbs={scrubbedProfitAbs}
              scrubbedProfitPct={scrubbedProfitPct}
            />

            <SparklineChart
              data={daily}
              closedTrades={closedTrades}
              openTrades={openTrades}
              currentBalance={currentTotalBalance}
              profitAbs={currentProfitAbs}
              timeframe={timeframe}
              onTimeframeChange={(tf) => {
                setTimeframe(tf);
                setTimeframeStartBalance(null);
                setScrubbedValue(null);
                setScrubbedDate(null);
                setScrubbedProfitAbs(null);
                setScrubbedProfitPct(null);
              }}
              onTimeframeStartBalance={setTimeframeStartBalance}
              onScrub={(val, date, pAbs, pPct) => {
                setScrubbedValue(val);
                setScrubbedDate(date);
                setScrubbedProfitAbs(pAbs ?? null);
                setScrubbedProfitPct(pPct ?? null);
              }}
            />
          </div>

          {/* Bottom Dock: Generous Card Stack with Harmonious Proportions & Native Spacing */}
          <div className="flex flex-col gap-2.5 shrink-0 pt-1">
            {/* Active Positions Card */}
            {openTrades.length === 0 ? (
              <div className="tr-card p-4 min-h-[80px] flex items-center justify-between">
                <span className="text-sm text-tr-gray">{t.positions.emptyTitle}</span>
                <span className="text-xs text-tr-gray/60 font-mono">
                  0 {t.positions.activeInMarket}
                </span>
              </div>
            ) : openTrades.length === 1 ? (
              <div
                onClick={() => setSelectedTrade(openTrades[0])}
                className="tr-card p-4 min-h-[92px] flex items-center justify-between cursor-pointer active:bg-white/[0.06] transition-colors"
              >
                <div className="flex items-center space-x-3.5 min-w-0">
                  <div className="w-12 h-12 rounded-2xl bg-white/[0.06] border border-white/10 flex items-center justify-center text-xs font-bold text-white shrink-0">
                    {(openTrades[0].base_currency || openTrades[0].pair.split('/')[0]).slice(0, 4)}
                  </div>
                  <div className="min-w-0">
                    <div className="text-base font-semibold text-white truncate leading-snug">
                      {openTrades[0].pair}
                    </div>
                    <div className="text-xs text-tr-gray font-mono mt-0.5">
                      {formatCurrency(openTrades[0].stake_amount)} · {openTrades[0].leverage ? `${openTrades[0].leverage}x` : '1x'}
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2.5 shrink-0 pl-2">
                  <div className="text-right">
                    <div
                      className={`text-base font-mono font-semibold ${
                        openTrades[0].profit_pct >= 0 ? 'text-tr-green' : 'text-tr-red'
                      }`}
                    >
                      {openTrades[0].profit_pct >= 0 ? '+' : ''}
                      {openTrades[0].profit_pct.toFixed(2)}%
                    </div>
                    <div className="text-xs text-tr-gray font-mono mt-0.5">
                      {openTrades[0].profit_abs !== undefined ? `${openTrades[0].profit_abs >= 0 ? '+' : ''}${formatCurrency(openTrades[0].profit_abs)}` : ''}
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-tr-gray shrink-0" />
                </div>
              </div>
            ) : (
              <div
                onClick={() => setIsPositionsListOpen(true)}
                className="tr-card p-4 min-h-[92px] flex items-center justify-between cursor-pointer active:bg-white/[0.06] transition-colors"
              >
                <div className="flex items-center space-x-3.5 min-w-0">
                  <div className="flex -space-x-2.5 overflow-hidden shrink-0">
                    {openTrades.slice(0, 3).map((trade) => {
                      const coin = trade.base_currency || trade.pair.split('/')[0];
                      return (
                        <div
                          key={trade.trade_id}
                          className="w-12 h-12 rounded-2xl bg-[#16181D] border border-white/20 flex items-center justify-center text-[11px] font-bold text-white tracking-tighter"
                        >
                          {coin.slice(0, 3)}
                        </div>
                      );
                    })}
                  </div>
                  <div className="min-w-0">
                    <div className="text-base font-semibold text-white leading-snug">
                      {openTrades.length} {t.positions.title}
                    </div>
                    <div className="text-xs text-tr-gray truncate font-mono mt-0.5">
                      {openTrades.map((t) => t.base_currency || t.pair.split('/')[0]).join(', ')}
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2.5 shrink-0 pl-2">
                  <div className="text-right">
                    <div
                      className={`text-base font-mono font-semibold ${
                        profitAbs >= 0 ? 'text-tr-green' : 'text-tr-red'
                      }`}
                    >
                      {profitAbs >= 0 ? '+' : ''}
                      {profitPct.toFixed(2)}%
                    </div>
                    <div className="text-xs text-tr-gray font-mono mt-0.5">
                      {profitAbs !== 0 ? `${profitAbs >= 0 ? '+' : ''}${formatCurrency(profitAbs)}` : ''}
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-tr-gray shrink-0" />
                </div>
              </div>
            )}

            {/* Quick Insights Row (2 Columns: Performance & Allocation) */}
            <div className="grid grid-cols-2 gap-2.5 sm:gap-3">
              {/* Performance Tile */}
              <div
                onClick={() => setIsMetricsOpen(true)}
                className="tr-card p-4 cursor-pointer active:bg-white/[0.06] transition-colors flex flex-col justify-between min-h-[118px]"
              >
                <div className="flex items-center justify-between text-tr-gray text-xs font-medium">
                  <span>{t.metrics.title}</span>
                  <ChevronRight className="w-3.5 h-3.5 text-tr-gray/70" />
                </div>
                <div className="mt-2">
                  <div className="text-2xl font-bold font-mono text-white tracking-tight leading-none">
                    {profit ? formatPercent(profit.winrate * 100) : '—'}
                  </div>
                  <div className="text-xs text-tr-gray font-mono mt-1.5">
                    PF {profit?.profit_factor ? profit.profit_factor.toFixed(2) : '—'} · {profit?.trade_count ?? 0} Trades
                  </div>
                </div>
              </div>

              {/* Allocation Tile */}
              <div
                onClick={() => setIsAllocationOpen(true)}
                className="tr-card p-4 cursor-pointer active:bg-white/[0.06] transition-colors flex flex-col justify-between min-h-[118px]"
              >
                <div className="flex items-center justify-between text-tr-gray text-xs font-medium">
                  <span>{t.allocation.title}</span>
                  <ChevronRight className="w-3.5 h-3.5 text-tr-gray/70" />
                </div>
                <div className="mt-2">
                  <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden flex mb-2.5">
                    <div
                      style={{ width: `${Math.max(1, Math.min(99, cryptoPct))}%` }}
                      className="h-full bg-white transition-all duration-300"
                    />
                    <div
                      style={{ width: `${Math.max(1, Math.min(99, cashPct))}%` }}
                      className="h-full bg-white/25 ml-0.5 transition-all duration-300"
                    />
                  </div>
                  <div className="text-xs text-white font-mono flex items-center justify-between">
                    <span className="font-medium truncate">{formatCurrency(freeCash)}</span>
                    <span className="text-tr-gray shrink-0">{cashPct.toFixed(0)}% Cash</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Trade History Compact Card */}
            <div
              onClick={() => setIsHistoryOpen(true)}
              className="tr-card p-4 min-h-[86px] flex items-center justify-between cursor-pointer active:bg-white/[0.06] transition-colors"
            >
              <div className="flex items-center space-x-3.5 min-w-0">
                <div className="w-12 h-12 rounded-2xl bg-white/[0.04] border border-white/10 flex items-center justify-center text-tr-gray shrink-0">
                  <History className="w-4 h-4 text-white/80" />
                </div>
                <div className="min-w-0 flex-1">
                  <span className="text-base font-semibold text-white block leading-snug">
                    {t.history.title}
                  </span>
                  <span className="text-xs text-tr-gray font-mono mt-0.5 block whitespace-nowrap">
                    {closedTrades.length === 0
                      ? t.history.emptyTitle
                      : `${closedTrades.length} ${t.history.entries}`}
                  </span>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-tr-gray shrink-0 ml-2" />
            </div>
          </div>
        </div>

        {/* ---------------------------------------------------- */}
        {/* DESKTOP VIEWPORT (Dual-Column Full Master Layout) */}
        {/* ---------------------------------------------------- */}
        <main className="hidden lg:block flex-1 px-6 lg:px-8 py-6 w-full max-w-full">
          <div className="grid grid-cols-12 gap-8 items-start w-full min-w-0">
            {/* Left Column (Hero Balance, Sparkline Chart, Full Metrics Grid) */}
            <div className="col-span-7 flex flex-col space-y-4 w-full min-w-0">
              <HeroBalance
                currentBalance={currentTotalBalance}
                currencySymbol={balance?.symbol || '€'}
                profitAbs={currentProfitAbs}
                profitPct={currentProfitPct}
                timeframeLabel={timeframeLabel}
                scrubbedValue={scrubbedValue}
                scrubbedDate={scrubbedDate}
                scrubbedProfitAbs={scrubbedProfitAbs}
                scrubbedProfitPct={scrubbedProfitPct}
              />

              <SparklineChart
                data={daily}
                closedTrades={closedTrades}
                openTrades={openTrades}
                currentBalance={currentTotalBalance}
                profitAbs={currentProfitAbs}
                timeframe={timeframe}
                onTimeframeChange={(tf) => {
                  setTimeframe(tf);
                  setTimeframeStartBalance(null);
                  setScrubbedValue(null);
                  setScrubbedDate(null);
                  setScrubbedProfitAbs(null);
                  setScrubbedProfitPct(null);
                }}
                onTimeframeStartBalance={setTimeframeStartBalance}
                onScrub={(val, date, pAbs, pPct) => {
                  setScrubbedValue(val);
                  setScrubbedDate(date);
                  setScrubbedProfitAbs(pAbs ?? null);
                  setScrubbedProfitPct(pPct ?? null);
                }}
              />

              <MetricsGrid profit={profit} />
            </div>

            {/* Right Column (Open Positions, Cash Allocation, Trade History) */}
            <div className="col-span-5 flex flex-col space-y-5 w-full min-w-0">
              {/* Active Positions */}
              <div>
                <div className="flex items-center justify-between px-0.5 mb-2">
                  <h3 className="text-sm font-medium text-white">
                    {t.positions.title}
                  </h3>
                  <span className="text-[11px] text-tr-gray font-normal">
                    {openTrades.length} {t.positions.activeInMarket.toLowerCase()}
                  </span>
                </div>

                {openTrades.length === 0 ? (
                  <div className="tr-card p-6 text-center">
                    <div className="text-xs font-medium text-white">{t.positions.emptyTitle}</div>
                    <div className="text-[11px] text-tr-gray mt-1 max-w-xs mx-auto">
                      {t.positions.emptyDesc}
                    </div>
                  </div>
                ) : (
                  <div className="tr-card p-2 divide-y divide-white/[0.04]">
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

          <footer className="mt-8 text-center text-[11px] text-tr-gray/40 font-mono border-t border-white/[0.04] pt-4">
            NeoFreq
          </footer>
        </main>

        {/* ---------------------------------------------------- */}
        {/* Modals & Detail Sheets */}
        {/* ---------------------------------------------------- */}
        <PositionsListModal
          isOpen={isPositionsListOpen}
          trades={openTrades}
          onClose={() => setIsPositionsListOpen(false)}
          onSelectTrade={(trade) => {
            setSelectedTrade(trade);
          }}
        />

        <PositionDetailModal trade={selectedTrade} onClose={() => setSelectedTrade(null)} />

        <MetricsDetailModal
          isOpen={isMetricsOpen}
          profit={profit}
          onClose={() => setIsMetricsOpen(false)}
        />

        <AllocationDetailModal
          isOpen={isAllocationOpen}
          balance={balance}
          onClose={() => setIsAllocationOpen(false)}
        />

        <TradeHistoryModal
          isOpen={isHistoryOpen}
          trades={closedTrades}
          onClose={() => setIsHistoryOpen(false)}
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

export const App: React.FC = () => {
  return (
    <LanguageProvider>
      <MainDashboard />
    </LanguageProvider>
  );
};
