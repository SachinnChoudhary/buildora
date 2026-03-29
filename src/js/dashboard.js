/* ============================================
   BUILDORA — Dashboard JavaScript
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
    // --- Cursor Glow ---
    const cursorGlow = document.getElementById('cursorGlow');
    let mouseX = 0, mouseY = 0, glowX = 0, glowY = 0;
    document.addEventListener('mousemove', (e) => { mouseX = e.clientX; mouseY = e.clientY; });
    function animateGlow() {
        glowX += (mouseX - glowX) * 0.1;
        glowY += (mouseY - glowY) * 0.1;
        if (cursorGlow) {
            cursorGlow.style.left = glowX + 'px';
            cursorGlow.style.top = glowY + 'px';
        }
        requestAnimationFrame(animateGlow);
    }
    animateGlow();

    // --- Mobile Sidebar ---
    const mobileSidebarBtn = document.getElementById('mobileSidebarBtn');
    const sidebar = document.getElementById('sidebar');
    if (mobileSidebarBtn && sidebar) {
        mobileSidebarBtn.addEventListener('click', () => sidebar.classList.toggle('open'));
    }

    // --- Contribution Heatmap ---
    const heatmapContainer = document.getElementById('heatmapContainer');
    if (heatmapContainer) {
        const weeks = 13; // ~3 months
        for (let w = 0; w < weeks; w++) {
            const col = document.createElement('div');
            col.className = 'heatmap-col';
            for (let d = 0; d < 7; d++) {
                const cell = document.createElement('div');
                cell.className = 'heatmap-cell';
                // Generate pseudo-random activity levels
                const seed = (w * 7 + d) * 2654435761;
                const val = ((seed >>> 0) % 100);
                let level;
                if (val < 30) level = 0;
                else if (val < 55) level = 1;
                else if (val < 75) level = 2;
                else if (val < 90) level = 3;
                else level = 4;
                cell.classList.add(`level-${level}`);
                const dayNames = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
                cell.title = `${dayNames[d]}, Week ${w + 1}: Level ${level}`;
                col.appendChild(cell);
            }
            heatmapContainer.appendChild(col);
        }
    }

    // --- Skill Radar Chart (Canvas) ---
    const skillCanvas = document.getElementById('skillChart');
    if (skillCanvas) {
        const ctx = skillCanvas.getContext('2d');
        const size = 220;
        const cx = size / 2;
        const cy = size / 2;
        const maxR = 80;

        skillCanvas.width = size * 2;
        skillCanvas.height = size * 2;
        skillCanvas.style.width = size + 'px';
        skillCanvas.style.height = size + 'px';
        ctx.scale(2, 2);

        const labels = ['Python', 'React', 'ML/AI', 'DevOps', 'Databases', 'System Design'];
        const values = [0.85, 0.72, 0.68, 0.45, 0.60, 0.55];
        const n = labels.length;
        const angleStep = (Math.PI * 2) / n;

        // Draw grid rings
        for (let ring = 1; ring <= 4; ring++) {
            const r = (maxR / 4) * ring;
            ctx.beginPath();
            for (let i = 0; i <= n; i++) {
                const angle = angleStep * i - Math.PI / 2;
                const x = cx + r * Math.cos(angle);
                const y = cy + r * Math.sin(angle);
                i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
            }
            ctx.closePath();
            ctx.strokeStyle = 'rgba(255,255,255,0.06)';
            ctx.lineWidth = 1;
            ctx.stroke();
        }

        // Draw axes
        for (let i = 0; i < n; i++) {
            const angle = angleStep * i - Math.PI / 2;
            ctx.beginPath();
            ctx.moveTo(cx, cy);
            ctx.lineTo(cx + maxR * Math.cos(angle), cy + maxR * Math.sin(angle));
            ctx.strokeStyle = 'rgba(255,255,255,0.06)';
            ctx.stroke();
        }

        // Draw data area
        ctx.beginPath();
        for (let i = 0; i <= n; i++) {
            const idx = i % n;
            const angle = angleStep * idx - Math.PI / 2;
            const r = maxR * values[idx];
            const x = cx + r * Math.cos(angle);
            const y = cy + r * Math.sin(angle);
            i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
        }
        ctx.closePath();
        ctx.fillStyle = 'rgba(124, 58, 237, 0.2)';
        ctx.fill();
        ctx.strokeStyle = '#7C3AED';
        ctx.lineWidth = 2;
        ctx.stroke();

        // Draw data points
        for (let i = 0; i < n; i++) {
            const angle = angleStep * i - Math.PI / 2;
            const r = maxR * values[i];
            const x = cx + r * Math.cos(angle);
            const y = cy + r * Math.sin(angle);
            ctx.beginPath();
            ctx.arc(x, y, 4, 0, Math.PI * 2);
            ctx.fillStyle = '#A78BFA';
            ctx.fill();
            ctx.strokeStyle = '#7C3AED';
            ctx.lineWidth = 2;
            ctx.stroke();
        }

        // Draw labels
        ctx.font = '11px Inter, sans-serif';
        ctx.fillStyle = '#94A3B8';
        ctx.textAlign = 'center';
        for (let i = 0; i < n; i++) {
            const angle = angleStep * i - Math.PI / 2;
            const r = maxR + 18;
            const x = cx + r * Math.cos(angle);
            const y = cy + r * Math.sin(angle);
            ctx.fillText(labels[i], x, y + 4);
        }
    }

    // --- Animate stat card values ---
    const statValues = document.querySelectorAll('.stat-card-value');
    statValues.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(10px)';
        el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    });
    const statObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry, i) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }, i * 100);
                statObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });
    statValues.forEach(el => statObserver.observe(el));

    // --- Fetch User Data & Orders ---
    const token = localStorage.getItem('ba_token');
    if (!token) {
        window.location.href = 'login.html';
        return;
    }

    async function loadDashboard() {
        try {
            // Fetch Profile
            const profileRes = await fetch('http://127.0.0.1:8001/api/auth/me', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (!profileRes.ok) throw new Error("Profile load failed");
            const profile = await profileRes.json();
            
            document.querySelector('.topbar-greeting h1').innerHTML = `Welcome back, ${profile.full_name.split(' ')[0]}! 👋`;
            document.querySelector('.user-name').textContent = profile.full_name;
            document.querySelector('.user-avatar').textContent = profile.full_name.substring(0, 2).toUpperCase();
            document.querySelector('.user-role').textContent = profile.role === 'student' ? 'Pro Student' : 'Developer';

            // Fetch Orders
            const ordersRes = await fetch('http://127.0.0.1:8001/api/orders/my-orders', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (ordersRes.ok) {
                const orders = await ordersRes.json();
                document.querySelector('#statProjects .stat-card-value').textContent = orders.length;
                
                const listContainer = document.querySelector('.project-list');
                listContainer.innerHTML = ''; // clear mock
                
                if (orders.length === 0) {
                    listContainer.innerHTML = '<p style="padding:20px; color:var(--text-muted)">You have not purchased any projects yet.</p>';
                } else {
                    orders.forEach(o => {
                        const a = document.createElement('a');
                        a.href = 'project.html'; // Assuming there is a detail view
                        a.className = 'project-item';
                        a.innerHTML = `
                            <div class="project-item-color purple-accent"></div>
                            <div class="project-item-info">
                                <h3>${o.project_title}</h3>
                                <div class="project-item-meta">
                                    <span class="tag-small purple">Purchased</span>
                                    <span class="tag-small purple">$${Math.round(o.amount / 80)}</span>
                                </div>
                            </div>
                            <div class="project-item-progress">
                                <span style="font-size:12px; font-weight:bold; color:var(--primary-light)">ACCESS FILES</span>
                            </div>
                        `;
                        listContainer.appendChild(a);
                    });
                }
            }

        } catch (err) {
            console.error(err);
        }
    }
    
    // --- Animate cards on load ---
    const dashCards = document.querySelectorAll('.dash-card, .stat-card');
    dashCards.forEach((card, i) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = `opacity 0.5s ease ${i * 0.08}s, transform 0.5s ease ${i * 0.08}s`;
        requestAnimationFrame(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        });
    });

    loadDashboard();
});
