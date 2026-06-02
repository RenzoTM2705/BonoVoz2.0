const API_BASE = import.meta.env.VITE_API_URL || ''

export async function adminLogin(email: string, password: string) {
  const res = await fetch(`${API_BASE}/api/auth/admin/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  })

  if (!res.ok) {
    const text = await res.text().catch(() => '')
    throw new Error(text || 'Login failed')
  }

  const data = await res.json()
  if (data.token) {
    localStorage.setItem('admin_token', data.token)
    localStorage.setItem('adminAuthenticated', 'true')
  }
  return data
}

export function logout() {
  localStorage.removeItem('admin_token')
  localStorage.removeItem('adminAuthenticated')
}

export function getToken() {
  return localStorage.getItem('admin_token')
}

export function hasAdminToken() {
  return Boolean(localStorage.getItem('admin_token'))
}

export function isAdminAuthenticated() {
  return hasAdminToken() && localStorage.getItem('adminAuthenticated') === 'true'
}
