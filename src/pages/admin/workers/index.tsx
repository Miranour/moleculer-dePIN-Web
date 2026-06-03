import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Wifi, WifiOff, Cpu, Activity, Info } from 'lucide-react';

// İtibar Skoru Görsel Gösterge Mantığı
const getReputationBadge = (score: number) => {
  if (score >= 90) return <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/50">💎 Elmas ({score})</Badge>;
  if (score >= 70) return <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/50">🥇 Altın ({score})</Badge>;
  if (score >= 50) return <Badge className="bg-zinc-400/20 text-zinc-300 border-zinc-400/50">🥈 Gümüş ({score})</Badge>;
  if (score >= 0) return <Badge className="bg-orange-500/20 text-orange-400 border-orange-500/50">🥉 Bronz ({score})</Badge>;
  return <Badge className="bg-red-500/20 text-red-400 border-red-500/50">🚫 Kara Liste ({score})</Badge>;
};

// Mock Data
const mockWorkers = [
  { id: 'W-9842A', hardware: 'NVIDIA RTX 4090', ping: 24, score: 95, status: 'online', uptime: '14 gün' },
  { id: 'W-1049B', hardware: 'NVIDIA RTX 3080', ping: 45, score: 82, status: 'online', uptime: '5 gün' },
  { id: 'W-5532C', hardware: 'NVIDIA RTX 3060', ping: 120, score: 65, status: 'online', uptime: '1 gün' },
  { id: 'W-9911D', hardware: 'AMD RX 7900 XTX', ping: 0, score: 12, status: 'offline', uptime: '0 gün' },
  { id: 'W-7723E', hardware: 'NVIDIA RTX 4080', ping: 0, score: -15, status: 'banned', uptime: '0 gün' },
];

export default function AdminWorkers() {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredWorkers = mockWorkers.filter(w => 
    w.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    w.hardware.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-8 space-y-8 text-zinc-100">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Worker Yönetimi</h1>
          <p className="text-zinc-400">Ağa bağlı hesaplama düğümlerini ve itibar skorlarını izleyin.</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="px-3 py-1.5 border-emerald-500/30 bg-emerald-500/10 text-emerald-400">
            <Wifi className="w-4 h-4 mr-2" />
            142 Aktif
          </Badge>
          <Badge variant="outline" className="px-3 py-1.5 border-red-500/30 bg-red-500/10 text-red-400">
            <WifiOff className="w-4 h-4 mr-2" />
            18 Koptu
          </Badge>
        </div>
      </div>

      {/* İtibar Skoru Bilgilendirmesi */}
      <Card className="bg-zinc-900 border-zinc-800 border-l-4 border-l-primary">
        <CardContent className="p-4 flex gap-4 items-start">
          <Info className="w-6 h-6 text-primary shrink-0 mt-0.5" />
          <div className="space-y-1">
            <h3 className="font-medium">İtibar Skoru Formülü</h3>
            <p className="text-sm text-zinc-400">
              <code className="bg-zinc-950 px-1 py-0.5 rounded text-zinc-300">Reputation = (Başarılı İş / Toplam İş) × 100 - (Spot Check Hata × 25) - (Termal Hata × 5) + (Uptime Gün × 0.1)</code>
            </p>
            <p className="text-xs text-zinc-500 mt-2">
              Negatif skora düşen worker'lar otomatik olarak ağdan dışlanır (Kara Liste). Yüksek skorlu (Elmas/Altın) worker'lara kritik simülasyonlar öncelikli atanır.
            </p>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-zinc-900 border-zinc-800">
        <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <CardTitle className="text-lg">Düğüm Listesi</CardTitle>
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
            <Input 
              placeholder="ID veya Donanım Ara..." 
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="pl-9 bg-zinc-950 border-zinc-800"
            />
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-zinc-400 uppercase bg-zinc-950/50">
                <tr>
                  <th className="px-6 py-4">Durum</th>
                  <th className="px-6 py-4">Worker ID</th>
                  <th className="px-6 py-4">Donanım</th>
                  <th className="px-6 py-4">Ping</th>
                  <th className="px-6 py-4">Uptime</th>
                  <th className="px-6 py-4">İtibar Skoru</th>
                  <th className="px-6 py-4 text-right">İşlemler</th>
                </tr>
              </thead>
              <tbody>
                {filteredWorkers.length === 0 ? (
                  <tr><td colSpan={7} className="text-center py-8 text-zinc-500">Worker bulunamadı.</td></tr>
                ) : (
                  filteredWorkers.map((worker) => (
                    <tr key={worker.id} className="border-b border-zinc-800/50 hover:bg-zinc-800/20 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <div className={`w-2.5 h-2.5 rounded-full mr-2 ${
                            worker.status === 'online' ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]' : 
                            worker.status === 'banned' ? 'bg-red-500' : 'bg-zinc-600'
                          }`}></div>
                          <span className="capitalize text-zinc-400">{worker.status}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 font-mono font-medium">{worker.id}</td>
                      <td className="px-6 py-4 flex items-center gap-2">
                        <Cpu className="w-4 h-4 text-zinc-500" />
                        {worker.hardware}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1.5">
                          <Activity className={`w-4 h-4 ${worker.ping > 0 && worker.ping < 50 ? 'text-emerald-500' : worker.ping >= 50 ? 'text-yellow-500' : 'text-zinc-600'}`} />
                          <span className="font-mono">{worker.ping > 0 ? `${worker.ping}ms` : '-'}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-zinc-400">{worker.uptime}</td>
                      <td className="px-6 py-4">
                        {getReputationBadge(worker.score)}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <Button variant="ghost" size="sm" className="text-zinc-300 hover:text-white">Detay</Button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
