import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import './App.css'

// Placeholder Pages
const Dashboard = () => <div className="p-8"><h1>Dashboard</h1></div>
const Wallet = () => <div className="p-8"><h1>Wallet</h1></div>
const Lab = () => <div className="p-8"><h1>Molecular Lab</h1></div>
const Login = () => <div className="p-8"><h1>Login</h1></div>
const AdminLayout = ({ children }: { children: React.ReactNode }) => <div className="admin-layout">{children}</div>
const AdminDashboard = () => <div>Admin Dashboard</div>

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        
        {/* Auth Routes */}
        <Route path="/login" element={<Login />} />
        
        {/* Researcher Routes */}
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/wallet" element={<Wallet />} />
        <Route path="/lab" element={<Lab />} />

        {/* Admin Routes */}
        <Route path="/admin/*" element={
          <AdminLayout>
            <Routes>
              <Route path="/" element={<Navigate to="dashboard" replace />} />
              <Route path="dashboard" element={<AdminDashboard />} />
            </Routes>
          </AdminLayout>
        } />
      </Routes>
    </Router>
  )
}

export default App
