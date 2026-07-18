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