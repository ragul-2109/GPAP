import re

with open('d:/CVS/frontend/index.html', 'r', encoding='utf-8') as f:
    html = f.read()

tabs = re.findall(r'<div id=\"(tab-[^\"]+)\" class=\"tab-section', html)
print('Found tabs:', tabs)

sections = re.findall(r'<section id=\"([^\"]+)\" class=\"[^\"]*page', html)
print('Found sections:', sections)
