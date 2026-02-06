import { getDaysBetween, addDays, getTodayDateString } from '../utils/date-helpers.js';

export function createJourney(goalMinutes, startDate) {
  const days = [];
  for (let i = 0; i < 30; i++) {
    days.push({
      dayNumber: i + 1,
      date: addDays(startDate, i),
      sessions: [],
      totalMinutes: 0,
      goalMet: false,
    });
  }
  return {
    version: 1,
    journey: {
      startDate,
      dailyGoalMinutes: goalMinutes,
      days,
      completed: false,
      completionDate: null,
    },
  };
}

export function getCurrentDayNumber(state, today) {
  const todayStr = today || getTodayDateString();
  const diff = getDaysBetween(state.journey.startDate, todayStr) + 1;
  return Math.max(1, Math.min(30, diff));
}

export function getCurrentDayInfo(state, today) {
  const dayNum = getCurrentDayNumber(state, today);
  const day = state.journey.days[dayNum - 1];
  const isPast = (today || getTodayDateString()) > state.journey.days[29].date;
  return { dayNumber: dayNum, day, isPast };
}

export function addSession(state, durationMinutes, completed, today) {
  const todayStr = today || getTodayDateString();
  const dayNum = getCurrentDayNumber(state, todayStr);
  const day = state.journey.days[dayNum - 1];

  day.sessions.push({
    durationMinutes,
    completed,
    timestamp: new Date().toISOString(),
  });

  if (completed) {
    day.totalMinutes += durationMinutes;
    day.goalMet = day.totalMinutes >= state.journey.dailyGoalMinutes;
  }

  // Check if journey is complete (past day 30)
  if (dayNum === 30 && todayStr >= state.journey.days[29].date) {
    const endDate = state.journey.days[29].date;
    if (todayStr >= endDate) {
      state.journey.completed = true;
      state.journey.completionDate = todayStr;
    }
  }

  return state;
}

export function updateDailyGoal(state, newGoalMinutes) {
  state.journey.dailyGoalMinutes = newGoalMinutes;
  for (const day of state.journey.days) {
    day.goalMet = day.totalMinutes >= newGoalMinutes;
  }
  return state;
}

export function restartJourney(goalMinutes, startDate) {
  return createJourney(goalMinutes, startDate || getTodayDateString());
}

export function getJourneyStats(state) {
  const days = state.journey.days;
  const daysGoalMet = days.filter((d) => d.goalMet).length;
  const totalMinutes = days.reduce((sum, d) => sum + d.totalMinutes, 0);
  const totalSessions = days.reduce((sum, d) => sum + d.sessions.filter((s) => s.completed).length, 0);
  return { daysGoalMet, totalMinutes, totalSessions };
}

export function isJourneyComplete(state, today) {
  const todayStr = today || getTodayDateString();
  const endDate = state.journey.days[29].date;
  return todayStr > endDate || state.journey.completed;
}
