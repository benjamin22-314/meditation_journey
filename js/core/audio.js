let audioContext = null;

export function initAudio() {
  if (!audioContext) {
    audioContext = new (window.AudioContext || window.webkitAudioContext)();
  }
  if (audioContext.state === 'suspended') {
    audioContext.resume();
  }
}

export function playGong() {
  initAudio();
  const now = audioContext.currentTime;

  const masterGain = audioContext.createGain();
  masterGain.gain.setValueAtTime(0.35, now);
  masterGain.connect(audioContext.destination);

  const comp = audioContext.createDynamicsCompressor();
  comp.threshold.setValueAtTime(-12, now);
  comp.ratio.setValueAtTime(6, now);
  comp.connect(masterGain);

  function bloomOsc(type, freq, peakGain, decayTime, stopTime) {
    const osc = audioContext.createOscillator();
    const gain = audioContext.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, now);
    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(peakGain * 0.7, now + 0.005);
    gain.gain.linearRampToValueAtTime(peakGain, now + 0.15);
    gain.gain.exponentialRampToValueAtTime(0.001, now + decayTime);
    osc.connect(gain);
    gain.connect(comp);
    osc.start(now);
    osc.stop(now + stopTime);
  }

  bloomOsc('sine', 350, 0.8, 6.0, 6.5);
  bloomOsc('sine', 353, 0.7, 6.0, 6.5);
  bloomOsc('sine', 518, 0.45, 4.5, 5.0);
  bloomOsc('sine', 641, 0.35, 3.5, 4.0);
  bloomOsc('sine', 830, 0.25, 3.0, 3.5);
  bloomOsc('sine', 835, 0.20, 3.0, 3.5);
  bloomOsc('sine', 1022, 0.15, 2.0, 2.5);

  const oscStrike = audioContext.createOscillator();
  const gainStrike = audioContext.createGain();
  oscStrike.type = 'triangle';
  oscStrike.frequency.setValueAtTime(1500, now);
  oscStrike.frequency.exponentialRampToValueAtTime(800, now + 0.2);
  gainStrike.gain.setValueAtTime(0.50, now);
  gainStrike.gain.exponentialRampToValueAtTime(0.001, now + 0.2);
  oscStrike.connect(gainStrike);
  gainStrike.connect(comp);
  oscStrike.start(now);
  oscStrike.stop(now + 0.3);
}
