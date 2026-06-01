import React, { useState, useEffect, useRef, useCallback } from 'react';
import { drawingCache } from '../services/drawingCache';
import { Button } from './ui/button';
import { Undo, Redo, Trash2, ZoomIn, ZoomOut } from 'lucide-react';
import { Card } from './ui/card';

// Types
type Point = { x: number; y: number };
type Atom = Point & { id: string; element: string; charge: number };
type Bond = { id: string; source: string; target: string; type: 1 | 2 | 3 };
type DrawingState = { atoms: Atom[]; bonds: Bond[] };

const ELEMENTS = ['C', 'N', 'O', 'S', 'P', 'F', 'Cl', 'Br', 'I'];

interface MoleculeDrawerProps {
  onSmilesChange?: (smiles: string) => void;
}

export const MoleculeDrawer: React.FC<MoleculeDrawerProps> = ({ onSmilesChange }) => {
  const svgRef = useRef<SVGSVGElement>(null);
  
  // State
  const [history, setHistory] = useState<DrawingState[]>([{ atoms: [], bonds: [] }]);
  const [historyIndex, setHistoryIndex] = useState(0);
  const [activeElement, setActiveElement] = useState('C');
  const [activeBondType, setActiveBondType] = useState<1 | 2 | 3>(1);
  const [isDrawingBond, setIsDrawingBond] = useState(false);
  const [dragStartAtom, setDragStartAtom] = useState<string | null>(null);
  const [mousePos, setMousePos] = useState<Point>({ x: 0, y: 0 });
  const [scale, setScale] = useState(1);
  const [smiles, setSmiles] = useState('');
  const [valencyError, setValencyError] = useState<string | null>(null);

  const currentState = history[historyIndex];

  // RDKit Worker
  const workerRef = useRef<Worker | null>(null);

  useEffect(() => {
    // Initialize Worker
    workerRef.current = new Worker(new URL('../workers/rdkitWorker.ts', import.meta.url), { type: 'module' });
    workerRef.current.postMessage({ type: 'INIT' });

    workerRef.current.onmessage = (e) => {
      if (e.data.type === 'VALIDATE_SMILES_RESULT') {
        const { isValid, details } = e.data.payload;
        if (!isValid) {
          setValencyError(details || 'Geçersiz valans veya yapı');
        } else {
          setValencyError(null);
        }
      }
    };

    // Load from IndexedDB
    drawingCache.getDrawing().then((savedSmiles) => {
      if (savedSmiles) {
        setSmiles(savedSmiles);
        // Note: Full state restoration from SMILES to Graph is complex.
        // For phase 2, we just load the SMILES string for now.
      }
    });

    return () => {
      workerRef.current?.terminate();
    };
  }, []);

  const pushState = (newState: DrawingState) => {
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(newState);
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
    
    // Auto-save graph representation or SMILES
    // Here we'd ideally convert to MOL and SMILES.
    // For now, we simulate the validation.
    if (workerRef.current) {
      // Mock SMILES generation for now
      const mockSmiles = `C`.repeat(newState.atoms.length);
      setSmiles(mockSmiles);
      if (onSmilesChange) onSmilesChange(mockSmiles);
      drawingCache.saveDrawing(mockSmiles);
      workerRef.current.postMessage({ type: 'VALIDATE_SMILES', payload: { smiles: mockSmiles } });
    }
  };

  const undo = useCallback(() => {
    if (historyIndex > 0) setHistoryIndex((i) => i - 1);
  }, [historyIndex]);

  const redo = useCallback(() => {
    if (historyIndex < history.length - 1) setHistoryIndex((i) => i + 1);
  }, [historyIndex, history.length]);

  // Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key === 'z') {
        e.preventDefault();
        undo();
      } else if (e.ctrlKey && e.key === 'y') {
        e.preventDefault();
        redo();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [undo, redo]);

  const handleSvgClick = (e: React.MouseEvent) => {
    if (isDrawingBond) return;
    
    const svg = svgRef.current;
    if (!svg) return;
    
    const rect = svg.getBoundingClientRect();
    const x = (e.clientX - rect.left) / scale;
    const y = (e.clientY - rect.top) / scale;

    const newAtom: Atom = {
      id: `atom_${Date.now()}`,
      x,
      y,
      element: activeElement,
      charge: 0
    };

    pushState({
      atoms: [...currentState.atoms, newAtom],
      bonds: [...currentState.bonds]
    });
  };

  const handleAtomMouseDown = (atomId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setIsDrawingBond(true);
    setDragStartAtom(atomId);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDrawingBond) return;
    
    const svg = svgRef.current;
    if (!svg) return;
    
    const rect = svg.getBoundingClientRect();
    setMousePos({
      x: (e.clientX - rect.left) / scale,
      y: (e.clientY - rect.top) / scale
    });
  };

  const handleMouseUp = () => {
    setIsDrawingBond(false);
    setDragStartAtom(null);
  };

  const handleAtomMouseUp = (atomId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (isDrawingBond && dragStartAtom && dragStartAtom !== atomId) {
      // Create bond
      const newBond: Bond = {
        id: `bond_${Date.now()}`,
        source: dragStartAtom,
        target: atomId,
        type: activeBondType
      };
      
      // Check if bond exists
      const exists = currentState.bonds.find(
        (b) => (b.source === newBond.source && b.target === newBond.target) ||
               (b.source === newBond.target && b.target === newBond.source)
      );
      
      if (!exists) {
        pushState({
          atoms: [...currentState.atoms],
          bonds: [...currentState.bonds, newBond]
        });
      }
    }
    setIsDrawingBond(false);
    setDragStartAtom(null);
  };

  const clearCanvas = () => {
    if (window.confirm("Çizimi silmek istediğinize emin misiniz?")) {
      pushState({ atoms: [], bonds: [] });
      drawingCache.clearDrawing();
      setSmiles('');
      if (onSmilesChange) onSmilesChange('');
    }
  };

  return (
    <Card className="flex flex-col h-[600px] bg-zinc-900 border-zinc-800">
      {/* Toolbar */}
      <div className="flex items-center justify-between p-2 border-b border-zinc-800 bg-zinc-950/50">
        <div className="flex gap-2">
          {ELEMENTS.map(el => (
            <Button 
              key={el}
              variant={activeElement === el ? 'default' : 'outline'}
              size="sm"
              onClick={() => setActiveElement(el)}
              className="w-8 h-8 p-0"
            >
              {el}
            </Button>
          ))}
          <div className="w-px h-8 bg-zinc-800 mx-2" />
          <Button variant={activeBondType === 1 ? 'default' : 'outline'} size="sm" onClick={() => setActiveBondType(1)}>Tekli</Button>
          <Button variant={activeBondType === 2 ? 'default' : 'outline'} size="sm" onClick={() => setActiveBondType(2)}>İkili</Button>
          <Button variant={activeBondType === 3 ? 'default' : 'outline'} size="sm" onClick={() => setActiveBondType(3)}>Üçlü</Button>
        </div>
        
        <div className="flex gap-2">
          <Button variant="ghost" size="icon" onClick={undo} disabled={historyIndex === 0} title="Geri Al (Ctrl+Z)"><Undo className="w-4 h-4" /></Button>
          <Button variant="ghost" size="icon" onClick={redo} disabled={historyIndex === history.length - 1} title="İleri Al (Ctrl+Y)"><Redo className="w-4 h-4" /></Button>
          <div className="w-px h-8 bg-zinc-800 mx-1" />
          <Button variant="ghost" size="icon" onClick={() => setScale(s => s * 1.1)}><ZoomIn className="w-4 h-4" /></Button>
          <Button variant="ghost" size="icon" onClick={() => setScale(s => s / 1.1)}><ZoomOut className="w-4 h-4" /></Button>
          <div className="w-px h-8 bg-zinc-800 mx-1" />
          <Button variant="destructive" size="icon" onClick={clearCanvas} title="Temizle"><Trash2 className="w-4 h-4" /></Button>
        </div>
      </div>

      {/* Canvas */}
      <div className="flex-1 relative overflow-hidden bg-[#1a1b23] cursor-crosshair">
        {valencyError && (
          <div className="absolute top-4 left-4 right-4 bg-red-500/90 text-white p-2 rounded-md text-sm z-10 text-center shadow-lg">
            Valans Hatası: {valencyError}
          </div>
        )}
        
        <div className="absolute bottom-4 left-4 bg-zinc-950/80 px-3 py-1.5 rounded-md text-xs font-mono text-zinc-400 border border-zinc-800">
          SMILES: {smiles || '-'}
        </div>

        <svg 
          ref={svgRef}
          className="w-full h-full touch-none"
          onClick={handleSvgClick}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        >
          <g transform={`scale(${scale})`}>
            {/* Draw Bonds */}
            {currentState.bonds.map(bond => {
              const src = currentState.atoms.find(a => a.id === bond.source);
              const tgt = currentState.atoms.find(a => a.id === bond.target);
              if (!src || !tgt) return null;
              return (
                <line 
                  key={bond.id}
                  x1={src.x} y1={src.y}
                  x2={tgt.x} y2={tgt.y}
                  stroke="currentColor"
                  strokeWidth={bond.type * 2}
                  className="text-zinc-500"
                />
              );
            })}
            
            {/* Draw active bond */}
            {isDrawingBond && dragStartAtom && (
              <line 
                x1={currentState.atoms.find(a => a.id === dragStartAtom)?.x} 
                y1={currentState.atoms.find(a => a.id === dragStartAtom)?.y}
                x2={mousePos.x} 
                y2={mousePos.y}
                stroke="currentColor"
                strokeWidth={activeBondType * 2}
                strokeDasharray="4"
                className="text-zinc-400"
              />
            )}

            {/* Draw Atoms */}
            {currentState.atoms.map(atom => (
              <g 
                key={atom.id}
                transform={`translate(${atom.x}, ${atom.y})`}
                onMouseDown={(e) => handleAtomMouseDown(atom.id, e)}
                onMouseUp={(e) => handleAtomMouseUp(atom.id, e)}
                className="cursor-pointer"
              >
                <circle r={12} className="fill-zinc-800 stroke-zinc-600 hover:stroke-primary" strokeWidth={2} />
                <text 
                  textAnchor="middle" 
                  alignmentBaseline="central"
                  className="fill-zinc-200 text-xs font-bold pointer-events-none select-none"
                >
                  {atom.element}
                </text>
              </g>
            ))}
          </g>
        </svg>
      </div>
    </Card>
  );
};
