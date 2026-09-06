// Web Audio API & HTML5 Audio Engine
// Provides synthesized sound effects (pops, chimes, unwrap) and supports theme-specific MP3 music playback with fallback synthesis.

class SoundEngine {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;
  private musicInterval: any = null;
  private isMusicPlaying: boolean = false;
  private activeOscillators: OscillatorNode[] = [];
  private currentAudioElement: HTMLAudioElement | null = null;

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

  // Pop sound
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

  // Sparkle chime sound
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

  // Paper tear sound
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

  // Toggle Background Music per theme track ('birthday' | '/music/wedding.mp3' | '/music/love.mp3')
  public toggleMusic(audioTrack: string = 'birthday', onStatusChange?: (playing: boolean) => void) {
    if (this.isMusicPlaying) {
      this.stopMusic();
      if (onStatusChange) onStatusChange(false);
    } else {
      this.isMuted = false;
      this.startMusic(audioTrack, () => {
        if (onStatusChange) onStatusChange(true);
      });
    }
  }

  public startMusic(audioTrack: string = 'birthday', onSuccess?: () => void) {
    if (this.isMusicPlaying) return;

    // Check if playing an MP3 file path
    if (audioTrack.endsWith('.mp3')) {
      const audio = new Audio(audioTrack);
      audio.loop = true;
      audio.volume = 0.6;

      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            this.currentAudioElement = audio;
            this.isMusicPlaying = true;
            if (onSuccess) onSuccess();
          })
          .catch((err) => {
            console.warn(`Could not play MP3 ${audioTrack}, falling back to synthesized tune`, err);
            // Fallback to synth song if MP3 not found
            this.startSynthMusic(audioTrack.includes('love') || audioTrack.includes('wedding') ? 'romantic' : 'birthday');
            if (onSuccess) onSuccess();
          });
      }
    } else {
      this.startSynthMusic('birthday');
      if (onSuccess) onSuccess();
    }
  }

  private startSynthMusic(style: 'birthday' | 'romantic' = 'birthday') {
    this.initCtx();
    if (!this.ctx) return;
    this.isMusicPlaying = true;

    const melody = style === 'romantic'
      ? [
          { note: 440.00, duration: 0.6, delay: 0 },    // A4
          { note: 554.37, duration: 0.6, delay: 0.7 },   // C#5
          { note: 659.25, duration: 0.8, delay: 1.4 },   // E5
          { note: 587.33, duration: 0.6, delay: 2.3 },   // D5
          { note: 554.37, duration: 0.6, delay: 3.0 },   // C#5
          { note: 440.00, duration: 1.0, delay: 3.7 },   // A4

          { note: 493.88, duration: 0.6, delay: 5.0 },   // B4
          { note: 587.33, duration: 0.6, delay: 5.7 },   // D5
          { note: 739.99, duration: 0.8, delay: 6.4 },   // F#5
          { note: 659.25, duration: 0.6, delay: 7.3 },   // E5
          { note: 554.37, duration: 1.2, delay: 8.0 },   // C#5
        ]
      : [
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
        ];

    const totalLoopDuration = style === 'romantic' ? 10.0 : 9.0;

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
    if (this.currentAudioElement) {
      try {
        this.currentAudioElement.pause();
        this.currentAudioElement.currentTime = 0;
      } catch (e) {}
      this.currentAudioElement = null;
    }
    if (this.musicInterval) {
      clearInterval(this.musicInterval);
      this.musicInterval = null;
    }
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
