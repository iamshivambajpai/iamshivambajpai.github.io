const root = document.documentElement;
const themeToggle = document.getElementById('themeToggle');
const themeStorageKey = 'preferred-theme';
const systemThemeQuery = window.matchMedia('(prefers-color-scheme: dark)');

const readSavedTheme = () => {
  try {
    const saved = localStorage.getItem(themeStorageKey);
    return saved === 'dark' || saved === 'light' ? saved : null;
  } catch (error) {
    return null;
  }
};

const saveTheme = (theme) => {
  try {
    localStorage.setItem(themeStorageKey, theme);
  } catch (error) {
    // Ignore storage write issues and continue with in-memory state.
  }
};

const applyTheme = (theme) => {
  root.dataset.theme = theme;

  if (!themeToggle) return;

  const isDark = theme === 'dark';
  themeToggle.textContent = isDark ? 'Light Mode' : 'Dark Mode';
  themeToggle.setAttribute('aria-pressed', String(isDark));
  themeToggle.setAttribute(
    'aria-label',
    isDark ? 'Switch to light mode' : 'Switch to dark mode'
  );
};

const savedTheme = readSavedTheme();
applyTheme(savedTheme || (systemThemeQuery.matches ? 'dark' : 'light'));

if (themeToggle) {
  themeToggle.addEventListener('click', () => {
    const nextTheme = root.dataset.theme === 'dark' ? 'light' : 'dark';
    applyTheme(nextTheme);
    saveTheme(nextTheme);
  });
}

const handleSystemThemeChange = (event) => {
  if (!readSavedTheme()) {
    applyTheme(event.matches ? 'dark' : 'light');
  }
};

if (typeof systemThemeQuery.addEventListener === 'function') {
  systemThemeQuery.addEventListener('change', handleSystemThemeChange);
} else if (typeof systemThemeQuery.addListener === 'function') {
  systemThemeQuery.addListener(handleSystemThemeChange);
}

const revealElements = document.querySelectorAll('.reveal');

const revealObserver = new IntersectionObserver(
  (entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;

      const delayIndex = Number(entry.target.dataset.delay || 0);
      entry.target.style.transitionDelay = `${delayIndex * 80}ms`;
      entry.target.classList.add('in-view');
      observer.unobserve(entry.target);
    });
  },
  {
    threshold: 0.2,
    rootMargin: '0px 0px -40px 0px',
  }
);

revealElements.forEach((element) => revealObserver.observe(element));

const sectionIds = [
  'summary',
  'experience',
  'education',
  'skills',
];
const navLinks = Array.from(document.querySelectorAll('.nav-link'));

const setActiveNav = (id) => {
  navLinks.forEach((link) => {
    const target = link.getAttribute('href').replace('#', '');
    link.classList.toggle('active', target === id);
  });
};

setActiveNav('summary');

const sectionObserver = new IntersectionObserver(
  (entries) => {
    const visible = entries
      .filter((entry) => entry.isIntersecting)
      .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

    if (visible) {
      setActiveNav(visible.target.id);
    }
  },
  {
    threshold: [0.3, 0.5, 0.7],
  }
);

sectionIds.forEach((id) => {
  const section = document.getElementById(id);
  if (section) {
    sectionObserver.observe(section);
  }
});
