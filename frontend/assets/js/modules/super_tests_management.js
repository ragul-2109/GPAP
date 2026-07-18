const SuperTestsManager = (function() {

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

    function openImportModal() {
        getModal('importTestModal').show();
    }

    function openCreateTemplateModal() {
        getModal('createTemplateModal').show();
    }

    function openAuditModal(btn) {
        const row = btn.closest('tr');
        const testName = row.querySelector('td:first-child div[style*="font-weight: 600"]').innerText;
        document.getElementById('auditTestTitle').innerText = testName;
        getModal('auditTestModal').show();
    }

    function duplicateTemplate(btn) {
        const row = btn.closest('tr');
        const testName = row.querySelector('td:first-child div[style*="font-weight: 600"]').innerText;
        showToast(`Template "${testName}" has been duplicated successfully.`, 'success');
    }

    function archiveTest(btn) {
        const row = btn.closest('tr');
        const testName = row.querySelector('td:first-child div[style*="font-weight: 600"]').innerText;
        showToast(`Test "${testName}" has been archived.`, 'success');
        row.style.display = 'none';
    }

    function applyFilters() {
        const searchInput = document.getElementById('testSearchInput').value.toLowerCase();
        const collegeFilter = document.getElementById('testCollegeFilter').value;
        const tbody = document.querySelector('.premium-table tbody');
        
        if (tbody) {
            tbody.style.opacity = '0.3';
            setTimeout(() => {
                const rows = tbody.querySelectorAll('tr');
                rows.forEach(row => {
                    const textContent = row.innerText.toLowerCase();
                    const collegeText = row.querySelector('td:nth-child(2)').innerText;
                    
                    const matchesSearch = textContent.includes(searchInput);
                    const matchesCollege = collegeFilter === 'College: All' || collegeText === collegeFilter;
                    
                    if (matchesSearch && matchesCollege) {
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
            const search = document.getElementById('testSearchInput');
            const college = document.getElementById('testCollegeFilter');
            const sort = document.getElementById('testSortFilter');
            
            if (search) search.addEventListener('input', applyFilters);
            if (college) college.addEventListener('change', applyFilters);
            if (sort) sort.addEventListener('change', () => { showToast('Sort applied successfully.'); applyFilters(); });
        }, 500);
    });

    return {
        openImportModal,
        openCreateTemplateModal,
        openAuditModal,
        duplicateTemplate,
        archiveTest,
        applyFilters
    };
})();
window.SuperTestsManager = SuperTestsManager;
