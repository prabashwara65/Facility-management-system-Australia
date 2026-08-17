'use client';

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';

export const THEMES: Theme[] = [
  {
    name: 'blue-white',
    label: 'Classic Blue',
    colors: ['#ffffff', '#1a3a6b', '#4a7bc4', '#0a1d38'],
    description: 'Professional & Trustworthy',
  },
  {
    name: 'navy-light',
    label: 'Navy & White',
    colors: ['#f8fafc', '#1e293b', '#3b82f6', '#0f172a'],
    description: 'Clean & Modern',
  },
  {
    name: 'sky-blue',
    label: 'Sky Blue',
    colors: ['#ffffff', '#0284c7', '#38bdf8', '#0c4a6e'],
    description: 'Fresh & Airy',
  },
  {
    name: 'corporate-blue',
    label: 'Corporate Blue',
    colors: ['#ffffff', '#1e40af', '#60a5fa', '#1e3a8a'],
    description: 'Professional & Bold',
  },
  {
    name: 'ocean',
    label: 'Ocean Breeze',
    colors: ['#f0f9ff', '#0f4c75', '#3282b8', '#1a202c'],
    description: 'Calm & Trustworthy',
  },
  {
    name: 'twilight',
    label: 'Twilight Blue',
    colors: ['#f8fafc', '#1a1a2e', '#4a7bc4', '#0f274a'],
    description: 'Elegant & Premium',
  },
  {
    name: 'mist-teal',
    label: 'Mist Teal',
    colors: ['#f4fbff', '#0f766e', '#67e8f9', '#083344'],
    description: 'Cool & Refreshing',
  },
];

export interface Theme {
  name: string;
  label: string;
  colors: string[];
  description: string;
}

interface ThemeContextType {
  currentTheme: Theme;
  setTheme: (themeName: string) => void;
  themes: Theme[];
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const THEME_STORAGE_KEY = 'sparkwell-theme';

function applyTheme(theme: Theme) {
  const [bg, primary, secondary, text] = theme.colors;

  document.documentElement.style.setProperty('--theme-bg', bg);
  document.documentElement.style.setProperty('--theme-primary', primary);
  document.documentElement.style.setProperty('--theme-secondary', secondary);
  document.documentElement.style.setProperty('--theme-text', text);
  document.documentElement.style.setProperty('--theme-surface', `color-mix(in srgb, ${secondary} 16%, white)`);
  document.documentElement.style.setProperty('--theme-card', '#ffffff');
  document.documentElement.style.setProperty('--theme-panel', `color-mix(in srgb, ${primary} 12%, white)`);
  document.documentElement.style.setProperty('--theme-border', `color-mix(in srgb, ${primary} 20%, white)`);
  document.documentElement.style.setProperty('--theme-muted', `color-mix(in srgb, ${text} 64%, white)`);
  document.documentElement.style.setProperty('--theme-soft', `color-mix(in srgb, ${secondary} 20%, white)`);

  // Hero section styling with proper contrast on dark overlays
  document.documentElement.style.setProperty('--hero-text', '#ffffff');
  document.documentElement.style.setProperty('--hero-text-secondary', 'rgba(255, 255, 255, 0.85)');
  document.documentElement.style.setProperty('--hero-badge', 'rgba(255, 255, 255, 0.1)');
  document.documentElement.style.setProperty('--hero-badge-border', 'rgba(255, 255, 255, 0.3)');

  document.body.style.backgroundColor = bg;
  document.body.style.color = text;
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [currentTheme, setCurrentTheme] = useState<Theme>(THEMES[0]);

  useEffect(() => {
    const savedTheme = window.localStorage.getItem(THEME_STORAGE_KEY);
    const nextTheme = THEMES.find((theme) => theme.name === savedTheme) ?? THEMES[0];

    setCurrentTheme(nextTheme);
    applyTheme(nextTheme);
  }, []);

  const setTheme = (themeName: string) => {
    const nextTheme = THEMES.find((theme) => theme.name === themeName);

    if (!nextTheme) {
      return;
    }

    setCurrentTheme(nextTheme);
    applyTheme(nextTheme);
    window.localStorage.setItem(THEME_STORAGE_KEY, themeName);
  };

  const value = useMemo(
    () => ({
      currentTheme,
      setTheme,
      themes: [...THEMES],
    }),
    [currentTheme],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }

  return context;
}

export function ThemeSwitcher() {
  const { currentTheme, setTheme, themes } = useTheme();
  const [open, setOpen] = useState(false);

  return (
    <div className="relative z-50">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="flex items-center gap-2 rounded-full border border-slate-200 bg-white/90 px-2.5 py-2 shadow-sm backdrop-blur-sm transition hover:border-slate-300"
        aria-label="Choose theme"
      >
        <span className="flex items-center gap-1">
          {currentTheme.colors.slice(0, 3).map((color, index) => (
            <span
              key={`${currentTheme.name}-${color}-${index}`}
              className="h-3.5 w-3.5 rounded-full border border-white shadow-sm"
              style={{ backgroundColor: color }}
            />
          ))}
        </span>
        <span className="text-[10px] font-bold uppercase tracking-[0.12em] text-slate-700">
          {currentTheme.label}
        </span>
      </button>

      {open && (
        <div className="absolute right-0 top-[calc(100%+0.75rem)] w-[260px] rounded-2xl border border-slate-200 bg-white p-3 shadow-xl">
          <p className="mb-2 px-2 text-[10px] font-bold uppercase tracking-[0.14em] text-slate-500">
            Pick a palette
          </p>

          <div className="space-y-2">
            {themes.map((theme) => {
              const isActive = theme.name === currentTheme.name;

              return (
                <button
                  key={theme.name}
                  type="button"
                  onClick={() => {
                    setTheme(theme.name);
                    setOpen(false);
                  }}
                  className={`flex w-full items-center justify-between rounded-xl border px-2.5 py-2 text-left transition ${
                    isActive ? 'border-slate-300 bg-slate-50' : 'border-transparent hover:bg-slate-50'
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <span className="flex items-center gap-1">
                      {theme.colors.slice(0, 3).map((color, index) => (
                        <span
                          key={`${theme.name}-swatch-${index}`}
                          className="h-3.5 w-3.5 rounded-full border border-white"
                          style={{ backgroundColor: color }}
                        />
                      ))}
                    </span>
                    <span>
                      <span className="block text-[12px] font-bold text-slate-800">{theme.label}</span>
                      <span className="block text-[10px] text-slate-500">{theme.description}</span>
                    </span>
                  </span>

                  {isActive && <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
