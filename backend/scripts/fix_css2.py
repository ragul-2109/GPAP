import sys

with open('d:/CVS/frontend/assets/css/main.css', 'r') as f:
    lines = f.readlines()

cleaned_lines = lines[:211]

css = """
/* ==========================================================================
   SPLIT SCREEN LOGIN DESIGN (FROM MOCKUP)
   ========================================================================== */
.login-split-page {
    height: 100vh;
    display: flex;
    overflow: hidden;
    background-color: #ffffff;
}

/* Left Pane */
.login-left-pane {
    background: linear-gradient(180deg, #093077 0%, #061c47 100%);
    position: relative;
    padding: 3rem;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    overflow: hidden;
}

.login-left-pane::after {
    content: '';
    position: absolute;
    bottom: 0; left: 0; right: 0;
    height: 50%;
    background-image: url('https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070&auto=format&fit=crop');
    background-size: cover;
    background-position: center;
    opacity: 0.4;
    mix-blend-mode: luminosity;
    z-index: 1;
}

.left-pane-content {
    position: relative;
    z-index: 2;
    height: 100%;
    display: flex;
    flex-direction: column;
}

.login-logo {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 2rem;
}

.login-logo-icon {
    width: 48px;
    height: 48px;
    background: white;
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #093077;
    font-size: 1.5rem;
}

.login-hero-text h1 {
    font-size: 2.5rem;
    font-weight: 700;
    line-height: 1.2;
    margin-bottom: 1.5rem;
}

.login-hero-text p {
    font-size: 1.1rem;
    opacity: 0.9;
    max-width: 400px;
    line-height: 1.6;
}

/* Feature Cards */
.feature-cards-container {
    display: flex;
    gap: 15px;
    margin-top: auto;
    background: rgba(0,0,0,0.3);
    padding: 20px;
    border-radius: 16px;
    backdrop-filter: blur(10px);
}

.feature-card {
    flex: 1;
    text-align: center;
}

.feature-icon {
    width: 40px;
    height: 40px;
    background: rgba(255,255,255,0.1);
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto 10px;
    font-size: 1.2rem;
}

.feature-card h6 {
    font-size: 0.85rem;
    font-weight: 600;
    margin-bottom: 4px;
}

.feature-card p {
    font-size: 0.7rem;
    opacity: 0.7;
    margin: 0;
    line-height: 1.2;
}

/* Right Pane */
.login-right-pane {
    padding: 2rem 4rem;
    display: flex;
    flex-direction: column;
    overflow-y: auto;
}

.top-bar-login {
    display: flex;
    justify-content: flex-end;
    margin-bottom: 2rem;
}

.lang-select {
    padding: 6px 12px;
    border-radius: 20px;
    border: 1px solid #e2e8f0;
    background: white;
    font-size: 0.85rem;
    color: #475569;
    display: flex;
    align-items: center;
    gap: 8px;
}

.login-form-container {
    max-width: 500px;
    width: 100%;
    margin: 0 auto;
}

.login-form-container h2 {
    font-size: 2rem;
    font-weight: 700;
    color: #0f172a;
    margin-bottom: 8px;
}

.login-form-container > p {
    color: #64748b;
    margin-bottom: 2rem;
}

/* Role Tabs */
.role-tabs {
    display: flex;
    gap: 10px;
    margin-bottom: 2rem;
}

.role-tab {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 12px 5px;
    border: 1px solid #e2e8f0;
    border-radius: 12px;
    cursor: pointer;
    transition: all 0.2s;
    background: white;
    color: #64748b;
}

.role-tab:hover {
    border-color: #cbd5e1;
    background: #f8fafc;
}

.role-tab.active {
    border-color: #0d6efd;
    color: #0d6efd;
    background: #f0f7ff;
    box-shadow: 0 4px 12px rgba(13, 110, 253, 0.1);
}

.role-tab i {
    font-size: 1.2rem;
    margin-bottom: 6px;
}

.role-tab span {
    font-size: 0.8rem;
    font-weight: 600;
}

/* Form Elements */
.login-label {
    font-size: 0.85rem;
    font-weight: 600;
    color: #1e293b;
    margin-bottom: 8px;
    display: block;
}

.login-input-group {
    position: relative;
    margin-bottom: 1.5rem;
}

.login-input-group i.left-icon {
    position: absolute;
    left: 14px;
    top: 50%;
    transform: translateY(-50%);
    color: #94a3b8;
}

.login-input {
    width: 100%;
    padding: 12px 14px 12px 40px;
    border: 1px solid #cbd5e1;
    border-radius: 8px;
    font-size: 0.95rem;
    color: #1e293b;
    transition: border-color 0.2s;
}

.login-input:focus {
    outline: none;
    border-color: #0d6efd;
    box-shadow: 0 0 0 3px rgba(13, 110, 253, 0.1);
}

i.right-icon {
    position: absolute;
    right: 14px;
    top: 50%;
    transform: translateY(-50%);
    color: #94a3b8;
    cursor: pointer;
}

/* Auth Buttons */
.btn-login {
    width: 100%;
    padding: 12px;
    background: #0d6efd;
    color: white;
    border: none;
    border-radius: 8px;
    font-weight: 600;
    font-size: 1rem;
    margin-top: 1rem;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    transition: background 0.2s;
}

.btn-login:hover {
    background: #0b5ed7;
}

.divider {
    display: flex;
    align-items: center;
    text-align: center;
    margin: 1.5rem 0;
    color: #94a3b8;
    font-size: 0.85rem;
}
.divider::before, .divider::after {
    content: "";
    flex: 1;
    border-bottom: 1px solid #e2e8f0;
}
.divider:not(:empty)::before { margin-right: .5em; }
.divider:not(:empty)::after { margin-left: .5em; }

.social-btns {
    display: flex;
    gap: 1rem;
    margin-bottom: 2rem;
}

.btn-social {
    flex: 1;
    padding: 10px;
    border: 1px solid #e2e8f0;
    border-radius: 8px;
    background: white;
    font-weight: 600;
    font-size: 0.9rem;
    color: #475569;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    transition: background 0.2s;
}

.btn-social:hover {
    background: #f8fafc;
}

/* Footer info */
.login-footer-info {
    margin-top: auto;
    padding-top: 2rem;
    border-top: 1px solid #e2e8f0;
    display: flex;
    justify-content: space-between;
    font-size: 0.8rem;
    color: #64748b;
}

.footer-item {
    display: flex;
    align-items: center;
    gap: 8px;
}
"""

with open('d:/CVS/frontend/assets/css/main.css', 'w') as f:
    f.writelines(cleaned_lines)
    if not cleaned_lines[-1].endswith('\n'):
        f.write('\n')
    f.write(css)

