import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { ProtectedRoute } from './components/ProtectedRoute'
import Login from './pages/auth/Login'
import Register from './pages/auth/Register'
import Lab from './pages/Lab'
import Dashboard from './pages/dashboard'
import Wallet from './pages/wallet'
import './App.css'

// Placeholder Pages
const AdminLayout = ({ children }: { children: React.ReactNode }) => <div className="admin-layout text-white">{children}</div>
const AdminDashboard = () => <div>Admin Dashboard</div>

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        
        {/* Auth Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        {/* Researcher Routes */}
        <Route element={<ProtectedRoute allowedRoles={['researcher']} />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/wallet" element={<Wallet />} />
          <Route path="/lab" element={<Lab />} />
        </Route>

        {/* Admin Routes */}
        <Route path="/admin" element={<ProtectedRoute allowedRoles={['admin']} />}>
          <Route path="" element={
            <AdminLayout>
              <Routes>
                <Route path="/" element={<Navigate to="dashboard" replace />} />
                <Route path="dashboard" element={<AdminDashboard />} />
              </Routes>
            </AdminLayout>
          } />
        </Route>
      </Routes>
    </Router>
  )
}

export default App
