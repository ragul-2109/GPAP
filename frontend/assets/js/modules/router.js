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
    if (window.innerWidth <= 768) {
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
        if (page === "study") page = "study_materials";
    }

    try {
        const response = await fetch(`/static/pages/${role}/${page}.html?t=${Date.now()}`);
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
            if (page === 'mcq_practice') {
                if (typeof MCQModule !== 'undefined') {
                    MCQModule.init();
                }
            } else if (page === 'coding_practice') {
                if (typeof CodingModule !== 'undefined') {
                    CodingModule.init();
                }
            } else if (page === 'live_test') {
                if (typeof LiveTestModule !== 'undefined') {
                    LiveTestModule.init();
                }
            } else if (page === 'results') {
                if (typeof ResultsModule !== 'undefined') {
                    ResultsModule.init();
                }
            } else if (page === 'performance') {
                if (typeof PerformanceModule !== 'undefined') {
                    PerformanceModule.init();
                }
            } else if (page === 'resume') {
                if (typeof ResumeModule !== 'undefined') {
                    ResumeModule.init();
                }
            } else if (page === 'notifications') {
                if (typeof NotificationsModule !== 'undefined') {
                    NotificationsModule.init();
                }
            } else if (page === 'staff-mcq-create') {
                loadModuleContent(appState.selectedRole);
            }

            // Load Dashboard stats if needed
            if (page === 'dashboard') {
                loadDashboardSummary();
            }

        } else {
            contentArea.innerHTML = `<div class="p-5 text-center text-danger"><h4>Page Not Found</h4><p>Failed to load ${role}/${page}.html (Status ${response.status})</p></div>`;
        }
    } catch (e) {
        contentArea.innerHTML = `<div class="p-5 text-center text-danger"><h4>Connection Error</h4><p>${e.message}</p></div>`;
    }
}