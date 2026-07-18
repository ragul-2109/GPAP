const DashboardManager = (function() {
    function loadAdminAnalytics() {
        // Mock data since backend isn't connected
        document.getElementById('admin-total-students').innerText = "1,250";
        document.getElementById('admin-total-tests').innerText = "42";
        document.getElementById('admin-avg-marks').innerText = "68%";
        document.getElementById('admin-risk-students').innerText = "15";
        
        document.getElementById('admin-pass-percent').innerText = "75.0%";
        document.getElementById('admin-pass-count').innerText = "937";
        document.getElementById('admin-fail-count').innerText = "313";
        
        document.getElementById('admin-pass-bar').style.width = "75%";
        document.getElementById('admin-fail-bar').style.width = "25%";
    }

    function getModal(id) {
        return bootstrap.Modal.getOrCreateInstance(document.getElementById(id));
    }

    function openTotalStudentsModal() { getModal('totalStudentsModal').show(); }
    function openTotalTestsModal() { getModal('totalTestsModal').show(); }
    function openAverageMarksModal() { getModal('averageMarksModal').show(); }
    function openHighRiskModal() { getModal('highRiskModal').show(); }

    return {
        loadAdminAnalytics,
        openTotalStudentsModal,
        openTotalTestsModal,
        openAverageMarksModal,
        openHighRiskModal
    };
})();
window.DashboardManager = DashboardManager;
