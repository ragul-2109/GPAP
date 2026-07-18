// Initialization
window.setRole = function(role, element) {
    document.querySelectorAll('.role-tab').forEach(t => t.classList.remove('active'));
    element.classList.add('active');

    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const collegeInput = document.getElementById('collegeCode');

    if (role === 'student') {
        emailInput.value = 'student@gmail.com';
        passwordInput.value = 'student123';
        collegeInput.value = 'EXCEL';
        collegeInput.disabled = false;
    } else if (role === 'staff') {
        emailInput.value = 'staff@gmail.com';
        passwordInput.value = 'staff123';
        collegeInput.value = 'EXCEL';
        collegeInput.disabled = false;
    } else if (role === 'college') {
        emailInput.value = 'management@gmail.com';
        passwordInput.value = 'management123';
        collegeInput.value = 'EXCEL';
        collegeInput.disabled = false;
    } else if (role === 'super') {
        emailInput.value = 'genfinix@gmail.com';
        passwordInput.value = 'genfinix123';
        collegeInput.value = 'GENFINIX';
        collegeInput.disabled = true;
    }
};

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

    if (typeof NotificationsModule !== 'undefined') {
        NotificationsModule.init();
    }
});