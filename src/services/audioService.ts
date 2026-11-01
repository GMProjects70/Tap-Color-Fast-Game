/**
 * Procedural Web Audio API Sound Synthesizer & Haptics Engine
 * Zero external audio dependencies - 100% offline, zero latency, customizable pitch!
 */

class AudioService {
  private ctx: AudioContext | null = null;
  private soundEnabled = true;
  private musicEnabled = false;
  private vibrationEnabled = true;
  private musicInterval: number | null = null;
  private musicStep = 0;

  constructor() {
    // AudioContext will be initialized on first user interaction
  }

  private initContext() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public setSoundEnabled(enabled: boolean) {
    this.soundEnabled = enabled;
  }

  public setVibrationEnabled(enabled: boolean) {
    this.vibrationEnabled = enabled;
  }

  public setMusicEnabled(enabled: boolean) {
    this.musicEnabled = enabled;
    if (enabled) {
      this.startMusic();
    } else {
      this.stopMusic();
    }
  }

  public vibrate(pattern: number | number[] = 25) {
    if (!this.vibrationEnabled || typeof navigator === 'undefined' || !navigator.vibrate) return;
    try {
      navigator.vibrate(pattern);
    } catch {
      // Ignore vibration error on unsupported platforms
    }
  }

  /**
   * Button click sound: clean subtle acoustic blip
   */
  public playClick() {
    if (!this.soundEnabled) return;
    this.initContext();
    if (!this.ctx) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const now = this.ctx.currentTime;

    osc.type = 'sine';
    osc.frequency.setValueAtTime(600, now);
    osc.frequency.exponentialRampToValueAtTime(300, now + 0.05);

    gain.gain.setValueAtTime(0.12, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.05);
    this.vibrate(12);
  }

  /**
   * Correct answer pop: rich rising harmonic chord scaled by combo!
   */
  public playCorrect(combo = 0) {
    if (!this.soundEnabled) {
      this.vibrate(18);
      return;
    }
    this.initContext();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    // Base pentatonic note progression based on combo
    const notes = [523.25, 587.33, 659.25, 783.99, 880.00, 1046.50, 1174.66, 1318.51];
    const baseFreq = notes[Math.min(combo, notes.length - 1)];

    // Primary bell tone
    const osc1 = this.ctx.createOscillator();
    const osc2 = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc1.type = 'triangle';
    osc2.type = 'sine';

    osc1.frequency.setValueAtTime(baseFreq, now);
    osc1.frequency.exponentialRampToValueAtTime(baseFreq * 1.5, now + 0.12);

    osc2.frequency.setValueAtTime(baseFreq * 2, now);
    osc2.frequency.exponentialRampToValueAtTime(baseFreq * 2.2, now + 0.12);

    gain.gain.setValueAtTime(0.18, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);

    osc1.connect(gain);
    osc2.connect(gain);
    gain.connect(this.ctx.destination);

    osc1.start(now);
    osc2.start(now);
    osc1.stop(now + 0.18);
    osc2.stop(now + 0.18);

    this.vibrate(20);
  }

  /**
   * Mistake buzzer: low, distinct, snappy buzz without being grating
   */
  public playWrong() {
    this.vibrate([40, 30, 40]);
    if (!this.soundEnabled) return;
    this.initContext();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(140, now);
    osc.frequency.linearRampToValueAtTime(95, now + 0.18);

    gain.gain.setValueAtTime(0.2, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.18);
  }

