const SuperStudentsManager = (function() {

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

    function openProvisionModal() {
        getModal('provisionStudentModal').show();
    }

    function openGlobalProfile(btn) {
        const row = btn.closest('tr');
        const studentName = row.querySelector('td:first-child div[style*="font-weight: 600"]').innerText;
        const college = row.querySelector('td:nth-child(2)').innerText;
        
        document.getElementById('globalProfileName').innerText = studentName;
        document.getElementById('globalProfileCollege').innerText = college;
        getModal('globalStudentProfileModal').show();
    }

    function applyFilters() {
        const searchInput = document.getElementById('studentSearchInput').value.toLowerCase();
        const collegeFilter = document.getElementById('studentCollegeFilter').value;
        const statusFilter = document.getElementById('studentStatusFilter').value;
        
        const tbody = document.querySelector('.premium-table tbody');
        
        if (tbody) {
            tbody.style.opacity = '0.3';
            setTimeout(() => {
                const rows = tbody.querySelectorAll('tr');
                rows.forEach(row => {
                    const textContent = row.innerText.toLowerCase();
                    const collegeText = row.querySelector('td:nth-child(2)').innerText;
                    const statusText = row.querySelector('.status-pill').innerText;
                    
                    const matchesSearch = textContent.includes(searchInput);
                    const matchesCollege = collegeFilter === 'College: All' || collegeText === collegeFilter;
                    const matchesStatus = statusFilter === 'Status: All' || statusText === statusFilter;
                    
                    if (matchesSearch && matchesCollege && matchesStatus) {
                        row.style.display = '';
                    } else {
                        row.style.display = 'none';
                    }
                });
                tbody.style.opacity = '1';
            }, 300);
        }
    }

    document.addEventListener('DOMContentLoaded', () => {
        setTimeout(() => {
            const search = document.getElementById('studentSearchInput');
            const college = document.getElementById('studentCollegeFilter');
            const status = document.getElementById('studentStatusFilter');
            const searchBtn = document.getElementById('studentSearchBtn');
            
            if (search) search.addEventListener('input', applyFilters);
            if (college) college.addEventListener('change', applyFilters);
            if (status) status.addEventListener('change', applyFilters);
            if (searchBtn) searchBtn.addEventListener('click', applyFilters);
        }, 500);
    });

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
        const form1 = document.getElementById('studentAcademicForm');
        const form2 = document.getElementById('studentSecurityForm');
        if(!form1.checkValidity() || !form2.checkValidity()) {
            form1.reportValidity();
            form2.reportValidity();
            return;
        }
        
        btn.innerHTML = `<i class="fa-solid fa-circle-notch fa-spin me-2"></i> Provisioning...`;
        btn.disabled = true;

        setTimeout(() => {
            getModal('provisionStudentModal').hide();
            showToast('Student Account successfully provisioned.', 'success');
            
            // Reset modal
            btn.innerHTML = `<i class="fa-solid fa-user-check me-2"></i> Provision Student Account`;
            btn.disabled = false;
            form1.reset();
            form2.reset();
        }, 1500);
    }

    return {
        openGlobalProfile,
        openProvisionModal,
        applyFilters,
        generatePassword,
        togglePassword,
        submitProvisioning
    };
})();
window.SuperStudentsManager = SuperStudentsManager;
