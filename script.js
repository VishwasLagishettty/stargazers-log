// Fetch events.json and render a simple starred repos list
document.addEventListener('DOMContentLoaded', () => {
    const listEl = document.getElementById('starred-list');
    const statusEl = document.getElementById('status');
  
    function showError(msg){
      if(statusEl) statusEl.textContent = msg;
      listEl.innerHTML = '';
    }
  
    // Try to fetch events.json relative to the page
    fetch('events.json', { cache: 'no-store' })
      .then(response => {
        if (!response.ok) throw new Error('Failed to load events.json: ' + response.status);
        return response.json();
      })
      .then(data => {
        if (!Array.isArray(data) || data.length === 0) {
          if(statusEl) statusEl.textContent = 'No starred repositories found.';
          return;
        }
        if(statusEl) statusEl.textContent = '';
        listEl.innerHTML = '';
        data.forEach(repo => {
          const li = document.createElement('li');
          li.className = 'repo-card';
  
          const main = document.createElement('div');
          main.className = 'repo-main';
  
          const title = document.createElement('h3');
          title.className = 'repo-title';
          const a = document.createElement('a');
          a.href = repo.html_url || '#';
          a.textContent = `${repo.owner}/${repo.name}`;
          a.target = '_blank';
          a.rel = 'noopener noreferrer';
          title.appendChild(a);
  
          const desc = document.createElement('p');
          desc.className = 'repo-desc';
          desc.textContent = repo.description || '';
  
          const meta = document.createElement('div');
          meta.className = 'repo-meta';
  
          if (repo.language) {
            const lang = document.createElement('span');
            lang.textContent = repo.language;
            meta.appendChild(lang);
          }
  
          if (typeof repo.stargazers_count === 'number') {
            const stars = document.createElement('span');
            stars.className = 'meta-pill';
            stars.textContent = `★ ${repo.stargazers_count.toLocaleString()}`;
            meta.appendChild(stars);
          }
  
          if (repo.starred_at) {
            const d = new Date(repo.starred_at);
            if (!isNaN(d)) {
              const time = document.createElement('span');
              time.textContent = `starred: ${d.toLocaleDateString()} ${d.toLocaleTimeString()}`;
              meta.appendChild(time);
            }
          }
  
          main.appendChild(title);
          main.appendChild(desc);
          main.appendChild(meta);
  
          li.appendChild(main);
          listEl.appendChild(li);
        });
      })
      .catch(err => {
        console.error(err);
        showError('Could not load starred repos. See console for details.');
      });
  });