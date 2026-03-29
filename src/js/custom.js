/* ============================================
   BUILDORA — Custom Request Logic
   ============================================ */

import { API_BASE } from './config.js';

document.addEventListener('DOMContentLoaded', () => {
    // --- Mobile Sidebar ---
    const mobileSidebarBtn = document.getElementById('mobileSidebarBtn');
    const sidebar = document.getElementById('sidebar');
    if (mobileSidebarBtn && sidebar) {
        mobileSidebarBtn.addEventListener('click', () => sidebar.classList.toggle('open'));
    }

    // --- Multi-Step Form Logic ---
    const steps = [
        document.getElementById('step1'),
        document.getElementById('step2'),
        document.getElementById('step3')
    ];
    let currentStep = 0;

    const nextBtns = document.querySelectorAll('.next-btn');
    const prevBtns = document.querySelectorAll('.prev-btn');
    const stepIndicators = document.querySelectorAll('.progress-step');

    function updateSteps() {
        // Update Forms
        steps.forEach((step, idx) => {
            if (idx === currentStep) {
                step.classList.add('active');
            } else {
                step.classList.remove('active');
            }
        });

        // Update Indicators
        stepIndicators.forEach((indicator, idx) => {
            if (idx === currentStep) {
                indicator.classList.add('active');
                indicator.classList.remove('completed');
            } else if (idx < currentStep) {
                indicator.classList.remove('active');
                indicator.classList.add('completed');
                indicator.querySelector('.step-circle').innerHTML = '✓'; // Add Checkmark
            } else {
                indicator.classList.remove('active', 'completed');
                indicator.querySelector('.step-circle').innerHTML = idx + 1; // Reset Number
            }
        });
    }

    nextBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Basic validation for Step 1
            if (currentStep === 0) {
                const title = document.getElementById('projectTitle').value;
                const desc = document.getElementById('projectDesc').value;
                const domain = document.querySelector('input[name="domain"]:checked');
                if (!title || !desc || !domain) {
                    alert('Please fill out all required fields in Step 1.');
                    return;
                }
            }
            if (currentStep < steps.length - 1) {
                currentStep++;
                updateSteps();
            }
        });
    });

    prevBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            if (currentStep > 0) {
                currentStep--;
                updateSteps();
            }
        });
    });

    // --- Tech Pill Selection Logic ---
    const techGroups = ['frontendTech', 'backendTech', 'dbTech'];
    techGroups.forEach(groupId => {
        const group = document.getElementById(groupId);
        if (group) {
            const pills = group.querySelectorAll('.tech-pill');
            pills.forEach(pill => {
                pill.addEventListener('click', () => {
                    // Single select per group for simplicity, though could be multi-select
                    pills.forEach(p => p.classList.remove('active'));
                    pill.classList.add('active');
                });
            });
        }
    });

    // --- Form Submission ---
    const form = document.getElementById('customBuildForm');
    const successMsg = document.getElementById('successMessage');

    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            // Validate step 3
            const budget = document.getElementById('budget').value;
            const deadline = document.getElementById('deadline').value;
            
            if (!budget) {
                alert('Please select a budget range.');
                return;
            }

            // Gather Data
            const title = document.getElementById('projectTitle').value;
            const desc = document.getElementById('projectDesc').value;
            const payload = {
                title: title,
                description: desc,
                budget_range: budget,
                deadline: deadline || 'Flexible'
            };

            const submitBtn = document.getElementById('submitRequestBtn');
            const originalText = submitBtn.textContent;
            submitBtn.innerHTML = `Processing... <svg class="spinner" viewBox="0 0 50 50" style="width:20px;height:20px;vertical-align:middle;margin-left:8px;animation:spin 1s linear infinite;"><circle class="path" cx="25" cy="25" r="20" fill="none" stroke-width="5" stroke="currentColor"></circle></svg>`;
            submitBtn.disabled = true;

            const token = localStorage.getItem('ba_token');
            if(!token) {
                alert("Please log in to submit a custom request.");
                window.location.href = "login.html";
                return;
            }

            try {
                const response = await fetch(`${API_BASE}/api/custom-requests/`, {
                    method: 'POST',
                    headers: { 
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}` 
                    },
                    body: JSON.stringify(payload)
                });
                
                if(response.ok) {
                    form.style.display = 'none';
                    stepIndicators[2].classList.remove('active');
                    stepIndicators[2].classList.add('completed');
                    stepIndicators[2].querySelector('.step-circle').innerHTML = '✓';
                    
                    successMsg.style.display = 'block';

                    // Redirect to checkout with dynamic parameters
                    setTimeout(() => {
                        window.location.href = `checkout.html?mode=deposit&price=${encodeURIComponent('10% deposit of ' + budget)}`;
                    }, 2000);
                } else {
                    alert('Error submitting request. Is the backend running?');
                    submitBtn.textContent = originalText;
                    submitBtn.disabled = false;
                }
            } catch (err) {
                console.error('API Error:', err);
                alert('Connection error. Could not reach backend.');
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
            }
        });
    }
});
