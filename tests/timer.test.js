import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { MeditationTimer, formatTimeDisplay } from '../js/core/timer.js';

describe('MeditationTimer', () => {
  let timer;

  beforeEach(() => {
    vi.useFakeTimers();
    timer = new MeditationTimer();
  });

  afterEach(() => {
    timer.stop();
    vi.useRealTimers();
  });

  it('starts with correct time', () => {
    timer.start(5);
    expect(timer.getTimeRemaining()).toBe(300);
    expect(timer.isRunning()).toBe(true);
  });

  it('ticks every second', () => {
    const ticks = [];
    timer.onTick = (remaining) => ticks.push(remaining);
    timer.start(1);

    vi.advanceTimersByTime(3000);
    expect(ticks).toContain(57);
  });

  it('reports progress', () => {
    timer.start(1);
    vi.advanceTimersByTime(30000);
    expect(timer.getProgress()).toBeCloseTo(0.5, 1);
  });

  it('calls onComplete when finished', () => {
    const onComplete = vi.fn();
    timer.onComplete = onComplete;
    timer.start(1);

    vi.advanceTimersByTime(60000);
    expect(onComplete).toHaveBeenCalledOnce();
    expect(timer.isRunning()).toBe(false);
  });

  it('calls onMinuteInterval at minute marks', () => {
    const minutes = [];
    timer.onMinuteInterval = (m) => minutes.push(m);
    timer.start(3);

    vi.advanceTimersByTime(60000); // 1 minute passes, 2 remain
    expect(minutes).toContain(2);

    vi.advanceTimersByTime(60000); // 2 minutes pass, 1 remains
    expect(minutes).toContain(1);
  });

  it('stop prevents further ticks', () => {
    const ticks = [];
    timer.onTick = (r) => ticks.push(r);
    timer.start(1);

    vi.advanceTimersByTime(5000);
    const countBefore = ticks.length;
    timer.stop();

    vi.advanceTimersByTime(5000);
    expect(ticks.length).toBe(countBefore);
    expect(timer.isRunning()).toBe(false);
  });

  it('getElapsedMinutes returns fractional minutes', () => {
    timer.start(5);
    vi.advanceTimersByTime(90000); // 1.5 minutes
    expect(timer.getElapsedMinutes()).toBeCloseTo(1.5, 1);
  });
});

describe('formatTimeDisplay', () => {
  it('formats zero', () => {
    expect(formatTimeDisplay(0)).toBe('0:00');
  });

  it('formats seconds only', () => {
    expect(formatTimeDisplay(45)).toBe('0:45');
  });

  it('formats minutes and seconds', () => {
    expect(formatTimeDisplay(125)).toBe('2:05');
  });

  it('formats exact minutes', () => {
    expect(formatTimeDisplay(600)).toBe('10:00');
  });
});
