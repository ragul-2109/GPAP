const SuperStaffManager = (function() {

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

    function openAddStaffModal() {
        getModal('addStaffModal').show();
    }

    function openBulkModal() {
        getModal('bulkStaffModal').show();
    }

    let currentStaffName = '';

    function openManageProfileModal(btn) {
        const card = btn.closest('.lux-card');
        currentStaffName = card.querySelector('h5').innerText;
        document.getElementById('manageStaffTitle').innerText = `Manage ${currentStaffName}`;
        getModal('manageStaffModal').show();
    }

    function resetPassword() {
        getModal('manageStaffModal').hide();
        showToast(`A password reset link has been sent to ${currentStaffName}'s email.`, 'success');
    }

    function sendMessage() {
        getModal('manageStaffModal').hide();
        showToast(`Direct message composer opened for ${currentStaffName}.`, 'success');
    }

    function deactivateAccount() {
        getModal('manageStaffModal').hide();
        showToast(`${currentStaffName}'s account has been successfully deactivated.`, 'success');
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

    async function uploadBulkStaff() {
        const fileInput = document.getElementById('bulkStaffFile');
        if (!fileInput || !fileInput.files.length) {
            showToast('Please select a CSV file before importing.', 'error');
            return;
        }

        const formData = new FormData();
        formData.append('file', fileInput.files[0]);
        const token = localStorage.getItem('gpap_token');

        try {
            const response = await fetch('/api/super-admin/bulk-import/staff', {
                method: 'POST',
                headers: token ? { Authorization: `Bearer ${token}` } : {},
                body: formData
            });
            const data = await response.json().catch(() => ({}));
            if (!response.ok) {
                throw new Error(data.detail || 'Import failed');
            }
            getModal('bulkStaffModal').hide();
            showToast(`Imported ${data.imported || 0} staff accounts.`, 'success');
            fileInput.value = '';
        } catch (error) {
            showToast(error.message || 'Bulk import failed.', 'error');
        }
    }

    function submitProvisioning(btn) {
        // Validate
        const form1 = document.getElementById('staffDetailsForm');
        const form2 = document.getElementById('staffSecurityForm');
        if(!form1.checkValidity() || !form2.checkValidity()) {
            form1.reportValidity();
            form2.reportValidity();
            return;
        }
        
        btn.innerHTML = `<i class="fa-solid fa-circle-notch fa-spin me-2"></i> Provisioning...`;
        btn.disabled = true;

        setTimeout(() => {
            getModal('addStaffModal').hide();
            showToast('Staff Member Account successfully provisioned.', 'success');
            
            // Reset modal
            btn.innerHTML = `<i class="fa-solid fa-user-check me-2"></i> Provision Staff Account`;
            btn.disabled = false;
            form1.reset();
            form2.reset();
        }, 1500);
    }

    return {
        openAddStaffModal,
        openBulkModal,
        uploadBulkStaff,
        openManageProfileModal,
        resetPassword,
        sendMessage,
        deactivateAccount,
        generatePassword,
        togglePassword,
        submitProvisioning
    };
})();
window.SuperStaffManager = SuperStaffManager;
