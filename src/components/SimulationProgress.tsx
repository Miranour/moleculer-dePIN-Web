import React, { useEffect, useState } from 'react';
import { Card } from './ui/card';
import { Loader2, CheckCircle2, AlertCircle } from 'lucide-react';

interface SimulationProgressProps {
  progress: number;
  status: 'idle' | 'running' | 'completed' | 'error';
  message?: string;
  estimatedTimeLeft?: number; // in seconds
}

export const SimulationProgress: React.FC<SimulationProgressProps> = ({ 
  progress, 
  status, 
  message, 
  estimatedTimeLeft 
}) => {
  const [displayProgress, setDisplayProgress] = useState(0);

  // Smooth animation for progress bar
  useEffect(() => {
    setDisplayProgress(progress);
  }, [progress]);

  if (status === 'idle') return null;

  const formatTime = (seconds?: number) => {
    if (seconds === undefined || seconds < 0) return '--:--';
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <Card className="p-6 bg-zinc-900 border-zinc-800 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {status === 'running' && <Loader2 className="w-5 h-5 text-primary animate-spin" />}
          {status === 'completed' && <CheckCircle2 className="w-5 h-5 text-green-500" />}
          {status === 'error' && <AlertCircle className="w-5 h-5 text-red-500" />}
          <h3 className="font-medium text-zinc-100">
            {status === 'running' ? 'Simülasyon Çalışıyor' : 
             status === 'completed' ? 'Simülasyon Tamamlandı' : 
             status === 'error' ? 'Hata Oluştu' : ''}
          </h3>
        </div>
        <div className="text-sm font-mono text-zinc-400">
          {Math.round(displayProgress)}%
        </div>
      </div>

      <div className="w-full h-2 bg-zinc-950 rounded-full overflow-hidden">
        <div 
          className={`h-full rounded-full transition-all duration-500 ease-out ${
            status === 'error' ? 'bg-red-500' :
            status === 'completed' ? 'bg-green-500' :
            'bg-primary relative overflow-hidden'
          }`}
          style={{ width: `${displayProgress}%` }}
        >
          {status === 'running' && (
            <div className="absolute inset-0 bg-white/20 w-full animate-[shimmer_2s_infinite]" />
          )}
        </div>
      </div>

      <div className="flex items-center justify-between text-sm text-zinc-400">
        <div>{message || (status === 'running' ? 'Docking algoritmaları çalıştırılıyor...' : '')}</div>
        {status === 'running' && estimatedTimeLeft !== undefined && (
          <div className="font-mono">Kalan: {formatTime(estimatedTimeLeft)}</div>
        )}
      </div>
    </Card>
  );
};
