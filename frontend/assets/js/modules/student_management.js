const StudentManager = (function() {
    let currentEditRow = null;

    function getModal(id) {
        return bootstrap.Modal.getOrCreateInstance(document.getElementById(id));
    }

    function openAddStudentModal() {
        document.getElementById('studentModalTitle').innerText = 'Add New Student';
        document.getElementById('studentForm').reset();
        document.getElementById('studentEditIndex').value = '';
        currentEditRow = null;
        getModal('studentModal').show();
    }

    function openEditStudentModal(btn) {
        currentEditRow = btn.closest('tr');
        document.getElementById('studentModalTitle').innerText = 'Edit Student';
        
        // Extract data from row
        const tds = currentEditRow.querySelectorAll('td');
        const nameDivs = tds[0].querySelectorAll('div');
        const name = nameDivs[0].innerText;
        const email = nameDivs[1].innerText;
        const rollNumber = tds[1].innerText;
        const dept = tds[2].innerText;
        const batch = tds[3].innerText;
        const status = tds[4].innerText.trim();

        document.getElementById('studentName').value = name;
        document.getElementById('studentEmail').value = email;
        document.getElementById('studentRollNumber').value = rollNumber;
        document.getElementById('studentDept').value = dept;
        document.getElementById('studentBatch').value = batch;
        document.getElementById('studentStatus').value = status;
        
        getModal('studentModal').show();
    }

    function saveStudent() {
        const name = document.getElementById('studentName').value;
        const email = document.getElementById('studentEmail').value;
        const rollNumber = document.getElementById('studentRollNumber').value;
        const dept = document.getElementById('studentDept').value;
        const batch = document.getElementById('studentBatch').value;
        const status = document.getElementById('studentStatus').value;

        if (!name || !email || !rollNumber || !dept || !batch) {
            alert("Please fill in all required fields.");
            return;
        }

        const statusClass = status === 'Active' ? 'status-active' : 'status-pending';

        if (currentEditRow) {
            // Update existing row
            const tds = currentEditRow.querySelectorAll('td');
            tds[0].innerHTML = `<div style="font-weight: 600; color: var(--primary-dark);">${name}</div><div class="text-muted" style="font-size: 0.8rem;">${email}</div>`;
            tds[1].innerText = rollNumber;
            tds[2].innerText = dept;
            tds[3].innerText = batch;
            tds[4].innerHTML = `<span class="status-pill ${statusClass}">${status}</span>`;
        } else {
            // Add new row to table
            const tbody = document.querySelector('.premium-table tbody');
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>
                    <div style="font-weight: 600; color: var(--primary-dark);">${name}</div>
                    <div class="text-muted" style="font-size: 0.8rem;">${email}</div>
                </td>
                <td>${rollNumber}</td>
                <td>${dept}</td>
                <td>${batch}</td>
                <td><span class="status-pill ${statusClass}">${status}</span></td>
                <td class="text-end">
                    <button class="btn btn-sm btn-outline-secondary" onclick="StudentManager.openEditStudentModal(this)"><i class="fa-solid fa-pen"></i></button>
                </td>
            `;
            tbody.insertBefore(tr, tbody.firstChild);
        }

        getModal('studentModal').hide();
        // Show a mock notification
        alert(currentEditRow ? "Student updated successfully!" : "Student added successfully!");
    }

    function openBulkImportModal() {
        document.getElementById('csvFileInput').value = '';
        document.getElementById('selectedFileName').innerText = 'No file selected';
        getModal('bulkImportModal').show();
        
        // Attach listener here since DOM is dynamic
        const fileInput = document.getElementById('csvFileInput');
        if (fileInput && !fileInput.hasAttribute('data-listener')) {
            fileInput.addEventListener('change', function() {
                const fileName = this.files[0] ? this.files[0].name : 'No file selected';
                document.getElementById('selectedFileName').innerText = fileName;
            });
            fileInput.setAttribute('data-listener', 'true');
        }
    }

    async function processBulkImport() {
        const fileInput = document.getElementById('csvFileInput');
        if (!fileInput || !fileInput.files.length) {
            alert("Please select a CSV file first.");
            return;
        }

        const formData = new FormData();
        formData.append('file', fileInput.files[0]);
        const token = localStorage.getItem('gpap_token');

        try {
            const response = await fetch('/api/super-admin/bulk-import/students', {
                method: 'POST',
                headers: token ? { Authorization: `Bearer ${token}` } : {},
                body: formData
            });
            const data = await response.json().catch(() => ({}));
            if (!response.ok) {
                throw new Error(data.detail || 'Import failed');
            }
            getModal('bulkImportModal').hide();
            alert(`Imported ${data.imported || 0} student accounts. Default password: Welcome@123. Students must change it at first login.`);
            fileInput.value = '';
            document.getElementById('selectedFileName').innerText = 'No file selected';
        } catch (error) {
            alert(error.message || 'Bulk import failed.');
        }
    }

    function downloadTemplate(e) {
        if (e) e.preventDefault();
        const headers = ["roll_number", "full_name", "email", "college_name", "department", "batch_year", "section", "password"];
        const sampleRow = ["CS23001", "John Doe", "john.doe@example.com", "GENFINIX", "Computer Science", "2025", "A", "Welcome@123"];
        const csvContent = headers.join(",") + "\n" + sampleRow.join(",") + "\n";

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement("a");
        const url = URL.createObjectURL(blob);
        link.setAttribute("href", url);
        link.setAttribute("download", "Student_Bulk_Import_Template.csv");
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
    
    // Return public API
    return {
        openAddStudentModal,
        openEditStudentModal,
        saveStudent,
        openBulkImportModal,
        processBulkImport,
        downloadTemplate
    };
})();
window.StudentManager = StudentManager;
