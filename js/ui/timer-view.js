import { MeditationTimer, formatTimeDisplay } from '../core/timer.js';
import { initAudio, playGong } from '../core/audio.js';

export class TimerView {
  constructor({ onSessionEnd }) {
    this.el = document.getElementById('timer-view');
    this.setupEl = document.getElementById('timer-setup');
    this.activeEl = document.getElementById('timer-active');
    this.completeEl = document.getElementById('timer-complete');
    this.durationEl = document.getElementById('timer-duration');
    this.timeEl = document.getElementById('timer-time');
    this.ringEl = document.getElementById('timer-ring-progress');
    this.goalHintEl = document.getElementById('timer-goal-hint');
    this.bellFlash = document.getElementById('bellFlash');

    this.duration = 10;
    this.timer = new MeditationTimer();
    this.onSessionEnd = onSessionEnd;
    this.circumference = 2 * Math.PI * 115;

    document.getElementById('timer-decrease').addEventListener('click', () => this._adjustDuration(-1));
    document.getElementById('timer-increase').addEventListener('click', () => this._adjustDuration(1));
    document.getElementById('timer-start').addEventListener('click', () => this._startTimer());
    document.getElementById('timer-stop').addEventListener('click', () => this._stopTimer());
    document.getElementById('timer-done').addEventListener('click', () => this._finishSession(true));
    document.getElementById('timer-back').addEventListener('click', () => this._goBack());
  }

  show(goalMinutes, minutesRemaining) {
    this.duration = goalMinutes;
    this.durationEl.textContent = this.duration;

    const remaining = Math.max(0, goalMinutes - (minutesRemaining || 0));
    if (remaining > 0) {
      this.goalHintEl.textContent = `${remaining} min remaining for today's goal`;
    } else {
      this.goalHintEl.textContent = "Today's goal met — keep going!";
    }

    this._showSetup();
    this.el.classList.add('active');
  }

  hide() {
    this.timer.stop();
    this.el.classList.remove('active');
  }

  _showSetup() {
    this.setupEl.classList.remove('hidden');
    this.activeEl.classList.remove('visible');
    this.completeEl.classList.remove('visible');
  }

  _adjustDuration(delta) {
    this.duration = Math.max(1, Math.min(120, this.duration + delta));
    this.durationEl.textContent = this.duration;
  }

  _startTimer() {
    initAudio();
    this.setupEl.classList.add('hidden');
    this.activeEl.classList.add('visible');

    this.ringEl.style.strokeDasharray = this.circumference;
    this.ringEl.style.strokeDashoffset = this.circumference;

    this.timer.onTick = (remaining, progress) => {
      this.timeEl.textContent = formatTimeDisplay(remaining);
      const offset = this.circumference * (1 - progress);
      this.ringEl.style.strokeDashoffset = offset;
    };

    this.timer.onMinuteInterval = () => {
      playGong();
      this._triggerFlash();
    };

    this.timer.onComplete = () => {
      playGong();
      this._triggerFlash();
      setTimeout(() => {
        playGong();
        this._triggerFlash();
      }, 3000);
      this.activeEl.classList.remove('visible');
      this.completeEl.classList.add('visible');
    };

    playGong();
    this._triggerFlash();
    this.timer.start(this.duration);
  }

  _stopTimer() {
    this.timer.stop();
    this._finishSession(false);
  }

  _finishSession(completed) {
    const elapsed = this.timer.getElapsedMinutes();
    const duration = completed ? this.duration : Math.floor(elapsed);
    this.onSessionEnd(duration, completed);
  }

  _goBack() {
    this.timer.stop();
    this.hide();
    // The app controller will show the journey view
    this.onSessionEnd(0, false);
  }

  _triggerFlash() {
    this.bellFlash.classList.remove('active');
    void this.bellFlash.offsetWidth;
    this.bellFlash.classList.add('active');
  }
}
