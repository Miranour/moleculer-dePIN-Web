import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';
import { Activity, Clock, Play, Server, ArrowRightLeft } from 'lucide-react';

// Mock Zaman Serisi Verisi (RabbitMQ/Kafka Yükü)
const generateMockTimeSeries = () => {
  const data = [];
  const now = new Date();
  for (let i = 24; i >= 0; i--) {
    const time = new Date(now.getTime() - i * 5 * 60000);
    data.push({
      time: time.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' }),
      bekleyen_is: Math.floor(Math.random() * 500) + 100,
      islenen_is: Math.floor(Math.random() * 200) + 50,
    });
  }
  return data;
};

// Mock Bekleyen Kritik İşler
const mockPendingJobs = [
  { id: 'JOB-994A', type: 'Docking', molecule: 'Imatinib Analog', priority: 'High', waitTime: '4m 12s', status: 'queued' },
  { id: 'JOB-995B', type: 'MD Sim', molecule: 'SARS-CoV-2 Mpro', priority: 'Critical', waitTime: '8m 45s', status: 'queued' },
  { id: 'JOB-996C', type: 'Docking', molecule: 'Aspirin', priority: 'Normal', waitTime: '1m 20s', status: 'queued' },
];

export default function AdminQueue() {
  const [data, setData] = useState(generateMockTimeSeries());
  const [pendingJobs, setPendingJobs] = useState(mockPendingJobs);

  // SSE Simülasyonu (Ağ Anlık Durumu)
  useEffect(() => {
    const interval = setInterval(() => {
      setData(prev => {
        const newData = [...prev.slice(1)];
        newData.push({
          time: new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' }),
          bekleyen_is: Math.floor(Math.random() * 500) + 100,
          islenen_is: Math.floor(Math.random() * 200) + 50,
        });
        return newData;
      });
    }, 5000); // Her 5 saniyede bir güncelle
    return () => clearInterval(interval);
  }, []);

  const handleRouteJob = (jobId: string) => {
    // "İşi Yönlendir" özelliği: İşi elit havuzuna yönlendirme simülasyonu
    setPendingJobs(prev => prev.map(job => 
      job.id === jobId ? { ...job, status: 'routing' } : job
    ));
    
    setTimeout(() => {
      setPendingJobs(prev => prev.filter(job => job.id !== jobId));
      alert(`${jobId} başarıyla Elmas/Altın havuzuna yönlendirildi!`);
    }, 1500);
  };

  return (
    <div className="p-8 space-y-8 text-zinc-100">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Kuyruk İzleme</h1>
          <p className="text-zinc-400">RabbitMQ / Kafka anlık yükünü izleyin ve kritik işleri yönetin.</p>
        </div>
        <div className="flex items-center gap-4">
          <Badge variant="outline" className="px-3 py-1.5 border-blue-500/30 bg-blue-500/10 text-blue-400">
            <Activity className="w-4 h-4 mr-2 animate-pulse" />
            Canlı Akış (SSE) Aktif
          </Badge>
        </div>
      </div>

      {/* Üst Metrikler */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="bg-zinc-900 border-zinc-800">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-zinc-400">Anlık Bekleyen İş</CardTitle>
            <Clock className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{data[data.length - 1].bekleyen_is}</div>
            <p className="text-xs text-orange-500 mt-1">Son 5 dk içinde +%12</p>
          </CardContent>
        </Card>
        
        <Card className="bg-zinc-900 border-zinc-800">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-zinc-400">Erime Hızı (İş/dk)</CardTitle>
            <Play className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">124</div>
            <p className="text-xs text-emerald-500 mt-1">Optimum hızda ilerliyor</p>
          </CardContent>
        </Card>

        <Card className="bg-zinc-900 border-zinc-800">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-zinc-400">Ortalama Bekleme</CardTitle>
            <Server className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">2m 14s</div>
            <p className="text-xs text-zinc-500 mt-1">Hedef: &lt; 5m</p>
          </CardContent>
        </Card>
      </div>

      {/* Grafikler */}
      <Card className="bg-zinc-900 border-zinc-800">
        <CardHeader>
          <CardTitle>Canlı İş Kuyruğu Yükü</CardTitle>
          <CardDescription>Son 2 saat içindeki bekleyen ve işlenen simülasyon paketleri</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorBekleyen" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f97316" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#f97316" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorIslenen" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
                <XAxis dataKey="time" stroke="#71717a" fontSize={12} tickMargin={10} />
                <YAxis stroke="#71717a" fontSize={12} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#18181b', borderColor: '#27272a', color: '#f4f4f5' }}
                  itemStyle={{ color: '#f4f4f5' }}
                />
                <Area type="monotone" dataKey="bekleyen_is" name="Bekleyen İş" stroke="#f97316" fillOpacity={1} fill="url(#colorBekleyen)" strokeWidth={2} />
                <Area type="monotone" dataKey="islenen_is" name="İşlenen" stroke="#10b981" fillOpacity={1} fill="url(#colorIslenen)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Bekleyen İşler ve Manuel Yönlendirme */}
      <Card className="bg-zinc-900 border-zinc-800">
        <CardHeader>
          <CardTitle>Kritik Bekleyen İşler (Manuel Yönlendirme)</CardTitle>
          <CardDescription>Süresi aşılmış veya kritik öneme sahip işleri yüksek itibarlı (Elmas/Altın) worker havuzuna yönlendirin.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-zinc-400 uppercase bg-zinc-950/50">
                <tr>
                  <th className="px-6 py-4 rounded-tl-lg">İş ID</th>
                  <th className="px-6 py-4">Tip</th>
                  <th className="px-6 py-4">Molekül</th>
                  <th className="px-6 py-4">Öncelik</th>
                  <th className="px-6 py-4">Bekleme Süresi</th>
                  <th className="px-6 py-4 text-right rounded-tr-lg">Aksiyon</th>
                </tr>
              </thead>
              <tbody>
                {pendingJobs.length === 0 ? (
                  <tr><td colSpan={6} className="text-center py-8 text-zinc-500">Şu an manuel yönlendirme gerektiren kritik iş yok.</td></tr>
                ) : (
                  pendingJobs.map((job) => (
                    <tr key={job.id} className="border-b border-zinc-800/50 hover:bg-zinc-800/20 transition-colors">
                      <td className="px-6 py-4 font-mono text-zinc-300">{job.id}</td>
                      <td className="px-6 py-4 font-medium">{job.type}</td>
                      <td className="px-6 py-4">{job.molecule}</td>
                      <td className="px-6 py-4">
                        <Badge variant="outline" className={
                          job.priority === 'Critical' ? 'border-red-500/50 text-red-400' :
                          job.priority === 'High' ? 'border-orange-500/50 text-orange-400' :
                          'border-zinc-500/50 text-zinc-400'
                        }>{job.priority}</Badge>
                      </td>
                      <td className="px-6 py-4 text-zinc-400">{job.waitTime}</td>
                      <td className="px-6 py-4 text-right">
                        <Button 
                          size="sm" 
                          variant="secondary"
                          className="bg-primary/20 hover:bg-primary/30 text-primary border border-primary/50"
                          onClick={() => handleRouteJob(job.id)}
                          disabled={job.status === 'routing'}
                        >
                          {job.status === 'routing' ? 'Yönlendiriliyor...' : (
                            <span className="flex items-center gap-2">
                              Elit Havuza İt <ArrowRightLeft className="w-3 h-3" />
                            </span>
                          )}
                        </Button>
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
