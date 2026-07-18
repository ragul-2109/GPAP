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

    ];

    let sentNotificationsData = []; // To track messages sent by the user
    let currentFilter = 'all';
    let currentTab = 'inbox'; // 'inbox' or 'sent'

    function init() {
        renderFeed();
    }

    function filterFeed(filterType, btnElement) {
        currentFilter = filterType;
        
        // Update active class on buttons if btnElement is provided
        if (btnElement) {
            const buttons = btnElement.parentElement.parentElement.querySelectorAll('.nav-link');
            buttons.forEach(b => b.classList.remove('active'));
            btnElement.classList.add('active');
        }
        
        renderFeed();
    }

    function switchTab(tabId) {
        currentTab = tabId;
        renderFeed();
    }

    let composeModalInstance = null;

    function openCompose() {
        const user = window.StateModule ? window.StateModule.getUser() : { role: 'student' };
        const role = user.role;
        const targetSelect = document.getElementById('compose-target');
        
        targetSelect.innerHTML = '';
        
        if (role === 'student') {
            targetSelect.innerHTML += `<option value="staff">Send to Staff (Mentors)</option>`;
            targetSelect.innerHTML += `<option value="management">Send to Management</option>`;
        } else if (role === 'staff') {
            targetSelect.innerHTML += `<option value="student">Broadcast to Students</option>`;
            targetSelect.innerHTML += `<option value="management">Send to Management</option>`;
        } else if (role === 'college_admin' || role === 'super_admin') {
            targetSelect.innerHTML += `<option value="all">Broadcast to All Users</option>`;
            targetSelect.innerHTML += `<option value="student">Broadcast to Students</option>`;
            targetSelect.innerHTML += `<option value="staff">Broadcast to Staff</option>`;
        } else {
            targetSelect.innerHTML += `<option value="admin">Send to Admin</option>`;
        }

        document.getElementById('compose-subject').value = '';
        document.getElementById('compose-message').value = '';

        if (typeof bootstrap !== 'undefined') {
            const modalEl = document.getElementById('composeNotificationModal');
            if(modalEl) {
                if (!composeModalInstance) composeModalInstance = new bootstrap.Modal(modalEl);
                composeModalInstance.show();
            }
        }
    }

    function sendMessage() {
        const target = document.getElementById('compose-target').value;
        const targetText = document.getElementById('compose-target').options[document.getElementById('compose-target').selectedIndex].text;
        const subject = document.getElementById('compose-subject').value.trim();
        const message = document.getElementById('compose-message').value.trim();

        if(!subject || !message) {
            Swal.fire({
                icon: 'warning',
                title: 'Missing Fields',
                text: 'Please enter both a subject and a message.'
            });
            return;
        }

        const newMsg = {
            id: Date.now(),
            type: 'announcement',
            title: subject,
            message: message,
            timestamp: 'Just now',
            isRead: true,
            icon: 'fa-solid fa-paper-plane',
            color: 'primary',
            target: targetText
        };

        // Add to sent tracking
        sentNotificationsData.unshift(newMsg);

        if(composeModalInstance) {
            composeModalInstance.hide();
        }

        Swal.fire({
            icon: 'success',
            title: 'Message Sent!',
            text: `Your message has been successfully dispatched to ${targetText}.`,
            timer: 2000,
            showConfirmButton: false
        });

        // If user sends to 'all', inject it into their own inbox too for demonstration
        if (target === 'all') {
            const inboxMsg = {...newMsg, isRead: false, target: undefined};
            notificationsData.unshift(inboxMsg);
        }

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
        const sentEl = document.getElementById('sent-panel-body');
        
        if (listEl) {
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
            } else {
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
        }

        // Render Sent panel
        if (sentEl) {
            if (sentNotificationsData.length === 0) {
                sentEl.innerHTML = `
                    <div class="text-center p-5 mt-4">
                        <i class="fa-regular fa-paper-plane fa-3x text-muted opacity-25 mb-3"></i>
                        <h6 class="text-muted fw-bold">No sent messages</h6>
                        <p class="small text-muted mb-0">You haven't sent any messages or feedback yet.</p>
                    </div>
                `;
            } else {
                sentEl.innerHTML = sentNotificationsData.map(n => {
                    return `
                    <div class="p-3 border-bottom">
                        <div class="d-flex align-items-start gap-3">
                            <div class="bg-light text-secondary rounded-circle d-flex justify-content-center align-items-center flex-shrink-0 mt-1" style="width: 40px; height: 40px; font-size: 1rem;">
                                <i class="${n.icon}"></i>
                            </div>
                            <div class="flex-grow-1">
                                <div class="d-flex justify-content-between align-items-start mb-1">
                                    <h6 class="fw-bold text-dark m-0 pe-2" style="font-size: 0.9rem;">${n.title}</h6>
                                    <small class="text-muted flex-shrink-0" style="font-size: 0.75rem;">${n.timestamp}</small>
                                </div>
                                <div class="small text-primary fw-medium mb-1"><i class="fa-solid fa-share me-1"></i>To: ${n.target}</div>
                                <p class="text-muted mb-0" style="font-size: 0.85rem; line-height: 1.4;">${n.message}</p>
                            </div>
                        </div>
                    </div>
                    `;
                }).join('');
            }
        }
    }

    return {
        init,
        filterFeed,
        switchTab,
        openCompose,
        sendMessage,
        markAsRead,
        markAllAsRead
    };
})();
