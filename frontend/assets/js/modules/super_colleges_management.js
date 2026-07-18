const SuperCollegesManager = (function() {

    function getModal(id) {
        return bootstrap.Modal.getOrCreateInstance(document.getElementById(id));
    }

    function showToast(message, type = 'success') {
        const toastId = 'toast-' + Date.now();
        const icon = type === 'success' ? '<i class="fa-solid fa-circle-check text-success"></i>' : '<i class="fa-solid fa-circle-exclamation text-danger"></i>';
        const html = `
            <div id="${toastId}" class="toast align-items-center bg-white border-0 shadow-lg mb-3" role="alert" aria-live="assertive" aria-atomic="true">
                <div class="d-flex p-2">
                    <div class="toast-body d-flex align-items-center gap-3">
                        <div style="font-size: 1.5rem;">${icon}</div>
                        <div class="fw-bold text-dark">${message}</div>
                    </div>
                    <button type="button" class="btn-close me-2 m-auto shadow-none" data-bs-dismiss="toast" aria-label="Close"></button>
                </div>
            </div>
        `;
        
        let container = document.getElementById('toastContainer');
        if (!container) {
            container = document.createElement('div');
            container.id = 'toastContainer';
            container.className = 'position-fixed bottom-0 end-0 p-3';
            container.style.zIndex = '1080';
            document.body.appendChild(container);
        }
        
        container.insertAdjacentHTML('beforeend', html);
        const toastElement = document.getElementById(toastId);
        const bsToast = new bootstrap.Toast(toastElement, { delay: 3000 });
        bsToast.show();
        
        toastElement.addEventListener('hidden.bs.toast', () => {
            toastElement.remove();
        });
    }

    function openOnboardModal() {
        getModal('onboardCollegeModal').show();
    }

    function openManageModal(btn) {
        const row = btn.closest('tr');
        const collegeName = row.querySelector('td:first-child div[style*="font-weight: 600"]').innerText;
        document.getElementById('manageCollegeTitle').innerText = `Manage ${collegeName}`;
        getModal('manageCollegeModal').show();
    }

    function openEditDetailsModal(btn) {
        const row = btn.closest('tr');
        const collegeName = row.querySelector('td:first-child div[style*="font-weight: 600"]').innerText;
        document.getElementById('editCollegeTitle').innerText = `Edit ${collegeName}`;
        getModal('editCollegeDetailsModal').show();
    }

    function toggleStatus(btn) {
        const icon = btn.querySelector('i');
        const row = btn.closest('tr');
        const collegeName = row.querySelector('td:first-child div[style*="font-weight: 600"]').innerText;
        const statusBadge = row.querySelector('td:nth-child(5) .status-pill');

        if (icon.classList.contains('fa-ban')) {
            icon.classList.replace('fa-ban', 'fa-check');
            btn.innerHTML = `<i class="fa-solid fa-check me-2"></i>Activate College`;
            btn.classList.replace('text-danger', 'text-success');
            
            // Update table status
            statusBadge.classList.replace('status-active', 'status-inactive');
            statusBadge.innerText = 'Inactive';
            
            showToast(`${collegeName} has been successfully suspended.`, 'success');
        } else {
            icon.classList.replace('fa-check', 'fa-ban');
            btn.innerHTML = `<i class="fa-solid fa-ban me-2"></i>Suspend College`;
            btn.classList.replace('text-success', 'text-danger');
            
            // Update table status
            statusBadge.classList.replace('status-inactive', 'status-active');
            statusBadge.innerText = 'Active';
            
            showToast(`${collegeName} is now active on the platform.`, 'success');
        }
    }

    function applyFilters() {
        const searchInput = document.getElementById('collegeSearchInput').value.toLowerCase();
        const statusFilter = document.getElementById('collegeStatusFilter').value;
        const tbody = document.querySelector('.premium-table tbody');
        
        if (tbody) {
            tbody.style.opacity = '0.3';
            setTimeout(() => {
                const rows = tbody.querySelectorAll('tr');
                rows.forEach(row => {
                    const textContent = row.innerText.toLowerCase();
                    const statusPill = row.querySelector('.status-pill').innerText;
                    
                    const matchesSearch = textContent.includes(searchInput);
                    const matchesStatus = statusFilter === 'Status: All' || `Status: ${statusPill}` === statusFilter;
                    
                    if (matchesSearch && matchesStatus) {
                        row.style.display = '';
                    } else {
                        row.style.display = 'none';
                    }
                });
                tbody.style.opacity = '1';
            }, 300);
        }
    }

    // Attach event listeners for filters
    document.addEventListener('DOMContentLoaded', () => {
        setTimeout(() => {
            const search = document.getElementById('collegeSearchInput');
            const filter = document.getElementById('collegeStatusFilter');
            if (search) search.addEventListener('input', applyFilters);
            if (filter) filter.addEventListener('change', applyFilters);
        }, 500);
    });

    return {
        openOnboardModal,
        openManageModal,
        openEditDetailsModal,
        toggleStatus,
        applyFilters
    };
})();
window.SuperCollegesManager = SuperCollegesManager;
