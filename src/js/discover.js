/* ============================================
   BUILDORA — Discover Page JavaScript (API Integrated)
   ============================================ */

document.addEventListener('DOMContentLoaded', async () => {
    // --- Global script.js handles cursor/particles ---

    // --- Mobile Sidebar ---
    const mobileSidebarBtn = document.getElementById('mobileSidebarBtn');
    const sidebar = document.getElementById('sidebar');
    if (mobileSidebarBtn && sidebar) {
        mobileSidebarBtn.addEventListener('click', () => sidebar.classList.toggle('open'));
    }

    // --- State ---
    let projects = [];
    let currentSearch = '';
    let currentSort = 'popular';
    let currentTech = 'all';

    // --- Render Projects ---
    const grid = document.getElementById('discoverGrid');
    function renderProjects(list) {
        grid.innerHTML = '';
        if (list.length === 0) {
            grid.innerHTML = '<div style="grid-column: 1/-1; text-align: center; padding: 40px; color: var(--text-secondary);">No projects found matching your criteria.</div>';
            document.querySelector('.results-count strong').textContent = 0;
            return;
        }

        list.forEach((p, i) => {
            const card = document.createElement('div');
            card.className = 'disc-project-card';
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px)';
            card.style.transition = `opacity 0.4s ease ${i * 0.05}s, transform 0.4s ease ${i * 0.05}s`;
            
            // Map data from FastAPI model
            const techList = p.tech_stack ? p.tech_stack.split(',').map(t => t.trim()) : [];
            const price = Math.round(p.tier1_price / 80); // roughly convert INR to USD for UI consistency
            const difficulty = p.tier2_price > 2000 ? 'major' : 'mini';
            const domainLabel = p.domain.toUpperCase();
            const industry = 'Tech';
            const rating = 4.8;
            const downloads = Math.floor(Math.random() * 200) + 50;

            card.innerHTML = `
                <a href="project.html" class="disc-card-link-wrapper" style="text-decoration: none; color: inherit;">
                    <div class="disc-card-top" style="display: flex; justify-content: space-between; margin-bottom: 20px;">
                        <span class="disc-domain ${p.domain}" style="font-size: 11px; text-transform: uppercase; font-weight: 700; color: var(--primary-light);">${domainLabel}</span>
                        <span class="disc-difficulty ${difficulty}" style="font-size: 11px; color: var(--text-muted);">${difficulty === 'mini' ? 'Mini Project' : 'Major Project'}</span>
                    </div>
                    <h3 style="font-family: var(--font-heading); font-size: 18px; font-weight: 700; margin-bottom: 12px;">${p.title}</h3>
                    <p style="font-size: 14px; color: var(--text-muted); line-height: 1.6; height: 44px; overflow: hidden; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical;">${p.description}</p>
                    <div class="disc-tech-row" style="margin-top: 16px; display: flex; flex-wrap: wrap; gap: 8px;">${techList.map(t => `<span class="tag-small" style="background: rgba(255,255,255,0.05);">${t}</span>`).join('')}</div>
                </a>
                <div class="disc-card-footer" style="margin-top: 24px; padding-top: 20px; border-top: 1px solid var(--glass-border); display: flex; justify-content: space-between; align-items: center;">
                    <div class="disc-price">
                        <span class="disc-current-price" style="font-size: 20px; font-weight: 700; font-family: var(--font-heading); color: var(--primary-light);">$${price}</span>
                    </div>
                    <button class="btn-primary btn-sm disc-buy-btn">Buy Now</button>
                </div>
            `;
            
            card.querySelector('.disc-buy-btn').addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                window.location.href = 'checkout.html?mode=buy&id=' + p.id;
            });

            grid.appendChild(card);
            requestAnimationFrame(() => {
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            });
        });
        document.querySelector('.results-count strong').textContent = list.length;
    }

    // --- Filter & Render Logic ---
    function applyAllFilters() {
        let filtered = projects.filter(p => {
            // Search
            if (currentSearch) {
                const q = currentSearch.toLowerCase();
                const matchesSearch = p.title.toLowerCase().includes(q) || 
                                      p.description.toLowerCase().includes(q) || 
                                      p.tech_stack.toLowerCase().includes(q) || 
                                      p.domain.toLowerCase().includes(q);
                if (!matchesSearch) return false;
            }

            // Tech Stack
            if (currentTech !== 'all') {
                const techMatch = p.tech_stack.toLowerCase().includes(currentTech);
                if (!techMatch) return false;
            }

            return true;
        });

        // We can also add Checkbox filtering here
        const priceChecks = Array.from(document.querySelectorAll('input[value="under50"], input[value="50to100"], input[value="over100"]')).filter(c => c.checked).map(c => c.value);

        if (priceChecks.length > 0) {
            filtered = filtered.filter(p => {
                const priceUsd = Math.round(p.tier1_price / 80);
                if (priceChecks.includes('under50') && priceUsd < 50) return true;
                if (priceChecks.includes('50to100') && priceUsd >= 50 && priceUsd <= 100) return true;
                if (priceChecks.includes('over100') && priceUsd > 100) return true;
                return false;
            });
        }

        renderProjects(filtered);
    }

    // --- Fetch Data ---
    try {
        grid.innerHTML = '<div style="grid-column: 1/-1; text-align: center; padding: 40px; color: var(--text-secondary);">Loading projects from API...</div>';
        const response = await fetch('http://127.0.0.1:8001/api/projects/');
        if (response.ok) {
            projects = await response.json();
            applyAllFilters();
        } else {
            console.error('Failed to fetch projects');
            grid.innerHTML = '<div style="grid-column: 1/-1; text-align: center; padding: 40px; color: #ef4444;">Failed to load projects. Is the backend running?</div>';
        }
    } catch (err) {
        console.error('API Error:', err);
        grid.innerHTML = '<div style="grid-column: 1/-1; text-align: center; padding: 40px; color: #ef4444;">Failed to load projects. Is the backend running?</div>';
    }

    // --- Event Listeners ---
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            currentSearch = e.target.value;
            applyAllFilters();
        });
    }

    const applyFiltersBtn = document.getElementById('applyFilters');
    if (applyFiltersBtn) {
        applyFiltersBtn.addEventListener('click', () => {
            applyAllFilters();
        });
    }

    const techTagsList = document.querySelectorAll('.tech-filter-tag');
    techTagsList.forEach(tag => {
        tag.addEventListener('click', (e) => {
            techTagsList.forEach(t => t.classList.remove('active'));
            tag.classList.add('active');
            currentTech = tag.dataset.tech;
            applyAllFilters();
        });
    });

});
