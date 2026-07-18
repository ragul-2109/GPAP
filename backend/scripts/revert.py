import os

dir_path = 'd:/CVS/frontend/pages/student'
for filename in os.listdir(dir_path):
    if not filename.endswith('.html'): continue
    filepath = os.path.join(dir_path, filename)
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    content = content.replace('glass-panel', 'lux-card')
    content = content.replace('text-white', 'text-dark')
    content = content.replace('text-secondary', 'text-muted')
    content = content.replace('bg-transparent', 'bg-white')
    content = content.replace('border-secondary', 'border-light')
    
    # Also fix any special cases I injected into dashboard.html
    if filename == 'dashboard.html':
        content = content.replace('style="background: linear-gradient(135deg, var(--primary-color), var(--secondary-color)); -webkit-background-clip: text; -webkit-text-fill-color: transparent; font-weight: 700;"', '')
        content = content.replace('text-secondary mt-1', 'text-muted mt-1')
        content = content.replace('border-bottom border-secondary pb-3 mb-4" style="border-color: rgba(255,255,255,0.1) !important;"', 'border-bottom pb-2 mb-4"')
    
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)
    
print('Reverted student pages to lux-card')
