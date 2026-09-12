import React, { useState } from 'react';
import { X, Check, Globe, Lock, Shield, RefreshCw, AlertCircle, Sparkles } from 'lucide-react';
import { ConnectionConfig } from '../types/freqtrade';

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
  const [serverUrl, setServerUrl] = useState(currentConfig.serverUrl);
  const [username, setUsername] = useState(currentConfig.username || '');
  const [password, setPassword] = useState(currentConfig.password || '');
  const [useProxy, setUseProxy] = useState(currentConfig.useProxy);
  const [demoMode, setDemoMode] = useState(currentConfig.demoMode);
  const [pollIntervalSec, setPollIntervalSec] = useState(Math.round(currentConfig.pollInterval / 1000) || 12);

  // Ping test state
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);

  if (!isOpen) return null;

  const defaultRemoteUrl = import.meta.env.VITE_FREQTRADE_URL || 'http://localhost:8080';
  const defaultLanUrl = import.meta.env.VITE_FREQTRADE_LAN_URL || 'http://192.168.1.100:8080';

  // Preset switchers
  const applyPreset = (url: string, proxy = false) => {
    setServerUrl(url);
    setUseProxy(proxy);
    setDemoMode(false);
    setTestResult(null);
  };

  const handleTestConnection = async () => {
    setIsTesting(true);
    setTestResult(null);

    try {
      if (demoMode) {
        setTestResult({ success: true, message: 'Demo-Modus aktiv (Verbindung simuliert)' });
        return;
      }

      const target = useProxy ? '/api/v1/ping' : `${serverUrl.replace(/\/+$/, '')}/api/v1/ping`;
      const headers: Record<string, string> = {};
      if (username && password) {
        headers['Authorization'] = `Basic ${btoa(`${username}:${password}`)}`;
      }

      const res = await fetch(target, {
        headers,
        signal: AbortSignal.timeout(5000)
      });

      if (!res.ok) {
        throw new Error(`HTTP ${res.status}: ${res.statusText}`);
      }

      const json = await res.json();
      if (json.status === 'pong') {
        setTestResult({ success: true, message: 'Erfolgreich! Server antwortete mit {"status": "pong"}' });
      } else {
        setTestResult({ success: true, message: `Server erreichbar (${JSON.stringify(json)})` });
      }
    } catch (err: any) {
      setTestResult({
        success: false,
        message: err?.message || 'Verbindung fehlgeschlagen (Prüfe URL, Auth oder CORS)'
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
      pollInterval: pollIntervalSec * 1000
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/70 backdrop-blur-md transition-opacity animate-in fade-in duration-200">
      <div className="absolute inset-0" onClick={onClose} />

      <div className="relative w-full max-w-lg bg-[#0E0F14] border border-white/10 rounded-t-[28px] sm:rounded-3xl p-6 shadow-2xl z-10 max-h-[92vh] overflow-y-auto no-scrollbar">
        {/* Mobile handle */}
        <div className="w-12 h-1 bg-white/20 rounded-full mx-auto mb-4 sm:hidden" />

        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10">
          <div>
            <span className="text-xs text-tr-gray uppercase font-semibold tracking-wider">Konfiguration</span>
            <h3 className="text-xl font-bold text-white">Verbindung & Server</h3>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 flex items-center justify-center rounded-full bg-white/10 text-white/70 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Presets */}
        <div className="pt-4">
          <label className="text-xs font-semibold text-tr-gray uppercase tracking-wider block mb-2">
            Schnell-Auswahl Server
          </label>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => applyPreset(defaultRemoteUrl)}
              className={`p-2.5 rounded-xl text-left border text-xs transition-all ${
                serverUrl === defaultRemoteUrl && !demoMode
                  ? 'bg-white/10 border-tr-green text-white'
                  : 'bg-white/[0.03] border-white/[0.06] text-tr-gray hover:text-white'
              }`}
            >
              <div className="font-bold text-white">Remote / VPN</div>
              <div className="text-[11px] font-mono truncate text-tr-gray">{defaultRemoteUrl}</div>
            </button>

            <button
              type="button"
              onClick={() => applyPreset(defaultLanUrl)}
              className={`p-2.5 rounded-xl text-left border text-xs transition-all ${
                serverUrl === defaultLanUrl && !demoMode
                  ? 'bg-white/10 border-tr-green text-white'
                  : 'bg-white/[0.03] border-white/[0.06] text-tr-gray hover:text-white'
              }`}
            >
              <div className="font-bold text-white">Heimnetz / LAN</div>
              <div className="text-[11px] font-mono truncate text-tr-gray">{defaultLanUrl}</div>
            </button>

            <button
              type="button"
              onClick={() => applyPreset('http://localhost:8080')}
              className={`p-2.5 rounded-xl text-left border text-xs transition-all ${
                serverUrl.includes('localhost') && !demoMode
                  ? 'bg-white/10 border-tr-green text-white'
                  : 'bg-white/[0.03] border-white/[0.06] text-tr-gray hover:text-white'
              }`}
            >
              <div className="font-bold text-white">Localhost</div>
              <div className="text-[11px] font-mono truncate text-tr-gray">localhost:8080</div>
            </button>

            <button
              type="button"
              onClick={() => setDemoMode(true)}
              className={`p-2.5 rounded-xl text-left border text-xs transition-all ${
                demoMode
                  ? 'bg-purple-500/20 border-purple-400 text-purple-200'
                  : 'bg-white/[0.03] border-white/[0.06] text-tr-gray hover:text-white'
              }`}
            >
              <div className="font-bold text-purple-300 flex items-center space-x-1">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Demo-Modus</span>
              </div>
              <div className="text-[11px] text-purple-300/70">Beispieldaten</div>
            </button>
          </div>
        </div>

        {/* Form fields */}
        <div className="space-y-4 pt-4">
          {/* Server URL */}
          <div>
            <label className="text-xs font-semibold text-tr-gray block mb-1">
              Freqtrade REST API URL
            </label>
            <div className="relative">
              <Globe className="w-4 h-4 text-tr-gray absolute left-3.5 top-3" />
              <input
                type="text"
                value={serverUrl}
                onChange={(e) => setServerUrl(e.target.value)}
                placeholder="http://localhost:8080"
                className="w-full bg-white/[0.04] border border-white/10 rounded-xl pl-10 pr-3.5 py-2.5 text-sm font-mono text-white placeholder:text-white/30 focus:outline-none focus:border-tr-green transition-colors"
              />
            </div>
          </div>

          {/* Credentials */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-tr-gray block mb-1">
                API Username
              </label>
              <div className="relative">
                <Lock className="w-3.5 h-3.5 text-tr-gray absolute left-3 top-3" />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="blackhawk"
                  className="w-full bg-white/[0.04] border border-white/10 rounded-xl pl-9 pr-3 py-2 text-xs font-mono text-white placeholder:text-white/30 focus:outline-none focus:border-tr-green"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-tr-gray block mb-1">
                API Passwort
              </label>
              <div className="relative">
                <Shield className="w-3.5 h-3.5 text-tr-gray absolute left-3 top-3" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="•••••"
                  className="w-full bg-white/[0.04] border border-white/10 rounded-xl pl-9 pr-3 py-2 text-xs font-mono text-white placeholder:text-white/30 focus:outline-none focus:border-tr-green"
                />
              </div>
            </div>
          </div>

          {/* Proxy Mode Toggle */}
          <div className="flex items-center justify-between p-3 rounded-xl bg-white/[0.02] border border-white/[0.05]">
            <div>
              <span className="text-xs font-semibold text-white block">Lokalen Proxy nutzen</span>
              <span className="text-[11px] text-tr-gray block">
                Leitet über Vite-Dev/Backend weiter. Löst CORS- und HTTP-Sicherheitsblockaden.
              </span>
            </div>
            <button
              type="button"
              onClick={() => setUseProxy(!useProxy)}
              className={`w-11 h-6 rounded-full transition-colors relative ${useProxy ? 'bg-tr-green' : 'bg-white/20'}`}
            >
              <span
                className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-transform ${
                  useProxy ? 'left-6' : 'left-1'
                }`}
              />
            </button>
          </div>

          {/* Polling Interval Slider */}
          <div>
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="text-tr-gray font-semibold">Aktualisierungsintervall</span>
              <span className="text-white font-mono font-bold">{pollIntervalSec} Sekunden</span>
            </div>
            <input
              type="range"
              min="5"
              max="60"
              step="1"
              value={pollIntervalSec}
              onChange={(e) => setPollIntervalSec(Number(e.target.value))}
              className="w-full accent-tr-green cursor-pointer"
            />
          </div>

          {/* Test connection button & feedback */}
          <div>
            <button
              type="button"
              onClick={handleTestConnection}
              disabled={isTesting}
              className="w-full py-2.5 px-4 rounded-xl tr-button text-xs font-semibold text-white flex items-center justify-center space-x-2"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isTesting ? 'animate-spin' : ''}`} />
              <span>{isTesting ? 'Teste Verbindung...' : 'Verbindung testen (Ping)'}</span>
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

        {/* Footer actions */}
        <div className="mt-6 flex space-x-3 pt-3 border-t border-white/10">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-3 rounded-2xl bg-white/10 hover:bg-white/15 text-white font-semibold text-sm transition-all"
          >
            Abbrechen
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="flex-1 py-3 rounded-2xl bg-tr-green text-black font-bold text-sm shadow-[0_0_20px_rgba(0,200,5,0.3)] hover:brightness-110 active:scale-98 transition-all"
          >
            Speichern
          </button>
        </div>
      </div>
    </div>
  );
};
