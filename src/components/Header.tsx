import React from 'react';
import { RefreshCw, Settings } from 'lucide-react';
import { ConnectionConfig } from '../types/freqtrade';
import { useLanguage } from '../i18n/LanguageContext';

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
  const { language, setLanguage, t } = useLanguage();

  const syncTimeStr = lastSync
    ? lastSync.toLocaleTimeString(language === 'de' ? 'de-DE' : 'en-US', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      })
    : null;

  return (
    <header className="flex items-center justify-between py-4 px-4 sm:px-6 sticky top-0 z-30 bg-black/85 backdrop-blur-xl border-b border-white/[0.06]">
      {/* Left: App title & Connection Status */}
      <div className="flex items-center space-x-3">
        <div className="relative flex items-center justify-center w-7 h-7 rounded-full bg-white/[0.04] border border-white/10">
          {isConnected ? (
            <>
              <span className="w-2 h-2 rounded-full bg-tr-green animate-pulse-ring" />
              <span className="absolute w-1.5 h-1.5 rounded-full bg-tr-green" />
            </>
          ) : (
            <span className="w-1.5 h-1.5 rounded-full bg-tr-red" />
          )}
        </div>

        <div>
          <div className="flex items-center space-x-2">
            <span className="text-sm font-semibold tracking-tight text-white">NeoFreq</span>
            {config.demoMode ? (
              <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-white/10 text-white/70 border border-white/10">
                {t.common.demoMode}
              </span>
            ) : (
              <span
                className={`text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded ${
                  isConnected
                    ? 'bg-white/[0.05] text-white/80 border border-white/[0.08]'
                    : 'bg-tr-red/10 text-tr-red border border-tr-red/20'
                }`}
              >
                {isConnected ? t.common.connected : t.common.disconnected}
              </span>
            )}
          </div>

          <div className="text-[11px] text-tr-gray">
            {isConnected ? (
              <span>{t.common.sync} {syncTimeStr || 'aktiv'}</span>
            ) : (
              <span className="text-tr-red/90">{t.common.disconnected}</span>
            )}
          </div>
        </div>
      </div>

      {/* Right: Language switch & Actions */}
      <div className="flex items-center space-x-2">
        {/* Language selector toggle */}
        <div className="flex items-center bg-white/[0.04] border border-white/[0.08] rounded-full p-0.5 text-xs font-semibold">
          <button
            onClick={() => setLanguage('de')}
            className={`px-2 py-0.5 rounded-full transition-colors ${
              language === 'de' ? 'bg-white/15 text-white' : 'text-tr-gray hover:text-white/80'
            }`}
          >
            DE
          </button>
          <button
            onClick={() => setLanguage('en')}
            className={`px-2 py-0.5 rounded-full transition-colors ${
              language === 'en' ? 'bg-white/15 text-white' : 'text-tr-gray hover:text-white/80'
            }`}
          >
            EN
          </button>
        </div>

        {/* Refresh button */}
        <button
          onClick={onRefresh}
          disabled={isPolling}
          title={t.common.refresh}
          className="p-2 rounded-full tr-button text-tr-gray hover:text-white transition-all disabled:opacity-50"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isPolling ? 'animate-spin text-white' : ''}`} />
        </button>

        {/* Settings button */}
        <button
          onClick={onOpenSettings}
          title={t.common.settings}
          className="p-2 rounded-full tr-button text-tr-gray hover:text-white transition-all"
        >
          <Settings className="w-3.5 h-3.5" />
        </button>
      </div>
    </header>
  );
};
