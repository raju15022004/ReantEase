import { Navigate, Route, Routes } from 'react-router-dom'
import MainLayout from './layouts/MainLayout'
import ProtectedRoute from './components/ProtectedRoute'
import RoleGuard from './components/RoleGuard'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import PropertyList from './pages/PropertyList'
import PropertyDetails from './pages/PropertyDetails'
import Favorites from './pages/Favorites'
import MyBookings from './pages/MyBookings'
import OwnerDashboard from './pages/OwnerDashboard'
import OwnerProperties from './pages/OwnerProperties'
import OwnerBookings from './pages/OwnerBookings'
import AddProperty from './pages/AddProperty'
import EditProperty from './pages/EditProperty'
import AdminDashboard from './pages/AdminDashboard'
import AdminUsers from './pages/AdminUsers'
import AdminProperties from './pages/AdminProperties'
import AdminBookings from './pages/AdminBookings'
import AdminReports from './pages/AdminReports'
import StudentDashboard from './pages/StudentDashboard'
import Profile from './pages/Profile'
import About from './pages/About'
import Contact from './pages/Contact'
import NotFound from './pages/NotFound'
import Unauthorized from './pages/Unauthorized'

export default function App() {
  return <Routes>
    <Route path="/" element={<MainLayout />}>
      <Route index element={<Home />} />
      <Route path="properties" element={<PropertyList />} />
      <Route path="properties/:id" element={<PropertyDetails />} />
      <Route path="login" element={<Login />} />
      <Route path="register" element={<Register />} />
      <Route path="about" element={<About />} />
      <Route path="contact" element={<Contact />} />
      <Route path="unauthorized" element={<Unauthorized />} />
      <Route element={<ProtectedRoute />}>
        <Route element={<RoleGuard roles={['STUDENT']} />}>
          <Route path="student/dashboard" element={<StudentDashboard />} />
          <Route path="student/bookings" element={<MyBookings />} />
          <Route path="student/favorites" element={<Favorites />} />
          <Route path="student/profile" element={<Profile />} />
        </Route>
        <Route element={<RoleGuard roles={['OWNER']} />}>
          <Route path="owner/dashboard" element={<OwnerDashboard />} />
          <Route path="owner/properties" element={<OwnerProperties />} />
          <Route path="owner/properties/new" element={<AddProperty />} />
          <Route path="owner/properties/:id/edit" element={<EditProperty />} />
          <Route path="owner/bookings" element={<OwnerBookings />} />
          <Route path="owner/profile" element={<Profile />} />
        </Route>
        <Route element={<RoleGuard roles={['ADMIN']} />}>
          <Route path="admin/dashboard" element={<AdminDashboard />} />
          <Route path="admin/users" element={<AdminUsers />} />
          <Route path="admin/properties" element={<AdminProperties />} />
          <Route path="admin/bookings" element={<AdminBookings />} />
          <Route path="admin/reports" element={<AdminReports />} />
        </Route>
      </Route>
      <Route path="*" element={<NotFound />} />
    </Route>
    <Route path="*" element={<Navigate to="/404" replace />} />
  </Routes>
}
