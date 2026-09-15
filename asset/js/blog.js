  let activeFilter = 'all';
 
  document.querySelectorAll('.pill-btn').forEach(btn=>{
    btn.addEventListener('click',()=>{
      document.querySelectorAll('.pill-btn').forEach(b=>b.classList.remove('active'));
      btn.classList.add('active');
      activeFilter = btn.dataset.filter;
      applyFilters();
    });
  });
 
  document.getElementById('searchInput').addEventListener('input', applyFilters);
 
  function applyFilters(){
    const q = document.getElementById('searchInput').value.toLowerCase().trim();
    let visible = 0;
    document.querySelectorAll('.blog-item').forEach(item=>{
      const source = item.dataset.source;
      const title = item.dataset.title.toLowerCase();
      const sourceMatch = activeFilter === 'all' || source === activeFilter;
      const searchMatch = q === '' || title.includes(q);
      if(sourceMatch && searchMatch){
        item.style.display = '';
        visible++;
      } else {
        item.style.display = 'none';
      }
    });
    document.getElementById('emptyState').style.display = visible === 0 ? 'block' : 'none';
  }