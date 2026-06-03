import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { ProtectedRoute } from './components/ProtectedRoute'
import { AdminLayout } from './components/layouts/AdminLayout'
import { lazy, Suspense } from 'react'

const Login = lazy(() => import('./pages/auth/Login'))
const Register = lazy(() => import('./pages/auth/Register'))
const Lab = lazy(() => import('./pages/Lab'))
const Dashboard = lazy(() => import('./pages/dashboard'))
const Wallet = lazy(() => import('./pages/wallet'))
const AdminDashboard = lazy(() => import('./pages/admin/dashboard'))
const AdminWorkers = lazy(() => import('./pages/admin/workers'))
const AdminQueue = lazy(() => import('./pages/admin/queue'))
const AdminQuarantine = lazy(() => import('./pages/admin/quarantine'))
const AdminPayouts = lazy(() => import('./pages/admin/payouts'))
const AdminLedger = lazy(() => import('./pages/admin/ledger'))
import './App.css'

function App() {
  return (
    <Router>
      <Suspense fallback={<div className="h-screen w-screen flex items-center justify-center bg-zinc-950 text-emerald-500">Yükleniyor...</div>}>
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
                <Suspense fallback={<div className="h-full w-full flex items-center justify-center text-emerald-500">Panel Yükleniyor...</div>}>
                  <Routes>
                    <Route path="/" element={<Navigate to="dashboard" replace />} />
                    <Route path="dashboard" element={<AdminDashboard />} />
                    <Route path="workers" element={<AdminWorkers />} />
                    <Route path="queue" element={<AdminQueue />} />
                    <Route path="quarantine" element={<AdminQuarantine />} />
                    <Route path="payouts" element={<AdminPayouts />} />
                    <Route path="ledger" element={<AdminLedger />} />
                  </Routes>
                </Suspense>
              </AdminLayout>
            } />
          </Route>
        </Routes>
      </Suspense>
    </Router>
  )
}

export default App
