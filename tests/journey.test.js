import { describe, it, expect } from 'vitest';
import {
  createJourney,
  getCurrentDayNumber,
  getCurrentDayInfo,
  addSession,
  updateDailyGoal,
  restartJourney,
  getJourneyStats,
  isJourneyComplete,
} from '../js/core/journey.js';

describe('journey', () => {
  function makeJourney(goal = 10, start = '2026-02-06') {
    return createJourney(goal, start);
  }

  describe('createJourney', () => {
    it('creates 30 days with correct dates', () => {
      const state = makeJourney(10, '2026-02-06');
      expect(state.journey.days).toHaveLength(30);
      expect(state.journey.days[0].date).toBe('2026-02-06');
      expect(state.journey.days[0].dayNumber).toBe(1);
      expect(state.journey.days[29].dayNumber).toBe(30);
      expect(state.journey.days[29].date).toBe('2026-03-07');
    });

    it('sets goal and defaults', () => {
      const state = makeJourney(15);
      expect(state.version).toBe(1);
      expect(state.journey.dailyGoalMinutes).toBe(15);
      expect(state.journey.completed).toBe(false);
      expect(state.journey.completionDate).toBeNull();
    });

    it('initialises each day with empty sessions', () => {
      const state = makeJourney();
      for (const day of state.journey.days) {
        expect(day.sessions).toEqual([]);
        expect(day.totalMinutes).toBe(0);
        expect(day.goalMet).toBe(false);
      }
    });
  });

  describe('getCurrentDayNumber', () => {
    it('returns 1 on start date', () => {
      const state = makeJourney(10, '2026-02-06');
      expect(getCurrentDayNumber(state, '2026-02-06')).toBe(1);
    });

    it('returns correct day mid-journey', () => {
      const state = makeJourney(10, '2026-02-06');
      expect(getCurrentDayNumber(state, '2026-02-10')).toBe(5);
    });

    it('clamps to 1 if before start', () => {
      const state = makeJourney(10, '2026-02-06');
      expect(getCurrentDayNumber(state, '2026-02-01')).toBe(1);
    });

    it('clamps to 30 if past end', () => {
      const state = makeJourney(10, '2026-02-06');
      expect(getCurrentDayNumber(state, '2026-04-01')).toBe(30);
    });
  });

  describe('addSession', () => {
    it('adds a completed session and updates totalMinutes', () => {
      const state = makeJourney(10, '2026-02-06');
      addSession(state, 10, true, '2026-02-06');
      const day = state.journey.days[0];
      expect(day.sessions).toHaveLength(1);
      expect(day.sessions[0].durationMinutes).toBe(10);
      expect(day.sessions[0].completed).toBe(true);
      expect(day.totalMinutes).toBe(10);
      expect(day.goalMet).toBe(true);
    });

    it('does not add to totalMinutes for incomplete session', () => {
      const state = makeJourney(10, '2026-02-06');
      addSession(state, 5, false, '2026-02-06');
      expect(state.journey.days[0].totalMinutes).toBe(0);
      expect(state.journey.days[0].goalMet).toBe(false);
    });

    it('accumulates multiple sessions', () => {
      const state = makeJourney(10, '2026-02-06');
      addSession(state, 4, true, '2026-02-06');
      addSession(state, 6, true, '2026-02-06');
      expect(state.journey.days[0].totalMinutes).toBe(10);
      expect(state.journey.days[0].goalMet).toBe(true);
    });

    it('marks goal not met if under target', () => {
      const state = makeJourney(10, '2026-02-06');
      addSession(state, 5, true, '2026-02-06');
      expect(state.journey.days[0].goalMet).toBe(false);
    });
  });

  describe('updateDailyGoal', () => {
    it('recalculates goalMet for all days', () => {
      const state = makeJourney(10, '2026-02-06');
      addSession(state, 5, true, '2026-02-06');
      expect(state.journey.days[0].goalMet).toBe(false);

      updateDailyGoal(state, 5);
      expect(state.journey.dailyGoalMinutes).toBe(5);
      expect(state.journey.days[0].goalMet).toBe(true);
    });

    it('updates goal to higher value', () => {
      const state = makeJourney(5, '2026-02-06');
      addSession(state, 5, true, '2026-02-06');
      expect(state.journey.days[0].goalMet).toBe(true);

      updateDailyGoal(state, 10);
      expect(state.journey.days[0].goalMet).toBe(false);
    });
  });

  describe('getJourneyStats', () => {
    it('returns zeroes for fresh journey', () => {
      const state = makeJourney();
      const stats = getJourneyStats(state);
      expect(stats.daysGoalMet).toBe(0);
      expect(stats.totalMinutes).toBe(0);
      expect(stats.totalSessions).toBe(0);
    });

    it('counts completed sessions and days', () => {
      const state = makeJourney(10, '2026-02-06');
      addSession(state, 10, true, '2026-02-06');
      addSession(state, 10, true, '2026-02-07');
      addSession(state, 5, true, '2026-02-08');

      const stats = getJourneyStats(state);
      expect(stats.daysGoalMet).toBe(2);
      expect(stats.totalMinutes).toBe(25);
      expect(stats.totalSessions).toBe(3);
    });
  });

  describe('restartJourney', () => {
    it('creates a fresh journey', () => {
      const state = restartJourney(15, '2026-03-01');
      expect(state.journey.startDate).toBe('2026-03-01');
      expect(state.journey.dailyGoalMinutes).toBe(15);
      expect(state.journey.days).toHaveLength(30);
    });
  });

  describe('isJourneyComplete', () => {
    it('returns false during journey', () => {
      const state = makeJourney(10, '2026-02-06');
      expect(isJourneyComplete(state, '2026-02-10')).toBe(false);
    });

    it('returns true after day 30', () => {
      const state = makeJourney(10, '2026-02-06');
      expect(isJourneyComplete(state, '2026-03-08')).toBe(true);
    });

    it('returns true if manually completed', () => {
      const state = makeJourney(10, '2026-02-06');
      state.journey.completed = true;
      expect(isJourneyComplete(state, '2026-02-10')).toBe(true);
    });
  });
});
