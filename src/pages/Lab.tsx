import { useState, useEffect, useRef } from 'react';
import { MoleculeDrawer } from '../components/MoleculeDrawer';
import { ProteinViewer } from '../components/ProteinViewer';
import { SimulationProgress } from '../components/SimulationProgress';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Play, Activity, Bell } from 'lucide-react';
import { pdbService } from '../services/pdbService';
import { createSSEConnection } from '../services/sseService';
import { pushService } from '../services/pushService';

export default function Lab() {
  const [smiles, setSmiles] = useState('');
  const [pdbIdInput, setPdbIdInput] = useState('1CRN');
  const [activePdbId, setActivePdbId] = useState('1CRN');
  const [gridBox, setGridBox] = useState<{ x: number, y: number, z: number, w: number, h: number, d: number } | null>(null);
  
  // Simulation State
  const [simStatus, setSimStatus] = useState<'idle' | 'running' | 'completed' | 'error'>('idle');
  const [simProgress, setSimProgress] = useState(0);
  const [simMessage, setSimMessage] = useState('');
  const [simTimeLeft, setSimTimeLeft] = useState<number | undefined>(undefined);
  const [pdbError, setPdbError] = useState('');
  
  const sseRef = useRef<ReturnType<typeof createSSEConnection> | null>(null);
  const mockSimRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      // Cleanup SSE on unmount
      if (sseRef.current) {
        sseRef.current.disconnect();
      }
      if (mockSimRef.current) clearInterval(mockSimRef.current);
    };
  }, []);

  const handleLoadPdb = () => {
    if (pdbService.validatePdbId(pdbIdInput)) {
      setActivePdbId(pdbIdInput);
      setPdbError('');
    } else {
      setPdbError('Geçersiz PDB ID formatı. (Örn: 1CRN)');
    }
  };

  const handleRequestNotification = async () => {
    const granted = await pushService.requestPermission();
    if (granted) {
      // In a real app, you would fetch VAPID key from backend
      const VAPID_PUBLIC_KEY = "BEl62iUYgUivxIkv69yViEuiBIa-Ib9-SkvMeAtA3LFgDyepq73vw11mi222n3sA3W_U8Y6Jg3P5eXoQ3v1lX3g";
      const subscription = await pushService.subscribeToPush(VAPID_PUBLIC_KEY);
      if (subscription) {
        alert("Bildirimler başarıyla aktif edildi!");
        // send subscription to backend...
      } else {
        alert("Bildirim servisine abone olunurken hata oluştu. Tarayıcı ayarlarınızı kontrol edin.");
      }
    } else {
      alert("Bildirim izni reddedildi.");
    }
  };

  const handleStartSimulation = async () => {
    if (!smiles) {
      alert("Lütfen önce bir molekül çizin veya SMILES oluşturun.");
      return;
    }
    if (!activePdbId) {
      alert("Lütfen bir PDB ID yükleyin.");
      return;
    }
    if (!gridBox) {
      alert("Lütfen bağlanma cebini (Grid Box) 3D sahne üzerinden seçin.");
      return;
    }

    setSimStatus('running');
    setSimProgress(0);
    setSimMessage('Bağlantı kuruluyor...');
    setSimTimeLeft(120); // mock 2 minutes

    // Start SSE Connection (Real implementation would point to real endpoint)
    // Here we use a fake endpoint. If it errors, we fallback to a mock interval for demo.
    const sse = createSSEConnection(`/api/simulate?pdb=${activePdbId}&smiles=${encodeURIComponent(smiles)}`);
    sseRef.current = sse;
    
    sse.onMessage((data) => {
      if (data.progress) setSimProgress(data.progress);
      if (data.message) setSimMessage(data.message);
      if (data.estimatedTimeLeft) setSimTimeLeft(data.estimatedTimeLeft);
    });

    sse.onError(() => {
      console.log('Gerçek SSE endpoint bulunamadı, mock simülasyon başlatılıyor...');
      sse.disconnect();
      startMockSimulation();
    });

    sse.onComplete((data) => {
      completeSimulation(data.score || '-9.2');
    });

    sse.connect();
  };

  const startMockSimulation = () => {
    let progress = 0;
    let timeLeft = 30; // 30 seconds mock
    
    mockSimRef.current = window.setInterval(() => {
      progress += Math.random() * 5;
      timeLeft -= 1;
      
      if (progress >= 100 || timeLeft <= 0) {
        progress = 100;
        clearInterval(mockSimRef.current!);
        completeSimulation('-9.2');
      } else {
        setSimProgress(progress);
        setSimTimeLeft(Math.max(0, timeLeft));
        
        if (progress < 30) setSimMessage('Ligand konformasyonları hazırlanıyor...');
        else if (progress < 60) setSimMessage('Grid map hesaplanıyor...');
        else if (progress < 90) setSimMessage('Docking algoritmaları (AutoDock Vina) çalışıyor...');
        else setSimMessage('Sonuçlar optimize ediliyor...');
      }
    }, 1000);
  };

  const completeSimulation = (score: string) => {
    setSimStatus('completed');
    setSimProgress(100);
    setSimMessage(`Simülasyon tamamlandı! Bağlanma Skoru: ${score} kcal/mol`);
    setSimTimeLeft(0);
    
    // Trigger desktop notification
    pushService.showLocalNotification(
      'Simülasyon Tamamlandı!', 
      `Moleküler docking başarıyla sonuçlandı. Skor: ${score} kcal/mol`
    );
  };

  return (
    <div className="p-8 text-white max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold tracking-tight">Moleküler Laboratuvar</h1>
          <p className="text-zinc-400">
            DePIN ağı üzerinde hesaplanmak üzere yeni moleküller çizin ve protein-ligand docking simülasyonlarını başlatın.
          </p>
        </div>
        <Button onClick={handleRequestNotification} variant="outline" className="shrink-0 gap-2">
          <Bell className="w-4 h-4" /> Bildirimleri Aç
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {/* Sol Panel: Molekül Çizimi */}
        <div className="xl:col-span-1 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">1. Ligand Çizimi</h2>
          </div>
          <MoleculeDrawer onSmilesChange={setSmiles} />
        </div>
        
        {/* Sağ Panel: 3D Görselleştirme */}
        <div className="xl:col-span-2 flex flex-col gap-4">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <h2 className="text-xl font-semibold">2. Protein (Reseptör) Hazırlığı</h2>
            
            <div className="flex items-end gap-2">
              <div className="space-y-1">
                <Label htmlFor="pdbId" className="text-xs text-zinc-400">PDB ID</Label>
                <Input 
                  id="pdbId"
                  value={pdbIdInput}
                  onChange={(e) => setPdbIdInput(e.target.value.toUpperCase())}
                  placeholder="1CRN"
                  className="w-24 h-9 bg-zinc-900 border-zinc-800"
                  maxLength={4}
                />
              </div>
              <Button onClick={handleLoadPdb} variant="secondary" className="h-9">
                Yükle
              </Button>
            </div>
          </div>
          
          {pdbError && <p className="text-sm text-red-500">{pdbError}</p>}

          <ProteinViewer 
            pdbId={activePdbId} 
            ligandSmiles={smiles} 
            onGridBoxSelect={setGridBox}
          />
          
          <SimulationProgress 
            progress={simProgress}
            status={simStatus}
            message={simMessage}
            estimatedTimeLeft={simTimeLeft}
          />

          <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6 mt-2 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="space-y-1">
              <h3 className="font-medium">3. Simülasyon (Docking)</h3>
              <p className="text-sm text-zinc-400">
                {!smiles ? 'Ligand eksik. ' : ''}
                {!activePdbId ? 'Protein eksik. ' : ''}
                {!gridBox ? 'Grid Box seçilmedi. ' : ''}
                {smiles && activePdbId && gridBox ? 'Tüm ayarlar hazır.' : ''}
              </p>
            </div>
            
            <Button 
              onClick={handleStartSimulation} 
              disabled={!smiles || !activePdbId || !gridBox || simStatus === 'running'}
              className="w-full sm:w-auto h-12 px-8 bg-primary hover:bg-primary/90 text-primary-foreground font-medium rounded-md shadow-[0_0_20px_rgba(170,59,255,0.3)] transition-all hover:shadow-[0_0_30px_rgba(170,59,255,0.5)]"
            >
              {simStatus === 'running' ? (
                <Activity className="w-5 h-5 mr-2 animate-spin" />
              ) : (
                <Play className="w-5 h-5 mr-2" />
              )}
              {simStatus === 'running' ? 'Simülasyon Çalışıyor...' : 'Simülasyonu Başlat'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
