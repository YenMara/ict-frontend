
const themeToggle = document.getElementById('themeToggle');
const htmlEl = document.documentElement;

// Load saved theme (defaults to light)
const savedTheme = localStorage.getItem('theme') || 'light';
htmlEl.setAttribute('data-bs-theme', savedTheme);

themeToggle.addEventListener('click', () => {
  const currentTheme = htmlEl.getAttribute('data-bs-theme');
  const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
  htmlEl.setAttribute('data-bs-theme', newTheme);
  localStorage.setItem('theme', newTheme);
});

/* responsive dropdown in small screens */
 document.addEventListener('DOMContentLoaded', function () {
  const isMobile = () => window.innerWidth < 992;

  const courseToggle = document.querySelector('.hover-dropdown > .dropdown-toggle');
  const courseMenu = document.querySelector('.course-dropdown-menu');

  if (courseToggle && courseMenu) {
    courseToggle.addEventListener('click', function (e) {
      if (!isMobile()) return;
      e.preventDefault();
      e.stopPropagation();

      const isOpen = courseMenu.classList.toggle('show');
      courseToggle.classList.toggle('open', isOpen);
      courseToggle.setAttribute('aria-expanded', isOpen);
    });
  }


  document.querySelectorAll('.has-submenu').forEach(function (item) {
    item.addEventListener('click', function (e) {
      if (!isMobile()) return;
      if (e.target.closest('.submenu-item')) return;
      e.preventDefault();
      e.stopPropagation();

      const alreadyOpen = item.classList.contains('open');
      document.querySelectorAll('.has-submenu.open').forEach(el => el.classList.remove('open'));
      if (!alreadyOpen) item.classList.add('open');
    });
  });

  const navbarCollapse = document.getElementById('navbarSupportedContent');
  if (navbarCollapse) {
    navbarCollapse.addEventListener('hidden.bs.collapse', function () {
      courseMenu.classList.remove('show');
      courseToggle.classList.remove('open');
      courseToggle.setAttribute('aria-expanded', 'false');
      document.querySelectorAll('.has-submenu.open').forEach(el => el.classList.remove('open'));
    });
  }
});


// has-submenu
document.addEventListener('DOMContentLoaded', function () {
  const courseDropdown = document.querySelector('.hover-dropdown');
  const courseToggle = courseDropdown?.querySelector('.dropdown-toggle');
  const courseMenu = courseDropdown?.querySelector('.course-dropdown-menu');
  const mobileBreakpoint = window.matchMedia('(max-width: 991.98px)');

  if (courseToggle && courseMenu) {
    // Click COURSE to open/close the whole panel
    courseToggle.addEventListener('click', function (event) {
      if (!mobileBreakpoint.matches) return;

      event.preventDefault();
      event.stopPropagation();

      const isOpen = courseMenu.classList.toggle('show');
      courseToggle.setAttribute('aria-expanded', String(isOpen));
      courseToggle.classList.toggle('open', isOpen);

      if (!isOpen) {
        courseMenu.querySelectorAll('.has-submenu.open').forEach(function (item) {
          item.classList.remove('open');
        });
      }
    });

    // Click each has-submenu item (Social, Website, Design...) to expand/collapse
    courseMenu.querySelectorAll('.has-submenu').forEach(function (item) {
      item.addEventListener('click', function (event) {
        if (!mobileBreakpoint.matches) return;
        if (event.target.closest('.submenu-item')) return; // let real links navigate

        event.preventDefault();
        event.stopPropagation();

        const alreadyOpen = item.classList.contains('open');

        // close any other open item first (accordion behavior — only one open at a time)
        courseMenu.querySelectorAll('.has-submenu.open').forEach(function (el) {
          if (el !== item) el.classList.remove('open');
        });

        item.classList.toggle('open', !alreadyOpen);
      });
    });
  }
});