import urllib.request
import json
req = urllib.request.Request("http://localhost:8000/api/auth/login", data=b'{"email":"student@gmail.com","password":"student123","college_code":"EXCEL"}', headers={"Content-Type": "application/json"})
try:
    print(urllib.request.urlopen(req).read().decode())
except Exception as e:
    print(e)
    if hasattr(e, 'read'):
        print(e.read().decode())
