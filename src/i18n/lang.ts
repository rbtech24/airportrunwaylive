import { englishPaths, spanishPaths, type Lang } from './strings';

export function langFromPath(pathname: string): Lang {
  const path = pathname.replace(/\/$/, '') || '/';
  return path === '/es' || path.startsWith('/es/') ? 'es' : 'en';
}

export function counterpartPath(pathname: string, target: Lang): string | null {
  const path = pathname.replace(/\/$/, '') || '/';
  if (target === 'es') return spanishPaths[path] ?? null;
  return englishPaths[path] ?? null;
}
