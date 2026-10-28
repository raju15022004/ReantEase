import { Outlet } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

export default function MainLayout() {
  return <div className="min-h-screen"><Navbar /><main className="min-h-[60vh]"><Outlet /></main><Footer /></div>
}
