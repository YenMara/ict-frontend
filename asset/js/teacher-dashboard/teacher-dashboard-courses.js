(() => {
  const modules = (window.TeacherDashboardModules = window.TeacherDashboardModules || {});

  modules.initCourses = function initCourses() {
    const teacherCourseCards = [...document.querySelectorAll('[data-teacher-course]')];
    const courseTabs = [...document.querySelectorAll('[data-course-status]')];
    const courseSearch = document.getElementById('courseSearch');
    const courseCount = document.getElementById('courseResultCount');
    const courseEmpty = document.getElementById('teacherCoursesEmpty');
    const courseSortToggle = document.getElementById('courseSortToggle');
    const courseSortMenu = document.getElementById('courseSortMenu');
    const courseGrid = document.getElementById('teacherCourseGrid');
    let activeCourseStatus = 'all';

    function filterTeacherCourses() {
      const query = courseSearch.value.trim().toLocaleLowerCase();
      let visibleCount = 0;
      teacherCourseCards.forEach((card) => {
        const matchesStatus = activeCourseStatus === 'all' || card.dataset.status === activeCourseStatus;
        const matchesSearch = card.textContent.toLocaleLowerCase().includes(query);
        const show = matchesStatus && matchesSearch;
        card.hidden = !show;
        if (show) visibleCount += 1;
      });
      courseCount.textContent = `Showing ${visibleCount} ${visibleCount === 1 ? 'course' : 'courses'}`;
      courseEmpty.hidden = visibleCount !== 0;
    }

    courseTabs.forEach((tab) => tab.addEventListener('click', () => {
      activeCourseStatus = tab.dataset.courseStatus;
      courseTabs.forEach((item) => {
        const selected = item === tab;
        item.classList.toggle('is-selected', selected);
        item.setAttribute('aria-selected', String(selected));
      });
      filterTeacherCourses();
    }));
    courseSearch.addEventListener('input', filterTeacherCourses);

    courseSortToggle.addEventListener('click', () => {
      const open = courseSortMenu.hidden;
      courseSortMenu.hidden = !open;
      courseSortToggle.setAttribute('aria-expanded', String(open));
    });
    courseSortMenu.querySelectorAll('[data-course-sort]').forEach((button) => button.addEventListener('click', () => {
      const sortBy = button.dataset.courseSort;
      const sortedCards = [...teacherCourseCards].sort((a, b) => sortBy === 'name'
        ? a.dataset.name.localeCompare(b.dataset.name)
        : Number(a.dataset.progress) - Number(b.dataset.progress));
      sortedCards.forEach((card) => courseGrid.insertBefore(card, courseEmpty));
      courseSortMenu.hidden = true;
      courseSortToggle.setAttribute('aria-expanded', 'false');
    }));

    document.getElementById('resetCourseFilters').addEventListener('click', () => {
      courseSearch.value = '';
      activeCourseStatus = 'all';
      courseTabs.forEach((tab) => {
        const selected = tab.dataset.courseStatus === 'all';
        tab.classList.toggle('is-selected', selected);
        tab.setAttribute('aria-selected', String(selected));
      });
      filterTeacherCourses();
      courseSearch.focus();
    });

    document.addEventListener('click', (event) => {
      if (!event.target.closest('.courses-filter-wrap') && !courseSortMenu.hidden) {
        courseSortMenu.hidden = true;
        courseSortToggle.setAttribute('aria-expanded', 'false');
      }
    });
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && !courseSortMenu.hidden) {
        courseSortMenu.hidden = true;
        courseSortToggle.setAttribute('aria-expanded', 'false');
      }
      if (event.key === '/' && !document.getElementById('coursesView').hidden && !['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName)) {
        event.preventDefault();
        courseSearch.focus();
      }
    });

    return { teacherCourseCards };
  };
})();
