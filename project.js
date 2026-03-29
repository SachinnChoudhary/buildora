/* ============================================
   BUILDORA — Project Detail JavaScript
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
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

    // --- Tabs ---
    const tabs = document.querySelectorAll('.proj-tab');
    const tabContents = document.querySelectorAll('.tab-content');
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            tabs.forEach(t => t.classList.remove('active'));
            tabContents.forEach(tc => tc.classList.remove('active'));
            tab.classList.add('active');
            const target = document.getElementById('tab-' + tab.dataset.tab);
            if (target) target.classList.add('active');
        });
    });

    // --- Milestone Animation ---
    const milestones = document.querySelectorAll('.milestone');
    const msObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry, i) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateX(0)';
                }, i * 120);
                msObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.2 });
    milestones.forEach(ms => {
        ms.style.opacity = '0';
        ms.style.transform = 'translateX(-20px)';
        ms.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        msObserver.observe(ms);
    });

    // --- AI Chat Interaction ---
    const aiInput = document.getElementById('aiFullInput');
    const aiSend = document.getElementById('aiFullSend');
    const aiMessages = document.getElementById('aiChatMessages');

    function addUserMessage(text) {
        const msg = document.createElement('div');
        msg.className = 'ai-msg user';
        msg.innerHTML = `<div class="ai-msg-content"><p>${text}</p></div>`;
        aiMessages.appendChild(msg);
        aiMessages.scrollTop = aiMessages.scrollHeight;

        // Simulate AI response
        setTimeout(() => {
            const botMsg = document.createElement('div');
            botMsg.className = 'ai-msg bot';
            botMsg.innerHTML = `
                <div class="ai-msg-avatar">🤖</div>
                <div class="ai-msg-content">
                    <p>I'm analyzing your question about <strong>${text.substring(0, 40)}...</strong></p>
                    <p>Let me check the project context and provide a targeted answer. This would normally connect to the BuildoraAI backend. 🚀</p>
                </div>
            `;
            aiMessages.appendChild(botMsg);
            aiMessages.scrollTop = aiMessages.scrollHeight;
        }, 1000);
    }

    if (aiSend && aiInput) {
        aiSend.addEventListener('click', () => {
            const text = aiInput.value.trim();
            if (text) {
                addUserMessage(text);
                aiInput.value = '';
            }
        });
        aiInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                const text = aiInput.value.trim();
                if (text) {
                    addUserMessage(text);
                    aiInput.value = '';
                }
            }
        });
    }

    // --- Animate cards on load ---
    const allCards = document.querySelectorAll('.ms-card, .resource-card, .team-member-card, .kanban-card');
    allCards.forEach((card, i) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(10px)';
        card.style.transition = `opacity 0.4s ease ${i * 0.05}s, transform 0.4s ease ${i * 0.05}s`;
        requestAnimationFrame(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        });
    });
});
