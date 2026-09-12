import {
  FreqtradeTrade,
  FreqtradeBalance,
  FreqtradeProfit,
  FreqtradeDailyResponse,
  FreqtradeTradesResponse,
  ConnectionConfig
} from '../types/freqtrade';

import {
  mockOpenTrades,
  mockBalance,
  mockProfit,
  mockDaily,
  mockClosedTrades
} from './mockData';

const STORAGE_KEY = 'freqtrade_neobroker_config';

const isGithubPages =
  typeof window !== 'undefined' && window.location.hostname.includes('github.io');

const isLocalhost =
  typeof window !== 'undefined' &&
  (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');

const urlParams = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : null;
const isDemoFromQuery = urlParams ? urlParams.get('demo') === 'true' || urlParams.get('demo') === '1' : false;

export const DEFAULT_CONFIG: ConnectionConfig = {
  serverUrl: import.meta.env.VITE_FREQTRADE_URL || 'http://localhost:8080',
  username: import.meta.env.VITE_FREQTRADE_USER || '',
  password: import.meta.env.VITE_FREQTRADE_PASSWORD || '',
  useProxy: isLocalhost,
  demoMode: import.meta.env.VITE_DEMO_MODE === 'true' || isDemoFromQuery || isGithubPages,
  pollInterval: Number(import.meta.env.VITE_POLL_INTERVAL) || 12000
};

export function loadConnectionConfig(): ConnectionConfig {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      return { ...DEFAULT_CONFIG, ...parsed };
    }
  } catch (err) {
    console.warn('Failed to parse connection config from localStorage:', err);
  }
  return { ...DEFAULT_CONFIG };
}

export function saveConnectionConfig(config: ConnectionConfig): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
  } catch (err) {
    console.error('Failed to save connection config to localStorage:', err);
  }
}

class FreqtradeApiClient {
  private config: ConnectionConfig;

  constructor() {
    this.config = loadConnectionConfig();
  }

  public updateConfig(newConfig: ConnectionConfig) {
    this.config = { ...newConfig };
    saveConnectionConfig(this.config);
  }

  public getConfig(): ConnectionConfig {
    return { ...this.config };
  }

  private getAuthHeader(): Record<string, string> {
    if (this.config.username && this.config.password) {
      const token = btoa(`${this.config.username}:${this.config.password}`);
      return { Authorization: `Basic ${token}` };
    }
    return {};
  }

  private buildUrl(endpoint: string): string {
    const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
    if (this.config.useProxy) {
      // In proxy mode, route through current origin's /api proxy
      return cleanEndpoint;
    }
    const rawUrl = (this.config.serverUrl && this.config.serverUrl.trim())
      ? this.config.serverUrl.trim()
      : 'http://localhost:8080';
    const baseUrl = rawUrl.replace(/\/+$/, '');
    return `${baseUrl}${cleanEndpoint}`;
  }

  private async request<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const url = this.buildUrl(endpoint);
    const headers = {
      'Accept': 'application/json',
      ...this.getAuthHeader(),
      ...(options?.headers || {})
    };

    const res = await fetch(url, {
      ...options,
      headers
    });

    if (!res.ok) {
      const errorText = await res.text().catch(() => res.statusText);
      throw new Error(`API Error (${res.status}): ${errorText || res.statusText}`);
    }

    return res.json() as Promise<T>;
  }

  // Ping endpoint
  public async ping(): Promise<{ status: string }> {
    if (this.config.demoMode) {
      return { status: 'pong' };
    }
    return this.request<{ status: string }>('/api/v1/ping');
  }

  // Get currently active open trades
  public async getStatus(): Promise<FreqtradeTrade[]> {
    if (this.config.demoMode) {
      return mockOpenTrades;
    }
    return this.request<FreqtradeTrade[]>('/api/v1/status');
  }

  // Get account and wallet balances
  public async getBalance(): Promise<FreqtradeBalance> {
    if (this.config.demoMode) {
      return mockBalance;
    }
    return this.request<FreqtradeBalance>('/api/v1/balance');
  }

  // Get lifetime and cumulative profit metrics
  public async getProfit(): Promise<FreqtradeProfit> {
    if (this.config.demoMode) {
      return mockProfit;
    }
    return this.request<FreqtradeProfit>('/api/v1/profit');
  }

  // Get daily returns for sparkline chart
  public async getDaily(timescale = 30): Promise<FreqtradeDailyResponse> {
    if (this.config.demoMode) {
      return mockDaily;
    }
    return this.request<FreqtradeDailyResponse>(`/api/v1/daily?timescale=${timescale}`);
  }

  // Get closed trade history
  public async getTrades(limit = 10): Promise<FreqtradeTradesResponse> {
    if (this.config.demoMode) {
      return mockClosedTrades;
    }
    return this.request<FreqtradeTradesResponse>(`/api/v1/trades?limit=${limit}`);
  }
}

export const api = new FreqtradeApiClient();
