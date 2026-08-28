'use client';

import { createContext, ReactNode, useContext } from 'react';

export type DashboardMode = 'day' | 'night';

export interface DashboardTheme {
  mode: DashboardMode;
  isNightMode: boolean;
  background: string;
  panel: string;
  card: string;
  border: string;
  text: string;
  muted: string;
  icon: string;
  iconBackground: string;
  hover: string;
  accentBackground: string;
  accentText: string;
  inputText: string;
  shadow: string;
  toggleMode: () => void;
}

export const dashboardPalettes = {
  night: {
    background: 'radial-gradient(circle at top, rgba(148, 163, 184, 0.14), transparent 30%), linear-gradient(135deg, #020817 0%, #0f172a 28%, #111827 100%)',
    panel: 'rgba(15, 23, 42, 0.82)',
    card: 'rgba(15, 23, 42, 0.72)',
    border: 'rgba(148, 163, 184, 0.12)',
    text: '#f8fafc',
    muted: '#94a3b8',
    icon: '#cbd5e1',
    iconBackground: 'rgba(248,250,252,0.12)',
    hover: 'rgba(248, 250, 252, 0.08)',
    accentBackground: 'rgba(248, 250, 252, 0.12)',
    accentText: '#f8fafc',
    inputText: '#cbd5e1',
    shadow: '0 18px 40px rgba(15, 23, 42, 0.2)',
  },
  day: {
    background: 'radial-gradient(circle at top, rgba(15, 23, 42, 0.07), transparent 30%), linear-gradient(135deg, #f8fafc 0%, #eef2f7 42%, #e5e7eb 100%)',
    panel: 'rgba(255, 255, 255, 0.9)',
    card: 'rgba(248, 250, 252, 0.94)',
    border: 'rgba(15, 23, 42, 0.1)',
    text: '#111827',
    muted: '#64748b',
    icon: '#475569',
    iconBackground: 'rgba(15,23,42,0.08)',
    hover: 'rgba(15, 23, 42, 0.06)',
    accentBackground: 'rgba(15, 23, 42, 0.08)',
    accentText: '#111827',
    inputText: '#111827',
    shadow: '0 18px 40px rgba(15, 23, 42, 0.1)',
  },
} as const;

const fallbackTheme: DashboardTheme = {
  mode: 'night',
  isNightMode: true,
  ...dashboardPalettes.night,
  toggleMode: () => undefined,
};

const DashboardThemeContext = createContext<DashboardTheme>(fallbackTheme);

export function DashboardThemeProvider({ children, value }: { children: ReactNode; value: DashboardTheme }) {
  return (
    <DashboardThemeContext.Provider value={value}>
      {children}
    </DashboardThemeContext.Provider>
  );
}

export function useDashboardTheme() {
  return useContext(DashboardThemeContext);
}
