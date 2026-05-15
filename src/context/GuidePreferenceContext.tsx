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

export function GuidePreferenceProvider({ children }: { children: ReactNode }) {
  const [mode, setModeState] = useState<GuideMode>(() => {
    try {
      const stored = localStorage.getItem('museum-guide-mode');
      if (stored === 'popular' || stored === 'enthusiast') return stored;
    } catch {
      // localStorage not available
    }
    return 'popular';
  });

  const setMode = (newMode: GuideMode) => {
    setModeState(newMode);
    try {
      localStorage.setItem('museum-guide-mode', newMode);
    } catch {
      // localStorage not available
    }
  };

  const modeLabel = mode === 'popular' ? '大众版' : '爱好者版';

  return (
    <GuidePreferenceContext.Provider value={{ mode, setMode, modeLabel }}>
      {children}
    </GuidePreferenceContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useGuidePreference() {
  return useContext(GuidePreferenceContext);
}
