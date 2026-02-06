const STORAGE_KEY = 'meditation-journey-state';

export function saveJourneyState(state) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

export function loadJourneyState() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw);
    if (!parsed || parsed.version !== 1 || !parsed.journey) return null;
    return parsed;
  } catch {
    return null;
  }
}

export function clearJourneyState() {
  localStorage.removeItem(STORAGE_KEY);
}
