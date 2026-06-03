import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ShieldAlert, CheckCircle, XCircle, Search, Eye } from 'lucide-react';
import { Input } from '@/components/ui/input';

const mockQuarantinedWorkers = [
  { id: 'W-9911D', reason: 'Termal Hata / Aşırı Isınma Belirtisi', hw: 'RTX 4090', date: '2026-06-02 14:30', threat: 'Medium' },
  { id: 'W-7723E', reason: 'Spot Check Başarısızlığı (Sürekli Hatalı Çıktı)', hw: 'RTX 3080', date: '2026-06-03 09:15', threat: 'High' },
  { id: 'W-1122F', reason: 'Donanım Gücü Hile Şüphesi (Orantısız İş Hızı)', hw: 'RTX 3060', date: '2026-06-03 11:45', threat: 'Critical' },
];

export default function AdminQuarantine() {
  const [searchTerm, setSearchTerm] = useState('');
  const [workers, setWorkers] = useState(mockQuarantinedWorkers);
  const [selectedJob, setSelectedJob] = useState<any>(null);

  const filtered = workers.filter(w => w.id.toLowerCase().includes(searchTerm.toLowerCase()));

  const handleSendToValidator = (id: string) => {
    // Audit log (Task 8.5 simülasyonu)
    console.log(`[AUDIT LOG] Worker ${id} Validator ağına incelenmek üzere gönderildi.`);
    alert(`${id} kodlu cihaz P2P Validator ağına zorunlu denetime gönderildi.`);
  };

  const handleBan = (id: string) => {
    console.log(`[AUDIT LOG] Worker ${id} ağdan kalıcı uzaklaştırıldı.`);
    setWorkers(prev => prev.filter(w => w.id !== id));
  };

  const handleRelease = (id: string) => {
    console.log(`[AUDIT LOG] Worker ${id} karantinadan çıkarıldı.`);
    setWorkers(prev => prev.filter(w => w.id !== id));
  };

  return (
    <div className="p-8 space-y-8 text-zinc-100">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-red-500">Karantina & Anti-Fraud</h1>
          <p className="text-zinc-400">Şüpheli işlemleri ve hile denemelerini denetleyin.</p>
        </div>
      </div>

      <Card className="bg-zinc-900 border-zinc-800">
        <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <CardTitle>Karantinaya Alınan Cihazlar</CardTitle>
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
            <Input 
              placeholder="Worker ID Ara..." 
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
                  <th className="px-6 py-4">Tehlike Seviyesi</th>
                  <th className="px-6 py-4">Worker ID</th>
                  <th className="px-6 py-4">Donanım</th>
                  <th className="px-6 py-4">Karantina Sebebi</th>
                  <th className="px-6 py-4">Tarih</th>
                  <th className="px-6 py-4 text-right">Aksiyonlar</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr><td colSpan={6} className="text-center py-8 text-zinc-500">Karantinada aktif kayıt bulunmuyor.</td></tr>
                ) : (
                  filtered.map((w) => (
                    <tr key={w.id} className="border-b border-zinc-800/50 hover:bg-zinc-800/20 transition-colors">
                      <td className="px-6 py-4">
                        <Badge variant="outline" className={
                          w.threat === 'Critical' ? 'border-red-500/50 text-red-400 bg-red-500/10' :
                          w.threat === 'High' ? 'border-orange-500/50 text-orange-400 bg-orange-500/10' :
                          'border-yellow-500/50 text-yellow-400 bg-yellow-500/10'
                        }>{w.threat}</Badge>
                      </td>
                      <td className="px-6 py-4 font-mono">{w.id}</td>
                      <td className="px-6 py-4">{w.hw}</td>
                      <td className="px-6 py-4">{w.reason}</td>
                      <td className="px-6 py-4 text-zinc-400">{w.date}</td>
                      <td className="px-6 py-4 text-right flex justify-end gap-2">
                        <Button size="sm" variant="outline" onClick={() => setSelectedJob(w)} className="border-zinc-700 hover:bg-zinc-800">
                          <Eye className="w-4 h-4 mr-1" /> İncele
                        </Button>
                        <Button size="sm" className="bg-blue-600 hover:bg-blue-500" onClick={() => handleSendToValidator(w.id)}>
                          <ShieldAlert className="w-4 h-4 mr-1" /> Validator
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

      {/* Şüpheli İş Detay Modalı (Task 8.2) */}
      {selectedJob && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <Card className="w-full max-w-lg bg-zinc-900 border-zinc-800">
            <CardHeader className="border-b border-zinc-800">
              <CardTitle>Şüpheli İş Detayı</CardTitle>
              <CardDescription>{selectedJob.id} kodlu cihaz inceleniyor</CardDescription>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div className="space-y-2 text-sm">
                <div className="flex justify-between"><span className="text-zinc-500">Karantina Sebebi:</span> <span>{selectedJob.reason}</span></div>
                <div className="flex justify-between"><span className="text-zinc-500">Beyan Edilen Donanım:</span> <span>{selectedJob.hw}</span></div>
                <div className="flex justify-between"><span className="text-zinc-500">Beklenen İş Süresi:</span> <span>~45 dakika</span></div>
                <div className="flex justify-between"><span className="text-zinc-500">Gerçekleşen İş Süresi:</span> <span className="text-red-400 font-bold">2.1 saniye (İmkansız)</span></div>
                <div className="flex justify-between"><span className="text-zinc-500">Donanım Gücü Oranı:</span> <span className="text-red-400">P2P ortalamasının x500 üzerinde</span></div>
              </div>
              <div className="flex justify-end gap-2 pt-4 border-t border-zinc-800">
                <Button variant="outline" onClick={() => setSelectedJob(null)}>Kapat</Button>
                <Button className="bg-emerald-600 hover:bg-emerald-500" onClick={() => { handleRelease(selectedJob.id); setSelectedJob(null); }}>
                  <CheckCircle className="w-4 h-4 mr-2" /> Aklan (Release)
                </Button>
                <Button className="bg-red-600 hover:bg-red-500" onClick={() => { handleBan(selectedJob.id); setSelectedJob(null); }}>
                  <XCircle className="w-4 h-4 mr-2" /> Kalıcı Ban (Ban)
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
