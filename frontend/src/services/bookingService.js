import { api, queryString } from './api'

export const bookingService = {
  create: (propertyId, details) => api(`/properties/${propertyId}/bookings`, { method: 'POST', body: JSON.stringify(details) }),
  studentList: (page = 0) => api(`/student/bookings?page=${page}`),
  ownerList: (page = 0) => api(`/owner/bookings?page=${page}`),
  adminList: (page = 0) => api(`/admin/bookings?${queryString({ page })}`),
  cancel: (id) => api(`/student/bookings/${id}/cancel`, { method: 'PATCH' }),
  setStatus: (id, status) => api(`/owner/bookings/${id}/status`, { method: 'PATCH', body: JSON.stringify({ status }) }),
}
