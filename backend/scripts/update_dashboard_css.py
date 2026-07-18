import sys

css = """
/* ==========================================================================
   MODERN LIGHT DASHBOARD THEME
   ========================================================================== */

/* Layout & Backgrounds */
.dashboard-layout {
    background-color: #f1f5f9; /* Modern light gray background */
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
    color: #334155;
}

.sidebar {
    background-color: #ffffff;
    border-right: 1px solid #e2e8f0;
    box-shadow: 4px 0 24px rgba(0,0,0,0.02);
    z-index: 10;
}

.main-content {
    background-color: #f1f5f9;
}

.top-navbar {
    background-color: #ffffff;
    border-bottom: 1px solid #e2e8f0;
    box-shadow: 0 2px 10px rgba(0,0,0,0.02);
    padding: 1rem 2rem;
}

/* Sidebar Links */
.sidebar-menu .menu-item {
    padding: 0.8rem 1.5rem;
    color: #64748b;
    font-weight: 500;
    font-size: 0.95rem;
    border-radius: 8px;
    margin: 0.2rem 1rem;
    transition: all 0.2s ease;
    display: flex;
    align-items: center;
    gap: 12px;
}

.sidebar-menu .menu-item i {
    font-size: 1.1rem;
    width: 24px;
    text-align: center;
    color: #94a3b8;
    transition: color 0.2s ease;
}

.sidebar-menu .menu-item:hover {
    background-color: #f8fafc;
    color: #0f172a;
}

.sidebar-menu .menu-item:hover i {
    color: #0d6efd;
}

.sidebar-menu .menu-item.active {
    background-color: #eff6ff;
    color: #0d6efd;
    font-weight: 600;
}

.sidebar-menu .menu-item.active i {
    color: #0d6efd;
}

/* Cards */
.lux-card {
    background: #ffffff;
    border-radius: 16px;
    border: 1px solid rgba(226, 232, 240, 0.6);
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.03), 0 2px 4px -1px rgba(0, 0, 0, 0.02);
    transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.lux-card:hover {
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.05), 0 4px 6px -2px rgba(0, 0, 0, 0.03);
}

/* Typography & Stats */
.brand {
    color: #0f172a;
    font-weight: 700;
    letter-spacing: -0.5px;
}

.text-muted {
    color: #64748b !important;
}

.stat-value {
    font-size: 2.25rem;
    font-weight: 700;
    color: #0f172a;
    letter-spacing: -1px;
}

.stat-value.text-primary { color: #0d6efd !important; }
.stat-value.text-success { color: #10b981 !important; }

/* Tables */
.table {
    border-collapse: separate;
    border-spacing: 0;
    width: 100%;
}

.table thead th {
    background-color: #f8fafc;
    color: #475569;
    font-weight: 600;
    font-size: 0.85rem;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    padding: 1rem;
    border-bottom: 1px solid #e2e8f0;
    border-top: none;
}

.table tbody td {
    padding: 1rem;
    vertical-align: middle;
    color: #334155;
    border-bottom: 1px solid #f1f5f9;
}

.table tbody tr:hover td {
    background-color: #f8fafc;
}

/* Badges */
.badge {
    padding: 0.4em 0.8em;
    font-weight: 600;
    border-radius: 6px;
}
.badge.bg-success { background-color: #d1fae5 !important; color: #059669; }
.badge.bg-primary { background-color: #dbeafe !important; color: #1d4ed8; }
.badge.bg-danger { background-color: #fee2e2 !important; color: #b91c1c; }

/* Buttons */
.btn {
    font-weight: 500;
    border-radius: 8px;
    padding: 0.5rem 1rem;
    transition: all 0.2s;
}

.btn-primary {
    background-color: #0d6efd;
    border-color: #0d6efd;
    box-shadow: 0 2px 4px rgba(13, 110, 253, 0.2);
}

.btn-primary:hover {
    background-color: #0b5ed7;
    border-color: #0a58ca;
    transform: translateY(-1px);
    box-shadow: 0 4px 6px rgba(13, 110, 253, 0.25);
}

.btn-outline-primary {
    color: #0d6efd;
    border-color: #0d6efd;
}

.btn-outline-primary:hover {
    background-color: #eff6ff;
    color: #0b5ed7;
    border-color: #0b5ed7;
}

/* Miscellaneous */
.blue-line {
    height: 4px;
    width: 40px;
    background: #0d6efd;
    border-radius: 2px;
}
"""

with open('d:/CVS/frontend/assets/css/main.css', 'a') as f:
    f.write(css)

print("Dashboard CSS added successfully!")
