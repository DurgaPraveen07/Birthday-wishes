// Web Audio API Sound Synthesizer & Audio Engine
// Provides zero-external-dependency sound effects for balloon pops, envelope chimes, unwrap sounds, and festive ambient music.

class SoundEngine {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;
  private musicInterval: any = null;
  private isMusicPlaying: boolean = false;
  private activeOscillators: OscillatorNode[] = [];

  private initCtx() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public unlockAudio() {
    this.initCtx();
  }

  public toggleMute(): boolean {
    this.isMuted = !this.isMuted;
    if (this.isMuted && this.isMusicPlaying) {
      this.stopMusic();
    }
    return !this.isMuted;
  }

  public getIsMuted(): boolean {
    return this.isMuted;
  }

  // Cute balloon pop sound
  public playPop() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    const now = this.ctx.currentTime;
    osc.frequency.setValueAtTime(450, now);
    osc.frequency.exponentialRampToValueAtTime(80, now + 0.08);

    gain.gain.setValueAtTime(0.7, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.08);

    // Noise click
    const bufferSize = this.ctx.sampleRate * 0.02;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }
    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;

    const noiseGain = this.ctx.createGain();
    noiseGain.gain.setValueAtTime(0.2, now);
    noiseGain.gain.exponentialRampToValueAtTime(0.01, now + 0.02);

    noise.connect(noiseGain);
    noiseGain.connect(this.ctx.destination);

    noise.start(now);
    noise.stop(now + 0.02);
  }

  // Sparkle chime sound for envelope / reveals
  public playSparkle() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    const freqs = [523.25, 659.25, 783.99, 1046.5, 1318.51, 1567.98];
    const now = this.ctx.currentTime;

    freqs.forEach((freq, idx) => {
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, now + idx * 0.05);

      gain.gain.setValueAtTime(0.15, now + idx * 0.05);
      gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.05 + 0.3);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now + idx * 0.05);
      osc.stop(now + idx * 0.05 + 0.3);
    });
  }

  // Paper tear / unwrap sound
  public playUnwrap() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const duration = 0.25;

    const bufferSize = this.ctx.sampleRate * duration;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.3));
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(1200, now);
    filter.frequency.linearRampToValueAtTime(3000, now + duration);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.3, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + duration);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);

    noise.start(now);
    noise.stop(now + duration);
  }

  // Toggle Background Music
  public toggleMusic(onStatusChange?: (playing: boolean) => void) {
    if (this.isMusicPlaying) {
      this.stopMusic();
      if (onStatusChange) onStatusChange(false);
    } else {
      this.isMuted = false;
      this.startMusic();
      if (onStatusChange) onStatusChange(true);
    }
  }

  public startMusic() {
    if (this.isMusicPlaying) return;
    this.initCtx();
    if (!this.ctx) return;

    this.isMusicPlaying = true;

    // Happy Birthday melody in C major
    const melody = [
      { note: 261.63, duration: 0.35, delay: 0 },    // C4
      { note: 261.63, duration: 0.25, delay: 0.4 },  // C4
      { note: 293.66, duration: 0.6, delay: 0.7 },   // D4
      { note: 261.63, duration: 0.6, delay: 1.45 },  // C4
      { note: 349.23, duration: 0.6, delay: 2.2 },   // F4
      { note: 329.63, duration: 1.0, delay: 2.95 },  // E4

      { note: 261.63, duration: 0.35, delay: 4.2 },  // C4
      { note: 261.63, duration: 0.25, delay: 4.6 },  // C4
      { note: 293.66, duration: 0.6, delay: 4.9 },   // D4
      { note: 261.63, duration: 0.6, delay: 5.65 },  // C4
      { note: 392.00, duration: 0.6, delay: 6.4 },   // G4
      { note: 349.23, duration: 1.0, delay: 7.15 },  // F4

      { note: 261.63, duration: 0.35, delay: 8.4 },  // C4
      { note: 261.63, duration: 0.25, delay: 8.8 },  // C4
      { note: 523.25, duration: 0.6, delay: 9.1 },   // C5
      { note: 440.00, duration: 0.6, delay: 9.85 },  // A4
      { note: 349.23, duration: 0.6, delay: 10.6 },  // F4
      { note: 329.63, duration: 0.6, delay: 11.35 }, // E4
      { note: 293.66, duration: 0.8, delay: 12.1 },  // D4

      { note: 466.16, duration: 0.35, delay: 13.2 }, // Bb4
      { note: 466.16, duration: 0.25, delay: 13.6 }, // Bb4
      { note: 440.00, duration: 0.6, delay: 13.9 },  // A4
      { note: 349.23, duration: 0.6, delay: 14.65 }, // F4
      { note: 392.00, duration: 0.6, delay: 15.4 },  // G4
      { note: 349.23, duration: 1.2, delay: 16.15 }, // F4
    ];

    const totalLoopDuration = 18.0;

    const playLoop = () => {
      if (!this.isMusicPlaying || !this.ctx) return;
      const startTime = this.ctx.currentTime;

      melody.forEach((item) => {
        if (!this.ctx || !this.isMusicPlaying) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(item.note, startTime + item.delay);

        gain.gain.setValueAtTime(0.08, startTime + item.delay);
        gain.gain.exponentialRampToValueAtTime(0.001, startTime + item.delay + item.duration);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(startTime + item.delay);
        osc.stop(startTime + item.delay + item.duration);

        this.activeOscillators.push(osc);
      });
    };

    playLoop();
    this.musicInterval = setInterval(() => {
      if (this.isMusicPlaying) {
        playLoop();
      }
    }, totalLoopDuration * 1000);
  }

  public stopMusic() {
    this.isMusicPlaying = false;
    if (this.musicInterval) {
      clearInterval(this.musicInterval);
      this.musicInterval = null;
    }
    // Stop all active oscillators immediately
    this.activeOscillators.forEach((osc) => {
      try {
        osc.stop();
        osc.disconnect();
      } catch (e) {}
    });
    this.activeOscillators = [];
  }

  public getIsMusicPlaying(): boolean {
    return this.isMusicPlaying;
  }
}

export const sound = new SoundEngine();
