import { api, queryString } from './api'

export const adminService = {
  dashboard: () => api('/admin/dashboard'),
  users: (filters = {}) => api(`/admin/users?${queryString(filters)}`),
  setUserStatus: (id, enabled) => api(`/admin/users/${id}/status`, { method: 'PATCH', body: JSON.stringify({ enabled }) }),
  reports: (filters = {}) => api(`/admin/reports?${queryString(filters)}`),
  updateReport: (id, status) => api(`/admin/reports/${id}`, { method: 'PATCH', body: JSON.stringify({ status }) }),
}
