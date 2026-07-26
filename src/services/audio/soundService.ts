export type SoundEvent = "MISSION_COMPLETE" | "ACHIEVEMENT_UNLOCKED" | "SUCCESS" | "ERROR";

let audioMuted = false;

export function setAudioMuted(muted: boolean) {
  audioMuted = muted;
  if (typeof window !== "undefined") {
    localStorage.setItem("titan_sound_muted", muted ? "true" : "false");
  }
}

export function isAudioMuted(): boolean {
  if (typeof window !== "undefined") {
    return localStorage.getItem("titan_sound_muted") === "true";
  }
  return audioMuted;
}

export function playUISound(event: SoundEvent) {
  if (isAudioMuted() || typeof window === "undefined") return;

  try {
    const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioCtx) return;

    const ctx = new AudioCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.connect(gain);
    gain.connect(ctx.destination);

    const now = ctx.currentTime;

    if (event === "MISSION_COMPLETE") {
      osc.frequency.setValueAtTime(523.25, now); // C5
      osc.frequency.exponentialRampToValueAtTime(659.25, now + 0.15); // E5
      osc.frequency.exponentialRampToValueAtTime(783.99, now + 0.3); // G5
      gain.gain.setValueAtTime(0.15, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.45);
      osc.start(now);
      osc.stop(now + 0.45);
    } else if (event === "ACHIEVEMENT_UNLOCKED") {
      osc.frequency.setValueAtTime(440, now); // A4
      osc.frequency.exponentialRampToValueAtTime(880, now + 0.2); // A5
      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.4);
      osc.start(now);
      osc.stop(now + 0.4);
    } else {
      osc.frequency.setValueAtTime(440, now);
      gain.gain.setValueAtTime(0.1, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.15);
      osc.start(now);
      osc.stop(now + 0.15);
    }
  } catch (err) {
    // Ignore audio synthesis errors gracefully
  }
}
