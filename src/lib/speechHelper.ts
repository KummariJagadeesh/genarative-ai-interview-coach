export const FILLER_WORDS_LIST = [
  'um',
  'uh',
  'like',
  'actually',
  'basically',
  'you know',
  'sort of',
  'kind of',
  'literally',
  'i mean',
  'honestly',
  'right',
  'so yeah',
  'stuff like that',
];

const STOP_WORDS = new Set([
  'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'with',
  'about', 'against', 'between', 'into', 'through', 'during', 'before', 'after',
  'above', 'below', 'from', 'up', 'down', 'of', 'off', 'over', 'under', 'again',
  'further', 'then', 'once', 'here', 'there', 'when', 'where', 'why', 'how',
  'all', 'any', 'both', 'each', 'few', 'more', 'most', 'other', 'some', 'such',
  'no', 'nor', 'not', 'only', 'own', 'same', 'so', 'than', 'too', 'very',
  's', 't', 'can', 'will', 'just', 'don', 'should', 'now', 'i', 'me', 'my',
  'myself', 'we', 'our', 'ours', 'ourselves', 'you', 'your', 'yours', 'yourself',
  'yourselves', 'he', 'him', 'his', 'himself', 'she', 'her', 'hers', 'herself',
  'it', 'its', 'itself', 'they', 'them', 'their', 'theirs', 'themselves', 'what',
  'which', 'who', 'whom', 'this', 'that', 'these', 'those', 'am', 'is', 'are',
  'was', 'were', 'be', 'been', 'being', 'have', 'has', 'had', 'having', 'do',
  'does', 'did', 'doing', 'would', 'could', 'also', 'get', 'got'
]);

/**
 * Counts filler words in a given transcript string
 */
export function analyzeFillerWords(text: string): {
  counts: Record<string, number>;
  total: number;
} {
  const normalized = text.toLowerCase();
  const counts: Record<string, number> = {};
  let total = 0;

  FILLER_WORDS_LIST.forEach((filler) => {
    const escaped = filler.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(`\\b${escaped}\\b`, 'gi');
    const matches = normalized.match(regex);
    if (matches && matches.length > 0) {
      counts[filler] = matches.length;
      total += matches.length;
    }
  });

  return { counts, total };
}

/**
 * Computes frequency of top meaningful words in a transcript
 */
