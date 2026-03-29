/* ============================================
   BUILDORA — Developer Dashboard Logic (API Integrated)
   ============================================ */

document.addEventListener('DOMContentLoaded', async () => {
    // --- Cursor Glow ---
    const cursorGlow = document.getElementById('cursorGlow');
    let mouseX = 0, mouseY = 0, glowX = 0, glowY = 0;
    document.addEventListener('mousemove', (e) => { mouseX = e.clientX; mouseY = e.clientY; });
    function animateGlow() {
        glowX += (mouseX - glowX) * 0.1;
        glowY += (mouseY - glowY) * 0.1;
        if (cursorGlow) { cursorGlow.style.left = glowX + 'px'; cursorGlow.style.top = glowY + 'px'; }
        requestAnimationFrame(animateGlow);
    }
    animateGlow();

    // --- Mobile Sidebar ---
    const mobileSidebarBtn = document.getElementById('mobileSidebarBtn');
    const sidebar = document.getElementById('sidebar');
    if (mobileSidebarBtn && sidebar) {
        mobileSidebarBtn.addEventListener('click', () => sidebar.classList.toggle('open'));
    }

    // --- Fetch Open Gigs ---
    const gigListContainer = document.querySelector('.gig-list');
    
    async function loadOpenGigs() {
        if (!gigListContainer) return;
        
        gigListContainer.innerHTML = '<div style="text-align:center; padding: 2rem; color: var(--text-secondary);">Loading open gigs...</div>';
        
        try {
            const response = await fetch('http://127.0.0.1:8001/api/custom-requests/open');
            if (!response.ok) throw new Error('Failed to fetch gigs');
            
            const gigs = await response.json();
            
            if (gigs.length === 0) {
                gigListContainer.innerHTML = '<div style="text-align:center; padding: 2rem; color: var(--text-secondary);">No open gigs at the moment. Check back later!</div>';
                return;
            }
            
            gigListContainer.innerHTML = '';
            gigs.forEach((gig, i) => {
                const gigItem = document.createElement('div');
                gigItem.className = 'gig-item';
                gigItem.style.opacity = '0';
                gigItem.style.transform = 'translateY(10px)';
                gigItem.style.transition = `opacity 0.4s ease ${i * 0.1}s, transform 0.4s ease ${i * 0.1}s`;
                
                gigItem.innerHTML = `
                    <div class="gig-header">
                        <h3>${gig.title}</h3>
                        <div class="gig-budget">
                            <span class="budget-amt">${gig.budget_range}</span>
                        </div>
                    </div>
                    <p class="gig-desc" style="display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;">${gig.description}</p>
                    <div class="gig-meta">
                        <span class="tag-small blue">New</span>
                        <span class="tag-small">Deadline: ${gig.deadline || 'Flexible'}</span>
                        <span class="tag-small">Client ID: ${gig.student_id}</span>
                    </div>
                    <div class="gig-actions">
                        <button class="btn btn-secondary btn-sm claim-gig-btn" data-id="${gig.id}">Submit Proposal</button>
                        <span class="bid-count">0 proposals active</span>
                    </div>
                `;
                
                gigListContainer.appendChild(gigItem);
                
                // Add click listener to submit proposal (mock functionality for now)
                gigItem.querySelector('.claim-gig-btn').addEventListener('click', (e) => {
                    const btn = e.target;
                    const originalText = btn.textContent;
                    btn.textContent = 'Proposal Sent ✓';
                    btn.disabled = true;
                    btn.style.background = 'rgba(16, 185, 129, 0.2)';
                    btn.style.color = '#10b981';
                    btn.style.borderColor = 'transparent';
                });
                
                requestAnimationFrame(() => {
                    gigItem.style.opacity = '1';
                    gigItem.style.transform = 'translateY(0)';
                });
            });
            
        } catch (err) {
            console.error('API Error:', err);
            gigListContainer.innerHTML = '<div style="text-align:center; padding: 2rem; color: #ef4444;">Failed to load gigs. Ensure backend is running.</div>';
        }
    }

    loadOpenGigs();
});
