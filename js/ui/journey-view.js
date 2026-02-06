import { getCurrentDayInfo } from '../core/journey.js';
import { formatDateForDisplay } from '../utils/date-helpers.js';

export class JourneyView {
  constructor({ onMeditate, onChangeGoal, onRestart }) {
    this.el = document.getElementById('journey-view');
    this.dayHeaderEl = document.getElementById('journey-day-header');
    this.dayDateEl = document.getElementById('journey-day-date');
    this.stoneGridEl = document.getElementById('stone-grid');
    this.progressLabelEl = document.getElementById('progress-label');
    this.progressFillEl = document.getElementById('progress-fill');

    document.getElementById('journey-meditate').addEventListener('click', onMeditate);
    document.getElementById('journey-change-goal').addEventListener('click', onChangeGoal);
    document.getElementById('journey-restart').addEventListener('click', onRestart);
  }

  show() {
    this.el.classList.add('active');
  }

  hide() {
    this.el.classList.remove('active');
  }

  render(state, today) {
    const { dayNumber, day } = getCurrentDayInfo(state, today);
    const goal = state.journey.dailyGoalMinutes;

    this.dayHeaderEl.textContent = `Day ${dayNumber} of 30`;
    this.dayDateEl.textContent = formatDateForDisplay(day.date);

    // Stone grid
    this.stoneGridEl.innerHTML = '';
    for (const d of state.journey.days) {
      const stone = document.createElement('div');
      stone.className = 'stone';
      stone.textContent = d.dayNumber;

      if (d.dayNumber === dayNumber) {
        stone.classList.add('stone--current');
      } else if (d.dayNumber < dayNumber) {
        stone.classList.add(d.goalMet ? 'stone--complete' : 'stone--missed');
      } else {
        stone.classList.add('stone--future');
      }

      this.stoneGridEl.appendChild(stone);
    }

    // Today's progress
    const todayMinutes = day.totalMinutes;
    const pct = Math.min(100, (todayMinutes / goal) * 100);
    this.progressLabelEl.textContent = `${todayMinutes} / ${goal} minutes today`;
    this.progressFillEl.style.width = `${pct}%`;
  }
}
