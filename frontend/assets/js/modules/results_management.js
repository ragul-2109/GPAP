const ResultsManager = (function() {

    function getModal(id) {
        return bootstrap.Modal.getOrCreateInstance(document.getElementById(id));
    }

    function applyFilters() {
        const deptFilter = document.getElementById('resultsDeptFilter').value;
        const tbody = document.querySelector('.premium-table tbody');
        
        if (tbody) {
            tbody.style.opacity = '0.3';
            setTimeout(() => {
                const rows = tbody.querySelectorAll('tr');
                rows.forEach(row => {
                    // Get the student ID which contains the department code (e.g. CS2025001)
                    const studentId = row.querySelector('.text-muted').innerText;
                    
                    if (deptFilter === "" || studentId.startsWith(deptFilter)) {
                        row.style.display = ''; // show
                    } else {
                        row.style.display = 'none'; // hide
                    }
                });
                
                tbody.style.opacity = '1';
            }, 300);
        }
    }

    function openFullReportModal(btn) {
        // Extract basic data from row
        const row = btn.closest('tr');
        const studentName = row.querySelector('div[style*="font-weight: 600"]').innerText;
        const testName = row.querySelectorAll('td')[1].innerText;
        const scoreHTML = row.querySelectorAll('td')[3].innerHTML;
        
        document.getElementById('reportStudentName').innerText = studentName;
        document.getElementById('reportTestName').innerText = testName;
        document.getElementById('reportScoreContainer').innerHTML = scoreHTML;
        
        getModal('fullReportModal').show();
    }

    return {
        applyFilters,
        openFullReportModal
    };
})();
window.ResultsManager = ResultsManager;
