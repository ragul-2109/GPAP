const StaffDailyMCQ = (function() {
    
    // Mock Data simulating API Response for Daily Tests
    let dailyTests = [
        {
            id: 101,
            title: "Daily Data Structures Test",
            created: "2026-07-18 09:00 AM",
            studentsFinished: 45,
            avgScore: "82%",
            status: "Active"
        },
        {
            id: 102,
            title: "Python Basics Daily",
            created: "2026-07-17 09:00 AM",
            studentsFinished: 120,
            avgScore: "76%",
            status: "Completed"
        }
    ];

    // Mock Data simulating Proctoring Results
    const mockResults = [
        { name: "Arun Kumar", score: "24/25", time: "22m", status: "Submitted", tabSwitches: 0, copyPaste: 0, risk: "Safe" },
        { name: "Bhavya Shree", score: "22/25", time: "18m", status: "Submitted", tabSwitches: 1, copyPaste: 0, risk: "Low" },
        { name: "Chandra Sekhar", score: "25/25", time: "15m", status: "Submitted", tabSwitches: 5, copyPaste: 2, risk: "High" },
        { name: "Deepak Raj", score: "15/25", time: "25m", status: "In Progress", tabSwitches: 0, copyPaste: 0, risk: "Safe" },
    ];

    let createModalInstance = null;
    let resultsModalInstance = null;

    function init() {
        renderTestsTable();
        updateStats();

        // Setup File Upload listener
        const fileInput = document.getElementById('dt-file');
        if(fileInput) {
            fileInput.addEventListener('change', function(e) {
                if(e.target.files.length > 0) {
                    const status = document.getElementById('upload-status');
                    status.textContent = `${e.target.files[0].name} selected! Ready to upload.`;
                    status.classList.remove('d-none');
                }
            });
        }
    }

    function renderTestsTable() {
        const tbody = document.getElementById('daily-tests-list');
        if(!tbody) return;

        tbody.innerHTML = dailyTests.map(t => `
            <tr>
                <td>
                    <div class="fw-bold text-dark">${t.title}</div>
                    <span class="badge ${t.status === 'Active' ? 'bg-success' : 'bg-secondary'} bg-opacity-10 ${t.status === 'Active' ? 'text-success' : 'text-secondary'} border">${t.status}</span>
                </td>
                <td><div class="small text-muted">${t.created}</div></td>
                <td><div class="fw-medium">${t.studentsFinished}</div></td>
                <td><div class="fw-bold text-primary">${t.avgScore}</div></td>
                <td class="text-end">
                    <button class="btn btn-sm btn-outline-primary" onclick="StaffDailyMCQ.viewResults(${t.id})">
                        <i class="fa-solid fa-eye me-1"></i>View & Proctoring
                    </button>
                </td>
            </tr>
        `).join('');
    }

    function updateStats() {
        const activeEl = document.getElementById('stats-active');
        const subEl = document.getElementById('stats-submissions');
        const flagEl = document.getElementById('stats-flags');
        
        if(activeEl) activeEl.textContent = dailyTests.filter(t => t.status === 'Active').length;
        if(subEl) subEl.textContent = '165';
        if(flagEl) flagEl.textContent = '12';
    }

    function showCreateModal() {
        if (typeof bootstrap !== 'undefined') {
            const modalEl = document.getElementById('createDailyTestModal');
            if(modalEl) {
                if (!createModalInstance) createModalInstance = new bootstrap.Modal(modalEl);
                createModalInstance.show();
            }
        }
    }

    function submitCreateTest() {
        const title = document.getElementById('dt-title').value;
        const duration = document.getElementById('dt-duration').value;
        const fileInput = document.getElementById('dt-file');

        if(!title || !duration || fileInput.files.length === 0) {
            alert("Please fill all fields and select a file.");
            return;
        }

        // Simulate API Call
        const newTest = {
            id: Math.floor(Math.random() * 1000) + 200,
            title: title,
            created: new Date().toLocaleString(),
            studentsFinished: 0,
            avgScore: "-",
            status: "Active"
        };

        dailyTests.unshift(newTest);
        renderTestsTable();
        updateStats();

        if(createModalInstance) createModalInstance.hide();
        
        // Reset form
        document.getElementById('form-create-daily-test').reset();
        document.getElementById('upload-status').classList.add('d-none');
        
        alert("Test created and assigned to students successfully!");
    }

    function viewResults(id) {
        const test = dailyTests.find(t => t.id === id);
        if(!test) return;

        document.getElementById('results-modal-title').textContent = `${test.title} - Results & Proctoring`;
        
        const tbody = document.getElementById('student-results-list');
        tbody.innerHTML = mockResults.map(r => {
            let riskBadge = `<span class="badge bg-success bg-opacity-10 text-success border border-success border-opacity-25"><i class="fa-solid fa-shield-check me-1"></i>Safe</span>`;
            if(r.risk === 'High') riskBadge = `<span class="badge bg-danger text-white"><i class="fa-solid fa-triangle-exclamation me-1"></i>High Risk</span>`;
            else if(r.risk === 'Low') riskBadge = `<span class="badge bg-warning text-dark border border-warning"><i class="fa-solid fa-bell me-1"></i>Low Risk</span>`;

            return `
            <tr>
                <td><div class="fw-bold text-dark">${r.name}</div></td>
                <td><div class="fw-bold text-primary">${r.score}</div></td>
                <td>${r.time}</td>
                <td><span class="small text-muted fw-medium">${r.status}</span></td>
                <td><div class="fw-bold ${r.tabSwitches > 0 ? 'text-danger' : 'text-success'}">${r.tabSwitches}</div></td>
                <td><div class="fw-bold ${r.copyPaste > 0 ? 'text-danger' : 'text-success'}">${r.copyPaste}</div></td>
                <td>${riskBadge}</td>
            </tr>
            `;
        }).join('');

        if (typeof bootstrap !== 'undefined') {
            const modalEl = document.getElementById('resultsDailyTestModal');
            if(modalEl) {
                if (!resultsModalInstance) resultsModalInstance = new bootstrap.Modal(modalEl);
                resultsModalInstance.show();
            }
        }
    }

    function exportData() {
        // Simple CSV generation
        const headers = ["Student Name", "Score", "Time Taken", "Status", "Tab Switches", "Copy/Paste Events", "Proctoring Risk"];
        const rows = mockResults.map(r => [r.name, r.score, r.time, r.status, r.tabSwitches, r.copyPaste, r.risk]);
        
        let csvContent = "data:text/csv;charset=utf-8," 
            + headers.join(",") + "\n"
            + rows.map(e => e.join(",")).join("\n");
            
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "daily_mcq_results.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    return {
        init,
        showCreateModal,
        submitCreateTest,
        viewResults,
        exportData
    };
})();
