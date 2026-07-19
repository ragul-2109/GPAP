function showPasswordChangeModal() {
    if (document.getElementById('forcePasswordChangeModal')) {
        return;
    }

    const modalHtml = `
        <div class="modal fade" id="forcePasswordChangeModal" tabindex="-1" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered">
                <div class="modal-content">
                    <div class="modal-header border-0 pb-0">
                        <h5 class="modal-title brand fs-5">Change Your Password</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <p class="text-muted small">This account requires a password change before continuing.</p>
                        <form id="forcePasswordChangeForm">
                            <div class="mb-3">
                                <label class="form-label">Current Password</label>
                                <input type="password" id="forceCurrentPassword" class="form-control" required>
                            </div>
                            <div class="mb-3">
                                <label class="form-label">New Password</label>
                                <input type="password" id="forceNewPassword" class="form-control" required>
                            </div>
                            <div class="mb-3">
                                <label class="form-label">Confirm New Password</label>
                                <input type="password" id="forceConfirmPassword" class="form-control" required>
                            </div>
                        </form>
                    </div>
                    <div class="modal-footer border-0 pt-0">
                        <button type="button" class="btn btn-light" data-bs-dismiss="modal">Cancel</button>
                        <button type="submit" form="forcePasswordChangeForm" class="btn btn-primary">Update Password</button>
                    </div>
                </div>
            </div>
        </div>`;

    document.body.insertAdjacentHTML('beforeend', modalHtml);
    const modalEl = document.getElementById('forcePasswordChangeModal');
    const modal = new bootstrap.Modal(modalEl);
    document.getElementById('forcePasswordChangeForm').addEventListener('submit', async (event) => {
        event.preventDefault();
        const currentPassword = document.getElementById('forceCurrentPassword').value;
        const newPassword = document.getElementById('forceNewPassword').value;
        const confirmPassword = document.getElementById('forceConfirmPassword').value;

        try {
            const response = await fetch('/api/auth/change-password', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${appState.token || localStorage.getItem('gpap_token')}`
                },
                body: JSON.stringify({ current_password: currentPassword, new_password: newPassword, confirm_password: confirmPassword })
            });
            const data = await response.json().catch(() => ({}));
            if (!response.ok) {
                alert(data.detail || 'Password change failed');
                return;
            }
            modal.hide();
            appState.user = { ...(appState.user || {}), must_change_password: false };
            renderDashboard(appState.selectedRole);
            setupAntiCheating(appState.selectedRole);
        } catch (err) {
            alert('Unable to change password right now.');
        }
    });
    modal.show();
}

async function submitPasswordChangeFromModal() {
    const currentPassword = document.getElementById('changePasswordCurrent')?.value || '';
    const newPassword = document.getElementById('changePasswordNew')?.value || '';
    const confirmPassword = document.getElementById('changePasswordConfirm')?.value || '';

    try {
        const response = await fetch('/api/auth/change-password', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${appState.token || localStorage.getItem('gpap_token')}`
            },
            body: JSON.stringify({ current_password: currentPassword, new_password: newPassword, confirm_password: confirmPassword })
        });
        const data = await response.json().catch(() => ({}));
        if (!response.ok) {
            alert(data.detail || 'Password change failed');
            return;
        }
        alert('Password changed successfully.');
        const modalEl = document.getElementById('changePasswordModal');
        if (modalEl) {
            bootstrap.Modal.getInstance(modalEl)?.hide();
        }
        appState.user = { ...(appState.user || {}), must_change_password: false };
    } catch (err) {
        alert('Unable to change password right now.');
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
        if (appState.user.must_change_password) {
            showPasswordChangeModal();
            return appState.user;
        }
        renderDashboard(appState.selectedRole);
        setupAntiCheating(appState.selectedRole);
        return appState.user;
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