import { Outlet } from 'react-router-dom'
import Sidebar from '../components/Sidebar'
import './app.css'

/* Wraps every signed-in page: sidebar + scrolling content area. */
export default function AppLayout() {
  return (
    <div className="app-shell">
      <Sidebar />
      <main className="app-main">
        <div className="app-main-inner">
          <Outlet />
        </div>
      </main>
    </div>
  )
}