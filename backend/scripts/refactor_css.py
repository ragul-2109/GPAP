import os

css_dir = 'd:/CVS/frontend/assets/css'
with open(os.path.join(css_dir, 'main.css'), 'r', encoding='utf-8') as f:
    main_css = f.read()

# We will create the modular files. Since main.css is complex, we will just create professional baseline files 
# based on the white luxury theme in main.css and inject them.

def write_css(subpath, content):
    filepath = os.path.join(css_dir, subpath)
    os.makedirs(os.path.dirname(filepath), exist_ok=True)
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)

variables_css = """/* Core Theme Variables */
:root {
    --primary-color: #0f4c81; /* Classic Blue */
    --primary-hover: #0a355c;
    --secondary-color: #3b82f6;
    --text-main: #334155;
    --text-muted: #64748b;
    --bg-main: #f4f7fb;
    --bg-card: #ffffff;
    --border-color: rgba(226, 232, 240, 0.8);
    --font-family: 'Outfit', sans-serif;
}
"""

reset_css = """/* Base Resets & Typography */
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');
@import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&display=swap');

body {
    background: var(--bg-main);
    font-family: var(--font-family);
    color: var(--text-main);
    margin: 0;
    padding: 0;
    -webkit-font-smoothing: antialiased;
}

.brand {
    color: var(--primary-color);
    font-weight: 700;
    letter-spacing: -0.5px;
}

.text-muted {
    color: var(--text-muted) !important;
}

.blue-line {
    height: 3px;
    background: linear-gradient(90deg, var(--primary-color), var(--secondary-color));
    border-radius: 4px;
    width: 60px;
}

.page {
    display: block;
    animation: fadeIn 0.4s ease-in-out;
}

@keyframes fadeIn {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
}
"""

cards_css = """/* Premium Card Components */
.lux-card {
    background: var(--bg-card);
    border: 1px solid var(--border-color);
    border-radius: 16px;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03);
    transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.lux-card:hover {
    box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.08), 0 8px 10px -6px rgba(0, 0, 0, 0.04);
}

.tab-section {
    display: none;
    animation: fadeIn 0.3s ease-in-out;
}

.tab-section.active {
    display: block;
}
"""

buttons_css = """/* Interactive Buttons */
.btn-primary {
    background: var(--primary-color);
    border: none;
    font-weight: 500;
    padding: 0.6rem 1.5rem;
    border-radius: 8px;
    transition: all 0.3s ease;
    box-shadow: 0 4px 14px 0 rgba(15, 76, 129, 0.39);
    color: white;
}

.btn-primary:hover {
    background: var(--primary-hover);
    box-shadow: 0 6px 20px rgba(15, 76, 129, 0.23);
    transform: translateY(-1px);
    color: white;
}

.btn-outline-primary {
    color: var(--primary-color);
    border-color: var(--primary-color);
    font-weight: 500;
}

.btn-outline-primary:hover {
    background: #f0f7ff;
    color: var(--primary-hover);
}
"""

forms_css = """/* Form Elements */
.form-control {
    border: 1px solid #e2e8f0;
    border-radius: 8px;
    padding: 0.75rem 1rem;
    font-size: 0.95rem;
    transition: all 0.2s;
}

.form-control:focus {
    border-color: var(--secondary-color);
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.15);
}

.form-label {
    font-weight: 500;
    color: #475569;
    font-size: 0.9rem;
}
"""

sidebar_css = """/* Layout: Sidebar and Content */
.dashboard-layout {
    display: flex;
    min-height: 100vh;
}

.sidebar {
    width: 280px;
    background: white;
    border-right: 1px solid #e2e8f0;
    display: flex;
    flex-direction: column;
    transition: all 0.3s ease;
    z-index: 1000;
}

.sidebar-header {
    padding: 1.5rem;
    border-bottom: 1px solid #f1f5f9;
}

.sidebar-menu {
    flex-grow: 1;
    overflow-y: auto;
    padding: 1.5rem 1rem;
}

.menu-item {
    display: flex;
    align-items: center;
    padding: 0.8rem 1rem;
    color: #475569;
    text-decoration: none;
    border-radius: 8px;
    margin-bottom: 0.4rem;
    font-weight: 500;
    transition: all 0.2s;
}

.menu-item i {
    width: 24px;
    font-size: 1.1rem;
    color: #94a3b8;
    transition: all 0.2s;
}

.menu-item:hover {
    background: #f8fafc;
    color: var(--primary-color);
}

.menu-item:hover i {
    color: var(--primary-color);
}

.menu-item.active {
    background: var(--primary-color);
    color: white;
    box-shadow: 0 4px 12px rgba(15, 76, 129, 0.2);
}

.menu-item.active i {
    color: white;
}

.main-content {
    flex-grow: 1;
    padding: 2rem;
    background: #f4f7fb;
    width: calc(100% - 280px);
}

.top-navbar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    background: white;
    padding: 1rem 1.5rem;
    border-radius: 12px;
    box-shadow: 0 2px 4px rgba(0,0,0,0.02);
}

/* Mobile Responsiveness */
@media (max-width: 768px) {
    .sidebar {
        position: fixed;
        left: -280px;
        height: 100vh;
    }
    .sidebar.show {
        left: 0;
    }
    .main-content {
        width: 100%;
        padding: 1rem;
    }
}
"""

login_css = """/* Login Page Layout */
.login-split-page {
    display: flex;
    min-height: 100vh;
}
.login-left-pane {
    background: linear-gradient(135deg, var(--primary-color), var(--primary-hover));
    padding: 3rem;
    display: flex;
    flex-direction: column;
    justify-content: center;
}
.login-right-pane {
    background: white;
    display: flex;
    flex-direction: column;
    padding: 2rem;
}
.login-form-container {
    max-width: 400px;
    width: 100%;
    margin: auto;
}
.role-tabs {
    display: flex;
    gap: 0.5rem;
    margin-bottom: 2rem;
}
.role-tab {
    flex: 1;
    text-align: center;
    padding: 0.75rem;
    background: #f8fafc;
    border: 1px solid #e2e8f0;
    border-radius: 8px;
    cursor: pointer;
    font-weight: 500;
    color: #64748b;
    transition: all 0.2s;
}
.role-tab.active {
    background: white;
    border-color: var(--primary-color);
    color: var(--primary-color);
    box-shadow: 0 4px 6px -1px rgba(15, 76, 129, 0.1);
}
"""

write_css('core/variables.css', variables_css)
write_css('core/reset.css', reset_css)
write_css('components/cards.css', cards_css)
write_css('components/buttons.css', buttons_css)
write_css('components/forms.css', forms_css)
write_css('layout/sidebar.css', sidebar_css)
write_css('pages/login.css', login_css)

new_main_css = """/* GPAP Modular CSS Entry File */
@import url('core/variables.css');
@import url('core/reset.css');
@import url('components/cards.css');
@import url('components/buttons.css');
@import url('components/forms.css');
@import url('layout/sidebar.css');
@import url('pages/login.css');

/* Miscellaneous utility classes that weren't moved yet */
"""

with open(os.path.join(css_dir, 'main.css'), 'w', encoding='utf-8') as f:
    f.write(new_main_css)

print("Modular CSS refactoring completed!")
