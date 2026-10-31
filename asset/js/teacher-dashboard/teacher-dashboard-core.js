(() => {
  const modules = (window.TeacherDashboardModules = window.TeacherDashboardModules || {});

  modules.initCore = function initCore() {
    const navButtons = [...document.querySelectorAll('.nav-link[data-view]')];
    const views = [...document.querySelectorAll('[data-page]')];
    const sidebar = document.getElementById('sidebar');
    const menuToggle = document.getElementById('menuToggle');
    const toast = document.getElementById('toast');
    let toastTimer;

    const now = new Date();
    const hour = now.getHours();
    document.getElementById('greeting').textContent = hour < 12 ? 'Good morning,' : hour < 18 ? 'Good afternoon,' : 'Good evening,';
    document.getElementById('todayDate').textContent = new Intl.DateTimeFormat('en-US', {
      weekday: 'long', month: 'long', day: 'numeric', year: 'numeric'
    }).format(now);

    function showToast(message) {
      toast.textContent = message;
      toast.classList.add('is-visible');
      window.clearTimeout(toastTimer);
      toastTimer = window.setTimeout(() => toast.classList.remove('is-visible'), 3200);
    }

    function closeMobileMenu() {
      sidebar.classList.remove('is-open');
      menuToggle.setAttribute('aria-expanded', 'false');
      menuToggle.setAttribute('aria-label', 'Open navigation');
      menuToggle.querySelector('path').setAttribute('d', 'M4 6h16M4 12h16M4 18h16');
      document.body.classList.remove('menu-open');
    }

    function setView(viewName) {
      const activeNavView = viewName === 'course-detail' ? 'courses' : viewName;
      navButtons.forEach((button) => {
        const active = button.dataset.view === activeNavView;
        button.classList.toggle('is-active', active);
        if (active) button.setAttribute('aria-current', 'page');
        else button.removeAttribute('aria-current');
      });
      views.forEach((view) => {
        const active = view.dataset.page === viewName;
        view.hidden = !active;
        view.classList.toggle('is-visible', active);
      });
      closeMobileMenu();
    }

    const sidebarScrim = document.createElement('button');
    sidebarScrim.type = 'button';
    sidebarScrim.className = 'sidebar-scrim';
    sidebarScrim.setAttribute('aria-label', 'Close navigation');
    sidebar.after(sidebarScrim);
    sidebarScrim.addEventListener('click', closeMobileMenu);
    navButtons.forEach((button) => button.addEventListener('click', () => setView(button.dataset.view)));

    const initialView = window.location.hash.slice(1);
    if (views.some((view) => view.dataset.page === initialView)) setView(initialView);

    return { setView, showToast, closeMobileMenu };
  };
})();
