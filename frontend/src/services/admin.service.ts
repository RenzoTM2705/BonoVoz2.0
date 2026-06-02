import { getToken } from './auth.service'

const API_BASE = import.meta.env.VITE_API_URL || ''

export async function fetchAdminMetrics() {
  const token = getToken()
  const res = await fetch(`${API_BASE}/api/admin/metrics`, {
    headers: {
      Authorization: token ? `Bearer ${token}` : '',
    },
  })

  if (!res.ok) {
    const body = await res.text().catch(() => '')
    throw new Error(body || 'Failed to fetch metrics')
  }

  return res.json()
}
