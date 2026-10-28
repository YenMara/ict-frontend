document.addEventListener('DOMContentLoaded', function () {
  const elements = Array.from(document.querySelectorAll(
    '.stats-section .stat-number, .hero-stats .stat b, .stats-card .stat-item b',
  ));
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (prefersReducedMotion || elements.length === 0) {
    return;
  }

  const counters = elements.map(function (element) {
    const match = element.textContent.trim().match(/^([\d,]+(?:\.\d+)?)(.*)$/);

    if (!match) {
      return null;
    }

    const target = Number(match[1].replace(/,/g, ''));

    if (!Number.isFinite(target)) {
      return null;
    }

    return {
      element: element,
      target: target,
      decimalPlaces: (match[1].split('.')[1] || '').length,
      suffix: match[2],
    };
  }).filter(Boolean);

  function animateCounter(counter) {
    const duration = 1600;
    let startTime;

    function update(timestamp) {
      if (startTime === undefined) {
        startTime = timestamp;
      }

      const progress = Math.min((timestamp - startTime) / duration, 1);
      const easedProgress = 1 - Math.pow(1 - progress, 3);
      const value = counter.target * easedProgress;

      counter.element.textContent = `${value.toLocaleString('en-US', {
        minimumFractionDigits: counter.decimalPlaces,
        maximumFractionDigits: counter.decimalPlaces,
      })}${counter.suffix}`;

      if (progress < 1) {
        window.requestAnimationFrame(update);
      }
    }

    window.requestAnimationFrame(update);
  }

  counters.forEach(function (counter) {
    counter.element.textContent = `${(0).toLocaleString('en-US', {
      minimumFractionDigits: counter.decimalPlaces,
      maximumFractionDigits: counter.decimalPlaces,
    })}${counter.suffix}`;
  });

  if (!('IntersectionObserver' in window)) {
    counters.forEach(animateCounter);
    return;
  }

  const counterByElement = new Map(counters.map(function (counter) {
    return [counter.element, counter];
  }));
  const observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) {
        return;
      }

      const counter = counterByElement.get(entry.target);
      if (counter) {
        animateCounter(counter);
      }
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.25 });

  counters.forEach(function (counter) {
    observer.observe(counter.element);
  });
});
