import { Routes, Route, Navigate } from 'react-router-dom'

import MainLayout from './layouts/MainLayout'
import DashboardLayout from './layouts/DashboardLayout'

import Home from './pages/Home'
import About from './pages/About'
import Login from './pages/Login'
import Register from './pages/Register'

import Dashboard from './pages/Dashboard'
import Analyze from './pages/Analyze'
import Results from './pages/Results'
import History from './pages/History'
import Report from './pages/Report'

export default function App() {
  return (
    <Routes>

      {/* Public website layout */}
      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Route>

      {/* Dashboard workspace layout */}
      <Route element={<DashboardLayout />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/analyze" element={<Analyze />} />
        <Route path="/results/:id" element={<Results />} />
        <Route path="/history" element={<History />} />
        <Route path="/report/:id" element={<Report />} />
      </Route>

      {/* Invalid routes */}
      <Route path="*" element={<Navigate to="/" replace />} />

    </Routes>
  )
}