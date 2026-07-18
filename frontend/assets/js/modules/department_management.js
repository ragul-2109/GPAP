const DepartmentManager = (function() {
    let currentDeptCard = null;

    function getModal(id) {
        return bootstrap.Modal.getOrCreateInstance(document.getElementById(id));
    }

    function openAddDepartmentModal() {
        document.getElementById('deptModalTitle').innerText = 'Add New Department';
        document.getElementById('deptForm').reset();
        currentDeptCard = null;
        getModal('departmentModal').show();
    }

    function openEditDepartmentModal(btn, event) {
        if (event) event.stopPropagation();
        currentDeptCard = btn.closest('.dept-card');
        document.getElementById('deptModalTitle').innerText = 'Edit Department';
        
        // Extract data
        const title = currentDeptCard.querySelector('h5').innerText;
        const codeText = currentDeptCard.querySelector('.text-muted.mb-3').innerText;
        const code = codeText.replace('Dept Code: ', '').trim();
        
        document.getElementById('deptName').value = title;
        document.getElementById('deptCode').value = code;
        
        getModal('departmentModal').show();
    }

    function saveDepartment() {
        const name = document.getElementById('deptName').value;
        const code = document.getElementById('deptCode').value;

        if (!name || !code) {
            alert("Please fill in all required fields.");
            return;
        }

        if (currentDeptCard) {
            // Update existing
            currentDeptCard.querySelector('h5').innerText = name;
            currentDeptCard.querySelector('.text-muted.mb-3').innerText = `Dept Code: ${code}`;
        } else {
            // Add new
            const grid = document.querySelector('.dept-grid');
            const card = document.createElement('div');
            card.className = 'dept-card cursor-pointer';
            card.setAttribute('onclick', 'DepartmentManager.openDeptStudentsModal(this)');
            card.innerHTML = `
                <div class="d-flex justify-content-between align-items-start">
                    <div class="dept-icon" style="background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);"><i class="fa-solid fa-building"></i></div>
                    <div class="dropdown">
                        <button class="btn btn-sm btn-light text-muted" type="button" data-bs-toggle="dropdown" onclick="event.stopPropagation()"><i class="fa-solid fa-ellipsis-v"></i></button>
                        <ul class="dropdown-menu dropdown-menu-end shadow-sm">
                            <li><a class="dropdown-item" href="#" onclick="DepartmentManager.openEditDepartmentModal(this, event)"><i class="fa-solid fa-pen text-primary me-2"></i> Edit</a></li>
                            <li><a class="dropdown-item text-danger" href="#" onclick="DepartmentManager.deleteDepartment(this, event)"><i class="fa-solid fa-trash me-2"></i> Delete</a></li>
                        </ul>
                    </div>
                </div>
                <h5 class="mb-1">${name}</h5>
                <div class="text-muted mb-3" style="font-size: 0.85rem;">Dept Code: ${code}</div>
                
                <div class="d-flex justify-content-between mb-3" style="font-size: 0.85rem;">
                    <div><i class="fa-solid fa-user-graduate text-secondary"></i> 0 Students</div>
                    <div><i class="fa-solid fa-layer-group text-secondary"></i> 0 Sections</div>
                </div>
                <button class="btn btn-outline-secondary w-100 btn-sm" onclick="DepartmentManager.openDeptStudentsModal(this, event)">View Details</button>
            `;
            grid.insertBefore(card, grid.firstChild);
        }

        getModal('departmentModal').hide();
        alert(currentDeptCard ? "Department updated!" : "Department added!");
    }

    function deleteDepartment(btn, event) {
        if (event) event.stopPropagation();
        if (confirm("Are you sure you want to delete this department?")) {
            const card = btn.closest('.dept-card');
            card.remove();
        }
    }

    function openDeptStudentsModal(element, event) {
        if (event) event.stopPropagation();
        const card = element.closest('.dept-card') || element;
        const title = card.querySelector('h5').innerText;
        document.getElementById('deptStudentsModalTitle').innerText = `Students - ${title}`;
        
        // Basic mock data refresh animation
        const tbody = document.getElementById('deptStudentsTbody');
        if (tbody) {
            tbody.style.opacity = '0.3';
            setTimeout(() => {
                tbody.style.opacity = '1';
            }, 300);
        }
        
        getModal('deptStudentsModal').show();
    }

    return {
        openAddDepartmentModal,
        openEditDepartmentModal,
        saveDepartment,
        deleteDepartment,
        openDeptStudentsModal
    };
})();
window.DepartmentManager = DepartmentManager;
