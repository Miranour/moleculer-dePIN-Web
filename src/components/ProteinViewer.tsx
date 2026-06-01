import React, { useEffect, useRef, useState } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Loader2, Maximize, Target, Layers } from 'lucide-react';
import { pdbService } from '../services/pdbService';

declare global {
  interface Window {
    $3Dmol: any;
  }
}

interface ProteinViewerProps {
  pdbId: string;
  ligandSmiles?: string;
  onGridBoxSelect?: (coords: { x: number; y: number; z: number; w: number; h: number; d: number }) => void;
}

export const ProteinViewer: React.FC<ProteinViewerProps> = ({ pdbId, ligandSmiles: _ligandSmiles, onGridBoxSelect }) => {
  const viewerRef = useRef<HTMLDivElement>(null);
  const [viewer, setViewer] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [viewStyle, setViewStyle] = useState<'cartoon' | 'stick' | 'surface'>('cartoon');
  const [isSelectingGrid, setIsSelectingGrid] = useState(false);
  const [gridBox, setGridBox] = useState<{ x: number, y: number, z: number, w: number, h: number, d: number } | null>(null);

  useEffect(() => {
    if (!viewerRef.current || !window.$3Dmol) return;

    const v = window.$3Dmol.createViewer(viewerRef.current, {
      defaultcolors: window.$3Dmol.rasmolElementColors,
      backgroundColor: '#09090b', // zinc-950
    });
    setViewer(v);

    return () => {
      v.clear();
    };
  }, []);

  useEffect(() => {
    if (!viewer || !pdbId || !pdbService.validatePdbId(pdbId)) return;

    const loadProtein = async () => {
      setIsLoading(true);
      setError('');
      try {
        const pdbData = await pdbService.fetchPdbData(pdbId);
        viewer.clear();
        viewer.addModel(pdbData, 'pdb');
        applyStyle(viewer, viewStyle);
        viewer.zoomTo();
        viewer.render();
      } catch (err: any) {
        setError(err.message || 'Protein yüklenemedi.');
      } finally {
        setIsLoading(false);
      }
    };

    loadProtein();
  }, [viewer, pdbId]);

  useEffect(() => {
    if (!viewer) return;
    applyStyle(viewer, viewStyle);
    viewer.render();
  }, [viewStyle]);

  const applyStyle = (v: any, style: string) => {
    v.setStyle({}, {}); // Clear styles
    if (style === 'cartoon') {
      v.setStyle({}, { cartoon: { color: 'spectrum' } });
    } else if (style === 'stick') {
      v.setStyle({}, { stick: {} });
    } else if (style === 'surface') {
      v.setStyle({}, { cartoon: { color: 'spectrum' } });
      v.addSurface(window.$3Dmol.SurfaceType.VDW, {
        opacity: 0.8,
        color: 'white',
      });
    }
    
    // Highlight ligand if added
    v.setStyle({ resn: 'LIG' }, { stick: { colorscheme: 'greenCarbon' } });
  };

  const handleStyleChange = () => {
    const styles: ('cartoon' | 'stick' | 'surface')[] = ['cartoon', 'stick', 'surface'];
    const next = styles[(styles.indexOf(viewStyle) + 1) % styles.length];
    setViewStyle(next);
  };

  const toggleGridSelection = () => {
    setIsSelectingGrid(!isSelectingGrid);
    if (!isSelectingGrid && viewer) {
      // Mock grid box selection logic for phase 3
      // In a real scenario, this would involve raycasting and 3D bounding box drawing.
      // Here we just simulate a click yielding a bounding box at the center.
      const center = viewer.getModel().selectedAtoms({})[0] || { x: 0, y: 0, z: 0 };
      const box = { x: center.x || 0, y: center.y || 0, z: center.z || 0, w: 20, h: 20, d: 20 };
      setGridBox(box);
      
      // Draw a shape to represent the grid box
      viewer.addBox({
        center: { x: box.x, y: box.y, z: box.z },
        dimensions: { w: box.w, h: box.h, d: box.d },
        color: 'red',
        wireframe: true,
        alpha: 0.5
      });
      viewer.render();

      if (onGridBoxSelect) {
        onGridBoxSelect(box);
      }
    } else if (isSelectingGrid && viewer) {
      viewer.removeAllShapes();
      viewer.render();
      setGridBox(null);
    }
  };

  return (
    <Card className="relative flex flex-col h-[600px] bg-zinc-900 border-zinc-800 overflow-hidden">
      {/* Toolbar */}
      <div className="absolute top-4 right-4 z-10 flex flex-col gap-2">
        <Button variant="secondary" size="icon" onClick={handleStyleChange} title="Görünümü Değiştir">
          <Layers className="w-4 h-4" />
        </Button>
        <Button variant={isSelectingGrid ? 'default' : 'secondary'} size="icon" onClick={toggleGridSelection} title="Grid Box (Bağlanma Cebi) Seç">
          <Target className="w-4 h-4" />
        </Button>
        <Button variant="secondary" size="icon" onClick={() => viewer?.zoomTo()} title="Sığdır">
          <Maximize className="w-4 h-4" />
        </Button>
      </div>

      {/* Grid Box Status */}
      {gridBox && (
        <div className="absolute top-4 left-4 z-10 bg-zinc-950/80 px-3 py-2 rounded-md text-xs font-mono text-zinc-300 border border-zinc-800 backdrop-blur-sm">
          <div className="text-primary font-bold mb-1">Aktif Grid Box</div>
          <div>X: {gridBox.x.toFixed(2)} Y: {gridBox.y.toFixed(2)} Z: {gridBox.z.toFixed(2)}</div>
          <div>Boyut: {gridBox.w} x {gridBox.h} x {gridBox.d} Å</div>
        </div>
      )}

      {/* Viewer Container */}
      <div className="flex-1 relative bg-[#09090b]">
        {isLoading && (
          <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-zinc-950/50 backdrop-blur-sm">
            <Loader2 className="w-8 h-8 text-primary animate-spin mb-4" />
            <div className="text-zinc-400 animate-pulse">Protein yapısı yükleniyor...</div>
          </div>
        )}
        {error && (
          <div className="absolute inset-0 z-20 flex items-center justify-center bg-zinc-950/80">
            <div className="text-red-500 bg-red-500/10 px-4 py-2 rounded-lg border border-red-500/50">
              {error}
            </div>
          </div>
        )}
        <div ref={viewerRef} className="w-full h-full" style={{ position: 'relative' }} />
      </div>
    </Card>
  );
};
