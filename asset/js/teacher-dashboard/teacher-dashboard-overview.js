(() => {
  const modules = (window.TeacherDashboardModules = window.TeacherDashboardModules || {});

  modules.initOverview = function initOverview({ setView, showToast }) {
    const statActions = ['courses', 'students', 'schedule', 'attendance'];
    document.querySelectorAll('.stat-card').forEach((card, index) => {
      card.dataset.statAction = statActions[index];
      card.setAttribute('role', 'button');
      card.tabIndex = 0;
      card.addEventListener('click', () => {
        const action = card.dataset.statAction;
        if (action === 'courses') setView('courses');
        if (action === 'schedule') document.querySelector('.schedule-panel').scrollIntoView({ behavior: 'smooth', block: 'center' });
        if (action === 'students') {
          setView('courses');
          showToast('Your courses currently have 1 enrolled student.');
        }
        if (action === 'attendance') showToast('Average attendance is 33% across recorded sessions.');
      });
      card.addEventListener('keydown', (event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          card.click();
        }
      });
    });
  };
})();
