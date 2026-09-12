import React, { useState } from 'react';
import { X, Check, Globe, Lock, Shield, RefreshCw, AlertCircle, Languages } from 'lucide-react';
import { ConnectionConfig } from '../types/freqtrade';
import { useLanguage } from '../i18n/LanguageContext';

interface SettingsModalProps {
  isOpen: boolean;
  currentConfig: ConnectionConfig;
  onClose: () => void;
  onSave: (newConfig: ConnectionConfig) => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  currentConfig,
  onClose,
  onSave,
}) => {
  const { language, setLanguage, t } = useLanguage();

  const [serverUrl, setServerUrl] = useState(currentConfig.serverUrl);
  const [username, setUsername] = useState(currentConfig.username || '');
  const [password, setPassword] = useState(currentConfig.password || '');
  const [useProxy, setUseProxy] = useState(currentConfig.useProxy);
  const [demoMode, setDemoMode] = useState(currentConfig.demoMode);
  const [pollIntervalSec, setPollIntervalSec] = useState(
    Math.round(currentConfig.pollInterval / 1000) || 12
  );

  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);

  if (!isOpen) return null;

  const handleTestConnection = async () => {
    setIsTesting(true);
    setTestResult(null);

    try {
      if (demoMode) {
        setTestResult({ success: true, message: t.settings.demoSimulated });
        return;
      }

      const rawTarget = serverUrl.trim() || 'http://localhost:8080';
      const target = useProxy ? '/api/v1/ping' : `${rawTarget.replace(/\/+$/, '')}/api/v1/ping`;
      const headers: Record<string, string> = {};
      if (username && password) {
        headers['Authorization'] = `Basic ${btoa(`${username}:${password}`)}`;
      }

      const res = await fetch(target, {
        headers,
        signal: AbortSignal.timeout(5000),
      });

      if (!res.ok) {
        throw new Error(`HTTP ${res.status}: ${res.statusText}`);
      }

      const json = await res.json();
      if (json.status === 'pong') {
        setTestResult({ success: true, message: t.settings.testSuccess });
      } else {
        setTestResult({ success: true, message: `Server OK: ${JSON.stringify(json)}` });
      }
    } catch (err: any) {
      setTestResult({
        success: false,
        message: err?.message || 'Connection failed (check URL, credentials or CORS)',
      });
    } finally {
      setIsTesting(false);
    }
  };

  const handleSave = () => {
    const cleanedUrl = serverUrl.trim() || 'http://localhost:8080';
    onSave({
      serverUrl: cleanedUrl,
      username: username.trim(),
      password: password.trim(),
      useProxy,
      demoMode,
      pollInterval: pollIntervalSec * 1000,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm transition-opacity animate-in fade-in duration-150">
      <div className="absolute inset-0" onClick={onClose} />

      <div className="relative w-full max-w-md bg-[#0D0E12] border border-white/10 rounded-2xl p-5 shadow-2xl z-10 max-h-[92vh] overflow-y-auto no-scrollbar">
        {/* Header: Unified Clean Layout */}
        <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
          <div>
            <span className="text-[11px] text-tr-gray font-normal block mb-0.5">
              {t.settings.title}
            </span>
            <h3 className="text-base sm:text-lg font-medium text-white">{t.settings.subtitle}</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full bg-white/[0.06] hover:bg-white/10 text-white/70 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Operating Mode Selector (Live vs Demo) */}
        <div className="py-3.5 border-b border-white/[0.08]">
          <div className="flex items-center justify-between">
            <div className="pr-2">
              <span className="text-xs font-medium text-white block">{t.settings.modeTitle}</span>
              <span className="text-[10px] text-tr-gray block mt-0.5">
                {demoMode ? t.settings.modeDemoDesc : t.settings.modeLiveDesc}
              </span>
            </div>
            <div className="flex items-center bg-white/[0.06] border border-white/10 rounded-lg p-0.5 text-xs shrink-0">
              <button
                type="button"
                onClick={() => {
                  setDemoMode(false);
                  setTestResult(null);
                }}
                className={`px-3 py-1.5 rounded-md transition-all font-medium ${
                  !demoMode ? 'bg-white text-black font-semibold' : 'text-tr-gray hover:text-white'
                }`}
              >
                {t.settings.modeLive}
              </button>
              <button
                type="button"
                onClick={() => {
                  setDemoMode(true);
                  setTestResult(null);
                }}
                className={`px-3 py-1.5 rounded-md transition-all font-medium ${
                  demoMode ? 'bg-white text-black font-semibold' : 'text-tr-gray hover:text-white'
                }`}
              >
                {t.settings.modeDemo}
              </button>
            </div>
          </div>
        </div>

        {/* Language Selection */}
        <div className="py-3 border-b border-white/[0.08]">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 text-xs text-white">
              <Languages className="w-3.5 h-3.5 text-tr-gray" />
              <span>Language / Sprache</span>
            </div>
            <div className="flex items-center bg-white/[0.06] border border-white/10 rounded-lg p-0.5 text-xs">
              <button
                type="button"
                onClick={() => setLanguage('en')}
                className={`px-2.5 py-1 rounded-md transition-all ${
                  language === 'en' ? 'bg-white text-black font-semibold' : 'text-tr-gray hover:text-white'
                }`}
              >
                English
              </button>
              <button
                type="button"
                onClick={() => setLanguage('de')}
                className={`px-2.5 py-1 rounded-md transition-all ${
                  language === 'de' ? 'bg-white text-black font-semibold' : 'text-tr-gray hover:text-white'
                }`}
              >
                Deutsch
              </button>
            </div>
          </div>
        </div>

        {/* Demo Mode active notification */}
        {demoMode && (
          <div className="mt-3 p-3 rounded-xl bg-white/[0.03] border border-white/[0.06] text-xs">
            <span className="text-white font-medium block">{t.settings.demoSimulated}</span>
            <span className="text-[10px] text-tr-gray block mt-0.5">
              {t.settings.modeDemoBannerHint}
            </span>
          </div>
        )}

        {/* Server & Authentication Input Fields */}
        <div className="space-y-3 pt-3">
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-[11px] font-medium text-tr-gray">
                {t.settings.serverUrlLabel}
              </label>
              {serverUrl && serverUrl !== 'http://localhost:8080' && (
                <button
                  type="button"
                  onClick={() => setServerUrl('http://localhost:8080')}
                  className="text-[10px] text-tr-gray hover:text-white transition-colors"
                >
                  Reset (localhost:8080)
                </button>
              )}
            </div>
            <div className="relative">
              <Globe className="w-3.5 h-3.5 text-tr-gray absolute left-3 top-3" />
              <input
                type="text"
                value={serverUrl}
                onChange={(e) => setServerUrl(e.target.value)}
                placeholder="http://localhost:8080 (Standard)"
                className="w-full bg-white/[0.04] border border-white/10 rounded-xl pl-9 pr-3 py-2 text-xs font-mono text-white placeholder:text-white/30 focus:outline-none focus:border-white/30 transition-colors"
              />
            </div>
            <span className="text-[10px] text-tr-gray/70 block mt-1">
              {t.settings.defaultUrlHint}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            <div>
              <label className="text-[11px] font-medium text-tr-gray block mb-1">
                {t.settings.usernameLabel}
              </label>
              <div className="relative">
                <Lock className="w-3 h-3 text-tr-gray absolute left-3 top-2.5" />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Username"
                  className="w-full bg-white/[0.04] border border-white/10 rounded-xl pl-8 pr-2.5 py-1.5 text-xs font-mono text-white placeholder:text-white/30 focus:outline-none focus:border-white/30"
                />
              </div>
            </div>

            <div>
              <label className="text-[11px] font-medium text-tr-gray block mb-1">
                {t.settings.passwordLabel}
              </label>
              <div className="relative">
                <Shield className="w-3 h-3 text-tr-gray absolute left-3 top-2.5" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="•••••"
                  className="w-full bg-white/[0.04] border border-white/10 rounded-xl pl-8 pr-2.5 py-1.5 text-xs font-mono text-white placeholder:text-white/30 focus:outline-none focus:border-white/30"
                />
              </div>
            </div>
          </div>

          {typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') ? (
            <div
              onClick={() => setUseProxy(!useProxy)}
              role="switch"
              aria-checked={useProxy}
              className="flex items-center justify-between p-2.5 rounded-xl bg-white/[0.02] border border-white/[0.05] cursor-pointer hover:bg-white/[0.04] transition-colors select-none"
            >
              <div className="pr-3">
                <span className="text-xs font-medium text-white block">{t.settings.proxyLabel}</span>
                <span className="text-[10px] text-tr-gray block mt-0.5">{t.settings.proxyDesc}</span>
              </div>
              <div
                className={`w-9 h-5 rounded-full transition-colors relative shrink-0 p-0.5 flex items-center ${
                  useProxy ? 'bg-white' : 'bg-white/20'
                }`}
              >
                <div
                  className={`w-4 h-4 rounded-full transition-transform duration-200 transform ${
                    useProxy ? 'translate-x-4 bg-black' : 'translate-x-0 bg-white'
                  }`}
                />
              </div>
            </div>
          ) : (
            <div className="p-2.5 rounded-xl bg-white/[0.02] border border-white/[0.05]">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-white block">
                  {language === 'de' ? 'Direkte Verbindung' : 'Direct Connection'}
                </span>
                <span className="text-[10px] text-tr-green font-medium">
                  {language === 'de' ? 'Aktiv' : 'Active'}
                </span>
              </div>
              <span className="text-[10px] text-tr-gray block mt-0.5">
                {language === 'de'
                  ? 'Verbindet sich direkt mit der Freqtrade REST API.'
                  : 'Connects directly to your Freqtrade REST API.'}
              </span>
            </div>
          )}

          <div>
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="text-tr-gray text-[11px]">{t.settings.pollIntervalLabel}</span>
              <span className="text-white font-mono text-xs font-medium">
                {pollIntervalSec} {t.settings.seconds}
              </span>
            </div>
            <input
              type="range"
              min="5"
              max="60"
              step="1"
              value={pollIntervalSec}
              onChange={(e) => setPollIntervalSec(Number(e.target.value))}
              className="w-full accent-white cursor-pointer"
            />
          </div>

          <div>
            <button
              type="button"
              onClick={handleTestConnection}
              disabled={isTesting}
              className="w-full py-2 px-3 rounded-xl tr-button text-xs font-medium text-white flex items-center justify-center space-x-2"
            >
              <RefreshCw className={`w-3 h-3 ${isTesting ? 'animate-spin' : ''}`} />
              <span>{isTesting ? t.settings.testing : t.settings.testConnection}</span>
            </button>

            {testResult && (
              <div
                className={`mt-2 p-2 rounded-xl text-xs flex items-start space-x-2 border ${
                  testResult.success
                    ? 'bg-tr-green/10 border-tr-green/20 text-tr-green'
                    : 'bg-tr-red/10 border-tr-red/20 text-tr-red'
                }`}
              >
                {testResult.success ? (
                  <Check className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                ) : (
                  <AlertCircle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                )}
                <span>{testResult.message}</span>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="mt-5 flex space-x-2.5 pt-3 border-t border-white/[0.08]">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-2.5 rounded-xl bg-white/[0.06] hover:bg-white/10 text-white font-medium text-xs transition-all"
          >
            {t.common.cancel}
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="flex-1 py-2.5 rounded-xl bg-white text-black font-semibold text-xs hover:bg-white/90 active:scale-98 transition-all"
          >
            {t.common.save}
          </button>
        </div>
      </div>
    </div>
  );
};
