const AuditModule = (function() {
    let logInterval = null;
    let currentFilter = 'all';
    
    const sampleLogs = [
        { type: 'INFO', msg: "College 'XYZTECH' added by admin_01", colorClass: 'badge-info' },
        { type: 'WARN', msg: "High load detected on Compiler Node 2", colorClass: 'badge-warn' },
        { type: 'INFO', msg: "Automated daily backup completed", colorClass: 'badge-info' },
        { type: 'SEC', msg: "Blocked unauthorized API access from IP 192.168.1.5", colorClass: 'badge-sec' },
        { type: 'INFO', msg: "User 'sarah.connor' updated subscription tier to 'Pro'", colorClass: 'badge-info' },
        { type: 'CRON', msg: "Executing cleanup routine for expired sessions...", colorClass: 'badge-cron' },
        { type: 'CRON', msg: "Cleanup routine finished successfully.", colorClass: 'badge-cron' },
        { type: 'SEC', msg: "Failed login attempt for user 'admin_root' (IP: 45.33.22.1)", colorClass: 'badge-sec' },
        { type: 'SEC', msg: "IP 45.33.22.1 temporarily banned (Too many failed attempts).", colorClass: 'badge-sec' },
        { type: 'INFO', msg: "Manual backup initiated by 'super_admin'", colorClass: 'badge-info' },
        { type: 'WARN', msg: "API rate limit exceeded by college 'GENFINIX'", colorClass: 'badge-warn' },
        { type: 'INFO', msg: "New AI model weights loaded successfully.", colorClass: 'badge-info' },
        { type: 'SEC', msg: "Detected anomaly in assessment #8842 submissions.", colorClass: 'badge-sec' }
    ];

    function generateTimestamp() {
        const now = new Date();
        const pad = (n) => n.toString().padStart(2, '0');
        return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())} ${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;
    }

    function createLogElement(log) {
        const div = document.createElement('div');
        div.className = `log-line mb-1 log-type-${log.type.toLowerCase()}`;
        div.innerHTML = `
            <span class="log-timestamp">[${generateTimestamp()}]</span>
            <span class="log-badge ${log.colorClass}">${log.type}</span>
            <span class="log-message text-light">${log.msg}</span>
        `;
        return div;
    }

    function init() {
        const container = document.getElementById('audit-logs');
        if (!container) return;
        
        container.innerHTML = '';
        // Load initial logs
        for(let i=0; i<10; i++) {
            const log = sampleLogs[Math.floor(Math.random() * sampleLogs.length)];
            appendLog(log, false);
        }
        
        startLiveStream();
    }

    function appendLog(log, smoothScroll = true) {
        const container = document.getElementById('audit-logs');
        const scrollContainer = document.getElementById('audit-terminal-container');
        if (!container || !scrollContainer) return;

        // Filtering logic
        if (currentFilter !== 'all' && log.type.toLowerCase() !== currentFilter) {
            return; // Skip adding if it doesn't match filter
        }

        const el = createLogElement(log);
        container.appendChild(el);

        // Keep only last 100 logs to prevent DOM bloat
        if (container.children.length > 100) {
            container.removeChild(container.firstChild);
        }

        if (smoothScroll) {
            scrollContainer.scrollTop = scrollContainer.scrollHeight;
        }
    }

    function startLiveStream() {
        if (logInterval) clearInterval(logInterval);
        
        logInterval = setInterval(() => {
            const log = sampleLogs[Math.floor(Math.random() * sampleLogs.length)];
            appendLog(log);
            
            // Randomly update the security alerts count if it's a SEC event
            if (log.type === 'SEC') {
                const countEl = document.getElementById('audit-security-count');
                if (countEl) {
                    countEl.innerText = parseInt(countEl.innerText) + 1;
                    countEl.classList.add('text-danger', 'fw-bold');
                    setTimeout(() => countEl.classList.remove('text-danger', 'fw-bold'), 500);
                }
            }
        }, 3000); // New log every 3 seconds
    }

    function filterLogs(type) {
        currentFilter = type;
        const container = document.getElementById('audit-logs');
        if (!container) return;
        
        // Hide/show existing logs
        const logs = container.children;
        for (let log of logs) {
            if (type === 'all' || log.classList.contains(`log-type-${type}`)) {
                log.style.display = 'block';
            } else {
                log.style.display = 'none';
            }
        }
    }

    function clearTerminal() {
        const container = document.getElementById('audit-logs');
        if (container) container.innerHTML = '';
    }

    function toggleFullscreen() {
        const term = document.getElementById('audit-terminal-container').parentElement;
        if (!document.fullscreenElement) {
            term.requestFullscreen().catch(err => {
                alert(`Error attempting to enable fullscreen: ${err.message}`);
            });
        } else {
            document.exitFullscreen();
        }
    }
    
    function downloadReport() {
        // Mock download
        alert("Preparing audit report for download... This may take a moment.");
    }

    return {
        init,
        filterLogs,
        clearTerminal,
        toggleFullscreen,
        downloadReport
    };
})();