  /**
   * Combo fanfare: enthusiastic ascending sparkle
   */
  public playComboFanfare() {
    if (!this.soundEnabled) return;
    this.initContext();
    if (!this.ctx) return;

    const chords = [523.25, 659.25, 783.99, 1046.50];
    chords.forEach((freq, idx) => {
      const now = this.ctx!.currentTime + idx * 0.05;
      const osc = this.ctx!.createOscillator();
      const gain = this.ctx!.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, now);

      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);

      osc.connect(gain);
      gain.connect(this.ctx!.destination);

      osc.start(now);
      osc.stop(now + 0.18);
    });

    this.vibrate([25, 20, 35]);
  }

  /**
   * Intermediate target completed in multi-target challenge
   */
  public playTargetStep() {
    this.vibrate(20);
    if (!this.soundEnabled) return;
    this.initContext();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(659.25, now);
    osc.frequency.exponentialRampToValueAtTime(880.00, now + 0.1);

    gain.gain.setValueAtTime(0.18, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.12);
  }

  /**
   * Double target challenge complete: energetic two-note chord
   */
  public playDoubleComplete() {
    this.vibrate([20, 30, 40]);
    if (!this.soundEnabled) return;
    this.initContext();
    if (!this.ctx) return;

    [783.99, 1046.50].forEach((freq, idx) => {
      const now = this.ctx!.currentTime + idx * 0.08;
      const osc = this.ctx!.createOscillator();
      const gain = this.ctx!.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, now);

      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);

      osc.connect(gain);
      gain.connect(this.ctx!.destination);

      osc.start(now);
      osc.stop(now + 0.18);
    });
  }

  /**
   * Triple target challenge complete: triumphant 3-note celebration!
   */
  public playTripleComplete() {
    this.vibrate([25, 30, 25, 30, 50]);
    if (!this.soundEnabled) return;
    this.initContext();
    if (!this.ctx) return;

    [659.25, 783.99, 1046.50, 1318.51].forEach((freq, idx) => {
      const now = this.ctx!.currentTime + idx * 0.07;
      const osc = this.ctx!.createOscillator();
      const gain = this.ctx!.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, now);

      gain.gain.setValueAtTime(0.22, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);

      osc.connect(gain);
      gain.connect(this.ctx!.destination);

      osc.start(now);
      osc.stop(now + 0.22);
    });
  }

  /**
   * Achievement Unlocked fanfare
   */
  public playAchievementUnlocked() {
    this.vibrate([30, 40, 50, 60]);
    if (!this.soundEnabled) return;
    this.initContext();
    if (!this.ctx) return;

    const notes = [523.25, 659.25, 783.99, 1046.50, 1318.51, 1567.98];
    notes.forEach((freq, idx) => {
      const now = this.ctx!.currentTime + idx * 0.06;
      const osc = this.ctx!.createOscillator();
      const gain = this.ctx!.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now);

      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);

      osc.connect(gain);
      gain.connect(this.ctx!.destination);

      osc.start(now);
      osc.stop(now + 0.25);
    });
  }

  /**
   * Level completed victory arpeggio
   */
  public playLevelVictory() {
    this.vibrate([30, 40, 50, 40, 80]);
    if (!this.soundEnabled) return;
    this.initContext();
    if (!this.ctx) return;

    const melody = [523.25, 659.25, 783.99, 1046.50, 1318.51];
    melody.forEach((freq, idx) => {
      const now = this.ctx!.currentTime + idx * 0.08;
      const osc = this.ctx!.createOscillator();
      const gain = this.ctx!.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now);

      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.28);

      osc.connect(gain);
      gain.connect(this.ctx!.destination);

      osc.start(now);
      osc.stop(now + 0.28);
    });
  }

  /**
   * Game Over gentle cadence
   */
  public playGameOver() {
    this.vibrate([60, 40, 80]);
    if (!this.soundEnabled) return;
    this.initContext();
    if (!this.ctx) return;

    const notes = [392.00, 349.23, 329.63, 261.63];
    notes.forEach((freq, idx) => {
      const now = this.ctx!.currentTime + idx * 0.12;
      const osc = this.ctx!.createOscillator();
      const gain = this.ctx!.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now);

      gain.gain.setValueAtTime(0.16, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);

      osc.connect(gain);
      gain.connect(this.ctx!.destination);

      osc.start(now);
      osc.stop(now + 0.22);
    });
  }

  /**
   * Procedural Ambient Synth Background Music (Calm, uplifting arcade rhythm)
   */
  private startMusic() {
    this.stopMusic();
    this.initContext();
    if (!this.ctx) return;

    const chords = [
      [261.63, 329.63, 392.00], // C
      [220.00, 261.63, 329.63], // Am
      [174.61, 220.00, 261.63], // F
      [196.00, 246.94, 293.66], // G
    ];

    this.musicStep = 0;
    this.musicInterval = window.setInterval(() => {
      if (!this.musicEnabled || !this.ctx) return;
      const currentChord = chords[this.musicStep % chords.length];
      const now = this.ctx.currentTime;

      // Soft ambient pad chord
      currentChord.forEach((freq) => {
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now);

        gain.gain.setValueAtTime(0.02, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 1.8);

        osc.connect(gain);
        gain.connect(this.ctx!.destination);

        osc.start(now);
        osc.stop(now + 1.8);
      });

      this.musicStep++;
    }, 2000);
  }

  private stopMusic() {
    if (this.musicInterval !== null) {
      clearInterval(this.musicInterval);
      this.musicInterval = null;
    }
  }
}

export const audioService = new AudioService();
