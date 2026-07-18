// Global Layout Logic
function showSection(sectionId) {
    document.querySelectorAll('.page').forEach((section) => {
        section.classList.toggle('d-none', section.id !== sectionId);
    });
}

function toggleSidebar() {
    document.getElementById('sidebar').classList.toggle('show');
}