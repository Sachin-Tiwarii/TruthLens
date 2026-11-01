import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import { useAuthStore } from './store/authStore'
import { DarkModeProvider } from './context/DarkModeContext'
import './styles/index.css'
import './styles/components.css'

// Verify any token saved from a previous visit before protected pages render.
useAuthStore.getState().checkSession()

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <DarkModeProvider>
        <App />
      </DarkModeProvider>
    </BrowserRouter>
  </React.StrictMode>,
)
