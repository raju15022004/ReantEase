import { api, queryString } from './api'

export const propertyService = {
  search: (filters) => api(`/properties?${queryString(filters)}`),
  featured: () => api('/properties/featured'),
  get: (id) => api(`/properties/${id}`),
  create: (details) => api('/owner/properties', { method: 'POST', body: JSON.stringify(details) }),
  update: (id, details) => api(`/owner/properties/${id}`, { method: 'PUT', body: JSON.stringify(details) }),
  owned: (id) => api(`/owner/properties/${id}`),
  mine: (page = 0) => api(`/owner/properties?page=${page}`),
  availability: (id, data) => api(`/owner/properties/${id}/availability`, { method: 'PATCH', body: JSON.stringify(data) }),
  remove: (id) => api(`/owner/properties/${id}`, { method: 'DELETE' }),
  adminList: (filters = {}) => api(`/admin/properties?${queryString(filters)}`),
  approve: (id, status) => api(`/admin/properties/${id}/approval`, { method: 'PATCH', body: JSON.stringify({ status }) }),
  report: (id, details) => api(`/student/reports/${id}`, { method: 'POST', body: JSON.stringify(details) }),
}
