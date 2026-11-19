import confetti from 'canvas-confetti';

/**
 * Fires an energetic, multi-cannon celebratory confetti blast.
 * Uses Rozzy industrial brand colors (Amber/Yellow, Blue, Emerald, Coral, White).
 */
export function fireConfettiBlast() {
  if (typeof window === 'undefined') return;

  const count = 200;
  const defaults = {
    origin: { y: 0.65 },
    zIndex: 99999,
    colors: ['#FACC15', '#2563EB', '#10B981', '#F59E0B', '#3B82F6', '#EF4444', '#FFFFFF'],
  };

  function fire(particleRatio: number, opts: confetti.Options) {
    try {
      confetti({
        ...defaults,
        ...opts,
        particleCount: Math.floor(count * particleRatio),
      });
    } catch (e) {
      console.warn('Confetti animation error:', e);
    }
  }

  // 1. Initial multi-angle cannons
  fire(0.25, {
    spread: 26,
    startVelocity: 55,
  });
  fire(0.2, {
    spread: 60,
  });
  fire(0.35, {
    spread: 100,
    decay: 0.91,
    scalar: 1.1,
  });
  fire(0.1, {
    spread: 120,
    startVelocity: 25,
    decay: 0.92,
    scalar: 1.2,
  });
  fire(0.1, {
    spread: 120,
    startVelocity: 45,
  });

  // 2. Delayed left & right side cannons (after 180ms)
  setTimeout(() => {
    try {
      confetti({
        particleCount: 50,
        angle: 60,
        spread: 55,
        origin: { x: 0, y: 0.7 },
        zIndex: 99999,
        colors: defaults.colors,
      });
      confetti({
        particleCount: 50,
        angle: 120,
        spread: 55,
        origin: { x: 1, y: 0.7 },
        zIndex: 99999,
        colors: defaults.colors,
      });
    } catch (_) {}
  }, 180);
}
