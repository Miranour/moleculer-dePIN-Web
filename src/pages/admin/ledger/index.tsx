import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend, BarChart, CartesianGrid, XAxis, YAxis, Bar } from 'recharts';
import { Lock, Coins, PieChart as PieChartIcon } from 'lucide-react';

const totalLocked = 12450;
const platformShare = totalLocked * 0.6;
const workerShare = totalLocked * 0.4;

const pieData = [
  { name: 'Platform Geliri (%60)', value: platformShare, color: '#10b981' }, // Emerald
  { name: 'Worker Hak Edişi (%40)', value: workerShare, color: '#3b82f6' }, // Blue
];

const barData = [
  { month: 'Ocak', platform: 4000, worker: 2666 },
  { month: 'Şubat', platform: 3000, worker: 2000 },
  { month: 'Mart', platform: 5000, worker: 3333 },
  { month: 'Nisan', platform: 6000, worker: 4000 },
  { month: 'Mayıs', platform: 5500, worker: 3666 },
  { month: 'Haziran', platform: 7470, worker: 4980 },
];

export default function AdminLedger() {
  return (
    <div className="p-8 space-y-8 text-zinc-100">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Finansal Defter (Ledger)</h1>
        <p className="text-zinc-400">Tüm sistemin ekonomik dengesini, kilitli fonları ve platform gelirlerini analiz edin.</p>
      </div>

      {/* Widgetlar (Task 8.4 gereksinimi) */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="bg-zinc-900 border-zinc-800 bg-gradient-to-br from-zinc-900 to-zinc-950">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-zinc-400">Toplam Kilitli Bakiye (TVL)</CardTitle>
            <Lock className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-white">${totalLocked.toLocaleString()}</div>
            <p className="text-xs text-zinc-500 mt-1">Sistemdeki tüm araştırmacıların harcanmamış kredisi</p>
          </CardContent>
        </Card>

        <Card className="bg-zinc-900 border-emerald-900/50">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-emerald-400">Platform Geliri (Net %60)</CardTitle>
            <PieChartIcon className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-emerald-500">${platformShare.toLocaleString()}</div>
            <p className="text-xs text-emerald-500/70 mt-1">Altyapı ve işletme payı</p>
          </CardContent>
        </Card>

        <Card className="bg-zinc-900 border-blue-900/50">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-blue-400">Worker'lara Dağıtım (%40)</CardTitle>
            <Coins className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-500">${workerShare.toLocaleString()}</div>
            <p className="text-xs text-blue-500/70 mt-1">Madencilere (GPU sahiplerine) ayrılan havuz</p>
          </CardContent>
        </Card>
      </div>

      {/* Grafikler */}
      <div className="grid gap-8 md:grid-cols-2">
        <Card className="bg-zinc-900 border-zinc-800">
          <CardHeader>
            <CardTitle>Ekonomik Model Dağılımı</CardTitle>
            <CardDescription>Sisteme giren her 1 birim DPL'in platform vs madenci dağılımı</CardDescription>
          </CardHeader>
          <CardContent className="h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={80}
                  outerRadius={120}
                  paddingAngle={5}
                  dataKey="value"
                  stroke="none"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value: any) => `$${Number(value).toLocaleString()}`}
                  contentStyle={{ backgroundColor: '#18181b', borderColor: '#27272a', color: '#f4f4f5' }}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="bg-zinc-900 border-zinc-800">
          <CardHeader>
            <CardTitle>Aylık Gelir & Dağılım Trendi</CardTitle>
            <CardDescription>Aylar bazında gerçekleşen token / dolar girişleri</CardDescription>
          </CardHeader>
          <CardContent className="h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
                <XAxis dataKey="month" stroke="#71717a" fontSize={12} tickMargin={10} />
                <YAxis stroke="#71717a" fontSize={12} tickFormatter={(value) => `$${value}`} />
                <Tooltip 
                  formatter={(value: any) => `$${Number(value).toLocaleString()}`}
                  contentStyle={{ backgroundColor: '#18181b', borderColor: '#27272a', color: '#f4f4f5' }}
                  cursor={{ fill: '#27272a', opacity: 0.4 }}
                />
                <Legend />
                <Bar dataKey="platform" name="Platform Geliri" stackId="a" fill="#10b981" radius={[0, 0, 4, 4]} />
                <Bar dataKey="worker" name="Worker Payı" stackId="a" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
