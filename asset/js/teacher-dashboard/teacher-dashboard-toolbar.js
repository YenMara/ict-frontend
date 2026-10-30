(() => {
  const modules = (window.TeacherDashboardModules = window.TeacherDashboardModules || {});

  modules.initToolbar = function initToolbar({ setView, closeMobileMenu }) {
    const notificationToggle = document.getElementById('notificationToggle');
    const notificationMenu = document.getElementById('notificationMenu');
    const themeToggle = document.getElementById('themeToggle');
    const profileToggle = document.getElementById('topbarProfile');
    const profileMenu = document.getElementById('profileMenu');
    const profileMenuWrap = profileToggle.closest('.profile-menu-wrap');
    const sidebar = document.getElementById('sidebar');
    const menuToggle = document.getElementById('menuToggle');
    let profileMenuCloseTimer;

    function toggleNotifications(open = notificationMenu.hidden) {
      notificationMenu.hidden = !open;
      notificationToggle.setAttribute('aria-expanded', String(open));
    }

    function toggleProfileMenu(open = profileMenu.hidden) {
      window.clearTimeout(profileMenuCloseTimer);
      if (open) toggleNotifications(false);
      profileMenu.hidden = !open;
      profileToggle.setAttribute('aria-expanded', String(open));
    }

    notificationToggle.addEventListener('click', () => toggleNotifications());
    profileToggle.addEventListener('click', (event) => {
      const supportsHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
      toggleProfileMenu(event.detail > 0 && supportsHover ? true : !profileMenu.hidden);
    });
    profileMenuWrap.addEventListener('pointerenter', () => {
      if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) toggleProfileMenu(true);
    });
    profileMenuWrap.addEventListener('pointerleave', () => {
      profileMenuCloseTimer = window.setTimeout(() => {
        if (!profileMenuWrap.contains(document.activeElement)) toggleProfileMenu(false);
      }, 140);
    });
    profileMenuWrap.addEventListener('focusin', (event) => {
      if (event.target !== profileToggle) toggleProfileMenu(true);
    });
    profileMenuWrap.addEventListener('focusout', (event) => {
      if (!profileMenuWrap.contains(event.relatedTarget)) toggleProfileMenu(false);
    });
    profileMenu.querySelectorAll('[data-profile-view]').forEach((button) => {
      button.addEventListener('click', () => {
        toggleProfileMenu(false);
        setView(button.dataset.profileView);
      });
    });

    let initialTheme = 'dark';
    try { initialTheme = localStorage.getItem('teacherDashboardTheme') || 'dark'; } catch { /* use the default theme */ }
    document.documentElement.dataset.theme = initialTheme;
    themeToggle.setAttribute('aria-label', initialTheme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme');
    themeToggle.addEventListener('click', () => {
      const nextTheme = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
      document.documentElement.dataset.theme = nextTheme;
      themeToggle.setAttribute('aria-label', nextTheme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme');
      try { localStorage.setItem('teacherDashboardTheme', nextTheme); } catch { /* keep the selected theme for this page */ }
    });

    menuToggle.addEventListener('click', () => {
      const open = sidebar.classList.toggle('is-open');
      menuToggle.setAttribute('aria-expanded', String(open));
      menuToggle.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
      menuToggle.querySelector('path').setAttribute('d', open ? 'M5 5l14 14M19 5L5 19' : 'M4 6h16M4 12h16M4 18h16');
      document.body.classList.toggle('menu-open', open);
    });

    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') {
        closeMobileMenu();
        toggleNotifications(false);
        if (!profileMenu.hidden) {
          toggleProfileMenu(false);
          profileToggle.focus();
        }
      }
    });
    document.addEventListener('click', (event) => {
      if (!event.target.closest('.toolbar-action-wrap')) toggleNotifications(false);
      if (!profileMenuWrap.contains(event.target)) toggleProfileMenu(false);
    });

    function updateProfileIdentity(profile) {
      profileToggle.title = profile.name;
      document.getElementById('profileMenuName').textContent = profile.name;
      document.getElementById('profileMenuEmail').textContent = profile.email;
    }

    function showSignOutMessage(showToast) {
      showToast('Sign out will be available when an account service is connected.');
      toggleProfileMenu(false);
    }

    return { updateProfileIdentity, closeProfileMenu: () => toggleProfileMenu(false), showSignOutMessage };
  };
})();
