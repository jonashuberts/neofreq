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

      const target = useProxy ? '/api/v1/ping' : `${serverUrl.replace(/\/+$/, '')}/api/v1/ping`;
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
    onSave({
      serverUrl,
      username,
      password,
      useProxy,
      demoMode,
      pollInterval: pollIntervalSec * 1000,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/80 backdrop-blur-md transition-opacity animate-in fade-in duration-200">
      <div className="absolute inset-0" onClick={onClose} />

      <div className="relative w-full max-w-lg bg-[#0E0F14] border border-white/10 rounded-t-[28px] sm:rounded-3xl p-6 shadow-2xl z-10 max-h-[92vh] overflow-y-auto no-scrollbar">
        <div className="w-12 h-1 bg-white/20 rounded-full mx-auto mb-4 sm:hidden" />

        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10">
          <div>
            <span className="text-xs text-tr-gray uppercase font-semibold tracking-wider">
              {t.settings.title}
            </span>
            <h3 className="text-xl font-bold text-white">{t.settings.subtitle}</h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full bg-white/10 text-white/70 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Language Selection Row */}
        <div className="py-4 border-b border-white/10">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 text-xs font-semibold text-white">
              <Languages className="w-4 h-4 text-tr-gray" />
              <span>Language / Sprache</span>
            </div>
            <div className="flex items-center bg-white/[0.06] border border-white/10 rounded-xl p-1 text-xs font-semibold">
              <button
                type="button"
                onClick={() => setLanguage('en')}
                className={`px-3 py-1 rounded-lg transition-all ${
                  language === 'en' ? 'bg-white text-black font-bold' : 'text-tr-gray hover:text-white'
                }`}
              >
                English
              </button>
              <button
                type="button"
                onClick={() => setLanguage('de')}
                className={`px-3 py-1 rounded-lg transition-all ${
                  language === 'de' ? 'bg-white text-black font-bold' : 'text-tr-gray hover:text-white'
                }`}
              >
                Deutsch
              </button>
            </div>
          </div>
        </div>

        {/* Generic Presets */}
        <div className="pt-4">
          <label className="text-xs font-semibold text-tr-gray uppercase tracking-wider block mb-2">
            {t.settings.presetsTitle}
          </label>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => {
                setServerUrl('http://localhost:8080');
                setDemoMode(false);
                setTestResult(null);
              }}
              className={`p-3 rounded-xl text-left border text-xs transition-all ${
                serverUrl === 'http://localhost:8080' && !demoMode
                  ? 'bg-white/10 border-white/30 text-white'
                  : 'bg-white/[0.03] border-white/[0.06] text-tr-gray hover:text-white'
              }`}
            >
              <div className="font-semibold text-white">{t.settings.presetLocalhost}</div>
              <div className="text-[11px] font-mono text-tr-gray">localhost:8080</div>
            </button>

            <button
              type="button"
              onClick={() => {
                setDemoMode(true);
                setTestResult(null);
              }}
              className={`p-3 rounded-xl text-left border text-xs transition-all ${
                demoMode
                  ? 'bg-white/15 border-white/40 text-white'
                  : 'bg-white/[0.03] border-white/[0.06] text-tr-gray hover:text-white'
              }`}
            >
              <div className="font-semibold text-white">{t.settings.presetDemo}</div>
              <div className="text-[11px] text-tr-gray">Sample portfolio</div>
            </button>
          </div>
        </div>

        {/* Input Fields */}
        <div className="space-y-4 pt-4">
          <div>
            <label className="text-xs font-semibold text-tr-gray block mb-1">
              {t.settings.serverUrlLabel}
            </label>
            <div className="relative">
              <Globe className="w-4 h-4 text-tr-gray absolute left-3.5 top-3" />
              <input
                type="text"
                value={serverUrl}
                onChange={(e) => setServerUrl(e.target.value)}
                placeholder={t.settings.serverUrlPlaceholder}
                className="w-full bg-white/[0.04] border border-white/10 rounded-xl pl-10 pr-3.5 py-2.5 text-sm font-mono text-white placeholder:text-white/30 focus:outline-none focus:border-white/40 transition-colors"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-tr-gray block mb-1">
                {t.settings.usernameLabel}
              </label>
              <div className="relative">
                <Lock className="w-3.5 h-3.5 text-tr-gray absolute left-3 top-3" />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Username"
                  className="w-full bg-white/[0.04] border border-white/10 rounded-xl pl-9 pr-3 py-2 text-xs font-mono text-white placeholder:text-white/30 focus:outline-none focus:border-white/40"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-tr-gray block mb-1">
                {t.settings.passwordLabel}
              </label>
              <div className="relative">
                <Shield className="w-3.5 h-3.5 text-tr-gray absolute left-3 top-3" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="•••••"
                  className="w-full bg-white/[0.04] border border-white/10 rounded-xl pl-9 pr-3 py-2 text-xs font-mono text-white placeholder:text-white/30 focus:outline-none focus:border-white/40"
                />
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between p-3 rounded-xl bg-white/[0.02] border border-white/[0.05]">
            <div>
              <span className="text-xs font-semibold text-white block">{t.settings.proxyLabel}</span>
              <span className="text-[11px] text-tr-gray block">{t.settings.proxyDesc}</span>
            </div>
            <button
              type="button"
              onClick={() => setUseProxy(!useProxy)}
              className={`w-11 h-6 rounded-full transition-colors relative ${
                useProxy ? 'bg-tr-green' : 'bg-white/20'
              }`}
            >
              <span
                className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-transform ${
                  useProxy ? 'left-6' : 'left-1'
                }`}
              />
            </button>
          </div>

          <div>
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="text-tr-gray font-semibold">{t.settings.pollIntervalLabel}</span>
              <span className="text-white font-mono font-bold">
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
              className="w-full py-2.5 px-4 rounded-xl tr-button text-xs font-semibold text-white flex items-center justify-center space-x-2"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isTesting ? 'animate-spin' : ''}`} />
              <span>{isTesting ? t.settings.testing : t.settings.testConnection}</span>
            </button>

            {testResult && (
              <div
                className={`mt-2 p-2.5 rounded-xl text-xs flex items-start space-x-2 border ${
                  testResult.success
                    ? 'bg-tr-green/10 border-tr-green/20 text-tr-green'
                    : 'bg-tr-red/10 border-tr-red/20 text-tr-red'
                }`}
              >
                {testResult.success ? (
                  <Check className="w-4 h-4 shrink-0 mt-0.5" />
                ) : (
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                )}
                <span>{testResult.message}</span>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 flex space-x-3 pt-3 border-t border-white/10">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-3 rounded-2xl bg-white/10 hover:bg-white/15 text-white font-semibold text-sm transition-all"
          >
            {t.common.cancel}
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="flex-1 py-3 rounded-2xl bg-white text-black font-bold text-sm hover:bg-white/90 active:scale-98 transition-all"
          >
            {t.common.save}
          </button>
        </div>
      </div>
    </div>
  );
};
