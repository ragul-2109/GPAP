const StaffManager = (function() {
    let currentStaffCard = null;

    function getModal(id) {
        return bootstrap.Modal.getOrCreateInstance(document.getElementById(id));
    }

    function openRequestStaffModal() {
        document.getElementById('requestStaffForm').reset();
        getModal('requestStaffModal').show();
    }

    function submitStaffRequest() {
        const spec = document.getElementById('staffSpecialization').value;
        const msg = document.getElementById('staffMessage').value;
        
        if (!spec) {
            alert("Please specify the required specialization.");
            return;
        }
        
        getModal('requestStaffModal').hide();
        alert("Your request for new staff has been sent to Genfinix Admin.");
    }

    function openManageAssignmentModal(btn) {
        currentStaffCard = btn.closest('.staff-card');
        
        // Extract staff name
        const name = currentStaffCard.querySelector('div[style*="font-weight:600"]').innerText;
        document.getElementById('assignStaffModalTitle').innerText = `Assign ${name} to Departments`;
        
        // Mock current assignments
        const deptsText = currentStaffCard.querySelector('.text-muted.mb-2 strong').innerText;
        
        document.getElementById('deptCSE').checked = deptsText.includes('CSE') || deptsText.includes('ALL');
        document.getElementById('deptIT').checked = deptsText.includes('IT') || deptsText.includes('ALL');
        document.getElementById('deptECE').checked = deptsText.includes('ECE') || deptsText.includes('ALL');
        document.getElementById('deptMECH').checked = deptsText.includes('MECH') || deptsText.includes('ALL');
        
        getModal('assignStaffModal').show();
    }

    function saveAssignment() {
        if (!currentStaffCard) return;

        const cse = document.getElementById('deptCSE').checked;
        const it = document.getElementById('deptIT').checked;
        const ece = document.getElementById('deptECE').checked;
        const mech = document.getElementById('deptMECH').checked;
        
        let assigned = [];
        if (cse) assigned.push('CSE');
        if (it) assigned.push('IT');
        if (ece) assigned.push('ECE');
        if (mech) assigned.push('MECH');

        let deptString = assigned.length === 0 ? "None" : (assigned.length === 4 ? "ALL" : assigned.join(', '));
        
        // Update card UI
        currentStaffCard.querySelector('.text-muted.mb-2 strong').innerText = deptString;
        
        const statusPill = currentStaffCard.querySelector('.status-pill');
        const actionBtn = currentStaffCard.querySelector('button');
        
        if (assigned.length > 0) {
            statusPill.className = 'status-pill status-active';
            statusPill.innerText = 'Currently Assigned';
            actionBtn.className = 'btn btn-outline-primary btn-sm w-100';
            actionBtn.innerText = 'Manage Department';
        } else {
            statusPill.className = 'status-pill status-inactive';
            statusPill.innerText = 'Not Assigned';
            actionBtn.className = 'btn btn-primary btn-sm w-100';
            actionBtn.innerText = 'Assign Now';
        }
        
        getModal('assignStaffModal').hide();
        // Optional: show a small toast or alert
        // alert("Assignments updated successfully.");
    }

    return {
        openRequestStaffModal,
        submitStaffRequest,
        openManageAssignmentModal,
        saveAssignment
    };
})();
window.StaffManager = StaffManager;
