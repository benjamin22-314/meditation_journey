import { describe, it, expect, vi, afterEach } from 'vitest';
import {
  getTodayDateString,
  getDaysBetween,
  addDays,
  formatDateForDisplay,
} from '../js/utils/date-helpers.js';

describe('date-helpers', () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  describe('getTodayDateString', () => {
    it('returns today in YYYY-MM-DD format', () => {
      vi.useFakeTimers();
      vi.setSystemTime(new Date(2026, 1, 6)); // 6 Feb 2026
      expect(getTodayDateString()).toBe('2026-02-06');
      vi.useRealTimers();
    });

    it('zero-pads single-digit months and days', () => {
      vi.useFakeTimers();
      vi.setSystemTime(new Date(2026, 0, 3)); // 3 Jan 2026
      expect(getTodayDateString()).toBe('2026-01-03');
      vi.useRealTimers();
    });
  });

  describe('getDaysBetween', () => {
    it('returns 0 for the same date', () => {
      expect(getDaysBetween('2026-02-06', '2026-02-06')).toBe(0);
    });

    it('returns positive for later date', () => {
      expect(getDaysBetween('2026-02-01', '2026-02-06')).toBe(5);
    });

    it('returns negative for earlier date', () => {
      expect(getDaysBetween('2026-02-06', '2026-02-01')).toBe(-5);
    });

    it('works across month boundaries', () => {
      expect(getDaysBetween('2026-01-30', '2026-02-02')).toBe(3);
    });

    it('works across year boundaries', () => {
      expect(getDaysBetween('2025-12-31', '2026-01-01')).toBe(1);
    });
  });

  describe('addDays', () => {
    it('adds days within a month', () => {
      expect(addDays('2026-02-01', 5)).toBe('2026-02-06');
    });

    it('adds days across month boundary', () => {
      expect(addDays('2026-01-30', 3)).toBe('2026-02-02');
    });

    it('handles negative days', () => {
      expect(addDays('2026-02-06', -3)).toBe('2026-02-03');
    });

    it('adds zero days', () => {
      expect(addDays('2026-02-06', 0)).toBe('2026-02-06');
    });

    it('handles year boundary', () => {
      expect(addDays('2025-12-31', 1)).toBe('2026-01-01');
    });
  });

  describe('formatDateForDisplay', () => {
    it('formats a date for display', () => {
      expect(formatDateForDisplay('2026-02-06')).toBe('6 Feb');
    });

    it('formats single-digit day', () => {
      expect(formatDateForDisplay('2026-01-03')).toBe('3 Jan');
    });

    it('formats December', () => {
      expect(formatDateForDisplay('2025-12-25')).toBe('25 Dec');
    });
  });
});
