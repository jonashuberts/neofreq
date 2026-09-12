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
    viewAll: string;
    allPositions: string;
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
    viewAllMetrics: string;
    metricsDetails: string;
    realizedProfit: string;
    activeSince: string;
  };
  history: {
    title: string;
    entries: string;
    emptyTitle: string;
    emptyDesc: string;
    recently: string;
  };
  landscape: {
    title: string;
    desc: string;
    dismiss: string;
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
    modeTitle: string;
    modeLive: string;
    modeLiveDesc: string;
    modeDemo: string;
    modeDemoDesc: string;
    modeDemoBannerHint: string;
    defaultUrlHint: string;
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
      totalValue: 'Gesamtwert',
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
      viewAll: 'Alle anzeigen',
      allPositions: 'Alle offenen Positionen',
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
      viewAllMetrics: 'Alle Kennzahlen',
      metricsDetails: 'Bot-Performance Details',
      realizedProfit: 'Realisierter Nettogewinn',
      activeSince: 'Aktiv seit',
    },
    history: {
      title: 'Trade-Historie',
      entries: 'abgeschlossene Trades',
      emptyTitle: 'Keine abgeschlossenen Trades',
      emptyDesc: 'Geschlossene Trades erscheinen hier automatisch.',
      recently: 'Vor kurzem',
    },
    landscape: {
      title: 'Bitte Gerät ins Hochformat drehen',
      desc: 'NeoFreq ist für die mobile Nutzung im Hochformat optimiert.',
      dismiss: 'Im Querformat fortfahren',
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
      testConnection: 'Verbindung testen',
      testing: 'Teste Verbindung...',
      testSuccess: 'Erfolgreich! Server antwortet.',
      demoSimulated: 'Demo-Modus aktiv (simulierte Daten)',
      presetsTitle: 'Schnell-Auswahl',
      presetLocalhost: 'Localhost (8080)',
      presetDemo: 'Demo Modus',
      modeTitle: 'Betriebsmodus',
      modeLive: 'Live-Server',
      modeLiveDesc: 'Verbindung mit echtem Freqtrade-Server',
      modeDemo: 'Demo-Modus',
      modeDemoDesc: 'Simulierte Beispieldaten zum Testen',
      modeDemoBannerHint: 'Schalte oben auf "Live-Server" um, um deinen echten Bot anzubinden.',
      defaultUrlHint: 'Wird nichts eingetragen, gilt automatisch http://localhost:8080 als Standard.',
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
      totalValue: 'Portfolio value',
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
      viewAll: 'View all',
      allPositions: 'All Open Positions',
    },
    allocation: {
      title: 'Asset allocation',
      total: 'Total',
      freeCash: 'Cash',
      inCrypto: 'Crypto',
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
      viewAllMetrics: 'View all metrics',
      metricsDetails: 'Bot Performance Details',
      realizedProfit: 'Realized Net Profit',
      activeSince: 'Active Since',
    },
    history: {
      title: 'Trade History',
      entries: 'closed',
      emptyTitle: 'No closed trades',
      emptyDesc: 'Closed trades will automatically appear here.',
      recently: 'Recently',
    },
    landscape: {
      title: 'Please rotate to portrait',
      desc: 'NeoFreq is optimized for mobile portrait orientation.',
      dismiss: 'Continue in landscape',
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
      testConnection: 'Test Connection',
      testing: 'Testing connection...',
      testSuccess: 'Success! Server responded.',
      demoSimulated: 'Demo mode active (simulated data)',
      presetsTitle: 'Quick Presets',
      presetLocalhost: 'Localhost (8080)',
      presetDemo: 'Demo Mode',
      modeTitle: 'Operating Mode',
      modeLive: 'Live Server',
      modeLiveDesc: 'Connects to live Freqtrade REST API',
      modeDemo: 'Demo Mode',
      modeDemoDesc: 'Simulated sample portfolio for testing',
      modeDemoBannerHint: 'Switch to "Live Server" above to connect your real bot.',
      defaultUrlHint: 'If left blank, http://localhost:8080 will be used as default.',
    },
  },
};