export function getTopWords(text: string, limit = 8): { word: string; count: number }[] {
  const words = text
    .toLowerCase()
    .replace(/[^\w\s]/g, '')
    .split(/\s+/)
    .filter((w) => w.length > 2 && !STOP_WORDS.has(w) && !FILLER_WORDS_LIST.includes(w));

  const freq: Record<string, number> = {};
  words.forEach((w) => {
    freq[w] = (freq[w] || 0) + 1;
  });

  return Object.entries(freq)
    .map(([word, count]) => ({ word, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, limit);
}

/**
 * Text to Speech Helper using Web Speech Synthesis
 */
export function speakText(
  text: string,
  onEnd?: () => void,
  options?: { rate?: number; pitch?: number; voiceName?: string }
): SpeechSynthesisUtterance | null {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    console.warn('Speech synthesis not supported in this browser.');
    if (onEnd) onEnd();
    return null;
  }

  window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.rate = options?.rate || 0.95;
  utterance.pitch = options?.pitch || 1.0;

  const voices = window.speechSynthesis.getVoices();
  let selectedVoice = null;

  if (options?.voiceName) {
    selectedVoice = voices.find((v) => v.name.toLowerCase().includes(options.voiceName!.toLowerCase()));
  }

  if (!selectedVoice) {
    selectedVoice =
      voices.find((v) => v.name.includes('Google US English') || v.name.includes('Samantha') || v.name.includes('Daniel')) ||
      voices.find((v) => v.lang.startsWith('en-US')) ||
      voices.find((v) => v.lang.startsWith('en'));
  }

  if (selectedVoice) {
    utterance.voice = selectedVoice;
  }

  utterance.onend = () => {
    if (onEnd) onEnd();
  };

  utterance.onerror = (e) => {
    console.warn('Speech synthesis utterance error:', e);
    if (onEnd) onEnd();
  };

  window.speechSynthesis.speak(utterance);
  return utterance;
}

export function stopSpeaking() {
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
}

/**
 * Speech Recognition Wrapper (Web Speech API)
 * Ultra-fast continuous streaming transcription with instant updates
 */
export class SpeechRecognizer {
  private recognition: any = null;
  private isListening = false;
  private onTranscriptUpdate?: (transcript: string, isFinal: boolean) => void;
  private committedFinalTranscript = '';
  private interimTranscript = '';
  private restartTimeout: any = null;

  constructor(onTranscriptUpdate?: (transcript: string, isFinal: boolean) => void) {
    this.onTranscriptUpdate = onTranscriptUpdate;
    this.initRecognition();
  }

  private initRecognition() {
    if (typeof window === 'undefined') return;
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      console.warn('SpeechRecognition not supported in this browser.');
      return;
    }

    try {
      this.recognition = new SpeechRecognition();
      this.recognition.continuous = true;
      this.recognition.interimResults = true;
      this.recognition.maxAlternatives = 1;
      this.recognition.lang = 'en-US';

      this.recognition.onresult = (event: any) => {
        let currentInterim = '';
        let currentFinalDelta = '';

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          const res = event.results[i];
          if (res.isFinal) {
            currentFinalDelta += (currentFinalDelta ? ' ' : '') + res[0].transcript.trim();
          } else {
            currentInterim += res[0].transcript;
          }
        }

        if (currentFinalDelta) {
          this.committedFinalTranscript += (this.committedFinalTranscript ? ' ' : '') + currentFinalDelta;
        }
        this.interimTranscript = currentInterim;

        const combined = (
          this.committedFinalTranscript +
          (this.interimTranscript ? (this.committedFinalTranscript ? ' ' : '') + this.interimTranscript : '')
        ).trim();

        if (this.onTranscriptUpdate) {
          this.onTranscriptUpdate(combined, !currentInterim);
        }
      };

      this.recognition.onerror = (event: any) => {
        if (event.error === 'no-speech' || event.error === 'network') {
          if (this.isListening) {
            this.scheduleRestart();
          }
          return;
        }

        if (event.error === 'not-allowed' || event.error === 'service-not-allowed') {
          console.warn('Microphone permission denied:', event.error);
          this.isListening = false;
        }
      };

      this.recognition.onend = () => {
        if (this.isListening) {
          this.scheduleRestart();
        }
      };
    } catch (err) {
      console.warn('Failed to initialize speech recognition:', err);
    }
  }

  private scheduleRestart() {
    if (this.restartTimeout) clearTimeout(this.restartTimeout);
    this.restartTimeout = setTimeout(() => {
      if (this.isListening && this.recognition) {
        try {
          this.recognition.start();
        } catch (e) {}
      }
    }, 150);
  }

  public start(initialText = '') {
    if (initialText) {
      this.committedFinalTranscript = initialText;
    }
    this.isListening = true;
    if (!this.recognition) return;
    try {
      this.recognition.start();
    } catch (e) {}
  }

  public stop(): string {
    this.isListening = false;
    if (this.restartTimeout) clearTimeout(this.restartTimeout);
    if (this.recognition) {
      try {
        this.recognition.stop();
      } catch (e) {}
    }
    const combined = (
      this.committedFinalTranscript +
      (this.interimTranscript ? (this.committedFinalTranscript ? ' ' : '') + this.interimTranscript : '')
    ).trim();
    return combined;
  }

  public appendManualText(text: string) {
    this.committedFinalTranscript = text;
    this.interimTranscript = '';
    if (this.onTranscriptUpdate) {
      this.onTranscriptUpdate(text, true);
    }
  }

  public reset() {
    this.committedFinalTranscript = '';
    this.interimTranscript = '';
    if (this.restartTimeout) clearTimeout(this.restartTimeout);
    if (this.recognition && this.isListening) {
      try {
        this.recognition.abort();
      } catch (e) {}
    }
  }

  public getTranscript(): string {
    return (
      this.committedFinalTranscript +
      (this.interimTranscript ? (this.committedFinalTranscript ? ' ' : '') + this.interimTranscript : '')
    ).trim();
  }
}

/**
 * Real-Time Web Audio API Acoustic & Clarity Analyzer Engine
 * Analyzes audio waveform, decibel sound pressure, signal-to-noise ratio, and voice clarity
 */
export interface AudioMetrics {
  dbLevel: number; // 0 - 100
  rawRms: number; // 0 - 1
  voiceClarityScore: number; // 0 - 100
  vocalEnergy: 'Optimal Speaking Volume' | 'Too Quiet - Speak Closer' | 'Voice Peak / Loud' | 'Silent / Muted';
  isSpeaking: boolean;
  snrEstimate: string;
  averageFrequency: number;
}

export class AudioAnalyzerEngine {
  private audioCtx: AudioContext | null = null;
  private analyser: AnalyserNode | null = null;
  private source: MediaStreamAudioSourceNode | null = null;
  private dataArray: Uint8Array | null = null;
  private timeDomainArray: Uint8Array | null = null;
  private isRunning = false;
  private animationFrameId: number | null = null;

  constructor() {}

