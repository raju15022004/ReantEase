import { api } from './api'

export const favoriteService = {
  list: () => api('/student/favorites'),
  add: (propertyId) => api(`/student/favorites/${propertyId}`, { method: 'POST' }),
  remove: (propertyId) => api(`/student/favorites/${propertyId}`, { method: 'DELETE' }),
}
