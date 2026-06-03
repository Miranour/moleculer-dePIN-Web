import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Server, 
  Activity, 
  ShieldAlert, 
  Wallet, 
  PieChart,
  LogOut
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

const navItems = [
  { path: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/admin/workers', label: 'Worker Yönetimi', icon: Server },
  { path: '/admin/queue', label: 'Kuyruk İzleme', icon: Activity },
  { path: '/admin/quarantine', label: 'Karantina', icon: ShieldAlert },
  { path: '/admin/payouts', label: 'Payout Yönetimi', icon: Wallet },
  { path: '/admin/ledger', label: 'Finansal Defter', icon: PieChart },
];

export function AdminLayout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const { logout } = useAuth(); // Varsayımsal auth hook'u, projede varsa kullanılır

  return (
    <div className="flex h-screen bg-zinc-950 text-zinc-100 overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 border-r border-zinc-800 bg-zinc-900 flex flex-col hidden md:flex">
        <div className="p-6 border-b border-zinc-800">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded bg-primary flex items-center justify-center font-bold text-white">
              dP
            </div>
            <span className="font-bold text-lg tracking-tight">dePIN Admin</span>
          </div>
        </div>
        
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname.startsWith(item.path);
            
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-md transition-colors ${
                  isActive 
                    ? 'bg-primary/10 text-primary font-medium' 
                    : 'text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800/50'
                }`}
              >
                <Icon className="w-5 h-5" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-zinc-800">
          <button 
            onClick={logout}
            className="flex items-center gap-3 px-3 py-2.5 w-full rounded-md text-zinc-400 hover:text-red-400 hover:bg-red-400/10 transition-colors"
          >
            <LogOut className="w-5 h-5" />
            Çıkış Yap
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Topbar (Mobile) */}
        <header className="h-16 border-b border-zinc-800 bg-zinc-900/50 flex items-center px-4 md:hidden">
          <span className="font-bold">dePIN Admin</span>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto bg-zinc-950">
          {children}
        </main>
      </div>
    </div>
  );
}
