import React, { useState, useEffect } from 'react';
import { Smartphone, RotateCw, ArrowRight } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';

export const LandscapeNotice: React.FC = () => {
  const { t } = useLanguage();
  const [isMobileLandscape, setIsMobileLandscape] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const mediaQuery = window.matchMedia('(orientation: landscape) and (max-height: 540px)');
    
    const checkOrientation = () => {
      const matches = mediaQuery.matches;
      setIsMobileLandscape(matches);
      // Reset dismissed state when returning to portrait
      if (!matches) {
        setDismissed(false);
      }
    };

    checkOrientation();
    mediaQuery.addEventListener('change', checkOrientation);
    window.addEventListener('resize', checkOrientation);

    return () => {
      mediaQuery.removeEventListener('change', checkOrientation);
      window.removeEventListener('resize', checkOrientation);
    };
  }, []);

  if (!isMobileLandscape || dismissed) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex items-center justify-center p-6 text-center select-none animate-in fade-in duration-200">
      <div className="max-w-sm flex flex-col items-center">
        {/* Animated Phone Rotate Icon */}
        <div className="relative w-16 h-16 rounded-2xl bg-white/[0.04] border border-white/10 flex items-center justify-center mb-4">
          <Smartphone className="w-8 h-8 text-white animate-pulse" />
          <div className="absolute -bottom-1 -right-1 p-1 rounded-full bg-white text-black">
            <RotateCw className="w-3.5 h-3.5 animate-spin" style={{ animationDuration: '4s' }} />
          </div>
        </div>

        <h3 className="text-lg font-semibold text-white tracking-tight">
          {t.landscape.title}
        </h3>
        
        <p className="text-xs text-tr-gray mt-1.5 leading-relaxed max-w-[280px]">
          {t.landscape.desc}
        </p>

        <button
          type="button"
          onClick={() => setDismissed(true)}
          className="mt-5 py-2 px-4 rounded-xl bg-white/[0.06] hover:bg-white/10 text-white font-medium text-xs border border-white/10 transition-all flex items-center space-x-1.5 active:scale-98"
        >
          <span>{t.landscape.dismiss}</span>
          <ArrowRight className="w-3.5 h-3.5 text-tr-gray" />
        </button>
      </div>
    </div>
  );
};
