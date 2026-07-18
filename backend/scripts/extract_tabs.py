import os
import re

def extract_tabs(html_file, base_dir):
    with open(html_file, 'r', encoding='utf-8') as f:
        html = f.read()

    # Find all tabs
    # We will use regex to find <div id="tab-..." class="tab-section..."> 
    # and then carefully extract the content until the matching closing div.
    
    # First, let's find the start indices
    pattern = re.compile(r'<div\s+id="tab-([^"]+)"\s+class="tab-section[^"]*">')
    matches = list(pattern.finditer(html))
    
    for i, match in enumerate(matches):
        tab_id = match.group(1)
        start_idx = match.end() # Content starts here
        
        # We need to find the matching closing </div>
        # To do this, we count open and close divs
        div_count = 1
        pos = start_idx
        
        while div_count > 0 and pos < len(html):
            next_open = html.find('<div', pos)
            next_close = html.find('</div>', pos)
            
            if next_close == -1:
                break # Malformed HTML
                
            if next_open != -1 and next_open < next_close:
                div_count += 1
                pos = next_open + 4
            else:
                div_count -= 1
                pos = next_close + 6
                
        end_idx = pos - 6 # The start of the matching closing </div>
        
        content = html[start_idx:end_idx].strip()
        
        # Now map tab_id to file path
        # tab_id formats:
        # dashboard -> student/dashboard.html
        # profile -> student/profile.html
        # mcq -> student/mcq_practice.html
        # coding -> student/coding_practice.html
        # results -> student/results.html
        # resume -> student/resume.html
        # staff-dashboard -> staff/dashboard.html
        # college-dashboard -> college_admin/dashboard.html
        # super-dashboard -> super_admin/dashboard.html
        # ...
        
        role = "student"
        page = tab_id
        
        if tab_id.startswith("staff-"):
            role = "staff"
            page = tab_id[6:]
        elif tab_id.startswith("college-"):
            role = "college_admin"
            page = tab_id[8:]
        elif tab_id.startswith("super-"):
            role = "super_admin"
            page = tab_id[6:]
        else:
            role = "student"
            if page == "mcq": page = "mcq_practice"
            if page == "coding": page = "coding_practice"
            if page == "live": page = "live_test"
            if page == "study": page = "study_materials"
        
        # ensure dir exists
        out_dir = os.path.join(base_dir, role)
        os.makedirs(out_dir, exist_ok=True)
        
        out_file = os.path.join(out_dir, f"{page}.html")
        
        print(f"Extracting tab-{tab_id} to {out_file}")
        with open(out_file, 'w', encoding='utf-8') as out_f:
            out_f.write(content)

if __name__ == "__main__":
    extract_tabs('d:/CVS/frontend/index.html', 'd:/CVS/frontend/pages')
