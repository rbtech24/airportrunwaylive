const KEY = 'arl-prefs';

export interface Prefs {
  pin?: string;
  filter?: string;
  stream?: string;
}

export function getPrefs(): Prefs {
  try {
    return JSON.parse(localStorage.getItem(KEY) ?? '{}') as Prefs;
  } catch {
    return {};
  }
}

export function setPrefs(patch: Prefs) {
  localStorage.setItem(KEY, JSON.stringify({ ...getPrefs(), ...patch }));
}
