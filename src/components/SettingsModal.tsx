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

    const rawTarget = serverUrl.trim() || 'http://localhost:8080';
    try {
      if (demoMode) {
        setTestResult({ success: true, message: t.settings.demoSimulated });
        return;
      }

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
        // Verify authentication against protected balance endpoint
        const balanceTarget = useProxy ? '/api/v1/balance' : `${rawTarget.replace(/\/+$/, '')}/api/v1/balance`;
        try {
          const authCheck = await fetch(balanceTarget, {
            headers,
            signal: AbortSignal.timeout(4000),
          });

          if (authCheck.status === 401) {
            setTestResult({
              success: false,
              message: language === 'de'
                ? 'Server antwortet, aber Authentifizierung fehlgeschlagen (Passwort fehlt oder falsch).'
                : 'Server reached, but authentication failed (password missing or incorrect).'
            });
            return;
          }
        } catch {
          // Ignore if secondary check fails for network reason, ping already succeeded
        }

        setTestResult({ success: true, message: t.settings.testSuccess });
      } else {
        setTestResult({ success: true, message: `Server OK: ${JSON.stringify(json)}` });
      }
    } catch (err: any) {
      let msg = err?.message || 'Verbindung fehlgeschlagen';
      if (typeof window !== 'undefined' && window.location.protocol === 'https:' && rawTarget.startsWith('http:')) {
        msg = language === 'de'
          ? 'HTTPS blockiert unverschlüsseltes HTTP (Mixed Content). Nutze HTTPS oder die lokale Dev-Version.'
          : 'HTTPS blocks unencrypted HTTP (Mixed Content). Use HTTPS or the local dev version.';
      } else if (err?.name === 'TypeError' || msg.includes('Failed to fetch') || msg.includes('NetworkError')) {
        msg = language === 'de'
          ? 'Verbindung fehlgeschlagen (Prüfe Server-URL, Erreichbarkeit oder CORS_origins in Freqtrade).'
          : 'Connection failed (Check Server URL, network reachability, or CORS_origins in Freqtrade).';
      }
      setTestResult({
        success: false,
        message: msg,
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

      <div className="relative w-full max-w-md bg-[#121316] border border-white/15 rounded-2xl p-4 sm:p-5 shadow-2xl shadow-black/80 z-10 max-h-[calc(100%-env(safe-area-inset-top,0px)-env(safe-area-inset-bottom,0px)-24px)] overflow-y-auto no-scrollbar my-auto">
        {/* Header: Unified Clean Layout */}
        <div className="flex items-center justify-between pb-2.5 border-b border-white/10">
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

        {/* Unified Card: Language & Operating Mode */}
        <div className="mt-3 p-3.5 rounded-2xl tr-card space-y-3">
          {/* Language Selector */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 text-xs">
              <Languages className="w-3.5 h-3.5 text-tr-gray" />
              <span className="font-medium text-white">Sprache</span>
            </div>
            <div className="flex items-center bg-white/[0.06] rounded-lg p-0.5 text-xs">
              <button
                type="button"
                onClick={() => setLanguage('de')}
                className={`px-3 py-1 rounded-md transition-all font-medium ${
                  language === 'de' ? 'bg-white text-black font-semibold' : 'text-tr-gray hover:text-white'
                }`}
              >
                Deutsch
              </button>
              <button
                type="button"
                onClick={() => setLanguage('en')}
                className={`px-3 py-1 rounded-md transition-all font-medium ${
                  language === 'en' ? 'bg-white text-black font-semibold' : 'text-tr-gray hover:text-white'
                }`}
              >
                English
              </button>
            </div>
          </div>

          <div className="h-px bg-white/[0.04]" />

          {/* Operating Mode Selector (Live vs Demo) */}
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-white">{t.settings.modeTitle}</span>
            <div className="flex items-center bg-white/[0.06] rounded-lg p-0.5 text-xs">
              <button
                type="button"
                onClick={() => {
                  setDemoMode(false);
                  setTestResult(null);
                }}
                className={`px-3 py-1 rounded-md transition-all font-medium ${
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
                className={`px-3 py-1 rounded-md transition-all font-medium ${
                  demoMode ? 'bg-white text-black font-semibold' : 'text-tr-gray hover:text-white'
                }`}
              >
                {t.settings.modeDemo}
              </button>
            </div>
          </div>
        </div>

        {/* Live Server Mode Fields: Single Clean Card */}
        {!demoMode && (
          <div className="mt-2.5 p-3.5 rounded-2xl tr-card space-y-3">
            {/* Server URL */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-medium text-white/90">
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
                <Globe className="w-3.5 h-3.5 text-tr-gray absolute left-3 top-2.5" />
                <input
                  type="text"
                  value={serverUrl}
                  onChange={(e) => setServerUrl(e.target.value)}
                  placeholder="http://localhost:8080"
                  className="w-full bg-white/[0.04] border border-white/10 rounded-xl pl-9 pr-3 py-2 text-xs font-mono text-white placeholder:text-white/30 focus:outline-none focus:border-white/30 transition-colors"
                />
              </div>
            </div>

            {/* Credentials 2-Col Grid */}
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-xs font-medium text-white/90 block mb-1.5">
                  {t.settings.usernameLabel}
                </label>
                <div className="relative">
                  <Lock className="w-3 h-3 text-tr-gray absolute left-2.5 top-2.5" />
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Username"
                    className="w-full bg-white/[0.04] border border-white/10 rounded-xl pl-8 pr-2.5 py-2 text-xs font-mono text-white placeholder:text-white/30 focus:outline-none focus:border-white/30"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-medium text-white/90 block mb-1.5">
                  {t.settings.passwordLabel}
                </label>
                <div className="relative">
                  <Shield className="w-3 h-3 text-tr-gray absolute left-2.5 top-2.5" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="•••••"
                    className="w-full bg-white/[0.04] border border-white/10 rounded-xl pl-8 pr-2.5 py-2 text-xs font-mono text-white placeholder:text-white/30 focus:outline-none focus:border-white/30"
                  />
                </div>
              </div>
            </div>

            {/* Local Proxy Toggle */}
            {typeof window !== 'undefined' && !window.location.hostname.includes('github.io') && (
              <div
                onClick={() => setUseProxy(!useProxy)}
                role="switch"
                aria-checked={useProxy}
                className="flex items-center justify-between py-1 cursor-pointer select-none"
              >
                <span className="text-xs text-tr-gray hover:text-white transition-colors">{t.settings.proxyLabel}</span>
                <div
                  className={`w-7 h-4 rounded-full transition-colors relative shrink-0 p-0.5 flex items-center ${
                    useProxy ? 'bg-white' : 'bg-white/20'
                  }`}
                >
                  <div
                    className={`w-3 h-3 rounded-full transition-transform duration-200 transform ${
                      useProxy ? 'translate-x-3 bg-black' : 'translate-x-0 bg-white'
                    }`}
                  />
                </div>
              </div>
            )}

            {/* Refresh Interval Slider */}
            <div className="pt-1">
              <div className="flex items-center justify-between text-xs mb-1.5">
                <span className="text-xs font-medium text-white/90">{t.settings.pollIntervalLabel}</span>
                <span className="text-white font-mono text-xs font-medium px-2 py-0.5 rounded bg-white/[0.06]">
                  {pollIntervalSec}s
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
          </div>
        )}

        {/* Action Buttons: Minimal, Balanced & Clean */}
        <div className="mt-3">
          {demoMode ? (
            <button
              type="button"
              onClick={handleSave}
              className="w-full py-2.5 rounded-xl bg-white text-black font-semibold text-xs hover:bg-white/90 active:scale-98 transition-all"
            >
              {t.common.save}
            </button>
          ) : (
            <div className="space-y-2">
              {testResult && (
                <div
                  className={`p-2.5 rounded-xl text-xs flex items-center space-x-2 border ${
                    testResult.success
                      ? 'bg-tr-green/10 border-tr-green/20 text-tr-green'
                      : 'bg-tr-red/10 border-tr-red/20 text-tr-red'
                  }`}
                >
                  {testResult.success ? (
                    <Check className="w-3.5 h-3.5 shrink-0" />
                  ) : (
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  )}
                  <span className="truncate">{testResult.message}</span>
                </div>
              )}

              <div className="flex space-x-2">
                <button
                  type="button"
                  onClick={handleTestConnection}
                  disabled={isTesting}
                  className="flex-1 py-2.5 px-3 rounded-xl bg-white/[0.06] hover:bg-white/10 text-white font-medium text-xs flex items-center justify-center space-x-1.5 transition-colors"
                >
                  <RefreshCw className={`w-3 h-3 ${isTesting ? 'animate-spin' : ''}`} />
                  <span>{isTesting ? t.settings.testing : t.settings.testConnection}</span>
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
          )}
        </div>

        {/* Version / Build Stamp */}
        <div className="mt-3.5 text-center text-[10px] text-tr-gray/40 font-mono select-none">
          NeoFreq v1.2.7 · Build 2026-09-13 08:52
        </div>
      </div>
    </div>
  );
};
