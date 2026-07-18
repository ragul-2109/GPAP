import re
from bs4 import BeautifulSoup

def analyze():
    with open('d:/CVS/frontend/index.html', 'r', encoding='utf-8') as f:
        html = f.read()
    
    soup = BeautifulSoup(html, 'html.parser')
    
    print("Sections:")
    for section in soup.find_all('section'):
        print(f" - section id: {section.get('id', 'None')}")
        
    print("\nTabs:")
    for div in soup.find_all('div', id=lambda x: x and x.startswith('tab-')):
        print(f" - div id: {div.get('id')}")

if __name__ == '__main__':
    analyze()
