import { RefreshCw, Settings, Sparkles } from 'lucide-react';
import { ConnectionConfig } from '../types/freqtrade';

interface HeaderProps {
  isConnected: boolean;
  isPolling: boolean;
  config: ConnectionConfig;
  lastSync: Date | null;
  onRefresh: () => void;
  onOpenSettings: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  isConnected,
  isPolling,
  config,
  lastSync,
  onRefresh,
  onOpenSettings,
}) => {
  // Format last sync time (HH:mm:ss)
  const syncTimeStr = lastSync
    ? lastSync.toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
    : null;

  // Determine friendly connection label
  let connectionLabel = 'Verbunden';
  if (config.demoMode) {
    connectionLabel = 'Demo Modus';
  } else if (config.serverUrl.startsWith('http://100.') || config.serverUrl.includes('ts.net')) {
    connectionLabel = 'VPN / Remote';
  } else if (config.serverUrl.includes('192.168.') || config.serverUrl.includes('10.') || config.serverUrl.includes('172.16.')) {
    connectionLabel = 'LAN';
  } else if (config.serverUrl.includes('localhost') || config.serverUrl.includes('127.0.0.1')) {
    connectionLabel = 'Lokal';
  }

  return (
    <header className="flex items-center justify-between py-4 px-4 sm:px-6 sticky top-0 z-30 bg-black/80 backdrop-blur-xl border-b border-white/[0.06]">
      {/* Left: App title & Connection Status */}
      <div className="flex items-center space-x-3">
        <div className="relative flex items-center justify-center w-8 h-8 rounded-full bg-white/[0.05] border border-white/10">
          {config.demoMode ? (
            <Sparkles className="w-4 h-4 text-purple-400" />
          ) : isConnected ? (
            <>
              <span className="w-2.5 h-2.5 rounded-full bg-tr-green animate-pulse-ring" />
              <span className="absolute w-2 h-2 rounded-full bg-tr-green" />
            </>
          ) : (
            <span className="w-2 h-2 rounded-full bg-tr-red" />
          )}
        </div>

        <div>
          <div className="flex items-center space-x-2">
            <span className="text-sm font-semibold tracking-tight text-white">NeoFreq</span>
            <span className={`text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded-md ${
              config.demoMode
                ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                : isConnected
                ? 'bg-tr-green/15 text-tr-green border border-tr-green/20'
                : 'bg-tr-red/15 text-tr-red border border-tr-red/20'
            }`}>
              {connectionLabel}
            </span>
          </div>

          <div className="text-[11px] text-tr-gray flex items-center space-x-1">
            {isConnected ? (
              <span>Sync {syncTimeStr || 'aktiv'}</span>
            ) : (
              <span className="text-tr-red/90">Getrennt</span>
            )}
          </div>
        </div>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center space-x-2">
        {/* Refresh button */}
        <button
          onClick={onRefresh}
          disabled={isPolling}
          title="Jetzt aktualisieren"
          className="p-2 rounded-full tr-button text-tr-gray hover:text-white transition-all disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${isPolling ? 'animate-spin text-tr-green' : ''}`} />
        </button>

        {/* Settings button */}
        <button
          onClick={onOpenSettings}
          title="Verbindungseinstellungen"
          className="p-2 rounded-full tr-button text-tr-gray hover:text-white transition-all"
        >
          <Settings className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
};
