const appState = {
    selectedRole: null,
    token: null,
    user: null,
    cheatingAlerts: 0
};

// Global Layout Logic
function showSection(sectionId) {
    document.querySelectorAll('.page').forEach((section) => {
        section.classList.toggle('d-none', section.id !== sectionId);
    });
}

function toggleSidebar() {
    document.getElementById('sidebar').classList.toggle('show');
}

// Tab Routing Logic (Dynamic Loading)
async function switchTab(tabId) {
    // Deactivate all menu items
    document.querySelectorAll('.menu-item').forEach(item => {
        item.classList.remove('active');
    });
    
    // Highlight selected menu item
    const activeItem = document.querySelector(`.menu-item[onclick="switchTab('${tabId}')"]`);
    if (activeItem) activeItem.classList.add('active');
    
    // Close sidebar on mobile after selection
    if(window.innerWidth <= 768) {
        document.getElementById('sidebar').classList.remove('show');
    }

    const contentArea = document.getElementById('content-area');
    
    // Show loading state
    contentArea.innerHTML = '<div class="d-flex justify-content-center p-5"><div class="spinner-border text-primary" role="status"><span class="visually-hidden">Loading...</span></div></div>';
    
    let role = "student";
    let page = tabId.replace("tab-", "");
    
    if (page.startsWith("staff-")) { role = "staff"; page = page.replace("staff-", ""); }
    else if (page.startsWith("college-")) { role = "college_admin"; page = page.replace("college-", ""); }
    else if (page.startsWith("super-")) { role = "super_admin"; page = page.replace("super-", ""); }
    else {
        if (page === "mcq") page = "mcq_practice";
        if (page === "coding") page = "coding_practice";
        if (page === "live") page = "live_test";
    }

    try {
        const response = await fetch(`/static/pages/${role}/${page}.html`);
        if (response.ok) {
            const html = await response.text();
            contentArea.innerHTML = `<div id="${tabId}" class="tab-section active">${html}</div>`;
            
            // Set Profile Info if it's the profile tab
            if (tabId === 'tab-profile' && appState.user) {
                const pName = document.getElementById('profileName');
                if (pName) pName.textContent = appState.user.full_name;
                const pEmail = document.getElementById('profileEmail');
                if (pEmail) pEmail.textContent = appState.user.email;
                const pInst = document.getElementById('profileInstitute');
                if (pInst) pInst.textContent = appState.user.college_code;
            }
            
            // Load module content if needed
            if (page === 'mcq_practice' || page === 'coding_practice' || page === 'staff-mcq-create') {
                loadModuleContent(appState.selectedRole);
            }
            
            // Load Dashboard stats if needed
            if (page === 'dashboard') {
                loadDashboardSummary();
            }
            
        } else {
            contentArea.innerHTML = `<div class="p-5 text-center text-danger"><h4>Page Not Found</h4><p>Failed to load ${role}/${page}.html (Status ${response.status})</p></div>`;
        }
    } catch(e) {
        contentArea.innerHTML = `<div class="p-5 text-center text-danger"><h4>Connection Error</h4><p>${e.message}</p></div>`;
    }
}

// Auth Logic
async function login() {
    const collegeCode = document.getElementById('collegeCode').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    try {
        const response = await fetch('/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ college_code: collegeCode, email, password })
        });

        const data = await response.json();
        if (!response.ok) {
            alert(data.detail || 'Login failed');
            return;
        }

        appState.token = data.access_token;
        localStorage.setItem('gpap_token', data.access_token);
        await fetchUserProfile();
    } catch(err) {
        alert("Server connection failed. Is the backend running?");
    }
}

function logout() {
    localStorage.removeItem('gpap_token');
    appState.token = null;
    appState.user = null;
    showSection('loginPage');
}

async function fetchUserProfile() {
    const token = appState.token || localStorage.getItem('gpap_token');
    if (!token) return;

    try {
        const response = await fetch('/api/auth/me', {
            headers: { Authorization: `Bearer ${token}` }
        });
        
        if (!response.ok) {
            logout();
            return;
        }
        
        appState.user = await response.json();
        appState.selectedRole = appState.user.role;
        renderDashboard(appState.selectedRole);
        setupAntiCheating(appState.selectedRole);
    } catch(err) {
        logout();
    }
}

// Anti-Cheating
function setupAntiCheating(role) {
    if (role === 'student') {
        // Prevent Copy/Paste globally (Temporarily disabled for testing)
        /*
        document.addEventListener('copy', (e) => {
            e.preventDefault();
            alert('GPAP Proctored Environment: Copying is disabled.');
        });
        document.addEventListener('paste', (e) => {
            e.preventDefault();
            alert('GPAP Proctored Environment: Pasting is disabled.');
        });
        document.addEventListener('contextmenu', e => e.preventDefault());
        */

        // Detect Tab Switch (Temporarily disabled for testing)
        /*
        document.addEventListener("visibilitychange", () => {
            if (document.hidden) {
                appState.cheatingAlerts++;
                alert(`Warning! Tab switching detected. This incident has been recorded. (Alerts: ${appState.cheatingAlerts})`);
            }
        });
        */
    }
}

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
    } catch(e) {
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
    } catch(e) {
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

// Initialization
window.addEventListener('DOMContentLoaded', () => {
    const savedToken = localStorage.getItem('gpap_token');
    if (savedToken) {
        appState.token = savedToken;
        fetchUserProfile();
    }

    document.getElementById('loginForm').addEventListener('submit', (event) => {
        event.preventDefault();
        login();
    });
});