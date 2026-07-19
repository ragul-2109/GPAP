const SettingsModule = (function() {
    function init() {
        // Make the navigation interactive visually and functionally
        document.querySelectorAll('.settings-nav-item').forEach(item => {
            // Remove previous listeners if any to avoid duplicates
            const newItem = item.cloneNode(true);
            item.parentNode.replaceChild(newItem, item);
            
            newItem.addEventListener('click', (e) => {
                e.preventDefault();
                
                // Update active state in sidebar
                document.querySelectorAll('.settings-nav-item').forEach(i => i.classList.remove('active'));
                e.currentTarget.classList.add('active');
                
                // Switch panels
                const targetId = e.currentTarget.getAttribute('data-target');
                if (targetId) {
                    document.querySelectorAll('.settings-panel').forEach(panel => {
                        panel.classList.remove('active-panel');
                    });
                    const targetPanel = document.getElementById(targetId);
                    if (targetPanel) {
                        targetPanel.classList.add('active-panel');
                    }
                }
            });
        });
    }

    function saveSettings(btn) {
        const originalHtml = btn.innerHTML;
        btn.innerHTML = '<span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span> Saving...';
        btn.classList.add('disabled');
        
        // Mock save delay
        setTimeout(() => {
            btn.innerHTML = '<i class="fa-solid fa-check me-2"></i> Saved Successfully';
            btn.classList.remove('btn-primary');
            btn.classList.add('btn-success');
            
            setTimeout(() => {
                btn.innerHTML = originalHtml;
                btn.classList.remove('btn-success', 'disabled');
                btn.classList.add('btn-primary');
            }, 2000);
        }, 800);
    }
    
    function toggleMaintenance(btn) {
        const isActivating = btn.innerText.includes('Activate');
        
        if (isActivating) {
            if(confirm('WARNING: Are you absolutely sure you want to activate Maintenance Mode? This will disconnect all users immediately.')) {
                btn.innerHTML = '<i class="fa-solid fa-unlock me-2"></i> Deactivate Mode';
                btn.classList.remove('btn-outline-danger');
                btn.classList.add('btn-danger');
                
                // Add a visual indicator to the card
                const card = btn.closest('.lux-card');
                card.style.backgroundColor = '#fef2f2';
                card.style.border = '2px solid #ef4444 !important';
            }
        } else {
            btn.innerHTML = '<i class="fa-solid fa-lock me-2"></i> Activate Mode';
            btn.classList.remove('btn-danger');
            btn.classList.add('btn-outline-danger');
            
            const card = btn.closest('.lux-card');
            card.style.backgroundColor = '#fffaf9';
            card.style.border = '1px dashed #fecdd3 !important';
        }
    }

    function manageStripe(btn) {
        btn.innerHTML = '<span class="spinner-border spinner-border-sm me-1" role="status" aria-hidden="true"></span> Loading...';
        btn.classList.add('disabled');
        setTimeout(() => {
            alert('Redirecting to Stripe Express Dashboard...');
            btn.innerHTML = '<i class="fa-solid fa-gear me-1"></i> Manage';
            btn.classList.remove('disabled');
        }, 800);
    }

    function connectPayPal(btn) {
        btn.innerHTML = '<span class="spinner-border spinner-border-sm me-1" role="status" aria-hidden="true"></span> Connecting...';
        btn.classList.add('disabled');
        setTimeout(() => {
            alert('Opening PayPal OAuth Integration flow...');
            btn.innerHTML = '<i class="fa-solid fa-link me-1"></i> Connect';
            btn.classList.remove('disabled');
        }, 800);
    }

    return {
        init,
        saveSettings,
        toggleMaintenance,
        manageStripe,
        connectPayPal
    };
})();