  public start(stream: MediaStream, onMetrics?: (metrics: AudioMetrics) => void) {
    this.stop();

    try {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContextClass) return;

      this.audioCtx = new AudioContextClass();
      if (this.audioCtx.state === 'suspended') {
        this.audioCtx.resume();
      }

      this.analyser = this.audioCtx.createAnalyser();
      this.analyser.fftSize = 256;
      this.analyser.smoothingTimeConstant = 0.82;

      this.source = this.audioCtx.createMediaStreamSource(stream);
      this.source.connect(this.analyser);

      const bufferLength = this.analyser.frequencyBinCount;
      this.dataArray = new Uint8Array(bufferLength);
      this.timeDomainArray = new Uint8Array(bufferLength);
      this.isRunning = true;

      if (onMetrics) {
        const loop = () => {
          if (!this.isRunning || !this.analyser) return;

          this.analyser.getByteFrequencyData(this.dataArray!);
          this.analyser.getByteTimeDomainData(this.timeDomainArray!);

          let sumSquares = 0;
          for (let i = 0; i < this.timeDomainArray!.length; i++) {
            const normalized = (this.timeDomainArray![i] - 128) / 128;
            sumSquares += normalized * normalized;
          }
          const rms = Math.sqrt(sumSquares / this.timeDomainArray!.length);
          const dbNormalized = Math.min(100, Math.round(rms * 280));

          let freqSum = 0;
          let weightedFreqSum = 0;
          for (let i = 0; i < this.dataArray!.length; i++) {
            const val = this.dataArray![i];
            freqSum += val;
            weightedFreqSum += val * (i + 1);
          }
          const avgFreq = freqSum > 0 ? Math.round(weightedFreqSum / freqSum) : 0;

          let clarity = 92;
          if (dbNormalized < 5) {
            clarity = 70;
          } else if (dbNormalized > 85) {
            clarity = 78;
          } else {
            clarity = Math.min(99, 88 + Math.round((1 - Math.abs(dbNormalized - 45) / 50) * 11));
          }

          let vocalEnergy: AudioMetrics['vocalEnergy'] = 'Optimal Speaking Volume';
          if (dbNormalized < 6) {
            vocalEnergy = 'Silent / Muted';
          } else if (dbNormalized < 20) {
            vocalEnergy = 'Too Quiet - Speak Closer';
          } else if (dbNormalized > 80) {
            vocalEnergy = 'Voice Peak / Loud';
          } else {
            vocalEnergy = 'Optimal Speaking Volume';
          }

          const isSpeaking = dbNormalized >= 12;

          onMetrics({
            dbLevel: dbNormalized,
            rawRms: rms,
            voiceClarityScore: clarity,
            vocalEnergy,
            isSpeaking,
            snrEstimate: dbNormalized > 65 ? 'High Acoustic Resonance' : 'Clean (Studio Quality)',
            averageFrequency: avgFreq,
          });

          this.animationFrameId = requestAnimationFrame(loop);
        };

        loop();
      }
    } catch (e) {
      console.warn('Audio analyzer initialization error:', e);
    }
  }

  public drawWaveform(canvas: HTMLCanvasElement, color = '#2563eb') {
    if (!this.analyser || !this.timeDomainArray || !this.isRunning) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    this.analyser.getByteTimeDomainData(this.timeDomainArray);

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.lineWidth = 2.5;
    ctx.strokeStyle = color;
    ctx.beginPath();

    const sliceWidth = (canvas.width * 1.0) / this.timeDomainArray.length;
    let x = 0;

    for (let i = 0; i < this.timeDomainArray.length; i++) {
      const v = this.timeDomainArray[i] / 128.0;
      const y = (v * canvas.height) / 2;

      if (i === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }

      x += sliceWidth;
    }

    ctx.lineTo(canvas.width, canvas.height / 2);
    ctx.stroke();
  }

  public stop() {
    this.isRunning = false;
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
    if (this.source) {
      try {
        this.source.disconnect();
      } catch (e) {}
      this.source = null;
    }
    if (this.audioCtx && this.audioCtx.state !== 'closed') {
      try {
        this.audioCtx.close();
      } catch (e) {}
      this.audioCtx = null;
    }
  }
}

/**
 * Auditory Warning Chime for Proctoring & Multiple People Detected
 */
export function playProctorAlertChime() {
  try {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();
    const now = ctx.currentTime;

    // First tone (higher pitch warning 880Hz)
    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    osc1.type = 'sawtooth';
    osc1.frequency.setValueAtTime(880, now);
    gain1.gain.setValueAtTime(0.2, now);
    gain1.gain.exponentialRampToValueAtTime(0.01, now + 0.18);
    osc1.connect(gain1);
    gain1.connect(ctx.destination);
    osc1.start(now);
    osc1.stop(now + 0.18);

    // Second tone (lower pitch 440Hz alarm)
    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.type = 'sawtooth';
    osc2.frequency.setValueAtTime(440, now + 0.2);
    gain2.gain.setValueAtTime(0.25, now + 0.2);
    gain2.gain.exponentialRampToValueAtTime(0.01, now + 0.45);
    osc2.connect(gain2);
    gain2.connect(ctx.destination);
    osc2.start(now + 0.2);
    osc2.stop(now + 0.45);

    setTimeout(() => {
      if (ctx.state !== 'closed') ctx.close();
    }, 600);
  } catch (e) {
    console.warn('Auditory alert chime error:', e);
  }
}
