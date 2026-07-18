// Data Fetching
async function loadDashboardSummary() {
    try {
        const response = await fetch('/api/dashboard/summary', {
            headers: { Authorization: `Bearer ${appState.token || localStorage.getItem('gpap_token')}` }
        });
        const data = await response.json();
        const stats = data.stats || {};
        document.getElementById('statsTests').textContent = stats.tests || 0;
        document.getElementById('statsScore').textContent = `${stats.avg_score || 0}%`;
        document.getElementById('statsPlacements').textContent = stats.placements || 0;

        const overview = document.getElementById('overviewCards');
        overview.innerHTML = '';
        (data.overview || []).forEach((item) => {
            const card = document.createElement('div');
            card.className = 'col-md-6';
            card.innerHTML = `<div class="p-3 border rounded-3 bg-light h-100"><h6 class="text-muted mb-2">${item.title}</h6><div class="fs-4 brand">${item.value}</div></div>`;
            overview.appendChild(card);
        });
    } catch (e) {
        console.error("Dashboard fetch error", e);
    }
}

async function loadModuleContent(role) {
    try {
        // Load MCQ
        const mcqResponse = await fetch('/api/content/mcq');
        const mcqData = await mcqResponse.json();
        const mcqContainer = document.getElementById('mcqContainer');
        mcqContainer.innerHTML = '';

        if (role === 'staff' || role === 'college_admin') {
            mcqContainer.innerHTML += `<button class="btn btn-primary mb-3"><i class="fa-solid fa-plus me-2"></i>Create New Test</button>`;
        }

        mcqData.questions.forEach((item, index) => {
            const card = document.createElement('div');
            card.className = 'mb-4 p-3 border rounded-3 bg-light';
            card.innerHTML = `<div class="fw-bold text-dark">${index + 1}. ${item.prompt}</div><div class="mt-3">${item.options.map((opt) => `<div class="form-check mb-2"><input class="form-check-input" type="radio" name="q${item.id}" /><label class="form-check-label ms-2">${opt}</label></div>`).join('')}</div>`;
            mcqContainer.appendChild(card);
        });

        // Load Coding
        const codingResponse = await fetch('/api/content/coding');
        const codingData = await codingResponse.json();
        const codingContainer = document.getElementById('codingContainer');
        codingContainer.innerHTML = '';
        codingData.tasks.forEach((task) => {
            const card = document.createElement('div');
            card.className = 'mb-3 p-4 border rounded-3 bg-light';
            card.innerHTML = `<div class="d-flex justify-content-between"><div class="fw-bold fs-5 text-dark">${task.title}</div><span class="badge bg-primary">${task.difficulty}</span></div><p class="mt-3 mb-3 text-muted">${task.description}</p><button class="btn btn-outline-primary btn-sm">Solve in AI Compiler</button>`;
            codingContainer.appendChild(card);
        });
    } catch (e) {
        console.error("Module content fetch error", e);
    }
}

function renderDashboard(role) {
    showSection('dashboardPage');

    // Toggle Menu based on role
    const studentMenu = document.getElementById('studentMenu');
    const staffMenu = document.getElementById('staffMenu');
    const collegeMenu = document.getElementById('collegeMenu');
    const superAdminMenu = document.getElementById('superAdminMenu');

    if (studentMenu) studentMenu.classList.add('d-none');
    if (staffMenu) staffMenu.classList.add('d-none');
    if (collegeMenu) collegeMenu.classList.add('d-none');
    if (superAdminMenu) superAdminMenu.classList.add('d-none');

    if (role === 'super_admin') {
        if (superAdminMenu) superAdminMenu.classList.remove('d-none');
        switchTab('tab-super-dashboard');
    } else if (role === 'college_admin') {
        if (collegeMenu) collegeMenu.classList.remove('d-none');
        switchTab('tab-college-dashboard');
    } else if (role === 'staff') {
        if (staffMenu) staffMenu.classList.remove('d-none');
        switchTab('tab-staff-dashboard');
    } else {
        if (studentMenu) studentMenu.classList.remove('d-none');
        switchTab('tab-dashboard');
    }

    // Data loading logic is now handled inside switchTab after HTML fetch
}
