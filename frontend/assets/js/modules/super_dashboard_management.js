const SuperDashboardManager = (function() {
    function getModal(id) {
        return bootstrap.Modal.getOrCreateInstance(document.getElementById(id));
    }

    function loadAnalytics() {
        const totalColleges = document.getElementById('sa-total-colleges');
        const totalStudents = document.getElementById('sa-total-students');
        const mrr = document.getElementById('sa-mrr');
        const uptime = document.getElementById('sa-uptime');

        if (totalColleges) totalColleges.innerText = '142';
        if (totalStudents) totalStudents.innerText = '18,750';
        if (mrr) mrr.innerText = '$412K';
        if (uptime) uptime.innerText = '99.98%';
    }

    function openCollegesModal() {
        getModal('saCollegesModal').show();
    }

    function openStudentsModal() {
        getModal('saStudentsModal').show();
    }

    function openMRRModal() {
        getModal('saMRRModal').show();
    }

    function openUptimeModal() {
        getModal('saUptimeModal').show();
    }

    return {
        loadAnalytics,
        openCollegesModal,
        openStudentsModal,
        openMRRModal,
        openUptimeModal
    };
})();
window.SuperDashboardManager = SuperDashboardManager;
