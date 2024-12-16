export class Cache {
  constructor(expirationHours = 24) {
    this.expirationHours = expirationHours;
  }

  set(key, value) {
    const item = {
      value,
      timestamp: Date.now(),
      expiresAt: Date.now() + (this.expirationHours * 60 * 60 * 1000)
    };
    localStorage.setItem(key, JSON.stringify(item));
  }

  get(key) {
    const item = localStorage.getItem(key);
    if (!item) return null;

    const parsed = JSON.parse(item);
    if (Date.now() > parsed.expiresAt) {
      localStorage.removeItem(key);
      return null;
    }

    return parsed.value;
  }

  remove(key) {
    localStorage.removeItem(key);
  }

  clear() {
    localStorage.clear();
  }
}