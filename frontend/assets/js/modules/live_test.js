const LiveTestModule = (function() {
    
    // Mock Database for Tests
    const testsData = {
        upcoming: [
            {
                id: 1,
                company: "Microsoft",
                title: "SDE 1 Online Assessment",
                date: "Aug 15, 2026",
                time: "10:00 AM",
                duration: "90 Mins",
                questions: 3,
                type: "Coding",
                logo: "fa-brands fa-microsoft text-info"
            },
            {
                id: 2,
                company: "Amazon",
                title: "Applied Scientist Intern",
                date: "Aug 20, 2026",
                time: "02:00 PM",
                duration: "120 Mins",
                questions: 5,
                type: "Machine Learning",
                logo: "fa-brands fa-amazon text-warning"
            },
            {
                id: 3,
                company: "Campus Placement Cell",
                title: "General Aptitude Test Phase 1",
                date: "Aug 22, 2026",
                time: "09:00 AM",
                duration: "60 Mins",
                questions: 50,
                type: "MCQ",
                logo: "fa-solid fa-building-columns text-primary"
            }
        ],
        completed: [
            {
                id: 4,
                company: "TCS",
                title: "TCS NQT National Qualifier",
                date: "Jul 10, 2026",
                score: "85/100",
                percentile: "92nd",
                status: "Cleared",
                logo: "fa-solid fa-briefcase text-secondary"
            },
            {
                id: 5,
                company: "Infosys",
                title: "Systems Engineer Assessment",
                date: "Jul 05, 2026",
                score: "68/100",
                percentile: "74th",
                status: "Not Cleared",
                logo: "fa-solid fa-briefcase text-secondary"
            }
        ],
        missed: [
            {
                id: 6,
                company: "Wipro",
                title: "Elite National Talent Hunt",
                date: "Jun 15, 2026",
                reason: "Absent",
                logo: "fa-solid fa-building text-danger"
            }
        ]
    };

    let activeTab = 'upcoming';

    function init() {
        filterTests('upcoming');
    }

    function filterTests(tab) {
        activeTab = tab;
        renderGrid();
    }

    function renderGrid() {
        const grid = document.getElementById('live-test-grid');
        if (!grid) return;
        
        const data = testsData[activeTab] || [];
        
        if (data.length === 0) {
            grid.innerHTML = `
                <div class="col-12">
                    <div class="text-center p-5 text-muted border rounded-3 bg-light">
                        <i class="fa-solid fa-folder-open fs-1 mb-3 opacity-50"></i>
                        <h5>No ${activeTab} tests found</h5>
                        <p class="mb-0">You're all caught up!</p>
                    </div>
                </div>
            `;
            return;
        }

        grid.innerHTML = data.map(test => {
            if (activeTab === 'upcoming') {
                return `
                <div class="col-md-6 col-lg-4">
                    <div class="lux-card h-100 border-0 shadow-sm p-4 hover-lift">
                        <div class="d-flex align-items-center mb-3 pb-3 border-bottom border-light">
                            <div class="bg-light rounded-circle d-flex align-items-center justify-content-center me-3 shadow-sm" style="width: 48px; height: 48px; font-size: 1.5rem;">
                                <i class="${test.logo}"></i>
                            </div>
                            <div>
                                <h6 class="mb-0 fw-bold">${test.company}</h6>
                                <small class="text-muted">${test.type}</small>
                            </div>
                        </div>
                        <h5 class="fw-bold mb-3" style="font-size: 1.1rem; min-height: 40px;">${test.title}</h5>
                        
                        <div class="d-flex flex-column gap-2 mb-4 text-muted small fw-medium">
                            <div><i class="fa-regular fa-calendar me-2 text-primary"></i>${test.date}</div>
                            <div><i class="fa-regular fa-clock me-2 text-primary"></i>${test.time}</div>
                            <div><i class="fa-solid fa-stopwatch me-2 text-primary"></i>${test.duration} • ${test.questions} Qs</div>
                        </div>
                        
                        <button class="btn btn-outline-primary w-100 fw-bold" onclick="LiveTestModule.startTestPrompt(${test.id})">Enter Waiting Room</button>
                    </div>
                </div>
                `;
            } else if (activeTab === 'completed') {
                const statusColor = test.status === 'Cleared' ? 'success' : 'danger';
                return `
                <div class="col-md-6 col-lg-4">
                    <div class="lux-card h-100 border-0 shadow-sm p-4 position-relative overflow-hidden">
                        <div class="position-absolute top-0 end-0 p-2">
                            <span class="badge bg-${statusColor} bg-opacity-10 text-${statusColor} border border-${statusColor} border-opacity-25 px-2 py-1">${test.status}</span>
                        </div>
                        <div class="d-flex align-items-center mb-3">
                            <div class="bg-light rounded-circle d-flex align-items-center justify-content-center me-3 shadow-sm" style="width: 40px; height: 40px; font-size: 1.2rem;">
                                <i class="${test.logo}"></i>
                            </div>
                            <h6 class="mb-0 fw-bold">${test.company}</h6>
                        </div>
                        <h5 class="fw-bold mb-3" style="font-size: 1.1rem;">${test.title}</h5>
                        <div class="text-muted small mb-3"><i class="fa-regular fa-calendar me-2"></i>Taken on ${test.date}</div>
                        
                        <div class="row g-2 text-center mt-auto">
                            <div class="col-6">
                                <div class="p-2 bg-light rounded border">
                                    <div class="small text-muted mb-1">Score</div>
                                    <div class="fw-bold fs-5 text-dark">${test.score}</div>
                                </div>
                            </div>
                            <div class="col-6">
                                <div class="p-2 bg-light rounded border">
                                    <div class="small text-muted mb-1">Percentile</div>
                                    <div class="fw-bold fs-5 text-primary">${test.percentile}</div>
                                </div>
                            </div>
                        </div>
                        <button class="btn btn-light w-100 mt-3 text-primary fw-medium border">View Detailed Report</button>
                    </div>
                </div>
                `;
            } else {
                return `
                <div class="col-md-6 col-lg-4">
                    <div class="lux-card h-100 border-0 shadow-sm p-4 position-relative">
                        <div class="position-absolute top-0 end-0 p-2">
                            <span class="badge bg-secondary bg-opacity-10 text-secondary border border-secondary border-opacity-25 px-2 py-1">Missed</span>
                        </div>
                        <div class="d-flex align-items-center mb-3">
                            <div class="bg-light rounded-circle d-flex align-items-center justify-content-center me-3 shadow-sm" style="width: 40px; height: 40px; font-size: 1.2rem;">
                                <i class="${test.logo}"></i>
                            </div>
                            <h6 class="mb-0 fw-bold">${test.company}</h6>
                        </div>
                        <h5 class="fw-bold mb-3 text-muted" style="font-size: 1.1rem;">${test.title}</h5>
                        <div class="text-muted small mb-3"><i class="fa-regular fa-calendar me-2"></i>Scheduled: ${test.date}</div>
                        <div class="text-danger small fw-medium"><i class="fa-solid fa-circle-exclamation me-2"></i>Reason: ${test.reason}</div>
                    </div>
                </div>
                `;
            }
        }).join('');
    }

    let proctorModalInstance = null;

    function startTestPrompt(testId) {
        if (typeof bootstrap !== 'undefined') {
            const modalEl = document.getElementById('proctorModal');
            if(modalEl) {
                document.getElementById('proctor-loader').classList.add('d-none');
                
                if (!proctorModalInstance) {
                    proctorModalInstance = new bootstrap.Modal(modalEl);
                }
                proctorModalInstance.show();
            }
        } else {
            alert('Proctoring Environment setup requires Bootstrap JS to be loaded.');
        }
    }

    function confirmSetup() {
        const loader = document.getElementById('proctor-loader');
        loader.classList.remove('d-none');
        
        // Simulate setup verification
        setTimeout(() => {
            if(proctorModalInstance) proctorModalInstance.hide();
            
            // For now, redirect to coding practice as a mock "Starting Test" action
            alert("Environment verified successfully. In a real system, you'd be redirected to the secure browser.");
            
            // Switch to MCQ test internally to simulate starting an assessment
            if (typeof switchTab === 'function') {
                switchTab('tab-mcq');
            }
        }, 2500);
    }

    return {
        init,
        filterTests,
        startTestPrompt,
        confirmSetup
    };
})();
