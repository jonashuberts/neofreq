import { useState, useEffect, useCallback, useRef } from 'react';
import {
  FreqtradeTrade,
  FreqtradeBalance,
  FreqtradeProfit,
  FreqtradeDailyItem,
  ConnectionConfig
} from '../types/freqtrade';
import { api, loadConnectionConfig } from '../services/freqtradeApi';

export function useFreqtrade() {
  const [config, setConfig] = useState<ConnectionConfig>(loadConnectionConfig());
  const [openTrades, setOpenTrades] = useState<FreqtradeTrade[]>([]);
  const [balance, setBalance] = useState<FreqtradeBalance | null>(null);
  const [profit, setProfit] = useState<FreqtradeProfit | null>(null);
  const [daily, setDaily] = useState<FreqtradeDailyItem[]>([]);
  const [closedTrades, setClosedTrades] = useState<FreqtradeTrade[]>([]);
  
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [isPolling, setIsPolling] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [lastSync, setLastSync] = useState<Date | null>(null);
  const [error, setError] = useState<string | null>(null);

  const isMounted = useRef(true);

  const fetchAll = useCallback(async (showLoadingSpinner = false) => {
    if (showLoadingSpinner) setIsLoading(true);
    setIsPolling(true);
    setError(null);

    try {
      // 1. Check ping
      await api.ping();

      // 2. Fetch all critical endpoints in parallel
      const [statusRes, balanceRes, profitRes, dailyRes, tradesRes] = await Promise.allSettled([
        api.getStatus(),
        api.getBalance(),
        api.getProfit(),
        api.getDaily(30),
        api.getTrades(10)
      ]);

      if (!isMounted.current) return;

      if (statusRes.status === 'fulfilled') {
        setOpenTrades(statusRes.value);
      }
      if (balanceRes.status === 'fulfilled') {
        setBalance(balanceRes.value);
      }
      if (profitRes.status === 'fulfilled') {
        setProfit(profitRes.value);
      }
      if (dailyRes.status === 'fulfilled' && dailyRes.value.data) {
        setDaily(dailyRes.value.data);
      }
      if (tradesRes.status === 'fulfilled' && tradesRes.value.trades) {
        setClosedTrades(tradesRes.value.trades);
      }

      setIsConnected(true);
      setLastSync(new Date());
      setError(null);
    } catch (err: any) {
      if (!isMounted.current) return;
      setIsConnected(false);
      const msg = err?.message || 'Verbindung zum Freqtrade-Server fehlgeschlagen';
      
      // Helpful hint for CORS
      if (msg.includes('Failed to fetch') || msg.includes('NetworkError')) {
        setError('Verbindung blockiert (CORS oder Server offline). Prüfe URL oder aktiviere den Proxy-Modus in den Einstellungen.');
      } else {
        setError(msg);
      }
    } finally {
      if (isMounted.current) {
        setIsPolling(false);
        setIsLoading(false);
      }
    }
  }, []);

  const updateConfig = useCallback((newConfig: ConnectionConfig) => {
    api.updateConfig(newConfig);
    setConfig(newConfig);
    fetchAll(true);
  }, [fetchAll]);

  const toggleDemoMode = useCallback((enabled: boolean) => {
    const newConfig = { ...config, demoMode: enabled };
    updateConfig(newConfig);
  }, [config, updateConfig]);

  // Handle lifecycle and polling
  useEffect(() => {
    isMounted.current = true;
    fetchAll(true);

    const intervalId = setInterval(() => {
      fetchAll(false);
    }, Math.max(5000, config.pollInterval || 12000));

    return () => {
      isMounted.current = false;
      clearInterval(intervalId);
    };
  }, [fetchAll, config.pollInterval, config.serverUrl, config.demoMode, config.useProxy]);

  return {
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
    refresh: () => fetchAll(false)
  };
}
