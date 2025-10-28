const initRevealAnimations = () => {
  const elements = Array.from(document.querySelectorAll('.fade-in-up'));
  if (!elements.length) {
    return;
  }

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if ('IntersectionObserver' in window && !prefersReducedMotion) {
    const observer = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );

    elements.forEach((el) => observer.observe(el));
  } else {
    elements.forEach((el) => el.classList.add('is-visible'));
  }
};

const initButtonRipple = () => {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion) {
    return;
  }

  const rippleClass = 'ui-ripple';
  const hostClass = 'has-ripple';

  const handlePointerDown = (event) => {
    const target = event.target.closest('button, [data-ripple="true"]');
    if (!target || target.disabled || target.dataset.ripple === 'false') {
      return;
    }

    target.classList.add(hostClass);

    const rect = target.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const ripple = document.createElement('span');
    ripple.className = rippleClass;
    ripple.style.setProperty('--ripple-size', `${size}px`);
    ripple.style.setProperty('--ripple-x', `${event.clientX - rect.left - size / 2}px`);
    ripple.style.setProperty('--ripple-y', `${event.clientY - rect.top - size / 2}px`);

    target.appendChild(ripple);
    ripple.addEventListener('animationend', () => {
      ripple.remove();
    });
  };

  document.addEventListener('pointerdown', handlePointerDown);
};

const markUiReady = () => {
  document.documentElement.classList.add('ui-ready');
};

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    markUiReady();
    initRevealAnimations();
    initButtonRipple();
  });
} else {
  markUiReady();
  initRevealAnimations();
  initButtonRipple();
}
