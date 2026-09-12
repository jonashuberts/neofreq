import React from 'react';
import { RefreshCw, Settings } from 'lucide-react';
import { ConnectionConfig } from '../types/freqtrade';
import { useLanguage } from '../i18n/LanguageContext';

interface HeaderProps {
  isConnected: boolean;
  isPolling: boolean;
  config: ConnectionConfig;
  lastSync: Date | null;
  activeTab: 'portfolio' | 'cash';
  onTabChange: (tab: 'portfolio' | 'cash') => void;
  onRefresh: () => void;
  onOpenSettings: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  isConnected,
  isPolling,
  config,
  lastSync,
  activeTab,
  onTabChange,
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
    <header className="flex items-center justify-between py-4 px-4 sm:px-6 lg:px-8 sticky top-0 z-30 bg-black/90 backdrop-blur-xl border-b border-white/[0.06]">
      {/* Left: Trade Republic style tabs: Portfolio | Cash */}
      <div className="flex items-center space-x-6">
        <div className="flex items-baseline space-x-4">
          <button
            onClick={() => onTabChange('portfolio')}
            className={`text-2xl font-bold tracking-tight transition-colors ${
              activeTab === 'portfolio' ? 'text-white' : 'text-white/40 hover:text-white/70'
            }`}
          >
            Portfolio
          </button>
          <button
            onClick={() => onTabChange('cash')}
            className={`text-2xl font-bold tracking-tight transition-colors ${
              activeTab === 'cash' ? 'text-white' : 'text-white/40 hover:text-white/70'
            }`}
          >
            Cash
          </button>
        </div>

        {/* Status Dot (No radar wave, pure clean dot) */}
        <div className="hidden sm:flex items-center space-x-1.5 text-xs text-tr-gray font-medium">
          <span
            className={`w-2 h-2 rounded-full ${
              config.demoMode
                ? 'bg-purple-400'
                : isConnected
                ? 'bg-tr-green'
                : 'bg-tr-red'
            }`}
          />
          <span>
            {config.demoMode
              ? t.common.demoMode
              : isConnected
              ? `${t.common.connected}${syncTimeStr ? ` · ${syncTimeStr}` : ''}`
              : t.common.disconnected}
          </span>
        </div>
      </div>

      {/* Right: Refresh & Settings (Profile circle in TR style) */}
      <div className="flex items-center space-x-2">
        {/* Refresh button */}
        <button
          onClick={onRefresh}
          disabled={isPolling}
          title={t.common.refresh}
          className="p-2 rounded-full tr-button text-tr-gray hover:text-white transition-all disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${isPolling ? 'animate-spin text-white' : ''}`} />
        </button>

        {/* Profile / Settings Button (circular avatar like Trade Republic) */}
        <button
          onClick={onOpenSettings}
          title={t.common.settings}
          className="w-9 h-9 rounded-full bg-white/[0.08] hover:bg-white/[0.14] border border-white/10 flex items-center justify-center text-white/90 hover:text-white transition-all"
        >
          <Settings className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
};
