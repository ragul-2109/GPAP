const NotificationsModule = (function() {
    
    // Mock Database for Notifications
    let notificationsData = [
        {
            id: 1,
            type: "alert",
            title: "Proctored Exam Reminder",
            message: "Your 'Google Software Engineering Intern Assessment' starts in 2 hours. Please ensure your webcam and microphone are working.",
            timestamp: "2 hours ago",
            isRead: false,
            icon: "fa-solid fa-clock",
            color: "warning"
        },
        {
            id: 2,
            type: "result",
            title: "Results Published",
            message: "Your results for 'TCS NQT National Qualifier' are now available. You scored 85% and ranked in the 92nd percentile.",
            timestamp: "Yesterday",
            isRead: false,
            icon: "fa-solid fa-trophy",
            color: "success"
        },
        {
            id: 3,
            type: "system",
            title: "System Maintenance",
            message: "The GPAP portal will undergo scheduled maintenance on Sunday from 2 AM to 4 AM EST. Some features may be unavailable.",
            timestamp: "2 days ago",
            isRead: true,
            icon: "fa-solid fa-screwdriver-wrench",
            color: "secondary"
        },
        {
            id: 4,
            type: "announcement",
            title: "New Coding Practice Modules",
            message: "We have just added 50 new Dynamic Programming questions to the Coding Practice library. Check them out!",
            timestamp: "3 days ago",
            isRead: true,
            icon: "fa-solid fa-bullhorn",
            color: "primary"
        },
        {
            id: 5,
            type: "alert",
            title: "Profile Completion Missing",
            message: "Your resume profile is only 60% complete. Please update your Technical Skills section to improve your placement chances.",
            timestamp: "1 week ago",
            isRead: true,
            icon: "fa-solid fa-triangle-exclamation",
            color: "danger"
        }
    ];

    let currentFilter = 'all';

    function init() {
        renderFeed();
    }

    function filterFeed(filterType, btnElement) {
        currentFilter = filterType;
        
        // Update active class on buttons
        const buttons = btnElement.parentElement.parentElement.querySelectorAll('.nav-link');
        buttons.forEach(b => b.classList.remove('active'));
        btnElement.classList.add('active');
        
        renderFeed();
    }

    function markAsRead(id) {
        const notif = notificationsData.find(n => n.id === id);
        if (notif && !notif.isRead) {
            notif.isRead = true;
            renderFeed(); // Re-render to update UI and counters
        }
    }

    function markAllAsRead() {
        notificationsData.forEach(n => n.isRead = true);
        renderFeed();
    }

    function updateUnreadCount() {
        const count = notificationsData.filter(n => !n.isRead).length;
        const badge = document.getElementById('nav-notification-badge');
        if (badge) {
            badge.textContent = count;
            if (count > 0) {
                badge.classList.remove('d-none');
            } else {
                badge.classList.add('d-none');
            }
        }
    }

    function renderFeed() {
        const listEl = document.getElementById('notifications-panel-body');
        if (!listEl) return;

        updateUnreadCount();

        let filteredData = notificationsData.filter(n => {
            if (currentFilter === 'unread') return !n.isRead;
            if (currentFilter === 'system') return n.type === 'system' || n.type === 'alert';
            return true; // 'all'
        });

        if (filteredData.length === 0) {
            listEl.innerHTML = `
                <div class="text-center p-5 mt-4">
                    <i class="fa-regular fa-bell-slash fa-3x text-muted opacity-25 mb-3"></i>
                    <h6 class="text-muted fw-bold">All caught up!</h6>
                    <p class="small text-muted mb-0">You have no new notifications.</p>
                </div>
            `;
            return;
        }

        listEl.innerHTML = filteredData.map(n => {
            const readClass = n.isRead ? '' : 'bg-light border-start border-primary border-4';
            const iconBg = `bg-${n.color}`;
            const iconText = `text-${n.color}`;
            const dot = n.isRead ? '' : `<div class="bg-primary rounded-circle mt-1 flex-shrink-0" style="width: 8px; height: 8px;"></div>`;

            return `
            <div class="p-3 border-bottom cursor-pointer notification-item-hover ${readClass}" onclick="NotificationsModule.markAsRead(${n.id})" style="transition: background 0.2s;">
                <div class="d-flex align-items-start gap-3">
                    <div class="${iconBg} bg-opacity-10 ${iconText} rounded-circle d-flex justify-content-center align-items-center flex-shrink-0 mt-1" style="width: 40px; height: 40px; font-size: 1rem;">
                        <i class="${n.icon}"></i>
                    </div>
                    <div class="flex-grow-1">
                        <div class="d-flex justify-content-between align-items-start mb-1">
                            <h6 class="fw-bold text-dark m-0 pe-2" style="font-size: 0.9rem;">${n.title}</h6>
                            <small class="text-muted flex-shrink-0" style="font-size: 0.75rem;">${n.timestamp}</small>
                        </div>
                        <p class="text-muted mb-0" style="font-size: 0.85rem; line-height: 1.4;">${n.message}</p>
                    </div>
                    ${dot}
                </div>
            </div>
            `;
        }).join('');
    }

    return {
        init,
        filterFeed,
        markAsRead,
        markAllAsRead
    };
})();
