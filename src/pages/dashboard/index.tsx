import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Activity, Coins, CheckCircle, XCircle, Download } from 'lucide-react';
import { simulationService, type SimulationResult } from '@/services/simulationService';
import { AdmetRadarChart } from '@/components/AdmetRadarChart';
import { MoleculeScatterPlot, type MoleculeData } from '@/components/MoleculeScatterPlot';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function Dashboard() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSim, setSelectedSim] = useState<SimulationResult | null>(null);

  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ['simStats'],
    queryFn: simulationService.getStats
  });

  const { data: simulations, isLoading: simLoading } = useQuery({
    queryKey: ['simulations'],
    queryFn: simulationService.getSimulations
  });

  const filteredSimulations = simulations?.filter(sim => 
    sim.moleculeName.toLowerCase().includes(searchTerm.toLowerCase()) || 
    sim.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const scatterData: MoleculeData[] = simulations?.filter(s => s.status === 'success').map(s => ({
    id: s.id,
    name: s.moleculeName,
    bindingEnergy: s.bindingEnergy,
    admetScore: s.admetScore,
    z: Math.abs(s.bindingEnergy) * 10
  })) || [];

  const handleDownloadReport = (sim: SimulationResult) => {
    // Generate simple CSV
    const headers = "ID,Molecule,SMILES,PDB,Date,Status,Binding Energy (kcal/mol),ADMET Score\n";
    const row = `${sim.id},${sim.moleculeName},${sim.smiles},${sim.pdbId},${sim.date},${sim.status},${sim.bindingEnergy},${sim.admetScore}\n`;
    
    const blob = new Blob([headers + row], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `report_${sim.id}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 text-zinc-100">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-zinc-400">Simülasyon sonuçlarınızı, ADMET analizlerini ve ağ kullanımlarınızı buradan takip edin.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-zinc-900 border-zinc-800">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-zinc-400">Toplam Simülasyon</CardTitle>
            <Activity className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{statsLoading ? '-' : stats?.total}</div>
          </CardContent>
        </Card>
        <Card className="bg-zinc-900 border-zinc-800">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-zinc-400">Başarılı Docking</CardTitle>
            <CheckCircle className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-500">{statsLoading ? '-' : stats?.success}</div>
          </CardContent>
        </Card>
        <Card className="bg-zinc-900 border-zinc-800">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-zinc-400">Hatalı İşlemler</CardTitle>
            <XCircle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-500">{statsLoading ? '-' : stats?.failed}</div>
          </CardContent>
        </Card>
        <Card className="bg-zinc-900 border-zinc-800">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-zinc-400">Aktif Kredi (DPL)</CardTitle>
            <Coins className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-500">{statsLoading ? '-' : stats?.activeCredits}</div>
            <p className="text-xs text-zinc-500 mt-1">{stats?.computeHours} saat hesaplama</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card className="bg-zinc-900 border-zinc-800">
          <CardHeader>
            <CardTitle className="text-lg">Molekül Karşılaştırması (Enerji vs ADMET)</CardTitle>
          </CardHeader>
          <CardContent>
            {scatterData.length > 0 ? (
              <MoleculeScatterPlot 
                data={scatterData} 
                onNodeClick={(mol) => {
                  const sim = simulations?.find(s => s.id === mol.id);
                  if (sim) setSelectedSim(sim);
                }} 
              />
            ) : (
              <div className="h-[350px] flex items-center justify-center text-zinc-500">Veri yükleniyor veya yeterli veri yok</div>
            )}
          </CardContent>
        </Card>

        <Card className="bg-zinc-900 border-zinc-800">
          <CardHeader>
            <CardTitle className="text-lg">Örnek ADMET Risk Profili</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-center">
            {simulations && simulations[0] ? (
              <AdmetRadarChart 
                data={[
                  { property: 'Toxicity', score: simulations[0].admetDetails.toxicity, fullMark: 100 },
                  { property: 'Absorption', score: simulations[0].admetDetails.absorption, fullMark: 100 },
                  { property: 'Distribution', score: simulations[0].admetDetails.distribution, fullMark: 100 },
                  { property: 'Metabolism', score: simulations[0].admetDetails.metabolism, fullMark: 100 },
                  { property: 'Excretion', score: simulations[0].admetDetails.excretion, fullMark: 100 },
                ]} 
              />
            ) : (
              <div className="h-[300px] flex items-center justify-center text-zinc-500">Analiz verisi bekleniyor...</div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Simulations Table */}
      <Card className="bg-zinc-900 border-zinc-800">
        <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <CardTitle className="text-lg">Geçmiş Simülasyonlar</CardTitle>
          <Input 
            placeholder="ID veya İsim Ara..." 
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full sm:w-64 bg-zinc-950 border-zinc-800"
          />
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-zinc-400 uppercase bg-zinc-950/50">
                <tr>
                  <th className="px-4 py-3 rounded-tl-lg">ID</th>
                  <th className="px-4 py-3">Molekül</th>
                  <th className="px-4 py-3">Tarih</th>
                  <th className="px-4 py-3">PDB</th>
                  <th className="px-4 py-3">Skor</th>
                  <th className="px-4 py-3">Durum</th>
                  <th className="px-4 py-3 rounded-tr-lg">İşlem</th>
                </tr>
              </thead>
              <tbody>
                {simLoading ? (
                  <tr><td colSpan={7} className="text-center py-8 text-zinc-500">Yükleniyor...</td></tr>
                ) : filteredSimulations?.length === 0 ? (
                  <tr><td colSpan={7} className="text-center py-8 text-zinc-500">Sonuç bulunamadı.</td></tr>
                ) : (
                  filteredSimulations?.map((sim) => (
                    <tr key={sim.id} className="border-b border-zinc-800/50 hover:bg-zinc-800/20 transition-colors">
                      <td className="px-4 py-3 font-mono text-zinc-300">{sim.id}</td>
                      <td className="px-4 py-3 font-medium">{sim.moleculeName}</td>
                      <td className="px-4 py-3 text-zinc-400">{new Date(sim.date).toLocaleDateString('tr-TR')}</td>
                      <td className="px-4 py-3 font-mono">{sim.pdbId}</td>
                      <td className="px-4 py-3 font-mono text-primary">{sim.status === 'success' ? `${sim.bindingEnergy} kcal/mol` : '-'}</td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 rounded-full text-xs ${sim.status === 'success' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-red-500/10 text-red-500'}`}>
                          {sim.status === 'success' ? 'Tamamlandı' : 'Hata'}
                        </span>
                      </td>
                      <td className="px-4 py-3 flex gap-2">
                        <Button variant="ghost" size="sm" onClick={() => setSelectedSim(sim)}>Detay</Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleDownloadReport(sim)} title="CSV İndir">
                          <Download className="w-4 h-4" />
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

      {/* Modal Placeholder - Simple Overlay for Phase 5 */}
      {selectedSim && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <Card className="w-full max-w-2xl bg-zinc-900 border-zinc-800 overflow-hidden flex flex-col max-h-[90vh]">
            <CardHeader className="flex flex-row items-center justify-between border-b border-zinc-800 bg-zinc-950/50">
              <CardTitle>Simülasyon Detayı: {selectedSim.id}</CardTitle>
              <Button variant="ghost" size="icon" onClick={() => setSelectedSim(null)}><XCircle className="w-5 h-5" /></Button>
            </CardHeader>
            <CardContent className="p-6 overflow-y-auto space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-sm text-zinc-400 mb-1">Molekül Adı</div>
                  <div className="font-medium text-lg">{selectedSim.moleculeName}</div>
                </div>
                <div>
                  <div className="text-sm text-zinc-400 mb-1">PDB Hedefi</div>
                  <div className="font-medium text-lg font-mono">{selectedSim.pdbId}</div>
                </div>
                <div className="col-span-2">
                  <div className="text-sm text-zinc-400 mb-1">SMILES Dizilimi</div>
                  <div className="font-mono text-xs bg-zinc-950 p-2 rounded border border-zinc-800 break-all">
                    {selectedSim.smiles}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-zinc-400 mb-1">Bağlanma Enerjisi</div>
                  <div className="font-medium text-2xl text-primary">{selectedSim.bindingEnergy} <span className="text-sm text-zinc-500">kcal/mol</span></div>
                </div>
                <div>
                  <div className="text-sm text-zinc-400 mb-1">ADMET Risk Skoru</div>
                  <div className="font-medium text-2xl text-emerald-400">{selectedSim.admetScore} <span className="text-sm text-zinc-500">/ 100</span></div>
                </div>
              </div>
              
              <div className="space-y-2">
                <h3 className="font-medium">ADMET Detayları</h3>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-center text-sm">
                  <div className="bg-zinc-950 p-2 rounded border border-zinc-800"><div className="text-zinc-400 text-xs">Toksisite</div><div>{selectedSim.admetDetails.toxicity}</div></div>
                  <div className="bg-zinc-950 p-2 rounded border border-zinc-800"><div className="text-zinc-400 text-xs">Emilim</div><div>{selectedSim.admetDetails.absorption}</div></div>
                  <div className="bg-zinc-950 p-2 rounded border border-zinc-800"><div className="text-zinc-400 text-xs">Dağılım</div><div>{selectedSim.admetDetails.distribution}</div></div>
                  <div className="bg-zinc-950 p-2 rounded border border-zinc-800"><div className="text-zinc-400 text-xs">Metabolizma</div><div>{selectedSim.admetDetails.metabolism}</div></div>
                  <div className="bg-zinc-950 p-2 rounded border border-zinc-800"><div className="text-zinc-400 text-xs">Atılım</div><div>{selectedSim.admetDetails.excretion}</div></div>
                </div>
              </div>
            </CardContent>
            <div className="p-4 border-t border-zinc-800 bg-zinc-950 flex justify-end gap-2">
              <Button variant="outline" onClick={() => setSelectedSim(null)}>Kapat</Button>
              <Button onClick={() => handleDownloadReport(selectedSim)} className="gap-2"><Download className="w-4 h-4" /> Rapor İndir</Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
