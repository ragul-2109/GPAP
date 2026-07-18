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
        const countEl = document.getElementById('unread-count');
        if (countEl) {
            countEl.textContent = count;
            if (count > 0) {
                countEl.classList.add('text-danger');
            } else {
                countEl.classList.remove('text-danger');
            }
        }
    }

    function renderFeed() {
        const listEl = document.getElementById('notifications-list');
        const emptyEl = document.getElementById('notifications-empty');
        if (!listEl) return;

        updateUnreadCount();

        let filteredData = notificationsData.filter(n => {
            if (currentFilter === 'unread') return !n.isRead;
            if (currentFilter === 'system') return n.type === 'system' || n.type === 'alert';
            return true; // 'all'
        });

        if (filteredData.length === 0) {
            listEl.innerHTML = '';
            emptyEl.classList.remove('d-none');
            return;
        }

        emptyEl.classList.add('d-none');

        listEl.innerHTML = filteredData.map(n => {
            const readClass = n.isRead ? '' : 'unread';
            const iconBg = `bg-${n.color}`;
            const iconText = `text-${n.color}`;

            return `
            <div class="notification-item p-4 ${readClass}" onclick="NotificationsModule.markAsRead(${n.id})">
                <div class="d-flex align-items-start gap-3">
                    <!-- Icon -->
                    <div class="${iconBg} bg-opacity-10 ${iconText} rounded-circle d-flex justify-content-center align-items-center flex-shrink-0" style="width: 48px; height: 48px; font-size: 1.25rem;">
                        <i class="${n.icon}"></i>
                    </div>
                    
                    <!-- Content -->
                    <div class="flex-grow-1">
                        <div class="d-flex justify-content-between align-items-center mb-1">
                            <h6 class="fw-bold text-dark m-0">${n.title}</h6>
                            <small class="text-muted">${n.timestamp}</small>
                        </div>
                        <p class="text-muted small mb-0 pe-md-5" style="line-height: 1.6;">${n.message}</p>
                    </div>
                    
                    <!-- Unread Indicator -->
                    <div class="d-flex align-items-center justify-content-center flex-shrink-0" style="width: 20px; height: 100%;">
                        <span class="unread-indicator"></span>
                    </div>
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
