const KEY = 'forge.v1.';

export const store = {
  get<T>(k: string, def: T | null = null): T | null {
    try {
      const v = localStorage.getItem(KEY + k);
      return v ? (JSON.parse(v) as T) : def;
    } catch {
      return def;
    }
  },
  set(k: string, v: unknown): boolean {
    try {
      localStorage.setItem(KEY + k, JSON.stringify(v));
      return true;
    } catch {
      return false;
    }
  },
  del(k: string): void {
    try { localStorage.removeItem(KEY + k); } catch { /* noop */ }
  },
  listKeys(prefix: string): string[] {
    const out: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      if (k && k.startsWith(KEY + prefix)) out.push(k.slice(KEY.length));
    }
    return out;
  },
};
