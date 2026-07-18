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

    return {
        openAddStaffModal,
        openManageProfileModal,
        resetPassword,
        sendMessage,
        deactivateAccount
    };
})();
window.SuperStaffManager = SuperStaffManager;
