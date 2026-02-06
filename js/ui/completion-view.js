export class CompletionView {
  constructor({ onRestart }) {
    this.el = document.getElementById('completion-view');
    this.daysEl = document.getElementById('stat-days');
    this.minutesEl = document.getElementById('stat-minutes');
    this.sessionsEl = document.getElementById('stat-sessions');

    document.getElementById('completion-restart').addEventListener('click', onRestart);
  }

  show(stats) {
    this.daysEl.textContent = stats.daysGoalMet;
    this.minutesEl.textContent = stats.totalMinutes;
    this.sessionsEl.textContent = stats.totalSessions;
    this.el.classList.add('active');
  }

  hide() {
    this.el.classList.remove('active');
  }
}
