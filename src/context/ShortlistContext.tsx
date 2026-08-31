import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';

const STORAGE_KEY = 'sialuxe-shortlist';

interface ShortlistContextValue {
  ids: string[];
  isShortlisted: (id: string) => boolean;
  toggle: (id: string) => void;
}

const ShortlistContext = createContext<ShortlistContextValue | undefined>(undefined);

function readStorage(): string[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as string[]) : [];
  } catch {
    return [];
  }
}

export function ShortlistProvider({ children }: { children: ReactNode }) {
  const [ids, setIds] = useState<string[]>(() => readStorage());

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
    } catch {
      // ignore write failures (private mode, quota, etc.)
    }
  }, [ids]);

  const value = useMemo<ShortlistContextValue>(
    () => ({
      ids,
      isShortlisted: (id) => ids.includes(id),
      toggle: (id) =>
        setIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id])),
    }),
    [ids],
  );

  return <ShortlistContext.Provider value={value}>{children}</ShortlistContext.Provider>;
}

export function useShortlist() {
  const ctx = useContext(ShortlistContext);
  if (!ctx) throw new Error('useShortlist must be used within ShortlistProvider');
  return ctx;
}
