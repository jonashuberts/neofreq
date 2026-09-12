export type Language = 'de' | 'en';

export interface Translations {
  common: {
    sync: string;
    connected: string;
    disconnected: string;
    demoMode: string;
    refresh: string;
    settings: string;
    cancel: string;
    save: string;
    done: string;
    loading: string;
    offlineTitle: string;
    offlineDesc: string;
    openSettings: string;
    tryDemo: string;
  };
  hero: {
    totalValue: string;
    today: string;
    allTime: string;
  };
  chart: {
    d1: string;
    w1: string;
    m1: string;
    y1: string;
    max: string;
  };
  positions: {
    title: string;
    activeInMarket: string;
    emptyTitle: string;
    emptyDesc: string;
    buyPrice: string;
    currentPrice: string;
    invested: string;
    stopLossProtected: string;
    unrealizedPnL: string;
    positionDetails: string;
    strategy: string;
    exchange: string;
    openedAt: string;
    executedOrders: string;
    short: string;
    long: string;
    leverage: string;
    slDistance: string;
    minMax: string;
    entryTag: string;
  };
  allocation: {
    title: string;
    total: string;
    freeCash: string;
    inCrypto: string;
    immediatelyAvailable: string;
    activePositions: string;
  };
  metrics: {
    title: string;
    winrate: string;
    profitFactor: string;
    totalTrades: string;
    maxDrawdown: string;
    closed: string;
    winLossRatio: string;
    maxDecline: string;
    tradingVolume: string;
    bestPair: string;
    avgDuration: string;
  };
  history: {
    title: string;
    entries: string;
    emptyTitle: string;
    emptyDesc: string;
    recently: string;
  };
  settings: {
    title: string;
    subtitle: string;
    serverUrlLabel: string;
    serverUrlPlaceholder: string;
    usernameLabel: string;
    passwordLabel: string;
    proxyLabel: string;
    proxyDesc: string;
    pollIntervalLabel: string;
    seconds: string;
    testConnection: string;
    testing: string;
    testSuccess: string;
    demoSimulated: string;
    presetsTitle: string;
    presetLocalhost: string;
    presetDemo: string;
  };
}

