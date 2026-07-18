const ResultsModule = (function () {

    // Mock Database for Results
    const resultsData = [
        {
            id: 1,
            title: "TCS NQT National Qualifier",
            type: "live",
            date: "Jul 10, 2026",
            time: "10:00 AM",
            scoreStr: "85/100",
            percentage: 85,
            status: "Pass",
            timeTaken: "85m",
            percentile: "92nd"
        },
        {
            id: 2,
            title: "Advanced Data Structures",
            type: "coding",
            date: "Jul 12, 2026",
            time: "02:30 PM",
            scoreStr: "4/5",
            percentage: 80,
            status: "Pass",
            timeTaken: "45m",
            percentile: "78th"
        },
        {
            id: 3,
            title: "Python Basics",
            type: "mcq",
            date: "Jul 15, 2026",
            time: "09:15 AM",
            scoreStr: "12/25",
            percentage: 48,
            status: "Fail",
            timeTaken: "15m",
            percentile: "40th"
        },
        {
            id: 4,
            title: "Infosys Systems Engineer Assessment",
            type: "live",
            date: "Jul 05, 2026",
            time: "11:00 AM",
            scoreStr: "68/100",
            percentage: 68,
            status: "Pass",
            timeTaken: "90m",
            percentile: "74th"
        },
        {
            id: 5,
            title: "Web Development Frameworks",
            type: "mcq",
            date: "Jul 01, 2026",
            time: "04:00 PM",
            scoreStr: "22/25",
            percentage: 88,
            status: "Pass",
            timeTaken: "20m",
            percentile: "85th"
        },
        {
            id: 6,
            title: "Daily Data Structures Test",
            type: "daily_mcq",
            date: "Jul 18, 2026",
            time: "09:30 AM",
            scoreStr: "24/25",
            percentage: 96,
            status: "Pass",
            timeTaken: "22m",
            percentile: "Top 5%",
            proctoring: {
                tabSwitches: 0,
                copyPaste: 0,
                risk: "Safe"
            }
        }
    ];

    let currentFilter = 'all';
    let searchQuery = '';

    function init() {
        renderTable();
    }

    function filterResults(type, btnElement) {
        currentFilter = type;

        // Update active class on buttons
        const buttons = btnElement.parentElement.querySelectorAll('button');
        buttons.forEach(b => b.classList.remove('active'));
        btnElement.classList.add('active');

        renderTable();
    }

    function searchTests(query) {
        searchQuery = query.toLowerCase();
        renderTable();
    }

    function renderTable() {
        const tbody = document.getElementById('results-table-body');
        const emptyState = document.getElementById('results-empty-state');
        if (!tbody) return;

        let filteredData = resultsData.filter(r => {
            const matchesType = currentFilter === 'all' || r.type === currentFilter;
            const matchesSearch = r.title.toLowerCase().includes(searchQuery);
            return matchesType && matchesSearch;
        });

        if (filteredData.length === 0) {
            tbody.innerHTML = '';
            emptyState.classList.remove('d-none');
            return;
        }

        emptyState.classList.add('d-none');

        tbody.innerHTML = filteredData.map(r => {
            const isPass = r.status === 'Pass';
            const statusColor = isPass ? 'success' : 'danger';

            let icon = 'fa-file-lines';
            let iconColor = 'text-primary';
            if (r.type === 'coding') { icon = 'fa-code'; iconColor = 'text-info'; }
            if (r.type === 'live') { icon = 'fa-globe'; iconColor = 'text-warning'; }
            if (r.type === 'daily_mcq') { icon = 'fa-calendar-day'; iconColor = 'text-danger'; }

            return `
            <tr>
                <td class="ps-4">
                    <div class="d-flex align-items-center gap-3">
                        <div class="bg-light rounded-circle d-flex align-items-center justify-content-center border" style="width: 40px; height: 40px;">
                            <i class="fa-solid ${icon} ${iconColor}"></i>
                        </div>
                        <div>
                            <div class="fw-bold text-dark">${r.title}</div>
                            <div class="text-muted small text-capitalize">${r.type} Assessment</div>
                        </div>
                    </div>
                </td>
                <td>
                    <div class="fw-medium text-dark">${r.date}</div>
                    <div class="text-muted small">${r.time}</div>
                </td>
                <td>
                    <div class="d-flex align-items-center gap-2">
                        <div class="fw-bold">${r.percentage}%</div>
                        <div class="progress flex-grow-1" style="height: 6px;">
                            <div class="progress-bar bg-${statusColor}" style="width: ${r.percentage}%;"></div>
                        </div>
                        <div class="text-muted small ms-2">${r.scoreStr}</div>
                    </div>
                </td>
                <td>
                    <span class="badge bg-${statusColor} bg-opacity-10 text-${statusColor} border border-${statusColor} border-opacity-25 px-2 py-1">${r.status}</span>
                </td>
                <td class="pe-4 text-end">
                    <button class="btn btn-sm btn-outline-primary" onclick="ResultsModule.viewReport(${r.id})">Detailed Report</button>
                </td>
            </tr>
            `;
        }).join('');
    }

    let reportModalInstance = null;

    function viewReport(id) {
        const result = resultsData.find(r => r.id === id);
        if (!result) return;

        document.getElementById('report-title').textContent = result.title;
        document.getElementById('report-date').textContent = `Taken on ${result.date} at ${result.time}`;
        document.getElementById('report-score').textContent = result.scoreStr;
        document.getElementById('report-accuracy').textContent = `${result.percentage}%`;
        document.getElementById('report-time').textContent = result.timeTaken;
        document.getElementById('report-percentile').textContent = result.percentile;
        
        const procSection = document.getElementById('report-proctoring-section');
        const topicTitle = document.getElementById('report-topic-title');
        
        if (result.type === 'daily_mcq' && result.proctoring) {
            procSection.classList.remove('d-none');
            topicTitle.classList.add('d-none');
            
            document.getElementById('report-tab-switches').textContent = result.proctoring.tabSwitches;
            document.getElementById('report-copy-paste').textContent = result.proctoring.copyPaste;
            
            const riskEl = document.getElementById('report-risk');
            riskEl.textContent = result.proctoring.risk;
            if (result.proctoring.risk === 'Safe') {
                riskEl.className = 'fs-5 fw-bold text-success mt-1';
            } else if (result.proctoring.risk === 'High Risk') {
                riskEl.className = 'fs-5 fw-bold text-danger mt-1';
            } else {
                riskEl.className = 'fs-5 fw-bold text-warning mt-1';
            }
        } else {
            procSection.classList.add('d-none');
            topicTitle.classList.remove('d-none');
        }

        const accuracyEl = document.getElementById('report-accuracy');
        accuracyEl.className = result.status === 'Pass' ? 'fs-4 fw-bold text-success' : 'fs-4 fw-bold text-danger';

        if (typeof bootstrap !== 'undefined') {
            const modalEl = document.getElementById('reportModal');
            if (modalEl) {
                if (!reportModalInstance) {
                    reportModalInstance = new bootstrap.Modal(modalEl);
                }
                reportModalInstance.show();
            }
        } else {
            alert(`Report for ${result.title}:\nScore: ${result.scoreStr}\nAccuracy: ${result.percentage}%`);
        }
    }

    return {
        init,
        filterResults,
        searchTests,
        viewReport
    };
})();
