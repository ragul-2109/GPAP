import os
import re

js_dir = 'd:/CVS/frontend/assets/js'
with open(os.path.join(js_dir, 'app.js'), 'r', encoding='utf-8') as f:
    app_js = f.read()

# I will write a script to extract sections of app.js based on their comments
def extract_section(start_comment, end_comment=None):
    start_idx = app_js.find(start_comment)
    if start_idx == -1: return ""
    if end_comment:
        end_idx = app_js.find(end_comment, start_idx)
        if end_idx == -1: end_idx = len(app_js)
    else:
        # Find next double slash comment that starts at beginning of line
        match = re.search(r'^//\s+[A-Z]', app_js[start_idx+len(start_comment):], re.MULTILINE)
        if match:
            end_idx = start_idx + len(start_comment) + match.start()
        else:
            end_idx = len(app_js)
    return app_js[start_idx:end_idx].strip()

layout_js = extract_section('// Global Layout Logic')
router_js = extract_section('// Tab Routing Logic')
auth_js = extract_section('// Auth Logic')
dashboard_js = extract_section('// Dashboard Data Loading')
init_js = extract_section('// Initialization')
state_js = "const appState = {\n    selectedRole: null,\n    token: null,\n    user: null,\n    cheatingAlerts: 0\n};\n"

def write_js(filename, content):
    filepath = os.path.join(js_dir, 'modules', filename)
    os.makedirs(os.path.dirname(filepath), exist_ok=True)
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)

write_js('state.js', state_js)
write_js('layout.js', layout_js)
write_js('router.js', router_js)
write_js('auth.js', auth_js)
write_js('dashboard.js', dashboard_js)
write_js('init.js', init_js)

# Update index.html to load these scripts instead of app.js
index_path = 'd:/CVS/frontend/index.html'
with open(index_path, 'r', encoding='utf-8') as f:
    index_html = f.read()

scripts = """    <script src="/static/assets/js/modules/state.js?v=2"></script>
    <script src="/static/assets/js/modules/layout.js?v=2"></script>
    <script src="/static/assets/js/modules/router.js?v=2"></script>
    <script src="/static/assets/js/modules/auth.js?v=2"></script>
    <script src="/static/assets/js/modules/dashboard.js?v=2"></script>
    <script src="/static/assets/js/modules/init.js?v=2"></script>"""

index_html = re.sub(r'<script src="/static/assets/js/app\.js[^>]*></script>', scripts, index_html)

with open(index_path, 'w', encoding='utf-8') as f:
    f.write(index_html)

print("Modular JS refactoring completed!")