export const translations: Record<Language, Translations> = {
  de: {
    common: {
      sync: 'Sync',
      connected: 'Verbunden',
      disconnected: 'Getrennt',
      demoMode: 'Demo',
      refresh: 'Aktualisieren',
      settings: 'Einstellungen',
      cancel: 'Abbrechen',
      save: 'Speichern',
      done: 'Fertig',
      loading: 'Laden...',
      offlineTitle: 'Keine Live-Verbindung',
      offlineDesc: 'Prüfe Freqtrade-Server URL oder Zugangsdaten.',
      openSettings: 'Einstellungen öffnen',
      tryDemo: 'Demo Modus',
    },
    hero: {
      totalValue: 'GESAMTWERT',
      today: 'Heute',
      allTime: 'Gesamt',
    },
    chart: {
      d1: '1T',
      w1: '1W',
      m1: '1M',
      y1: '1J',
      max: 'MAX',
    },
    positions: {
      title: 'Offene Positionen',
      activeInMarket: 'Aktiv',
      emptyTitle: 'Keine aktiven Positionen',
      emptyDesc: 'Der Bot analysiert aktuell Marktindikatoren.',
      buyPrice: 'Kaufkurs',
      currentPrice: 'Aktueller Kurs',
      invested: 'Investiert',
      stopLossProtected: 'Stop-Loss geschützt bei',
      unrealizedPnL: 'Unrealisierter PnL',
      positionDetails: 'Position Details',
      strategy: 'Strategie',
      exchange: 'Börse',
      openedAt: 'Eröffnet am',
      executedOrders: 'Ausgeführte Orders',
      short: 'SHORT',
      long: 'LONG',
      leverage: 'Hebel',
      slDistance: 'Abstand zu SL',
      minMax: 'Tiefst / Höchstkurs',
      entryTag: 'Einstiegssignal',
    },
    allocation: {
      title: 'Portfolio-Aufteilung',
      total: 'Gesamt',
      freeCash: 'Cash',
      inCrypto: 'Krypto',
      immediatelyAvailable: 'Verfügbares Guthaben',
      activePositions: 'Position(en) aktiv',
    },
    metrics: {
      title: 'Bot-Performance',
      winrate: 'Winrate',
      profitFactor: 'Profit-Faktor',
      totalTrades: 'Trades gesamt',
      maxDrawdown: 'Max Drawdown',
      closed: 'abgeschlossen',
      winLossRatio: 'Verhältnis Win/Loss',
      maxDecline: 'Maximaler Rückgang',
      tradingVolume: 'Handelsvolumen',
      bestPair: 'Bester Markt',
      avgDuration: 'Ø Haltedauer',
    },
    history: {
      title: 'Geschlossene Trades',
      entries: 'Einträge',
      emptyTitle: 'Keine geschlossenen Trades',
      emptyDesc: 'Geschlossene Trades erscheinen hier automatisch.',
      recently: 'Vor kurzem',
    },
    settings: {
      title: 'Konfiguration',
      subtitle: 'Verbindung & Server',
      serverUrlLabel: 'Freqtrade REST API URL',
      serverUrlPlaceholder: 'http://localhost:8080 oder Remote-URL',
      usernameLabel: 'API Username',
      passwordLabel: 'API Passwort',
      proxyLabel: 'Lokalen Proxy nutzen',
      proxyDesc: 'Leitet Anfragen über /api weiter (verhindert CORS-Blockaden).',
      pollIntervalLabel: 'Aktualisierungsintervall',
      seconds: 'Sekunden',
      testConnection: 'Verbindung testen (Ping)',
      testing: 'Teste Verbindung...',
      testSuccess: 'Erfolgreich! Server antwortet.',
      demoSimulated: 'Demo-Modus aktiv (simulierte Daten)',
      presetsTitle: 'Schnell-Auswahl',
      presetLocalhost: 'Localhost (8080)',
      presetDemo: 'Demo Modus',
    },
  },
  en: {
    common: {
      sync: 'Sync',
      connected: 'Connected',
      disconnected: 'Disconnected',
      demoMode: 'Demo',
      refresh: 'Refresh',
      settings: 'Settings',
      cancel: 'Cancel',
      save: 'Save',
      done: 'Done',
      loading: 'Loading...',
      offlineTitle: 'No Live Connection',
      offlineDesc: 'Check your Freqtrade server URL and credentials.',
      openSettings: 'Open Settings',
      tryDemo: 'Demo Mode',
    },
    hero: {
      totalValue: 'PORTFOLIO VALUE',
      today: 'Today',
      allTime: 'All time',
    },
    chart: {
      d1: '1D',
      w1: '1W',
      m1: '1M',
      y1: '1Y',
      max: 'MAX',
    },
    positions: {
      title: 'Open Positions',
      activeInMarket: 'Active',
      emptyTitle: 'No open positions',
      emptyDesc: 'The bot is currently scanning market indicators.',
      buyPrice: 'Buy Price',
      currentPrice: 'Current Price',
      invested: 'Invested',
      stopLossProtected: 'Stop loss protected at',
      unrealizedPnL: 'Unrealized PnL',
      positionDetails: 'Position Details',
      strategy: 'Strategy',
      exchange: 'Exchange',
      openedAt: 'Opened at',
      executedOrders: 'Executed Orders',
      short: 'SHORT',
      long: 'LONG',
      leverage: 'Leverage',
      slDistance: 'SL Distance',
      minMax: 'Low / High Price',
      entryTag: 'Entry Signal',
    },
    allocation: {
      title: 'Asset Allocation',
      total: 'Total',
      freeCash: 'Free Cash',
      inCrypto: 'Invested in Crypto',
      immediatelyAvailable: 'Available balance',
      activePositions: 'active position(s)',
    },
    metrics: {
      title: 'Bot Performance',
      winrate: 'Win Rate',
      profitFactor: 'Profit Factor',
      totalTrades: 'Total Trades',
      maxDrawdown: 'Max Drawdown',
      closed: 'closed',
      winLossRatio: 'Win/Loss ratio',
      maxDecline: 'Maximum drawdown',
      tradingVolume: 'Trading Volume',
      bestPair: 'Top Market',
      avgDuration: 'Avg Duration',
    },
    history: {
      title: 'Trade History',
      entries: 'trades',
      emptyTitle: 'No closed trades',
      emptyDesc: 'Closed trades will automatically appear here.',
      recently: 'Recently',
    },
    settings: {
      title: 'Configuration',
      subtitle: 'Connection & Server',
      serverUrlLabel: 'Freqtrade REST API URL',
      serverUrlPlaceholder: 'http://localhost:8080 or remote URL',
      usernameLabel: 'API Username',
      passwordLabel: 'API Password',
      proxyLabel: 'Use Local Proxy',
      proxyDesc: 'Routes requests through /api (bypasses browser CORS).',
      pollIntervalLabel: 'Refresh Interval',
      seconds: 'seconds',
      testConnection: 'Test Connection (Ping)',
      testing: 'Testing connection...',
      testSuccess: 'Success! Server responded.',
      demoSimulated: 'Demo mode active (simulated data)',
      presetsTitle: 'Quick Presets',
      presetLocalhost: 'Localhost (8080)',
      presetDemo: 'Demo Mode',
    },
  },
};
