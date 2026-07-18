const SuperStudentsManager = (function() {

    function getModal(id) {
        return bootstrap.Modal.getOrCreateInstance(document.getElementById(id));
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

    return {
        openGlobalProfile,
        applyFilters
    };
})();
window.SuperStudentsManager = SuperStudentsManager;
