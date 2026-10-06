/* Decorative petals are deliberately sparse and pause off-screen. */
(() => {
  const layer = document.getElementById('hearts');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const narrowScreen = window.matchMedia('(max-width: 700px)');
  if (!layer) return;
  let timer = null;

  function addHeart() {
    const limit = narrowScreen.matches ? 5 : 8;
    if (document.hidden || layer.childElementCount >= limit) return;
    const heart = document.createElement('span');
    heart.className = 'heart';
    heart.setAttribute('aria-hidden', 'true');
    heart.textContent = '♥';
    heart.style.left = `${Math.random() * 100}vw`;
    heart.style.setProperty('--drift', `${Math.random() * 120 - 60}px`);
    heart.style.animationDuration = `${8 + Math.random() * 4}s`;
    heart.style.fontSize = `${12 + Math.random() * 12}px`;
    layer.append(heart);
    window.setTimeout(() => heart.remove(), 12500);
  }

  function syncMotion() {
    if (timer !== null) window.clearInterval(timer);
    timer = null;
    if (document.hidden || reducedMotion.matches) {
      layer.replaceChildren();
      return;
    }
    addHeart();
    timer = window.setInterval(addHeart, narrowScreen.matches ? 2400 : 1600);
  }

  document.addEventListener('visibilitychange', syncMotion);
  reducedMotion.addEventListener('change', syncMotion);
  narrowScreen.addEventListener('change', syncMotion);
  syncMotion();
})();
