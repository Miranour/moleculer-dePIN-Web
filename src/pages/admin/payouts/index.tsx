import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, XCircle, Search, WalletCards, ShieldBan } from 'lucide-react';
import { Input } from '@/components/ui/input';

const mockPayouts = [
  { id: 'P-1001', workerId: 'W-9842A', amount: 450, wallet: '0x71C...89A', date: '2026-06-03 10:00', status: 'pending', isFrozen: false, hw: 'RTX 4090', rep: 95 },
  { id: 'P-1002', workerId: 'W-1049B', amount: 120, wallet: '0x44B...11C', date: '2026-06-03 09:30', status: 'pending', isFrozen: false, hw: 'RTX 3080', rep: 82 },
  { id: 'P-1003', workerId: 'W-7723E', amount: 800, wallet: '0x12D...FFF', date: '2026-06-02 20:15', status: 'pending', isFrozen: true, hw: 'RTX 4080', rep: -15 }, // Güvenlik filtresine takılmış
  { id: 'P-0999', workerId: 'W-5532C', amount: 50, wallet: '0x33A...22E', date: '2026-06-01 14:00', status: 'completed', isFrozen: false, hw: 'RTX 3060', rep: 65 },
];

export default function AdminPayouts() {
  const [payouts, setPayouts] = useState(mockPayouts);
  const [searchTerm, setSearchTerm] = useState('');

  const filtered = payouts.filter(p => p.workerId.toLowerCase().includes(searchTerm.toLowerCase()));
  const pendingCount = payouts.filter(p => p.status === 'pending').length;

  const handleMassApprove = () => {
    // Audit Log (Task 8.5)
    console.log(`[AUDIT LOG] Toplu ödeme (Mass Approve) API'si tetiklendi.`);
    setPayouts(prev => prev.map(p => (!p.isFrozen && p.status === 'pending') ? { ...p, status: 'completed' } : p));
  };

  const handleReject = (id: string) => {
    const reason = prompt("Reddetme sebebini girin:");
    if (reason) {
      console.log(`[AUDIT LOG] Payout ${id} reddedildi. Sebep: ${reason}`);
      setPayouts(prev => prev.map(p => p.id === id ? { ...p, status: 'rejected' } : p));
    }
  };

  return (
    <div className="p-8 space-y-8 text-zinc-100">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Kripto / Banka Payout Yönetimi</h1>
          <p className="text-zinc-400">Worker'ların hakediş ödemelerini (Mass Payout API) yönetin.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button onClick={handleMassApprove} className="bg-emerald-600 hover:bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.3)]">
            <WalletCards className="w-4 h-4 mr-2" /> Toplu Onayla (Mass Approve)
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="bg-zinc-900 border-zinc-800">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-zinc-400">Bekleyen Çekim Talebi</CardTitle>
          </CardHeader>
          <CardContent><div className="text-3xl font-bold">{pendingCount}</div></CardContent>
        </Card>
        <Card className="bg-zinc-900 border-zinc-800">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-zinc-400">Bugün Dağıtılan</CardTitle>
          </CardHeader>
          <CardContent><div className="text-3xl font-bold text-emerald-500">$50</div></CardContent>
        </Card>
        <Card className="bg-zinc-900 border-red-900/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-zinc-400">Bloklanan Şüpheli Tutar</CardTitle>
          </CardHeader>
          <CardContent><div className="text-3xl font-bold text-red-500">$800</div></CardContent>
        </Card>
      </div>

      <Card className="bg-zinc-900 border-zinc-800">
        <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <CardTitle>Çekim Talepleri (Withdrawals)</CardTitle>
            <CardDescription>Otomatik güvenlik filtresi: <code className="text-red-400">is_frozen=true</code> olanlar bloklanmıştır.</CardDescription>
          </div>
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
                  <th className="px-6 py-4">Tarih</th>
                  <th className="px-6 py-4">Worker ID / Donanım</th>
                  <th className="px-6 py-4">Cüzdan / İtibar</th>
                  <th className="px-6 py-4">Miktar (USDT)</th>
                  <th className="px-6 py-4">Durum</th>
                  <th className="px-6 py-4 text-right">Aksiyonlar</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((p) => (
                  <tr key={p.id} className={`border-b border-zinc-800/50 hover:bg-zinc-800/20 transition-colors ${p.isFrozen ? 'bg-red-500/5' : ''}`}>
                    <td className="px-6 py-4 text-zinc-400">{p.date}</td>
                    <td className="px-6 py-4">
                      <div className="font-mono font-medium">{p.workerId}</div>
                      <div className="text-xs text-zinc-500">{p.hw}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-mono">{p.wallet}</div>
                      <div className={`text-xs ${p.rep >= 50 ? 'text-emerald-500' : 'text-red-500'}`}>Rep: {p.rep}</div>
                    </td>
                    <td className="px-6 py-4 font-bold text-lg">${p.amount}</td>
                    <td className="px-6 py-4">
                      {p.isFrozen ? (
                        <Badge variant="outline" className="border-red-500/50 text-red-400 bg-red-500/10"><ShieldBan className="w-3 h-3 mr-1" /> Bloke</Badge>
                      ) : p.status === 'completed' ? (
                        <Badge variant="outline" className="border-emerald-500/50 text-emerald-400 bg-emerald-500/10"><CheckCircle2 className="w-3 h-3 mr-1" /> Tamamlandı</Badge>
                      ) : p.status === 'rejected' ? (
                        <Badge variant="outline" className="border-zinc-500/50 text-zinc-400 bg-zinc-500/10">Reddedildi</Badge>
                      ) : (
                        <Badge variant="outline" className="border-yellow-500/50 text-yellow-400 bg-yellow-500/10">Bekliyor</Badge>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      {p.status === 'pending' && !p.isFrozen && (
                        <div className="flex justify-end gap-2">
                          <Button size="sm" className="bg-emerald-600/20 text-emerald-500 hover:bg-emerald-600/40" onClick={() => setPayouts(prev => prev.map(item => item.id === p.id ? { ...item, status: 'completed' } : item))}>
                            Onayla
                          </Button>
                          <Button size="sm" variant="ghost" className="text-red-400 hover:text-red-300 hover:bg-red-400/10" onClick={() => handleReject(p.id)}>
                            <XCircle className="w-4 h-4" />
                          </Button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
