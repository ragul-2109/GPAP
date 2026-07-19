const StaffMCQCreate = (function() {
    function getAuthToken() {
        return localStorage.getItem('gpap_token') || localStorage.getItem('token');
    }

    function getAuthHeaders() {
        const token = getAuthToken();
        return token ? { Authorization: `Bearer ${token}` } : {};
    }

    function init() {
        const createTestForm = document.getElementById('createTestForm');
        if (createTestForm) {
            createTestForm.addEventListener('submit', async (e) => {
                e.preventDefault();
                const payload = {
                    title: document.getElementById('testTitle').value,
                    subject: document.getElementById('testSubject').value,
                    topic: document.getElementById('testTopic').value,
                    total_questions: parseInt(document.getElementById('testTotalQuestions').value),
                    total_marks: parseFloat(document.getElementById('testTotalMarks').value),
                    duration_minutes: parseInt(document.getElementById('testDuration').value),
                    passing_marks: parseFloat(document.getElementById('testPassingMarks').value) || 0,
                    negative_marking: parseFloat(document.getElementById('testNegativeMarking').value) || 0,
                    random_questions: document.getElementById('shuffleQuestions').checked,
                    random_options: document.getElementById('shuffleOptions').checked,
                    fullscreen_required: document.getElementById('requireFullscreen').checked,
                    allow_calculator: document.getElementById('allowCalculator').checked
                };
                
                try {
                    const token = getAuthToken();
                    if (!token) {
                        alert('Missing auth token. Please login again.');
                        return;
                    }
                    const res = await fetch('/api/tests/', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            ...getAuthHeaders()
                        },
                        body: JSON.stringify(payload)
                    });
                    
                    const data = await res.json().catch(() => ({}));
                    if (res.ok) {
                        if (typeof StaffMCQCreate !== 'undefined') {
                            StaffMCQCreate.refreshProgress();
                        }
                        alert(`Test created successfully! Test ID: ${data.id}`);
                    } else {
                        alert(data.detail || data.message || 'Failed to create test');
                    }
                } catch (error) {
                    console.error('Error:', error);
                    alert(`Error creating test: ${error.message}`);
                }
            });
        }

        const bulkUploadForm = document.getElementById('bulkUploadForm');
        if (bulkUploadForm) {
            bulkUploadForm.addEventListener('submit', async (e) => {
                e.preventDefault();
                const fileInput = document.getElementById('questionFile');
                if (!fileInput.files.length) return;
                
                const formData = new FormData();
                formData.append('file', fileInput.files[0]);
                
                const statusDiv = document.getElementById('uploadStatus');
                statusDiv.innerHTML = '<div class="spinner-border text-primary spinner-border-sm" role="status"></div> Uploading...';
                
                try {
                    const token = getAuthToken();
                    if (!token) {
                        statusDiv.innerHTML = `<div class="alert alert-danger py-2 mb-0">Missing auth token. Please login again.</div>`;
                        return;
                    }
                    const res = await fetch('/api/questions/bulk-upload', {
                        method: 'POST',
                        headers: {
                            ...getAuthHeaders()
                        },
                        body: formData
                    });
                    
                    const data = await res.json().catch(() => ({}));
                    if (res.ok) {
                        statusDiv.innerHTML = `<div class="alert alert-success py-2 mb-0">${data.message}</div>`;
                    } else {
                        statusDiv.innerHTML = `<div class="alert alert-danger py-2 mb-0">${data.detail || data.message || 'Upload failed'}</div>`;
                    }
                } catch (error) {
                    statusDiv.innerHTML = `<div class="alert alert-danger py-2 mb-0">Connection error: ${error.message}</div>`;
                }
            });
        }

        refreshProgress();
    }

    async function fetchTests() {
        try {
            const res = await fetch('/api/tests/', {
                headers: {
                    ...getAuthHeaders()
                }
            });
            if (!res.ok) return [];
            return await res.json();
        } catch (error) {
            return [];
        }
    }

    async function refreshProgress() {
        const tests = await fetchTests();
        const totalEl = document.getElementById('progress-total-tests');
        const activeEl = document.getElementById('progress-active-tests');
        const completedEl = document.getElementById('progress-completed-tests');
        const tbody = document.getElementById('test-progress-list');

        if (totalEl) totalEl.textContent = tests.length;
        if (activeEl) activeEl.textContent = tests.filter(t => t.status === 'Active').length;
        if (completedEl) completedEl.textContent = tests.filter(t => t.status === 'Completed').length;
        if (!tbody) return;

        if (tests.length === 0) {
            tbody.innerHTML = '<tr><td colspan="5" class="text-center text-muted py-4">No tests available yet.</td></tr>';
            return;
        }

        tbody.innerHTML = tests.map(test => `
            <tr>
                <td>${test.title}</td>
                <td>${test.status}</td>
                <td>${test.total_questions}</td>
                <td>${test.total_marks}</td>
                <td class="text-end">
                    <button class="btn btn-sm btn-outline-primary" type="button" onclick="StaffMCQCreate.viewProgress(${test.id})">Follow</button>
                </td>
            </tr>
        `).join('');
    }

    async function viewProgress(testId) {
        const modalTitle = document.getElementById('testProgressModalLabel');
        const modalBody = document.getElementById('testProgressModalBody');
        if (!modalTitle || !modalBody) return;

        modalTitle.textContent = 'Loading progress...';
        modalBody.innerHTML = '<div class="text-center py-4"><div class="spinner-border text-primary" role="status"></div></div>';
        const modalEl = document.getElementById('testProgressModal');
        const modalInstance = modalEl && bootstrap ? bootstrap.Modal.getOrCreateInstance(modalEl) : null;
        if (modalInstance) modalInstance.show();

        try {
            const res = await fetch(`/api/tests/${testId}/live-monitoring`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.detail || 'Unable to load progress');

            modalTitle.textContent = `Live Progress — ${data.total} students`;
            modalBody.innerHTML = `
                <div class="row g-3 mb-4">
                    <div class="col-md-3">
                        <div class="p-3 rounded-3 bg-light text-center">
                            <div class="text-muted small">Total Students</div>
                            <div class="fs-3 fw-bold">${data.total}</div>
                        </div>
                    </div>
                    <div class="col-md-3">
                        <div class="p-3 rounded-3 bg-light text-center">
                            <div class="text-muted small">Completed</div>
                            <div class="fs-3 fw-bold">${data.completed}</div>
                        </div>
                    </div>
                    <div class="col-md-3">
                        <div class="p-3 rounded-3 bg-light text-center">
                            <div class="text-muted small">In Progress</div>
                            <div class="fs-3 fw-bold">${data.in_progress}</div>
                        </div>
                    </div>
                    <div class="col-md-3">
                        <div class="p-3 rounded-3 bg-light text-center">
                            <div class="text-muted small">Flagged</div>
                            <div class="fs-3 fw-bold">${data.flagged}</div>
                        </div>
                    </div>
                </div>
                <div class="table-responsive">
                    <table class="table table-sm align-middle mb-0">
                        <thead class="table-light">
                            <tr>
                                <th>Student</th>
                                <th>Status</th>
                                <th>Risk Level</th>
                                <th>Score</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${data.students.map(s => `
                                <tr>
                                    <td>${s.name}</td>
                                    <td>${s.status}</td>
                                    <td>${s.risk_level || 'N/A'}</td>
                                    <td>${s.score || 'N/A'}</td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
            `;
        } catch (error) {
            modalTitle.textContent = 'Progress unavailable';
            modalBody.innerHTML = `<div class="alert alert-danger">${error.message}</div>`;
        }
    }
    
    function downloadCSVTemplate() {
        const headers = ["Question", "Option A", "Option B", "Option C", "Option D", "Correct Answer", "Explanation", "Marks", "Difficulty", "Topic"];
        const exampleRow = [
            "What is the output of print(2**3)?",
            "5",
            "6",
            "8",
            "9",
            "C",
            "** is the exponentiation operator in Python.",
            "1",
            "Easy",
            "Python Basics"
        ];
        
        const csvContent = [
            headers.join(","),
            exampleRow.map(item => `"${item.replace(/"/g, '""')}"`).join(",") 
        ].join("\n");
        
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement("a");
        const url = URL.createObjectURL(blob);
        link.setAttribute("href", url);
        link.setAttribute("download", "GPAP_MCQ_Template.csv");
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    function updateFileName(input) {
        const display = document.getElementById('fileNameDisplay');
        const area = document.getElementById('uploadArea');
        if (input.files && input.files.length > 0) {
            display.innerHTML = `<span class="text-primary fw-bold"><i class="fa-solid fa-check me-2"></i> ${input.files[0].name}</span> selected`;
            area.style.backgroundColor = '#eff6ff';
            area.style.borderColor = '#3b82f6';
        } else {
            display.innerText = "Supports .csv files only";
            area.style.backgroundColor = '#f8fafc';
            area.style.borderColor = '#cbd5e1';
        }
    }

    const moduleObject = {
        init,
        refreshProgress,
        viewProgress,
        downloadCSVTemplate
    };

    if (typeof window !== 'undefined') {
        window.StaffMCQCreate = moduleObject;
        window.updateFileName = updateFileName;
    }

    return moduleObject;
})();
