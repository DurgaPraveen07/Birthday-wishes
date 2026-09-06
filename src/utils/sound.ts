// Web Audio API & HTML5 Audio Engine
// Provides synthesized sound effects (pops, chimes, unwrap) and plays custom MP3 music files per theme with synth fallback.

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

  // Toggle Background Music per theme track
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

    if (audioTrack && audioTrack !== 'birthday') {
      // Try relative audio path
      const candidatePaths = [
        audioTrack,
        audioTrack.startsWith('/') ? audioTrack.substring(1) : `/${audioTrack}`,
        `/music/${audioTrack.replace('/music/', '').replace('/', '')}`,
      ];

      const tryPlay = (index: number) => {
        if (index >= candidatePaths.length) {
          console.warn(`Could not load MP3 from candidates, playing fallback synth tune`);
          this.startSynthMusic('romantic');
          if (onSuccess) onSuccess();
          return;
        }

        const path = candidatePaths[index];
        const audio = new Audio(path);
        audio.loop = true;
        audio.volume = 0.75;

        audio.onerror = () => {
          tryPlay(index + 1);
        };

        const playPromise = audio.play();
        if (playPromise !== undefined) {
          playPromise
            .then(() => {
              this.currentAudioElement = audio;
              this.isMusicPlaying = true;
              if (onSuccess) onSuccess();
            })
            .catch(() => {
              tryPlay(index + 1);
            });
        }
      };

      tryPlay(0);
    } else {
      this.startSynthMusic('birthday');
      if (onSuccess) onSuccess();
    }
  }

  private startSynthMusic(style: 'birthday' | 'romantic' = 'birthday') {
    this.initCtx();
    if (!this.ctx) return;
    this.isMusicPlaying = true;

    const melody = [
      { note: 261.63, duration: 0.35, delay: 0 },
      { note: 261.63, duration: 0.25, delay: 0.4 },
      { note: 293.66, duration: 0.6, delay: 0.7 },
      { note: 261.63, duration: 0.6, delay: 1.45 },
      { note: 349.23, duration: 0.6, delay: 2.2 },
      { note: 329.63, duration: 1.0, delay: 2.95 },
      { note: 261.63, duration: 0.35, delay: 4.2 },
      { note: 261.63, duration: 0.25, delay: 4.6 },
      { note: 293.66, duration: 0.6, delay: 4.9 },
      { note: 261.63, duration: 0.6, delay: 5.65 },
      { note: 392.00, duration: 0.6, delay: 6.4 },
      { note: 349.23, duration: 1.0, delay: 7.15 },
    ];

    const totalLoopDuration = 9.0;

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
