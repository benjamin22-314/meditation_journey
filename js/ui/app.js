import { createJourney, getCurrentDayInfo, addSession, updateDailyGoal, restartJourney, getJourneyStats, isJourneyComplete } from '../core/journey.js';
import { saveJourneyState, loadJourneyState, clearJourneyState } from '../core/storage.js';
import { getTodayDateString } from '../utils/date-helpers.js';
import { OnboardingView } from './onboarding-view.js';
import { JourneyView } from './journey-view.js';
import { TimerView } from './timer-view.js';
import { CompletionView } from './completion-view.js';

class App {
  constructor() {
    this.state = null;

    this.onboarding = new OnboardingView({
      onBegin: (goal) => this._beginJourney(goal),
    });

    this.journey = new JourneyView({
      onMeditate: () => this._showTimer(),
      onChangeGoal: () => this._showGoalModal(),
      onRestart: () => this._confirmRestart(),
    });

    this.timer = new TimerView({
      onSessionEnd: (duration, completed) => this._handleSessionEnd(duration, completed),
    });

    this.completion = new CompletionView({
      onRestart: () => this._restart(),
    });

    this._setupGoalModal();
    this._init();
  }

  _init() {
    this.state = loadJourneyState();
    if (!this.state) {
      this._showView('onboarding');
    } else if (isJourneyComplete(this.state)) {
      this._showCompletion();
    } else {
      this._showJourney();
    }
  }

  _showView(name) {
    this.onboarding.hide();
    this.journey.hide();
    this.timer.hide();
    this.completion.hide();

    switch (name) {
      case 'onboarding': this.onboarding.show(); break;
      case 'journey': this.journey.show(); break;
      case 'timer': this.timer.show(
        this.state.journey.dailyGoalMinutes,
        this._getTodayMinutes()
      ); break;
      case 'completion': this.completion.show(getJourneyStats(this.state)); break;
    }
  }

  _beginJourney(goalMinutes) {
    this.state = createJourney(goalMinutes, getTodayDateString());
    saveJourneyState(this.state);
    this._showJourney();
  }

  _showJourney() {
    this._showView('journey');
    this.journey.render(this.state);
  }

  _showTimer() {
    this._showView('timer');
  }

  _showCompletion() {
    this._showView('completion');
  }

  _handleSessionEnd(duration, completed) {
    if (duration > 0) {
      addSession(this.state, duration, completed);
      saveJourneyState(this.state);
    }

    if (isJourneyComplete(this.state)) {
      this._showCompletion();
    } else {
      this._showJourney();
    }
  }

  _getTodayMinutes() {
    if (!this.state) return 0;
    const { day } = getCurrentDayInfo(this.state);
    return day.totalMinutes;
  }

  // Goal modal
  _setupGoalModal() {
    this.modalEl = document.getElementById('goal-modal');
    this.modalGoalEl = document.getElementById('modal-goal');
    this.modalGoal = 10;

    document.getElementById('modal-decrease').addEventListener('click', () => {
      this.modalGoal = Math.max(1, this.modalGoal - 1);
      this.modalGoalEl.textContent = this.modalGoal;
    });

    document.getElementById('modal-increase').addEventListener('click', () => {
      this.modalGoal = Math.min(120, this.modalGoal + 1);
      this.modalGoalEl.textContent = this.modalGoal;
    });

    document.getElementById('modal-cancel').addEventListener('click', () => {
      this.modalEl.classList.remove('visible');
    });

    document.getElementById('modal-save').addEventListener('click', () => {
      updateDailyGoal(this.state, this.modalGoal);
      saveJourneyState(this.state);
      this.modalEl.classList.remove('visible');
      this.journey.render(this.state);
    });
  }

  _showGoalModal() {
    this.modalGoal = this.state.journey.dailyGoalMinutes;
    this.modalGoalEl.textContent = this.modalGoal;
    this.modalEl.classList.add('visible');
  }

  _confirmRestart() {
    if (confirm('Are you sure you want to restart your journey? All progress will be lost.')) {
      this._restart();
    }
  }

  _restart() {
    clearJourneyState();
    this.state = null;
    this._showView('onboarding');
  }
}

new App();
