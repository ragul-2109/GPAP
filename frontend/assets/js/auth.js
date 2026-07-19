window.gpapAuth = (function () {
  const API_BASE = '/api/auth';

  async function login(payload) {
    try {
      const response = await fetch(`${API_BASE}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await response.json();
      if (!response.ok) {
        alert(data.detail || 'Login failed');
        return { ok: false };
      }
      localStorage.setItem('gpap_access_token', data.access_token);
      localStorage.setItem('gpap_refresh_token', data.refresh_token);
      localStorage.setItem('gpap_role', data.role);
      return { ok: true, data };
    } catch (error) {
      console.error(error);
      alert('Unable to reach the backend');
      return { ok: false };
    }
  }

  function getToken() {
    return localStorage.getItem('gpap_access_token');
  }

  async function getProfile() {
    const token = getToken();
    if (!token) return null;
    const response = await fetch(`${API_BASE}/me`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!response.ok) return null;
    return response.json();
  }

  return { login, getToken, getProfile };
})();
