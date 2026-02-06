import { describe, it, expect, beforeEach } from 'vitest';
import { saveJourneyState, loadJourneyState, clearJourneyState } from '../js/core/storage.js';

function makeState() {
  return {
    version: 1,
    journey: {
      startDate: '2026-02-06',
      dailyGoalMinutes: 10,
      days: [],
      completed: false,
      completionDate: null,
    },
  };
}

describe('storage', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('saves and loads state', () => {
    const state = makeState();
    saveJourneyState(state);
    const loaded = loadJourneyState();
    expect(loaded).toEqual(state);
  });

  it('returns null when nothing is stored', () => {
    expect(loadJourneyState()).toBeNull();
  });

  it('returns null for invalid JSON', () => {
    localStorage.setItem('meditation-journey-state', 'not json');
    expect(loadJourneyState()).toBeNull();
  });

  it('returns null for wrong version', () => {
    const state = makeState();
    state.version = 99;
    saveJourneyState(state);
    expect(loadJourneyState()).toBeNull();
  });

  it('returns null for missing journey key', () => {
    localStorage.setItem('meditation-journey-state', JSON.stringify({ version: 1 }));
    expect(loadJourneyState()).toBeNull();
  });

  it('clears state', () => {
    saveJourneyState(makeState());
    clearJourneyState();
    expect(loadJourneyState()).toBeNull();
  });
});
