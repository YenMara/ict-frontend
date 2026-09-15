// Course cards
document.addEventListener('DOMContentLoaded', function () {
  const courseDropdown = document.querySelector('.hover-dropdown');
  const courseToggle = courseDropdown?.querySelector('.dropdown-toggle');
  const courseMenu = courseDropdown?.querySelector('.course-dropdown-menu');
  const mobileBreakpoint = window.matchMedia('(max-width: 991.98px)');

  if (courseToggle && courseMenu) {
    courseToggle.addEventListener('click', function (event) {
      if (!mobileBreakpoint.matches) {
        return;
      }

      event.preventDefault();
      const isOpen = courseMenu.classList.toggle('show');
      courseToggle.setAttribute('aria-expanded', String(isOpen));

      if (!isOpen) {
        courseMenu.querySelectorAll('.has-submenu.open').forEach(function (item) {
          item.classList.remove('open');
        });
      }
    });

    

    courseMenu.querySelectorAll('.has-submenu').forEach(function (item) {
      item.addEventListener('click', function (event) {
        if (!event.target.closest('.submenu-item')) {
          item.classList.toggle('open');
        }
      });
    });
  }

  const pills = document.querySelectorAll('.category-pill');
  const cards = document.querySelectorAll('.course-card-v2');
  const searchInput = document.querySelector('.course-search-input');

  let currentFilter = 'all';
  let currentSearch = '';

  function applyFilters() {
    cards.forEach(function (card) {
      const badgeElement = card.querySelector('.course-badge');
      const titleElement = card.querySelector('.course-card-title');
      const parentCol = card.closest('.col-12');

      if (!badgeElement || !titleElement || !parentCol) {
        return;
      }

      const badge = badgeElement.textContent.trim().toLowerCase();
      const title = titleElement.textContent.trim().toLowerCase();

      const matchesFilter = currentFilter === 'all' || badge === currentFilter;
      const matchesSearch = title.includes(currentSearch);

      if (matchesFilter && matchesSearch) {
        parentCol.style.display = '';
      } else {
        parentCol.style.display = 'none';
      }
    });
  }

  // Pill click handling
  pills.forEach(function (pill) {
    pill.addEventListener('click', function () {
      pills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');

      currentFilter = pill.dataset.filter;
      applyFilters();
    });
  });

  // Search input handling
  if (searchInput) {
    searchInput.addEventListener('input', function () {
      currentSearch = searchInput.value.trim().toLowerCase();
      applyFilters();
    });
  }

});