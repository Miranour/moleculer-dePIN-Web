import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Activity, Server, ShieldAlert, Wallet } from 'lucide-react';

export default function AdminDashboard() {
  return (
    <div className="p-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Sistem Genel Bakış</h1>
        <p className="text-zinc-400">Tüm ağın genel durumunu ve kritik metrikleri buradan izleyin.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-zinc-900 border-zinc-800">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-zinc-400">Aktif Worker</CardTitle>
            <Server className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">142</div>
            <p className="text-xs text-emerald-500 mt-1">+12 bu hafta</p>
          </CardContent>
        </Card>
        
        <Card className="bg-zinc-900 border-zinc-800">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-zinc-400">Kuyruktaki İşler</CardTitle>
            <Activity className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8,439</div>
            <p className="text-xs text-zinc-500 mt-1">Tahmini erime süresi: 4 saat</p>
          </CardContent>
        </Card>

        <Card className="bg-zinc-900 border-zinc-800">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-zinc-400">Karantina Bildirimleri</CardTitle>
            <ShieldAlert className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-500">3</div>
            <p className="text-xs text-zinc-500 mt-1">İnceleme bekliyor</p>
          </CardContent>
        </Card>

        <Card className="bg-zinc-900 border-zinc-800">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-zinc-400">Bekleyen Payout</CardTitle>
            <Wallet className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$4,250</div>
            <p className="text-xs text-zinc-500 mt-1">12 worker ödeme bekliyor</p>
          </CardContent>
        </Card>
      </div>
      
      {/* İleride buraya ağ haritası veya işlem hacmi grafikleri eklenebilir */}
      <div className="h-96 rounded-lg border border-zinc-800 bg-zinc-900/50 flex items-center justify-center text-zinc-500">
        Gerçek Zamanlı Ağ Grafiği Gelecek...
      </div>
    </div>
  );
}
