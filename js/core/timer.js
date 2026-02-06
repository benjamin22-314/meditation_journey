export class MeditationTimer {
  constructor() {
    this.intervalId = null;
    this.timeRemaining = 0;
    this.totalTime = 0;
    this.lastMinute = 0;
    this.onTick = null;
    this.onComplete = null;
    this.onMinuteInterval = null;
  }

  start(minutes) {
    this.stop();
    this.totalTime = minutes * 60;
    this.timeRemaining = this.totalTime;
    this.lastMinute = minutes;

    this.intervalId = setInterval(() => {
      this.timeRemaining--;

      if (this.timeRemaining <= 0) {
        this.timeRemaining = 0;
        this._notifyTick();
        this._finish();
        return;
      }

      const currentMinute = Math.ceil(this.timeRemaining / 60);
      if (currentMinute < this.lastMinute && this.timeRemaining > 0) {
        this.lastMinute = currentMinute;
        if (this.onMinuteInterval) this.onMinuteInterval(currentMinute);
      }

      this._notifyTick();
    }, 1000);
  }

  stop() {
    if (this.intervalId !== null) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  getProgress() {
    if (this.totalTime === 0) return 0;
    return (this.totalTime - this.timeRemaining) / this.totalTime;
  }

  getTimeRemaining() {
    return this.timeRemaining;
  }

  getElapsedMinutes() {
    return (this.totalTime - this.timeRemaining) / 60;
  }

  isRunning() {
    return this.intervalId !== null;
  }

  _notifyTick() {
    if (this.onTick) {
      this.onTick(this.timeRemaining, this.getProgress());
    }
  }

  _finish() {
    this.stop();
    if (this.onComplete) this.onComplete();
  }
}

export function formatTimeDisplay(seconds) {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${String(secs).padStart(2, '0')}`;
}
