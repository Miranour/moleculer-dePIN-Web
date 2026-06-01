import React from 'react';
import { ResponsiveContainer, ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ZAxis } from 'recharts';

export interface MoleculeData {
  id: string;
  name: string;
  bindingEnergy: number; // x-axis
  admetScore: number;    // y-axis
  z?: number;            // for bubble size (optional)
}

interface MoleculeScatterPlotProps {
  data: MoleculeData[];
  onNodeClick?: (molecule: MoleculeData) => void;
}

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload as MoleculeData;
    return (
      <div className="bg-zinc-900 border border-zinc-800 p-3 rounded-lg shadow-xl">
        <p className="font-bold text-zinc-100">{data.name}</p>
        <p className="text-sm text-zinc-400">ID: {data.id}</p>
        <div className="mt-2 text-sm">
          <p><span className="text-primary">Enerji:</span> {data.bindingEnergy.toFixed(2)} kcal/mol</p>
          <p><span className="text-emerald-400">ADMET:</span> {data.admetScore.toFixed(1)}</p>
        </div>
      </div>
    );
  }
  return null;
};

export const MoleculeScatterPlot: React.FC<MoleculeScatterPlotProps> = ({ data, onNodeClick }) => {
  return (
    <div className="w-full h-[350px]">
      <ResponsiveContainer width="100%" height="100%">
        <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
          <XAxis 
            type="number" 
            dataKey="bindingEnergy" 
            name="Bağlanma Enerjisi" 
            unit=" kcal/mol"
            stroke="#a1a1aa"
            tick={{ fill: '#a1a1aa' }}
            domain={['auto', 'auto']}
            label={{ value: 'Bağlanma Enerjisi (kcal/mol)', position: 'insideBottom', offset: -10, fill: '#71717a' }}
          />
          <YAxis 
            type="number" 
            dataKey="admetScore" 
            name="ADMET Skoru"
            stroke="#a1a1aa"
            tick={{ fill: '#a1a1aa' }}
            domain={[0, 100]}
            label={{ value: 'ADMET Skoru', angle: -90, position: 'insideLeft', fill: '#71717a' }}
          />
          <ZAxis type="number" dataKey="z" range={[50, 400]} name="Volume" />
          <Tooltip cursor={{ strokeDasharray: '3 3' }} content={<CustomTooltip />} />
          <Scatter 
            name="Moleküller" 
            data={data} 
            fill="#a855f7" 
            onClick={(e: any) => onNodeClick && onNodeClick(e.payload)}
            className="cursor-pointer hover:opacity-80 transition-opacity"
          />
        </ScatterChart>
      </ResponsiveContainer>
    </div>
  );
};
