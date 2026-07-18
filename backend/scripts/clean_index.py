import re
with open('d:/CVS/frontend/index.html', 'r', encoding='utf-8') as f:
    html = f.read()

# We need to find <main class="main-content"> and its closing </main>
# and we will keep the top-navbar.
main_start = html.find('<main class="main-content">')
main_end = html.find('</main>', main_start)

main_content = html[main_start:main_end]
navbar_end = main_content.find('</div>\n', main_content.find('<div class="top-navbar')) + 7

new_main = main_content[:navbar_end] + '\n                <!-- Dynamic Content Area -->\n                <div id="content-area" class="tab-section active">\n                    <!-- Content will be injected here by app.js -->\n                </div>\n            '

html = html[:main_start] + new_main + html[main_end:]

with open('d:/CVS/frontend/index.html', 'w', encoding='utf-8') as f:
    f.write(html)

print('Successfully cleaned index.html')
