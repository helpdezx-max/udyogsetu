import { useApp, Locale } from '../context/AppContext';
import en from '../locales/en.json';
import mr from '../locales/mr.json';
import hi from '../locales/hi.json';

const dictionaries: Record<Locale, Record<string, unknown>> = {
  en,
  mr,
  hi,
};

export const useLocale = () => {
  const { locale, setLocale } = useApp();

  const t = (path: string): string => {
    const keys = path.split('.');
    let current: unknown = dictionaries[locale] || dictionaries['en'];

    for (const key of keys) {
      if (current && typeof current === 'object' && key in (current as Record<string, unknown>)) {
        current = (current as Record<string, unknown>)[key];
      } else {
        // Fallback to English
        let fallback: unknown = dictionaries['en'];
        for (const fKey of keys) {
          if (fallback && typeof fallback === 'object' && fKey in (fallback as Record<string, unknown>)) {
            fallback = (fallback as Record<string, unknown>)[fKey];
          } else {
            return path;
          }
        }
        return typeof fallback === 'string' ? fallback : path;
      }
    }

    return typeof current === 'string' ? current : path;
  };

  return { locale, setLocale, t };
};
