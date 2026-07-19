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

    let currentManageCollege = '';

    function openManageModal(btn) {
        const row = btn.closest('tr');
        const collegeName = row.querySelector('td:first-child div[style*="font-weight: 600"]').innerText;
        currentManageCollege = collegeName;
        document.getElementById('manageCollegeTitle').innerText = `Manage ${collegeName}`;
        getModal('manageCollegeModal').show();
    }

    function openAddAdminModal() {
        getModal('manageCollegeModal').hide();
        document.getElementById('newAdminCollegeName').innerText = currentManageCollege;
        getModal('addCollegeAdminModal').show();
    }

    function submitNewAdmin(btn) {
        const form = document.getElementById('newAdminForm');
        if(!form.checkValidity()) {
            form.reportValidity();
            return;
        }
        
        btn.innerHTML = `<i class="fa-solid fa-circle-notch fa-spin me-2"></i> Creating...`;
        btn.disabled = true;

        setTimeout(() => {
            getModal('addCollegeAdminModal').hide();
            showToast(`New admin account successfully created for ${currentManageCollege}.`, 'success');
            
            // Reset
            btn.innerHTML = `<i class="fa-solid fa-user-check me-2"></i> Create Admin Account`;
            btn.disabled = false;
            form.reset();
        }, 1200);
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

    function generatePassword(inputId) {
        const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*";
        let password = "";
        for (let i = 0, n = charset.length; i < 12; ++i) {
            password += charset.charAt(Math.floor(Math.random() * n));
        }
        document.getElementById(inputId).value = password;
    }

    function togglePassword(inputId, btn) {
        const input = document.getElementById(inputId);
        const icon = btn.querySelector('i');
        if (input.type === "password") {
            input.type = "text";
            icon.classList.replace('fa-eye-slash', 'fa-eye');
        } else {
            input.type = "password";
            icon.classList.replace('fa-eye', 'fa-eye-slash');
        }
    }

    function submitProvisioning(btn) {
        // Validate
        const form1 = document.getElementById('collegeDetailsForm');
        const form2 = document.getElementById('collegeAdminForm');
        if(!form1.checkValidity() || !form2.checkValidity()) {
            form1.reportValidity();
            form2.reportValidity();
            return;
        }
        
        btn.innerHTML = `<i class="fa-solid fa-circle-notch fa-spin me-2"></i> Provisioning...`;
        btn.disabled = true;

        setTimeout(() => {
            getModal('onboardCollegeModal').hide();
            showToast('College and Administrator Account successfully provisioned.', 'success');
            
            // Reset modal
            btn.innerHTML = `<i class="fa-solid fa-cloud-arrow-up me-2"></i> Create College & Admin`;
            btn.disabled = false;
            form1.reset();
            form2.reset();
        }, 1500);
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
        openAddAdminModal,
        submitNewAdmin,
        openEditDetailsModal,
        toggleStatus,
        applyFilters,
        generatePassword,
        togglePassword,
        submitProvisioning
    };
})();
window.SuperCollegesManager = SuperCollegesManager;
