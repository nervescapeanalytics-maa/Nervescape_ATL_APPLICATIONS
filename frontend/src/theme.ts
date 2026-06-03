// Lightweight client-side theme + preference manager for the admin/portal UI.
// Persists to localStorage and applies a `data-theme` attribute on <html>.

export interface ThemeOption {
  key: string;
  label: string;
  swatch: string; // representative colour for the picker chip
  dark: boolean;
}

export const THEMES: ThemeOption[] = [
  { key: 'light', label: 'Light', swatch: '#1e73ff', dark: false },
  { key: 'dark', label: 'Dark', swatch: '#0f172a', dark: true },
  { key: 'midnight', label: 'Midnight Navy', swatch: '#0d1530', dark: true },
  { key: 'ocean', label: 'Ocean Teal', swatch: '#0e3040', dark: true },
  { key: 'royal', label: 'Royal Purple', swatch: '#241c46', dark: true },
  { key: 'sandstone', label: 'Sandstone', swatch: '#c2773b', dark: false },
];

const THEME_KEY = 'ns-theme';

export function getTheme(): string {
  return localStorage.getItem(THEME_KEY) || 'light';
}

export function applyTheme(key: string) {
  const theme = THEMES.find((t) => t.key === key) ? key : 'light';
  if (theme === 'light') document.documentElement.removeAttribute('data-theme');
  else document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem(THEME_KEY, theme);
}

// Apply the persisted theme as early as possible.
export function initTheme() {
  applyTheme(getTheme());
}

// Generic boolean / string preference helpers used by Quick Settings.
const PREF_PREFIX = 'ns-pref-';

export function getPref(name: string, fallback: string): string {
  return localStorage.getItem(PREF_PREFIX + name) ?? fallback;
}

export function setPref(name: string, value: string) {
  localStorage.setItem(PREF_PREFIX + name, value);
}

export function getBoolPref(name: string, fallback = false): boolean {
  const v = localStorage.getItem(PREF_PREFIX + name);
  return v === null ? fallback : v === 'true';
}

export function setBoolPref(name: string, value: boolean) {
  localStorage.setItem(PREF_PREFIX + name, String(value));
}
