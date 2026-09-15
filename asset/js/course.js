const searchInput = document.getElementById('searchInput');
const priceRange = document.getElementById('priceRange');
const priceOut = document.getElementById('priceOut');
const courseGrid = document.getElementById('courseGrid');

if (searchInput && priceRange && priceOut && courseGrid) {
  const courseItems = Array.from(courseGrid.querySelectorAll('.course-item'));
  const pager = document.querySelector('.pager');
  const resultCount = document.getElementById('resultCount');
  const pageSize = 6;
  let activeCat = 'all';
  let currentPage = 1;

  function getFilteredItems() {
    const query = searchInput.value.toLowerCase().trim();
    const maxPrice = Number(priceRange.value);

    return courseItems.filter((item) => {
      const categoryMatches = activeCat === 'all' || item.dataset.cat === activeCat;
      const titleMatches = item.dataset.title.toLowerCase().includes(query);
      const price = Number(item.querySelector('.course-price').textContent.replace(/[^0-9.]/g, ''));
      return categoryMatches && titleMatches && price <= maxPrice;
    });
  }

  function updatePager(totalPages) {
    if (!pager) return;
    pager.innerHTML = '';
    if (totalPages <= 1) return;

    const createButton = (label, className, onClick, disabled = false) => {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = className;
      button.disabled = disabled;
      button.innerHTML = label;
      button.addEventListener('click', onClick);
      return button;
    };

    pager.appendChild(createButton(
      '<i class="fa-solid fa-chevron-left"></i>',
      'nav-arrow',
      () => { currentPage -= 1; renderResults(); },
      currentPage === 1,
    ));

    for (let page = 1; page <= totalPages; page += 1) {
      pager.appendChild(createButton(
        String(page),
        page === currentPage ? 'active' : '',
        () => { currentPage = page; renderResults(); },
      ));
    }

    pager.appendChild(createButton(
      '<i class="fa-solid fa-chevron-right"></i>',
      'nav-arrow',
      () => { currentPage += 1; renderResults(); },
      currentPage === totalPages,
    ));
  }

  function renderResults() {
    const filteredItems = getFilteredItems();
    const totalPages = Math.max(1, Math.ceil(filteredItems.length / pageSize));
    currentPage = Math.min(currentPage, totalPages);
    const firstItem = (currentPage - 1) * pageSize;
    const visibleItems = new Set(filteredItems.slice(firstItem, firstItem + pageSize));

    courseItems.forEach((item) => {
      item.style.display = visibleItems.has(item) ? '' : 'none';
    });
    resultCount.textContent = `${filteredItems.length} ${filteredItems.length === 1 ? 'course' : 'courses'}`;
    updatePager(totalPages);
  }

  window.applyFilters = function applyFilters() {
    currentPage = 1;
    renderResults();
  };

  document.querySelectorAll('.cat-option').forEach((option) => {
    option.addEventListener('click', () => {
      document.querySelectorAll('.cat-option').forEach((item) => item.classList.remove('active'));
      option.classList.add('active');
      activeCat = option.dataset.cat;
      currentPage = 1;
      renderResults();
    });
  });

  searchInput.addEventListener('input', () => {
    currentPage = 1;
    renderResults();
  });

  priceRange.addEventListener('input', () => {
    priceOut.textContent = `$${priceRange.value}`;
    currentPage = 1;
    renderResults();
  });

  window.clearFilters = function clearFilters() {
    searchInput.value = '';
    priceRange.value = priceRange.max;
    priceOut.textContent = `$${priceRange.max}`;
    document.querySelectorAll('.cat-option').forEach((option) => option.classList.remove('active'));
    document.querySelector('.cat-option[data-cat="all"]').classList.add('active');
    activeCat = 'all';
    currentPage = 1;
    renderResults();
  };

  renderResults();
}