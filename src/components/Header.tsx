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
  const { language, t } = useLanguage();

  const syncTimeStr = lastSync
    ? lastSync.toLocaleTimeString(language === 'de' ? 'de-DE' : 'en-US', {
        hour: '2-digit',
        minute: '2-digit',
      })
    : null;

  return (
    <header className="flex items-center justify-between py-3.5 px-4 sm:px-6 lg:px-8 sticky top-0 z-30 bg-black/90 backdrop-blur-xl border-b border-white/[0.06]">
      {/* Left: Brand + Interactive Mode Pill */}
      <div className="flex items-center space-x-2.5">
        <span className="text-base font-semibold tracking-tight text-white">NeoFreq</span>

        <button
          onClick={onOpenSettings}
          className="text-[11px] text-tr-gray hover:text-white transition-colors cursor-pointer flex items-center space-x-1"
          title={t.common.openSettings}
        >
          <span>·</span>
          <span>
            {config.demoMode
              ? t.common.demoMode
              : isConnected
              ? `${t.common.connected}${syncTimeStr ? ` · ${syncTimeStr}` : ''}`
              : t.common.disconnected}
          </span>
        </button>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center space-x-1.5">
        <button
          onClick={onRefresh}
          disabled={isPolling}
          title={t.common.refresh}
          className="p-2 rounded-full text-tr-gray hover:text-white hover:bg-white/[0.06] transition-all disabled:opacity-50"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isPolling ? 'animate-spin text-white' : ''}`} />
        </button>

        <button
          onClick={onOpenSettings}
          title={t.common.settings}
          className="p-2 rounded-full text-tr-gray hover:text-white hover:bg-white/[0.06] transition-all"
        >
          <Settings className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
};
