export class OnboardingView {
  constructor({ onBegin }) {
    this.el = document.getElementById('onboarding-view');
    this.goalEl = document.getElementById('onboard-goal');
    this.goal = 10;
    this.onBegin = onBegin;

    document.getElementById('onboard-decrease').addEventListener('click', () => this._adjustGoal(-1));
    document.getElementById('onboard-increase').addEventListener('click', () => this._adjustGoal(1));
    document.getElementById('onboard-start').addEventListener('click', () => this.onBegin(this.goal));
  }

  show() {
    this.el.classList.add('active');
  }

  hide() {
    this.el.classList.remove('active');
  }

  _adjustGoal(delta) {
    this.goal = Math.max(1, Math.min(120, this.goal + delta));
    this.goalEl.textContent = this.goal;
  }
}
