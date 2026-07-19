// Initialization
window.setRole = function (role, element) {
    document.querySelectorAll('.role-tab').forEach(t => t.classList.remove('active'));
    element.classList.add('active');

    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const collegeInput = document.getElementById('collegeCode');

    if (role === 'student') {
        emailInput.placeholder = 'Student email provided by your administrator';
        passwordInput.placeholder = 'Password provided by your administrator';
        collegeInput.disabled = false;
        collegeInput.required = true;
    } else if (role === 'staff') {
        emailInput.placeholder = 'Staff / admin email provided by your administrator';
        passwordInput.placeholder = 'Password provided by your administrator';
        collegeInput.disabled = false;
        collegeInput.required = false;
    }

    emailInput.value = '';
    passwordInput.value = '';
    if (!collegeInput.value) {
        collegeInput.value = '';
    }
};

async function loadCollegeOptions() {
    const collegeInput = document.getElementById('collegeCode');
    if (!collegeInput) return;

    try {
        const response = await fetch('/api/colleges');
        if (!response.ok) throw new Error('Failed to load colleges');

        const data = await response.json();
        const colleges = Array.isArray(data.colleges) ? data.colleges : [];

        collegeInput.innerHTML = '';
        if (!colleges.length) {
            collegeInput.innerHTML = '<option value="" disabled selected>No colleges available</option>';
            return;
        }

        colleges.forEach((college, index) => {
            const option = document.createElement('option');
            option.value = college.code || college.id;
            option.textContent = `${college.name} (${college.code || college.id})`;
            if (index === 0) option.selected = true;
            collegeInput.appendChild(option);
        });
    } catch (error) {
        collegeInput.innerHTML = '<option value="" disabled selected>Failed to load colleges</option>';
        console.error(error);
    }
}

window.addEventListener('DOMContentLoaded', async () => {
    const savedToken = localStorage.getItem('gpap_token');
    if (savedToken) {
        appState.token = savedToken;
        fetchUserProfile();
    }

    await loadCollegeOptions();

    const activeRoleTab = document.querySelector('.role-tab.active');
    if (activeRoleTab) {
        setRole(activeRoleTab.getAttribute('data-role') || 'student', activeRoleTab);
    } else {
        const defaultTab = document.querySelector('.role-tab');
        if (defaultTab) setRole(defaultTab.getAttribute('data-role') || 'student', defaultTab);
    }

    document.getElementById('loginForm').addEventListener('submit', (event) => {
        event.preventDefault();
        login();
    });

    if (typeof NotificationsModule !== 'undefined') {
        NotificationsModule.init();
    }
});