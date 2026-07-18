const ResultsModule = (function() {
    
    // Mock Database for Results
    const resultsData = [
        {
            id: 1,
            title: "TCS NQT National Qualifier",
            type: "mcq",
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
            type: "mcq",
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
            if(r.type === 'coding') { icon = 'fa-code'; iconColor = 'text-info'; }

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
    let radarChartInstance = null;

    function viewReport(id) {
        const result = resultsData.find(r => r.id === id);
        if(!result) return;

        document.getElementById('report-title').textContent = result.title;
        document.getElementById('report-date').textContent = `Taken on ${result.date} at ${result.time}`;
        document.getElementById('report-score').textContent = result.scoreStr;

        const totalQ = parseInt(result.scoreStr.split('/')[1]) || 25;
        const correct = parseInt(result.scoreStr.split('/')[0]) || 0;
        const incorrect = Math.floor((totalQ - correct) * 0.7);
        const skipped = totalQ - correct - incorrect;

        document.getElementById('report-correct').textContent = correct;
        document.getElementById('report-incorrect').textContent = incorrect;
        document.getElementById('report-skipped').textContent = skipped;

        document.getElementById('report-time').textContent = result.timeTaken;
        document.getElementById('report-percentile').textContent = result.percentile;

        const ctx = document.getElementById('skillRadarChart').getContext('2d');
        if (radarChartInstance) {
            radarChartInstance.destroy();
        }
        radarChartInstance = new Chart(ctx, {
            type: 'radar',
            data: {
                labels: ['Core Concepts', 'Problem Solving', 'Time Management', 'Accuracy', 'Logic'],
                datasets: [{
                    label: 'Skill Level (%)',
                    data: [
                        Math.min(100, result.percentage + 5), 
                        Math.max(0, result.percentage - 10), 
                        92, 
                        result.percentage, 
                        Math.min(100, result.percentage + 15)
                    ],
                    backgroundColor: 'rgba(78, 115, 223, 0.2)',
                    borderColor: 'rgba(78, 115, 223, 1)',
                    pointBackgroundColor: 'rgba(78, 115, 223, 1)',
                    pointBorderColor: '#fff',
                    pointHoverBackgroundColor: '#fff',
                    pointHoverBorderColor: 'rgba(78, 115, 223, 1)'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    r: {
                        angleLines: { color: 'rgba(0,0,0,0.1)' },
                        grid: { color: 'rgba(0,0,0,0.05)' },
                        pointLabels: { font: { size: 11, family: 'Inter' } },
                        ticks: { display: false, min: 0, max: 100 }
                    }
                },
                plugins: { legend: { display: false } }
            }
        });

        if (typeof bootstrap !== 'undefined') {
            const modalEl = document.getElementById('reportModal');
            if(modalEl) {
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
