import api from './api'

// The backend uses OAuth2 password flow, which expects form-encoded fields.
const form = (fields) => {
  const params = new URLSearchParams()
  Object.entries(fields).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') params.append(key, value)
  })
  return params
}

export const authService = {
  login: (email, password) => api.post('/token', form({ username: email, password })),
  register: ({ name, email, password }) =>
    api.post('/register', form({ username: email, password, full_name: name })),
  me: () => api.get('/users/me'),
}
