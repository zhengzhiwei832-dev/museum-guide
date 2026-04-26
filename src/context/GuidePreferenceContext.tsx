import { createContext, useContext, useState, type ReactNode } from 'react';

export type GuideMode = 'popular' | 'enthusiast';

interface GuidePreferenceContextType {
  mode: GuideMode;
  setMode: (mode: GuideMode) => void;
  modeLabel: string;
}

const GuidePreferenceContext = createContext<GuidePreferenceContextType>({
  mode: 'popular',
  setMode: () => {},
  modeLabel: '大众版',
});

const STORAGE_KEY = 'museum-guide-mode';

export function GuidePreferenceProvider({ children }: { children: ReactNode }) {
  const [mode, setModeState] = useState<GuideMode>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored === 'popular' || stored === 'enthusiast') return stored;
    } catch {}
    return 'popular';
  });

  const setMode = (newMode: GuideMode) => {
    setModeState(newMode);
    try {
      localStorage.setItem(STORAGE_KEY, newMode);
    } catch {}
  };

  const modeLabel = mode === 'popular' ? '大众版' : '爱好者版';

  return (
    <GuidePreferenceContext.Provider value={{ mode, setMode, modeLabel }}>
      {children}
    </GuidePreferenceContext.Provider>
  );
}

export function useGuidePreference() {
  return useContext(GuidePreferenceContext);
}
